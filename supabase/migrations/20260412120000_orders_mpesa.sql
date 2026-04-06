-- M-Pesa (Daraja STK): linkage fields + RPCs for secure attach, status poll, and service-role callback.

alter table public.orders
  add column if not exists mpesa_checkout_nonce uuid not null default gen_random_uuid(),
  add column if not exists mpesa_merchant_request_id text,
  add column if not exists mpesa_checkout_request_id text,
  add column if not exists mpesa_receipt_number text;

create unique index if not exists orders_mpesa_checkout_nonce_key
  on public.orders (mpesa_checkout_nonce);

-- Replace return type: DROP required (PostgreSQL cannot change function return type in-place).
drop function if exists public.create_storefront_order(text, text, text, jsonb);

create function public.create_storefront_order(
  p_customer_email text,
  p_customer_name text,
  p_phone text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_nonce uuid;
  v_uid uuid := auth.uid();
  r record;
  v_id uuid;
  v_name text;
  v_unit int;
  v_curr text;
  v_qty int;
  v_total int := 0;
  v_currency text;
  v_first boolean := true;
begin
  if p_customer_email is null or length(trim(p_customer_email)) = 0 then
    raise exception 'email required';
  end if;
  if p_customer_name is null or length(trim(p_customer_name)) = 0 then
    raise exception 'name required';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'no items';
  end if;

  for r in
    select
      (elem->>'product_id')::uuid as pid,
      (elem->>'quantity')::int as qty
    from jsonb_array_elements(p_items) as t(elem)
  loop
    v_id := r.pid;
    v_qty := r.qty;
    if v_qty is null or v_qty <= 0 then
      raise exception 'invalid quantity';
    end if;

    select name, price_cents, currency
      into v_name, v_unit, v_curr
    from public.products
    where id = v_id;

    if v_name is null then
      raise exception 'product not found';
    end if;

    if v_first then
      v_currency := v_curr;
      v_first := false;
    elsif v_curr is distinct from v_currency then
      raise exception 'mixed currency';
    end if;

    v_total := v_total + v_unit * v_qty;
  end loop;

  insert into public.orders (
    user_id,
    customer_email,
    customer_name,
    phone,
    total_cents,
    currency,
    status
  )
  values (
    v_uid,
    lower(trim(p_customer_email)),
    trim(p_customer_name),
    nullif(trim(coalesce(p_phone, '')), ''),
    v_total,
    coalesce(v_currency, 'KES'),
    'pending'
  )
  returning id, mpesa_checkout_nonce into v_order_id, v_nonce;

  for r in
    select
      (elem->>'product_id')::uuid as pid,
      (elem->>'quantity')::int as qty
    from jsonb_array_elements(p_items) as t(elem)
  loop
    v_id := r.pid;
    v_qty := r.qty;

    select name, price_cents
      into v_name, v_unit
    from public.products
    where id = v_id;

    insert into public.order_items (
      order_id,
      product_id,
      product_name,
      unit_price_cents,
      quantity,
      line_total_cents
    )
    values (
      v_order_id,
      v_id,
      v_name,
      v_unit,
      v_qty,
      v_unit * v_qty
    );
  end loop;

  return jsonb_build_object(
    'order_id', v_order_id,
    'mpesa_nonce', v_nonce,
    'total_cents', v_total,
    'currency', coalesce(v_currency, 'KES')
  );
end;
$$;

revoke all on function public.create_storefront_order(text, text, text, jsonb) from public;
grant execute on function public.create_storefront_order(text, text, text, jsonb) to anon;
grant execute on function public.create_storefront_order(text, text, text, jsonb) to authenticated;


create or replace function public.attach_mpesa_stk_request(
  p_order_id uuid,
  p_nonce uuid,
  p_merchant_request_id text,
  p_checkout_request_id text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated int;
begin
  update public.orders
  set mpesa_merchant_request_id = p_merchant_request_id,
      mpesa_checkout_request_id = p_checkout_request_id
  where id = p_order_id
    and mpesa_checkout_nonce = p_nonce
    and status = 'pending'::public.order_status;
  get diagnostics updated = row_count;
  return updated = 1;
end;
$$;

revoke all on function public.attach_mpesa_stk_request(uuid, uuid, text, text) from public;
grant execute on function public.attach_mpesa_stk_request(uuid, uuid, text, text) to anon;
grant execute on function public.attach_mpesa_stk_request(uuid, uuid, text, text) to authenticated;


create or replace function public.order_payment_status_for_nonce(
  p_order_id uuid,
  p_nonce uuid
)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'status', o.status,
    'paid', o.status = 'paid'::public.order_status,
    'mpesa_receipt', o.mpesa_receipt_number
  )
  from public.orders o
  where o.id = p_order_id
    and o.mpesa_checkout_nonce = p_nonce
  limit 1;
$$;

revoke all on function public.order_payment_status_for_nonce(uuid, uuid) from public;
grant execute on function public.order_payment_status_for_nonce(uuid, uuid) to anon;
grant execute on function public.order_payment_status_for_nonce(uuid, uuid) to authenticated;


create or replace function public.complete_order_from_mpesa_callback(
  p_checkout_request_id text,
  p_result_code integer,
  p_amount_kes integer,
  p_mpesa_receipt text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  expected_kes bigint;
  updated int := 0;
begin
  if p_checkout_request_id is null or length(trim(p_checkout_request_id)) = 0 then
    return jsonb_build_object('ok', false, 'reason', 'missing_checkout_id');
  end if;

  select round(o.total_cents::numeric / 100)
    into expected_kes
  from public.orders o
  where o.mpesa_checkout_request_id = trim(p_checkout_request_id)
    and o.currency = 'KES'
  limit 1;

  if expected_kes is null then
    return jsonb_build_object('ok', false, 'reason', 'order_not_found');
  end if;

  if p_result_code = 0 then
    if p_amount_kes is null or p_amount_kes <> expected_kes then
      return jsonb_build_object(
        'ok', false,
        'reason', 'amount_mismatch',
        'expected', expected_kes,
        'received', p_amount_kes
      );
    end if;

    update public.orders
    set status = 'paid'::public.order_status,
        mpesa_receipt_number = left(nullif(trim(coalesce(p_mpesa_receipt, '')), ''), 64)
    where mpesa_checkout_request_id = trim(p_checkout_request_id)
      and status = 'pending'::public.order_status
      and currency = 'KES'
      and round(total_cents::numeric / 100) = p_amount_kes::numeric;
    get diagnostics updated = row_count;

    return jsonb_build_object('ok', updated = 1, 'updated', updated);
  end if;

  return jsonb_build_object('ok', true, 'reason', 'payment_failed_or_cancelled', 'result_code', p_result_code);
end;
$$;

revoke all on function public.complete_order_from_mpesa_callback(text, integer, integer, text) from public;
grant execute on function public.complete_order_from_mpesa_callback(text, integer, integer, text) to service_role;
