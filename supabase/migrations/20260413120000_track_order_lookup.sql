-- Public order lookup: match full order UUID + email (guest orders have no auth.uid(); RLS blocks direct select).

create or replace function public.track_order_lookup(p_order_id uuid, p_email text)
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
    'items', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'line_total_cents', oi.line_total_cents
          ) order by oi.id
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

grant execute on function public.track_order_lookup(uuid, text) to anon;
grant execute on function public.track_order_lookup(uuid, text) to authenticated;
