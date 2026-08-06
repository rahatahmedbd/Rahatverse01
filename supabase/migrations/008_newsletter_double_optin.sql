-- Phase 27: Newsletter double opt-in, preferences, campaigns and delivery tracking
-- Non-destructive, idempotent. Run after 007_create_analytics_tables.sql

create extension if not exists "uuid-ossp";

-- ── Extend newsletter_subscribers ──────────────────────
alter table public.newsletter_subscribers
  add column if not exists is_confirmed boolean not null default false;

alter table public.newsletter_subscribers
  add column if not exists confirmation_token text;

alter table public.newsletter_subscribers
  add column if not exists confirmation_sent_at timestamptz;

alter table public.newsletter_subscribers
  add column if not exists confirmed_at timestamptz;

alter table public.newsletter_subscribers
  add column if not exists unsubscribe_token text;

alter table public.newsletter_subscribers
  add column if not exists preferences jsonb not null default '{}'::jsonb;

alter table public.newsletter_subscribers
  add column if not exists source text;

alter table public.newsletter_subscribers
  add column if not exists bounce_count integer not null default 0;

alter table public.newsletter_subscribers
  add column if not exists last_email_sent_at timestamptz;

alter table public.newsletter_subscribers
  add column if not exists updated_at timestamptz not null default now();

-- Backfill unsubscribe_token for legacy rows where null (random hex)
update public.newsletter_subscribers
set unsubscribe_token = encode(gen_random_bytes(24), 'hex')
where unsubscribe_token is null;

-- Make unsubscribe_token not null after backfill, but keep if check for existing
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='newsletter_subscribers' and column_name='unsubscribe_token'
  ) then
    -- ensure all rows have token
    update public.newsletter_subscribers set unsubscribe_token = encode(gen_random_bytes(24), 'hex') where unsubscribe_token is null;
  end if;
end $$;

alter table public.newsletter_subscribers alter column unsubscribe_token set default encode(gen_random_bytes(24), 'hex');

-- Indexes
create unique index if not exists idx_newsletter_confirmation_token
  on public.newsletter_subscribers(confirmation_token) where confirmation_token is not null;

create unique index if not exists idx_newsletter_unsubscribe_token
  on public.newsletter_subscribers(unsubscribe_token) where unsubscribe_token is not null;

create index if not exists idx_newsletter_email_lower
  on public.newsletter_subscribers(lower(email));

create index if not exists idx_newsletter_is_active on public.newsletter_subscribers(is_active);
create index if not exists idx_newsletter_is_confirmed on public.newsletter_subscribers(is_confirmed);
create index if not exists idx_newsletter_subscribed_at on public.newsletter_subscribers(subscribed_at desc);

-- Updated_at trigger
create or replace function public.update_newsletter_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_newsletter_updated on public.newsletter_subscribers;
create trigger trg_newsletter_updated before update on public.newsletter_subscribers
  for each row execute procedure public.update_newsletter_updated_at();

-- Migrate existing active rows to confirmed if they were previously just inserted without opt-in
update public.newsletter_subscribers set is_confirmed = true, confirmed_at = subscribed_at where is_active = true and is_confirmed = false and confirmation_token is null;

-- ── Campaigns table ───────────────────────────────────
create table if not exists public.newsletter_campaigns (
  id uuid default uuid_generate_v4() primary key,
  subject text not null,
  subject_bn text,
  content text not null,
  content_bn text,
  status text not null default 'draft' check (status in ('draft','scheduled','sending','sent','cancelled')),
  recipient_count integer not null default 0,
  sent_count integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_campaign_status on public.newsletter_campaigns(status);
create index if not exists idx_campaign_created_at on public.newsletter_campaigns(created_at desc);

drop trigger if exists trg_campaign_updated on public.newsletter_campaigns;
create trigger trg_campaign_updated before update on public.newsletter_campaigns
  for each row execute procedure public.update_updated_at();

alter table public.newsletter_campaigns enable row level security;

drop policy if exists "campaigns_select_admin" on public.newsletter_campaigns;
create policy "campaigns_select_admin" on public.newsletter_campaigns for select to authenticated using (public.is_admin());
drop policy if exists "campaigns_insert_admin" on public.newsletter_campaigns;
create policy "campaigns_insert_admin" on public.newsletter_campaigns for insert to authenticated with check (public.is_admin());
drop policy if exists "campaigns_update_admin" on public.newsletter_campaigns;
create policy "campaigns_update_admin" on public.newsletter_campaigns for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "campaigns_delete_admin" on public.newsletter_campaigns;
create policy "campaigns_delete_admin" on public.newsletter_campaigns for delete to authenticated using (public.is_admin());

-- ── Sends / delivery tracking ──────────────────────────
create table if not exists public.newsletter_sends (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.newsletter_campaigns(id) on delete cascade,
  subscriber_id uuid references public.newsletter_subscribers(id) on delete cascade,
  email text not null,
  status text not null default 'pending' check (status in ('pending','sent','delivered','bounced','failed','opened')),
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists idx_sends_campaign on public.newsletter_sends(campaign_id);
create index if not exists idx_sends_subscriber on public.newsletter_sends(subscriber_id);
create index if not exists idx_sends_status on public.newsletter_sends(status);
create index if not exists idx_sends_email on public.newsletter_sends(lower(email));

alter table public.newsletter_sends enable row level security;

drop policy if exists "sends_select_admin" on public.newsletter_sends;
create policy "sends_select_admin" on public.newsletter_sends for select to authenticated using (public.is_admin());
drop policy if exists "sends_insert_admin" on public.newsletter_sends;
create policy "sends_insert_admin" on public.newsletter_sends for insert to authenticated with check (public.is_admin());
drop policy if exists "sends_update_admin" on public.newsletter_sends;
create policy "sends_update_admin" on public.newsletter_sends for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "sends_delete_admin" on public.newsletter_sends;
create policy "sends_delete_admin" on public.newsletter_sends for delete to authenticated using (public.is_admin());

-- Ensure RLS enabled for subscribers (already) but refresh policies for new columns
-- Existing policies from 006 remain: newsletter_insert_public, newsletter_select_admin, newsletter_update_admin
-- Ensure anon insert still works with new defaults
drop policy if exists "newsletter_insert_public" on public.newsletter_subscribers;
create policy "newsletter_insert_public" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (is_active = false and is_confirmed = false and unsubscribed_at is null);

-- For Phase 27, public insert is via API (service uses anon key but bypasses RLS with is_active=false default). Keep permissive but require is_confirmed false.
-- Admin policies already exist.

comment on table public.newsletter_subscribers is 'Phase 27: double opt-in with confirmation_token + unsubscribe_token';
comment on table public.newsletter_campaigns is 'Phase 27: email campaigns';
comment on table public.newsletter_sends is 'Phase 27: per-subscriber delivery tracking';
