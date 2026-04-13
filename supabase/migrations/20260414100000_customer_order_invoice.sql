-- Customer-facing invoice payload: same verification as track_order_lookup (order id + email).

create or replace function public.customer_order_invoice(p_order_id uuid, p_email text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'id', o.id,
    'status', o.status,
    'total_cents', o.total_cents,
    'currency', o.currency,
    'created_at', o.created_at,
    'customer_name', o.customer_name,
    'customer_email', o.customer_email,
    'phone', o.phone,
    'notes', o.notes,
    'mpesa_receipt_number', o.mpesa_receipt_number,
    'items', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'unit_price_cents', oi.unit_price_cents,
            'line_total_cents', oi.line_total_cents
          )
          order by oi.id
        )
        from public.order_items oi
        where oi.order_id = o.id
      ),
      '[]'::jsonb
    )
  )
  into result
  from public.orders o
  where o.id = p_order_id
    and lower(trim(o.customer_email)) = lower(trim(p_email));

  return result;
end;
$$;

grant execute on function public.customer_order_invoice(uuid, text) to anon;
grant execute on function public.customer_order_invoice(uuid, text) to authenticated;
