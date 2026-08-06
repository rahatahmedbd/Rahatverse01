-- Phase 29: provider-agnostic transactional email delivery audit.
-- Apply after migration 009. Webhook writes use the Supabase service role.
create table if not exists public.email_deliveries (
  id uuid primary key default uuid_generate_v4(),
  provider text not null default 'resend',
  provider_id text unique,
  recipient text not null,
  category text not null default 'general',
  status text not null check (status in ('sent','delivered','bounced','complained','failed')),
  error text,
  sent_at timestamptz,
  delivered_at timestamptz,
  bounced_at timestamptz,
  complained_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_email_deliveries_created on public.email_deliveries(created_at desc);
create index if not exists idx_email_deliveries_status on public.email_deliveries(status);
create index if not exists idx_email_deliveries_category on public.email_deliveries(category);
drop trigger if exists trg_email_deliveries_updated on public.email_deliveries;
create trigger trg_email_deliveries_updated before update on public.email_deliveries for each row execute procedure public.update_updated_at();
alter table public.email_deliveries enable row level security;
drop policy if exists "email_deliveries_admin_select" on public.email_deliveries;
create policy "email_deliveries_admin_select" on public.email_deliveries for select to authenticated using (public.is_admin());
comment on table public.email_deliveries is 'Phase 29: Resend transactional/campaign delivery audit, updated by signed webhooks.';
