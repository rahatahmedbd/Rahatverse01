-- Phase 25 stabilization: protect personal data and align the blog schema.
-- Apply through the Supabase migration workflow. This migration is non-destructive.

create extension if not exists "uuid-ossp";

-- The function runs with the migration owner's privileges so policies can safely
-- check an admin role without recursively querying profiles under RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Standardise the blog columns consumed by the bilingual frontend.
alter table public.blog_posts add column if not exists title_bn text;
alter table public.blog_posts add column if not exists content_bn text;
alter table public.blog_posts add column if not exists excerpt_bn text;
alter table public.blog_posts add column if not exists author text;
alter table public.blog_posts add column if not exists updated_at timestamptz default now();
alter table public.blog_posts add column if not exists views integer default 0;

-- Earlier schema versions used jsonb for tags while later versions used text[].
-- Convert jsonb safely, but leave an already-correct text[] column untouched.
do $$
declare
  tags_type text;
begin
  select data_type into tags_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'blog_posts'
    and column_name = 'tags';

  if tags_type = 'jsonb' then
    execute $sql$
      alter table public.blog_posts
      alter column tags type text[]
      using coalesce(
        array(select jsonb_array_elements_text(tags)),
        array[]::text[]
      )
    $sql$;
  end if;
end;
$$;

alter table public.blog_posts alter column tags set default array[]::text[];

-- Remove permissive legacy policies before applying least-privilege policies.
drop policy if exists "allow_select_profiles" on public.profiles;
drop policy if exists "allow_insert_profiles" on public.profiles;
drop policy if exists "allow_update_profiles" on public.profiles;
drop policy if exists "allow_select_messages" on public.messages;
drop policy if exists "allow_insert_messages" on public.messages;
drop policy if exists "allow_update_messages" on public.messages;
drop policy if exists "allow_select_orders" on public.orders;
drop policy if exists "allow_insert_orders" on public.orders;
drop policy if exists "allow_update_orders" on public.orders;
drop policy if exists "allow_select_blood" on public.blood_requests;
drop policy if exists "allow_insert_blood" on public.blood_requests;
drop policy if exists "allow_update_blood" on public.blood_requests;
drop policy if exists "allow_select_testimonials" on public.testimonials;
drop policy if exists "allow_insert_testimonials" on public.testimonials;
drop policy if exists "allow_update_testimonials" on public.testimonials;
drop policy if exists "allow_select_blog" on public.blog_posts;
drop policy if exists "allow_insert_blog" on public.blog_posts;
drop policy if exists "allow_update_blog" on public.blog_posts;
drop policy if exists "allow_select_newsletter" on public.newsletter_subscribers;
drop policy if exists "allow_insert_newsletter" on public.newsletter_subscribers;
drop policy if exists "allow_update_newsletter" on public.newsletter_subscribers;
drop policy if exists "allow_select_bookings" on public.bookings;
drop policy if exists "allow_insert_bookings" on public.bookings;
drop policy if exists "allow_update_bookings" on public.bookings;
drop policy if exists "allow_select_settings" on public.site_settings;
drop policy if exists "allow_insert_settings" on public.site_settings;
drop policy if exists "allow_update_settings" on public.site_settings;
drop policy if exists "Anyone can read published blog posts" on public.blog_posts;
drop policy if exists "Admins can read all blog posts" on public.blog_posts;
drop policy if exists "Admins can insert blog posts" on public.blog_posts;
drop policy if exists "Admins can update blog posts" on public.blog_posts;
drop policy if exists "Admins can delete blog posts" on public.blog_posts;
drop policy if exists "Images are viewable by everyone" on public.images;
drop policy if exists "Only admins can insert images" on public.images;
drop policy if exists "Only admins can update images" on public.images;
drop policy if exists "Only admins can delete images" on public.images;

-- Profiles: users may read only their own profile; role changes remain admin-only.
create policy "profiles_select_own_or_admin" on public.profiles
  for select to authenticated
  using (auth.uid() = id or public.is_admin());
create policy "profiles_update_admin" on public.profiles
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Contact messages are write-only for visitors and readable only by admins.
create policy "messages_insert_public" on public.messages
  for insert to anon, authenticated
  with check (true);
create policy "messages_select_admin" on public.messages
  for select to authenticated
  using (public.is_admin());
create policy "messages_update_admin" on public.messages
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Orders: anonymous visitors can create an order; signed-in users see their own;
-- administrators manage all orders.
create policy "orders_insert_public" on public.orders
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
create policy "orders_select_owner_or_admin" on public.orders
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy "orders_update_admin" on public.orders
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Blood requests contain phone numbers and locations, so only administrators
-- can view or manage them. Public users can still submit a request.
create policy "blood_requests_insert_public" on public.blood_requests
  for insert to anon, authenticated
  with check (true);
create policy "blood_requests_select_admin" on public.blood_requests
  for select to authenticated
  using (public.is_admin());
create policy "blood_requests_update_admin" on public.blood_requests
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Testimonials are publicly visible only after approval.
create policy "testimonials_insert_unapproved" on public.testimonials
  for insert to anon, authenticated
  with check (is_approved = false);
create policy "testimonials_select_approved_or_admin" on public.testimonials
  for select to anon, authenticated
  using (is_approved = true or public.is_admin());
create policy "testimonials_update_admin" on public.testimonials
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "testimonials_delete_admin" on public.testimonials
  for delete to authenticated
  using (public.is_admin());

-- Published posts are public; draft management is admin-only.
create policy "blog_posts_select_published_or_admin" on public.blog_posts
  for select to anon, authenticated
  using (is_published = true or public.is_admin());
create policy "blog_posts_insert_admin" on public.blog_posts
  for insert to authenticated
  with check (public.is_admin());
create policy "blog_posts_update_admin" on public.blog_posts
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "blog_posts_delete_admin" on public.blog_posts
  for delete to authenticated
  using (public.is_admin());

-- Newsletter addresses and bookings are private. Their public forms can only
-- create safe initial records; administrators manage the records afterward.
create policy "newsletter_insert_public" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (is_active = true and unsubscribed_at is null);
create policy "newsletter_select_admin" on public.newsletter_subscribers
  for select to authenticated
  using (public.is_admin());
create policy "newsletter_update_admin" on public.newsletter_subscribers
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "bookings_insert_public" on public.bookings
  for insert to anon, authenticated
  with check (status = 'pending');
create policy "bookings_select_admin" on public.bookings
  for select to authenticated
  using (public.is_admin());
create policy "bookings_update_admin" on public.bookings
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Site settings and images can be read publicly, but only administrators may
-- change them. Do not store secrets in site_settings.
create policy "site_settings_select_public" on public.site_settings
  for select to anon, authenticated
  using (true);
create policy "site_settings_admin_write" on public.site_settings
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "images_select_public" on public.images
  for select to anon, authenticated
  using (true);
create policy "images_insert_admin" on public.images
  for insert to authenticated
  with check (public.is_admin());
create policy "images_update_admin" on public.images
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "images_delete_admin" on public.images
  for delete to authenticated
  using (public.is_admin());
