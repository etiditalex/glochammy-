-- Customer reviews (rating + text) and per-product likes (anonymous key from browser).

create table public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid references auth.users on delete set null,
  reviewer_name text not null,
  reviewer_email text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  body text not null check (char_length(trim(body)) >= 3),
  created_at timestamptz not null default now()
);

create index product_reviews_product_id_created
  on public.product_reviews (product_id, created_at desc);

create unique index product_reviews_product_email_unique
  on public.product_reviews (product_id, lower(trim(reviewer_email)));

create table public.product_likes (
  product_id uuid not null references public.products (id) on delete cascade,
  liker_key text not null check (char_length(trim(liker_key)) >= 8),
  created_at timestamptz not null default now(),
  primary key (product_id, liker_key)
);

alter table public.product_reviews enable row level security;
alter table public.product_likes enable row level security;

create policy "product_reviews_select_public"
  on public.product_reviews for select
  using (true);

create policy "product_reviews_insert_public"
  on public.product_reviews for insert
  with check (true);

create policy "product_likes_select_public"
  on public.product_likes for select
  using (true);

create or replace function public.toggle_product_like(p_product_id uuid, p_liker_key text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if trim(p_liker_key) is null or length(trim(p_liker_key)) < 8 then
    raise exception 'invalid liker key';
  end if;
  if exists (
    select 1 from public.product_likes
    where product_id = p_product_id and liker_key = trim(p_liker_key)
  ) then
    delete from public.product_likes
    where product_id = p_product_id and liker_key = trim(p_liker_key);
    return false;
  end if;
  insert into public.product_likes (product_id, liker_key)
  values (p_product_id, trim(p_liker_key));
  return true;
end;
$$;

grant execute on function public.toggle_product_like(uuid, text) to anon;
grant execute on function public.toggle_product_like(uuid, text) to authenticated;

create or replace function public.has_product_like(p_product_id uuid, p_liker_key text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.product_likes
    where product_id = p_product_id and liker_key = trim(p_liker_key)
  );
$$;

grant execute on function public.has_product_like(uuid, text) to anon;
grant execute on function public.has_product_like(uuid, text) to authenticated;
