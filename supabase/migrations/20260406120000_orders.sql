-- Orders + line items for storefront checkout and admin visibility

create type public.order_status as enum (
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  customer_email text not null,
  customer_name text not null,
  phone text,
  status public.order_status not null default 'pending',
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'KES',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders on delete cascade,
  product_id uuid not null references public.products on delete restrict,
  product_name text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  line_total_cents integer not null check (line_total_cents >= 0)
);

create index orders_user_id_idx on public.orders (user_id);
create index orders_created_at_idx on public.orders (created_at desc);
create index orders_customer_email_lower_idx on public.orders (lower(customer_email));
create index order_items_order_id_idx on public.order_items (order_id);

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "orders_insert_checkout"
  on public.orders for insert
  with check (true);

create policy "orders_select_own_or_admin"
  on public.orders for select
  using (
    public.is_admin()
    or (auth.uid() is not null and user_id = auth.uid())
  );

create policy "orders_update_admin"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "order_items_insert_checkout"
  on public.order_items for insert
  with check (true);

create policy "order_items_select_via_order"
  on public.order_items for select
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_items.order_id
        and (
          public.is_admin()
          or (auth.uid() is not null and o.user_id = auth.uid())
        )
    )
  );

create policy "order_items_update_admin"
  on public.order_items for update
  using (public.is_admin())
  with check (public.is_admin());
