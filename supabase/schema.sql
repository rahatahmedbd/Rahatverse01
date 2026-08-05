-- ════════════════════════════════════════════════════════
-- RahatVerse Database Schema (CLEAN VERSION)
-- Run this in Supabase SQL Editor
-- First drops everything, then creates fresh
-- ════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════
-- STEP 1: Drop EVERYTHING existing (clean slate)
-- ══════════════════════════════════════════════════════

-- Drop triggers first
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists update_profiles_updated_at on public.profiles;
drop trigger if exists update_orders_updated_at on public.orders;
drop trigger if exists update_blood_requests_updated_at on public.blood_requests;
drop trigger if exists update_blog_posts_updated_at on public.blog_posts;
drop trigger if exists update_bookings_updated_at on public.bookings;
drop trigger if exists update_settings_updated_at on public.site_settings;

-- Drop functions
drop function if exists public.handle_new_user();
drop function if exists public.update_updated_at();

-- Drop tables (order matters for dependencies)
drop table if exists public.site_settings;
drop table if exists public.bookings;
drop table if exists public.newsletter_subscribers;
drop table if exists public.blog_posts;
drop table if exists public.testimonials;
drop table if exists public.blood_requests;
drop table if exists public.orders;
drop table if exists public.messages;
drop table if exists public.profiles;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ══════════════════════════════════════════════════════
-- STEP 2: Create ALL tables
-- ══════════════════════════════════════════════════════

-- 1. Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  phone text,
  role text check (role in ('admin', 'client', 'visitor')) default 'visitor',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Messages
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

-- 3. Orders
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  client_whatsapp text,
  client_company text,
  package_type text check (package_type in ('basic', 'standard', 'premium', 'enterprise')) not null,
  website_type text check (website_type in ('portfolio', 'business', 'ecommerce', 'education', 'blood_org', 'ngo', 'news_portal', 'landing_page', 'event', 'custom')) not null,
  description text,
  num_pages integer default 1,
  features jsonb default '[]',
  color_preference text,
  reference_sites jsonb default '[]',
  budget_range text,
  timeline text,
  status text check (status in ('pending', 'confirmed', 'in_progress', 'review', 'delivered', 'cancelled')) default 'pending',
  admin_notes text,
  payment_status text check (payment_status in ('unpaid', 'partial', 'paid')) default 'unpaid',
  payment_amount decimal(10, 2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Blood Requests
create table public.blood_requests (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text not null,
  blood_group text check (blood_group in ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')) not null,
  location text not null,
  urgency text check (urgency in ('normal', 'urgent', 'critical')) default 'normal',
  message text,
  status text check (status in ('open', 'fulfilled', 'expired')) default 'open',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Testimonials
create table public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text,
  company text,
  content text not null,
  rating integer check (rating >= 1 and rating <= 5) default 5,
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- 6. Blog Posts
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

-- 7. Newsletter Subscribers
create table public.newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  name text,
  is_active boolean default true,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);

-- 8. Bookings
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text not null,
  date date not null,
  time_slot text not null,
  purpose text,
  status text check (status in ('pending', 'approved', 'rejected', 'completed')) default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 9. Site Settings
create table public.site_settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- ══════════════════════════════════════════════════════
-- STEP 3: Enable RLS
-- ══════════════════════════════════════════════════════

alter table public.profiles enable row level security;
alter table public.messages enable row level security;
alter table public.orders enable row level security;
alter table public.blood_requests enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.bookings enable row level security;
alter table public.site_settings enable row level security;

-- ══════════════════════════════════════════════════════
-- STEP 4: RLS Policies
-- ══════════════════════════════════════════════════════

-- Profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Messages
create policy "Anyone can create messages" on public.messages for insert with check (true);
create policy "Anyone can view own messages" on public.messages for select using (true);
create policy "Anyone can update messages" on public.messages for update using (true);

-- Orders
create policy "Anyone can create orders" on public.orders for insert with check (true);
create policy "Anyone can view orders" on public.orders for select using (true);
create policy "Anyone can update orders" on public.orders for update using (true);

-- Blood Requests
create policy "Anyone can create blood requests" on public.blood_requests for insert with check (true);
create policy "Anyone can view blood requests" on public.blood_requests for select using (true);
create policy "Anyone can update blood requests" on public.blood_requests for update using (true);

-- Testimonials
create policy "Anyone can submit testimonials" on public.testimonials for insert with check (true);
create policy "Anyone can view testimonials" on public.testimonials for select using (true);
create policy "Anyone can update testimonials" on public.testimonials for update using (true);

-- Blog Posts
create policy "Anyone can view posts" on public.blog_posts for select using (true);
create policy "Anyone can insert posts" on public.blog_posts for insert with check (true);
create policy "Anyone can update posts" on public.blog_posts for update using (true);

-- Newsletter
create policy "Anyone can subscribe" on public.newsletter_subscribers for insert with check (true);
create policy "Anyone can view subscribers" on public.newsletter_subscribers for select using (true);
create policy "Anyone can update subscribers" on public.newsletter_subscribers for update using (true);

-- Bookings
create policy "Anyone can create bookings" on public.bookings for insert with check (true);
create policy "Anyone can view bookings" on public.bookings for select using (true);
create policy "Anyone can update bookings" on public.bookings for update using (true);

-- Site Settings
create policy "Anyone can read settings" on public.site_settings for select using (true);
create policy "Anyone can insert settings" on public.site_settings for insert with check (true);
create policy "Anyone can update settings" on public.site_settings for update using (true);

-- ══════════════════════════════════════════════════════
-- STEP 5: Functions & Triggers
-- ══════════════════════════════════════════════════════

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles for each row execute procedure public.update_updated_at();
create trigger update_orders_updated_at before update on public.orders for each row execute procedure public.update_updated_at();
create trigger update_blood_requests_updated_at before update on public.blood_requests for each row execute procedure public.update_updated_at();
create trigger update_blog_posts_updated_at before update on public.blog_posts for each row execute procedure public.update_updated_at();
create trigger update_bookings_updated_at before update on public.bookings for each row execute procedure public.update_updated_at();
create trigger update_settings_updated_at before update on public.site_settings for each row execute procedure public.update_updated_at();

-- Auto-create profile on signup
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ══════════════════════════════════════════════════════
-- STEP 6: Seed Data
-- ══════════════════════════════════════════════════════

insert into public.site_settings (key, value) values
  ('packages', '[
    {"id": "basic", "name": "Basic", "nameBn": "বেসিক", "price": 5000, "features": ["1-3 Pages", "Responsive", "Contact Form"]},
    {"id": "standard", "name": "Standard", "nameBn": "স্ট্যান্ডার্ড", "price": 15000, "features": ["5-10 Pages", "Responsive", "Blog", "SEO"]},
    {"id": "premium", "name": "Premium", "nameBn": "প্রিমিয়াম", "price": 30000, "features": ["Unlimited Pages", "E-Commerce", "Payment", "SEO"]},
    {"id": "enterprise", "name": "Enterprise", "nameBn": "এন্টারপ্রাইজ", "price": 0, "features": ["Custom", "Contact for pricing"]}
  ]'::jsonb);

-- ══════════════════════════════════════════════════════
-- ✅ DONE! All 9 tables created successfully!
-- ══════════════════════════════════════════════════════
