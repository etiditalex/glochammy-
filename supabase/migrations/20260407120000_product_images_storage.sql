-- Public product images; uploads restricted to admins (see is_admin()).

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_select_public"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "product_images_insert_admin"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and public.is_admin()
  );

create policy "product_images_update_admin"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and public.is_admin()
  )
  with check (
    bucket_id = 'product-images'
    and public.is_admin()
  );

create policy "product_images_delete_admin"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and public.is_admin()
  );
