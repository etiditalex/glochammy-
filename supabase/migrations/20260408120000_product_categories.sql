-- Dynamic product categories (admin-managed). Replaces the fixed CHECK on products.category.

create table if not exists public.product_categories (
  slug text primary key,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

insert into public.product_categories (slug, name, sort_order) values
  ('skincare', 'Skincare', 10),
  ('hair', 'Hair', 20),
  ('body', 'Body', 30),
  ('fragrance', 'Fragrance', 40)
on conflict (slug) do nothing;

-- Drop legacy CHECK on products.category (name may vary by PG version).
do $$
declare
  r record;
begin
  for r in
    select c.conname
    from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    where t.relname = 'products'
      and t.relnamespace = (select oid from pg_namespace where nspname = 'public')
      and c.contype = 'c'
      and pg_get_constraintdef(c.oid) ilike '%category%'
  loop
    execute format('alter table public.products drop constraint %I', r.conname);
  end loop;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint c
    join pg_class t on c.conrelid = t.oid
    join pg_namespace n on t.relnamespace = n.oid
    where c.conname = 'products_category_fkey'
      and t.relname = 'products'
      and n.nspname = 'public'
  ) then
    alter table public.products
      add constraint products_category_fkey
      foreign key (category) references public.product_categories (slug)
      on update cascade
      on delete restrict;
  end if;
end $$;

alter table public.product_categories enable row level security;

create policy "product_categories_select_all"
  on public.product_categories for select
  using (true);

create policy "product_categories_insert_admin"
  on public.product_categories for insert
  with check (public.is_admin());

create policy "product_categories_update_admin"
  on public.product_categories for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "product_categories_delete_admin"
  on public.product_categories for delete
  using (public.is_admin());
