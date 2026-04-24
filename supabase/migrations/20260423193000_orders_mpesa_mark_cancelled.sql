-- Mark failed/cancelled M-Pesa callbacks as cancelled orders so checkout can recover cleanly.

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

  update public.orders
  set status = 'cancelled'::public.order_status
  where mpesa_checkout_request_id = trim(p_checkout_request_id)
    and status = 'pending'::public.order_status
    and currency = 'KES';
  get diagnostics updated = row_count;

  return jsonb_build_object(
    'ok', true,
    'reason', 'payment_failed_or_cancelled',
    'result_code', p_result_code,
    'updated', updated
  );
end;
$$;

revoke all on function public.complete_order_from_mpesa_callback(text, integer, integer, text) from public;
grant execute on function public.complete_order_from_mpesa_callback(text, integer, integer, text) to service_role;
