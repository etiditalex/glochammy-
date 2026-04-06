-- Glochammy Beauty: profiles, catalog, bookings, inquiries, storage
-- Run in Supabase SQL Editor or via supabase db push

create extension if not exists "pgcrypto";

create type public.user_role as enum ('customer', 'admin');
create type public.booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type public.inquiry_status as enum ('new', 'read', 'replied', 'archived');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  long_description text not null,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'KES',
  category text not null check (category in ('skincare', 'hair', 'body', 'fragrance')),
  images text[] not null default '{}',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  service_id text not null,
  service_name text,
  preferred_date date not null,
  preferred_time text not null,
  notes text,
  status public.booking_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------------
-- Admin helper (SECURITY DEFINER so RLS can call it reliably)
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select role = 'admin'::public.user_role
      from public.profiles
      where id = auth.uid()
    ),
    false
  );
$$;

grant execute on function public.is_admin() to anon;
grant execute on function public.is_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- Auth: create profile row
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    nullif(trim(concat(
      coalesce(new.raw_user_meta_data->>'first_name', ''),
      ' ',
      coalesce(new.raw_user_meta_data->>'last_name', '')
    )), '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.bookings enable row level security;
alter table public.inquiries enable row level security;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "products_select_all"
  on public.products for select
  using (true);

create policy "products_insert_admin"
  on public.products for insert
  with check (public.is_admin());

create policy "products_update_admin"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_delete_admin"
  on public.products for delete
  using (public.is_admin());

create policy "bookings_insert_any"
  on public.bookings for insert
  with check (true);

create policy "bookings_select_own_or_admin"
  on public.bookings for select
  using (public.is_admin() or auth.uid() = user_id);

create policy "bookings_update_admin"
  on public.bookings for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "inquiries_insert_any"
  on public.inquiries for insert
  with check (true);

create policy "inquiries_select_admin"
  on public.inquiries for select
  using (public.is_admin());

create policy "inquiries_update_admin"
  on public.inquiries for update
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: avatars (path: {user_id}/filename)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_select_public"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_update_own"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid() is not null
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ---------------------------------------------------------------------------
-- Seed products (matches src/lib/data/products.ts)
-- ---------------------------------------------------------------------------

insert into public.products (
  slug, name, description, long_description, price_cents, currency, category, images, featured, sort_order
) values
(
  'aurora-gentle-cleanser',
  'Aurora Gentle Cleanser',
  'Silky daily cleanser to lift impurities without stripping.',
  'A sulfate-free gel-cream that respects your barrier. Massage onto damp skin, rinse, and follow with your serum. Formulated for sensitive and combination skin with a soft botanical scent.',
  3800,
  'KES',
  'skincare',
  array[
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&w=2400&q=88',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&w=2400&q=88'
  ],
  true,
  1
),
(
  'lumen-clarity-serum',
  'Lumen Clarity Serum',
  'Brightening serum with stabilized vitamin C and peptides.',
  'Featherlight and fast-absorbing. Use morning and night before moisturizer. Helps even tone and refine texture without irritation.',
  6200,
  'KES',
  'skincare',
  array[
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&w=2400&q=88',
    'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&w=2400&q=88'
  ],
  true,
  2
),
(
  'midnight-ritual-face-oil',
  'Midnight Ritual Face Oil',
  'Nourishing oil blend for overnight recovery.',
  'Cold-pressed marula and squalane melt into the skin. Press in after moisturizer on dry days or use alone as the final step.',
  5400,
  'KES',
  'skincare',
  array['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&w=2400&q=88'],
  false,
  3
),
(
  'silk-hair-mist',
  'Silk Hair Mist',
  'Weightless finish for shine and heat protection.',
  'Mist from mid-lengths to ends before styling. Heat-activated polymers smooth the cuticle while keeping movement.',
  2900,
  'KES',
  'hair',
  array['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&w=2400&q=88'],
  true,
  4
),
(
  'bloom-body-polish',
  'Bloom Body Polish',
  'Fine botanical grains and oils for supple skin.',
  'Use once or twice weekly on damp skin. Rinse thoroughly and pat dry. Follow with body lotion or oil.',
  3600,
  'KES',
  'body',
  array['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&w=2400&q=88'],
  false,
  5
),
(
  'noir-drift-edp',
  'Noir Drift Eau de Parfum',
  'Airy woods, soft iris, and a trace of citrus.',
  'Designed to sit close to the skin. Spritz on pulse points; layer with unscented body care for longevity.',
  8900,
  'KES',
  'fragrance',
  array['https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&w=2400&q=88'],
  false,
  6
)
on conflict (slug) DO NOTHING;

-- After first admin user signs up, run (replace email):
-- update public.profiles set role = 'admin' where email = 'you@example.com';
