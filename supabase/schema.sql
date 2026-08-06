-- RahatVerse Database Schema - Fresh Install
-- Supabase: jlciqhpewcahkphhyezq
-- Run this ENTIRE SQL in Supabase SQL Editor

-- DROP ALL (cascade removes dependencies)
drop table if exists public.quotes cascade;
drop table if exists public.revisions cascade;
drop table if exists public.project_messages cascade;
drop table if exists public.invoices cascade;
drop table if exists public.payments cascade;
drop table if exists public.site_settings cascade;
drop table if exists public.bookings cascade;
drop table if exists public.newsletter_subscribers cascade;
drop table if exists public.blog_posts cascade;
drop table if exists public.testimonials cascade;
drop table if exists public.blood_requests cascade;
drop table if exists public.orders cascade;
drop table if exists public.messages cascade;
drop table if exists public.profiles cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.update_updated_at() cascade;

-- CREATE TABLES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  phone text,
  role text default 'visitor',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  client_whatsapp text,
  client_company text,
  package_type text not null,
  website_type text not null,
  description text,
  num_pages integer default 1,
  features jsonb default '[]',
  color_preference text,
  reference_sites jsonb default '[]',
  budget_range text,
  timeline text,
  status text default 'pending',
  admin_notes text,
  payment_status text default 'unpaid',
  payment_amount decimal(10,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.blood_requests (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text not null,
  blood_group text not null,
  location text not null,
  urgency text default 'normal',
  message text,
  status text default 'open',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text,
  company text,
  content text not null,
  rating integer default 5,
  is_approved boolean default false,
  created_at timestamptz default now()
);

create table public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete set null,
  title text not null,
  slug text unique not null,
  content text not null,
  excerpt text,
  cover_image text,
  category text,
  tags jsonb default '[]',
  is_published boolean default false,
  published_at timestamptz,
  reading_time integer default 1,
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  name text,
  is_active boolean default true,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);

create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text not null,
  date date not null,
  time_slot text not null,
  purpose text,
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.site_settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- ENABLE RLS
alter table public.profiles enable row level security;
alter table public.messages enable row level security;
alter table public.orders enable row level security;
alter table public.blood_requests enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.bookings enable row level security;
alter table public.site_settings enable row level security;

-- POLICIES (allow all for now, tighten later)
create policy "allow_select_profiles" on public.profiles for select using (true);
create policy "allow_insert_profiles" on public.profiles for insert with check (true);
create policy "allow_update_profiles" on public.profiles for update using (true);
create policy "allow_select_messages" on public.messages for select using (true);
create policy "allow_insert_messages" on public.messages for insert with check (true);
create policy "allow_update_messages" on public.messages for update using (true);
create policy "allow_select_orders" on public.orders for select using (true);
create policy "allow_insert_orders" on public.orders for insert with check (true);
create policy "allow_update_orders" on public.orders for update using (true);
create policy "allow_select_blood" on public.blood_requests for select using (true);
create policy "allow_insert_blood" on public.blood_requests for insert with check (true);
create policy "allow_update_blood" on public.blood_requests for update using (true);
create policy "allow_select_testimonials" on public.testimonials for select using (true);
create policy "allow_insert_testimonials" on public.testimonials for insert with check (true);
create policy "allow_update_testimonials" on public.testimonials for update using (true);
create policy "allow_select_blog" on public.blog_posts for select using (true);
create policy "allow_insert_blog" on public.blog_posts for insert with check (true);
create policy "allow_update_blog" on public.blog_posts for update using (true);
create policy "allow_select_newsletter" on public.newsletter_subscribers for select using (true);
create policy "allow_insert_newsletter" on public.newsletter_subscribers for insert with check (true);
create policy "allow_update_newsletter" on public.newsletter_subscribers for update using (true);
create policy "allow_select_bookings" on public.bookings for select using (true);
create policy "allow_insert_bookings" on public.bookings for insert with check (true);
create policy "allow_update_bookings" on public.bookings for update using (true);
create policy "allow_select_settings" on public.site_settings for select using (true);
create policy "allow_insert_settings" on public.site_settings for insert with check (true);
create policy "allow_update_settings" on public.site_settings for update using (true);

-- FUNCTIONS
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_profiles_updated before update on public.profiles for each row execute procedure public.update_updated_at();
create trigger trg_orders_updated before update on public.orders for each row execute procedure public.update_updated_at();
create trigger trg_blood_updated before update on public.blood_requests for each row execute procedure public.update_updated_at();
create trigger trg_blog_updated before update on public.blog_posts for each row execute procedure public.update_updated_at();
create trigger trg_bookings_updated before update on public.bookings for each row execute procedure public.update_updated_at();
create trigger trg_settings_updated before update on public.site_settings for each row execute procedure public.update_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_new_user
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SEED DATA
insert into public.site_settings (key, value) values (
  'packages',
  '[{"id":"basic","name":"Basic","nameBn":"বেসিক","price":5000,"features":["1-3 Pages","Responsive","Contact Form"]},{"id":"standard","name":"Standard","nameBn":"স্ট্যান্ডার্ড","price":15000,"features":["5-10 Pages","Blog","SEO"]},{"id":"premium","name":"Premium","nameBn":"প্রিমিয়াম","price":30000,"features":["E-Commerce","Payment","SEO"]},{"id":"enterprise","name":"Enterprise","nameBn":"এন্টারপ্রাইজ","price":0,"features":["Custom","Contact for pricing"]}]'::jsonb
);
