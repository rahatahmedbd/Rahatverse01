-- Phase 28: Admin Dashboard Enhancement
-- Adds audit logging, admin notifications, blog comments, system logs, and
-- backup tracking. Non-destructive and idempotent — safe to run once on the
-- production database after migration 008.

-- ── Audit Logs ─────────────────────────────────────────
-- Records who did what in the admin area. Written by the audit helper
-- (src/lib/admin/audit.ts) through admin-only API routes.
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null,
  entity text not null default 'general',
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_created_at on public.audit_logs (created_at desc);
create index if not exists idx_audit_logs_actor on public.audit_logs (actor_id);
create index if not exists idx_audit_logs_action on public.audit_logs (action);
create index if not exists idx_audit_logs_entity on public.audit_logs (entity);

alter table public.audit_logs enable row level security;

drop policy if exists "audit_logs_admin_all" on public.audit_logs;
create policy "audit_logs_admin_all"
  on public.audit_logs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── Admin Notifications ────────────────────────────────
-- In-app notification center for administrators.
create table if not exists public.admin_notifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  title_bn text,
  message text,
  message_bn text,
  type text not null default 'info' check (type in ('info', 'success', 'warning', 'error')),
  link text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_notifications_created on public.admin_notifications (created_at desc);
create index if not exists idx_admin_notifications_read on public.admin_notifications (is_read);

alter table public.admin_notifications enable row level security;

drop policy if exists "admin_notifications_admin_all" on public.admin_notifications;
create policy "admin_notifications_admin_all"
  on public.admin_notifications for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── Blog Comments ──────────────────────────────────────
-- Public visitors may submit comments (pending approval); approved comments
-- are publicly readable; administrators moderate (approve / reject / delete).
create table if not exists public.blog_comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  author_name text not null,
  author_email text not null,
  content text not null check (char_length(content) between 1 and 2000),
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_blog_comments_post on public.blog_comments (post_id, created_at desc);
create index if not exists idx_blog_comments_approved on public.blog_comments (is_approved);

alter table public.blog_comments enable row level security;

drop policy if exists "blog_comments_insert_public" on public.blog_comments;
create policy "blog_comments_insert_public"
  on public.blog_comments for insert
  to anon, authenticated
  with check (is_approved = false);

drop policy if exists "blog_comments_select_approved_or_admin" on public.blog_comments;
create policy "blog_comments_select_approved_or_admin"
  on public.blog_comments for select
  to anon, authenticated
  using (is_approved = true or public.is_admin());

drop policy if exists "blog_comments_admin_update" on public.blog_comments;
create policy "blog_comments_admin_update"
  on public.blog_comments for update
  to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "blog_comments_admin_delete" on public.blog_comments;
create policy "blog_comments_admin_delete"
  on public.blog_comments for delete
  to authenticated
  using (public.is_admin());

-- ── System Logs ────────────────────────────────────────
-- Application-level log entries (server actions + client error reports).
create table if not exists public.system_logs (
  id uuid default uuid_generate_v4() primary key,
  level text not null default 'info' check (level in ('debug', 'info', 'warn', 'error')),
  source text not null default 'app',
  message text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_system_logs_created on public.system_logs (created_at desc);
create index if not exists idx_system_logs_level on public.system_logs (level);

alter table public.system_logs enable row level security;

drop policy if exists "system_logs_admin_all" on public.system_logs;
create policy "system_logs_admin_all"
  on public.system_logs for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── Backup History ─────────────────────────────────────
-- Tracks manual / scheduled backup records. Supabase-managed snapshots are
-- taken in the Supabase dashboard; this table records the audit trail and
-- powers the "Database backup status" widget.
create table if not exists public.system_backups (
  id uuid default uuid_generate_v4() primary key,
  status text not null default 'completed' check (status in ('completed', 'failed', 'in_progress')),
  scope text not null default 'full' check (scope in ('full', 'schema', 'partial')),
  note text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists idx_system_backups_created on public.system_backups (created_at desc);

alter table public.system_backups enable row level security;

drop policy if exists "system_backups_admin_all" on public.system_backups;
create policy "system_backups_admin_all"
  on public.system_backups for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── Seed: default admin notification ───────────────────
insert into public.admin_notifications (title, title_bn, message, message_bn, type, link)
select
  'Welcome to the new Admin Dashboard',
  'নতুন অ্যাডমিন ড্যাশবোর্ডে স্বাগতম',
  'Phase 28 added system health, audit logs, user management, CMS, comment moderation, notifications, and data export.',
  'ফেজ ২৮-এ সিস্টেম হেলথ, অডিট লগ, ইউজার ম্যানেজমেন্ট, CMS, কমেন্ট মডারেশন, নোটিফিকেশন ও ডেটা এক্সপোর্ট যুক্ত হয়েছে।',
  'success',
  '/bn/dashboard/health'
where not exists (
  select 1 from public.admin_notifications where title = 'Welcome to the new Admin Dashboard'
);
