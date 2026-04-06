-- Guest checkout: direct INSERT + .select() fails RLS because RETURNING is checked
-- against orders_select_own_or_admin (guests have no auth.uid() and user_id is null).
-- This RPC runs as definer, validates lines from public.products, and returns the new id.

create or replace function public.create_storefront_order(
  p_customer_email text,
  p_customer_name text,
  p_phone text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
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
  returning id into v_order_id;

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

  return v_order_id;
end;
$$;

revoke all on function public.create_storefront_order(text, text, text, jsonb) from public;
grant execute on function public.create_storefront_order(text, text, text, jsonb) to anon;
grant execute on function public.create_storefront_order(text, text, text, jsonb) to authenticated;
