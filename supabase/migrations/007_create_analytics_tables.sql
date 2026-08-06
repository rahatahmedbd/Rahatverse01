-- Phase 26: first-party analytics storage.
-- Apply through the Supabase migration workflow. This migration is non-destructive.
--
-- Design notes:
-- * Writing tracking data is public (anon) because visitors are not authenticated.
--   Payloads are validated and size-capped in /api/analytics before insert, so the
--   insert policy stays simple and cannot leak or modify existing rows.
-- * Reading and deleting analytics data is restricted to administrators via the
--   is_admin() helper created in migration 006.

create table if not exists public.analytics_page_views (
  id uuid default uuid_generate_v4() primary key,
  session_id text not null,
  path text not null,
  referrer text,
  referrer_source text,
  country text,
  device_type text not null default 'unknown' check (device_type in ('mobile', 'tablet', 'desktop', 'unknown')),
  screen_width integer,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid default uuid_generate_v4() primary key,
  session_id text not null,
  event_name text not null,
  event_category text not null default 'general',
  event_label text,
  path text,
  value double precision,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Lookup patterns used by the analytics dashboard and API.
create index if not exists idx_analytics_page_views_created_at on public.analytics_page_views (created_at desc);
create index if not exists idx_analytics_page_views_session on public.analytics_page_views (session_id);
create index if not exists idx_analytics_page_views_path on public.analytics_page_views (path);
create index if not exists idx_analytics_events_created_at on public.analytics_events (created_at desc);
create index if not exists idx_analytics_events_session on public.analytics_events (session_id);
create index if not exists idx_analytics_events_name on public.analytics_events (event_name);

alter table public.analytics_page_views enable row level security;
alter table public.analytics_events enable row level security;

-- Writing tracking rows is public; the API route sanitises every field.
drop policy if exists "analytics_page_views_insert_public" on public.analytics_page_views;
create policy "analytics_page_views_insert_public"
  on public.analytics_page_views for insert
  to anon, authenticated
  with check (true);

drop policy if exists "analytics_events_insert_public" on public.analytics_events;
create policy "analytics_events_insert_public"
  on public.analytics_events for insert
  to anon, authenticated
  with check (true);

-- Reading and deleting are admin-only.
drop policy if exists "analytics_page_views_admin_read" on public.analytics_page_views;
create policy "analytics_page_views_admin_read"
  on public.analytics_page_views for select
  to anon, authenticated
  using (public.is_admin());

drop policy if exists "analytics_page_views_admin_delete" on public.analytics_page_views;
create policy "analytics_page_views_admin_delete"
  on public.analytics_page_views for delete
  to anon, authenticated
  using (public.is_admin());

drop policy if exists "analytics_events_admin_read" on public.analytics_events;
create policy "analytics_events_admin_read"
  on public.analytics_events for select
  to anon, authenticated
  using (public.is_admin());

drop policy if exists "analytics_events_admin_delete" on public.analytics_events;
create policy "analytics_events_admin_delete"
  on public.analytics_events for delete
  to anon, authenticated
  using (public.is_admin());
