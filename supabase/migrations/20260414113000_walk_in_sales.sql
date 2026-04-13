-- Physical shop sales ledger (cash / M-Pesa) for items that may not exist in web catalog.

create table if not exists public.walk_in_sales (
  id uuid primary key default gen_random_uuid(),
  item_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'KES',
  payment_method text not null check (payment_method in ('cash', 'mpesa')),
  mpesa_code text,
  notes text,
  sold_at timestamptz not null default now(),
  created_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint walk_in_sales_mpesa_required check (
    (payment_method = 'mpesa' and mpesa_code is not null and length(trim(mpesa_code)) > 0)
    or (payment_method = 'cash' and mpesa_code is null)
  )
);

create unique index if not exists walk_in_sales_mpesa_code_unique
  on public.walk_in_sales (lower(mpesa_code))
  where mpesa_code is not null;

create index if not exists walk_in_sales_sold_at_idx
  on public.walk_in_sales (sold_at desc);

create trigger walk_in_sales_updated_at
  before update on public.walk_in_sales
  for each row execute function public.set_updated_at();

alter table public.walk_in_sales enable row level security;

create policy "walk_in_sales_select_admin"
  on public.walk_in_sales for select
  using (public.is_admin());

create policy "walk_in_sales_insert_admin"
  on public.walk_in_sales for insert
  with check (public.is_admin());

create policy "walk_in_sales_update_admin"
  on public.walk_in_sales for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "walk_in_sales_delete_admin"
  on public.walk_in_sales for delete
  using (public.is_admin());
