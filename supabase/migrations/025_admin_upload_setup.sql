-- ============================================================
-- 025 — Admin Image Upload: setup (idempotent)
-- ------------------------------------------------------------
-- 1) Ensures the images table + RLS policies exist (safe re-run).
-- 2) Assigns the admin role to the admin's email so they can
--    access /admin/upload and upload/delete via the signed
--    Cloudinary flow. The app checks profiles.role = 'admin'.
-- ============================================================

-- ── 1. Images table (already in 003, kept for safety) ──────
create table if not exists public.images (
  id uuid default uuid_generate_v4() primary key,
  public_id text not null unique,
  url text not null,
  category text not null,
  title text,
  title_bn text,
  description text,
  description_bn text,
  width integer,
  height integer,
  format text,
  size integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_images_category on public.images(category);
create index if not exists idx_images_public_id on public.images(public_id);

alter table public.images enable row level security;

drop policy if exists "Images are viewable by everyone" on public.images;
create policy "Images are viewable by everyone"
  on public.images for select
  using (true);

drop policy if exists "Only admins can insert images" on public.images;
create policy "Only admins can insert images"
  on public.images for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Only admins can update images" on public.images;
create policy "Only admins can update images"
  on public.images for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

drop policy if exists "Only admins can delete images" on public.images;
create policy "Only admins can delete images"
  on public.images for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ── 2. Grant the admin role to the admin account ────────────
-- Replace 'admin@rahatverse.com' with the real admin email.
-- Run AFTER the admin user has been created in Supabase Auth
-- (Auth -> Users -> Add user). The signup trigger creates a
-- profile row with role='visitor'; this promotes it to admin.
update public.profiles
set role = 'admin'
where email = 'admin@rahatverse.com'
  and role <> 'admin';

-- If the profile row does not exist yet (e.g. user exists in auth
-- but trigger didn't fire), this creates it:
insert into public.profiles (id, email, full_name, role)
select u.id, u.email, coalesce(u.raw_user_meta_data->>'full_name', ''), 'admin'
from auth.users u
where u.email = 'admin@rahatverse.com'
  and not exists (select 1 from public.profiles p where p.email = u.email);

-- ── 3. Verify ────────────────────────────────────────────────
select p.email, p.role
from public.profiles p
where p.role = 'admin';
