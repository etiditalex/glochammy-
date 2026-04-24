-- Expose checkout request id in polling RPC so server can query Daraja for definitive STK status.

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
    'mpesa_receipt', o.mpesa_receipt_number,
    'mpesa_checkout_request_id', o.mpesa_checkout_request_id
  )
  from public.orders o
  where o.id = p_order_id
    and o.mpesa_checkout_nonce = p_nonce
  limit 1;
$$;

revoke all on function public.order_payment_status_for_nonce(uuid, uuid) from public;
grant execute on function public.order_payment_status_for_nonce(uuid, uuid) to anon;
grant execute on function public.order_payment_status_for_nonce(uuid, uuid) to authenticated;
