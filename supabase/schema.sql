-- ════════════════════════════════════════════════════════
-- RahatVerse Database Schema (Fixed)
-- Run this in Supabase SQL Editor
-- ════════════════════════════════════════════════════════

-- ── Enable UUID extension ──────────────────────────────
create extension if not exists "uuid-ossp";

-- ══════════════════════════════════════════════════════
-- STEP 1: Create tables WITHOUT foreign keys first
-- ══════════════════════════════════════════════════════

-- Profiles table (references auth.users which always exists)
create table if not exists public.profiles (
  id uuid primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  phone text,
  role text check (role in ('admin', 'client', 'visitor')) default 'visitor',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table (no foreign keys)
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Orders table (no foreign keys yet)
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid,
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

-- Blood Requests table (no foreign keys)
create table if not exists public.blood_requests (
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

-- Testimonials table (no foreign keys)
create table if not exists public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text,
  company text,
  content text not null,
  rating integer check (rating >= 1 and rating <= 5) default 5,
  is_approved boolean default false,
  created_at timestamptz default now()
);

-- Blog Posts table (no foreign keys yet)
create table if not exists public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid,
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

-- Newsletter Subscribers table (no foreign keys)
create table if not exists public.newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  name text,
  is_active boolean default true,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);

-- Bookings table (no foreign keys)
create table if not exists public.bookings (
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

-- Site Settings table (no foreign keys)
create table if not exists public.site_settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- ══════════════════════════════════════════════════════
-- STEP 2: Add foreign keys AFTER all tables exist
-- ══════════════════════════════════════════════════════

-- Profiles FK to auth.users
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'profiles_id_fkey'
  ) then
    alter table public.profiles
    add constraint profiles_id_fkey
    foreign key (id) references auth.users(id) on delete cascade;
  end if;
end $$;

-- Orders FK to profiles
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'orders_user_id_fkey'
  ) then
    alter table public.orders
    add constraint orders_user_id_fkey
    foreign key (user_id) references public.profiles(id) on delete set null;
  end if;
end $$;

-- Blog Posts FK to profiles
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conname = 'blog_posts_author_id_fkey'
  ) then
    alter table public.blog_posts
    add constraint blog_posts_author_id_fkey
    foreign key (author_id) references public.profiles(id) on delete set null;
  end if;
end $$;

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

-- Profiles: Users can view/update own profile
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Messages: Anyone can insert, admins can view/update
drop policy if exists "Anyone can create messages" on public.messages;
create policy "Anyone can create messages"
  on public.messages for insert
  with check (true);

drop policy if exists "Admins can view messages" on public.messages;
create policy "Admins can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Admins can update messages" on public.messages;
create policy "Admins can update messages"
  on public.messages for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Orders: Anyone can insert, users view own, admins view all
drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
  on public.orders for insert
  with check (true);

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders for select
  using (user_id = auth.uid());

drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Blood Requests: Anyone can insert and view open, admins manage all
drop policy if exists "Anyone can create blood requests" on public.blood_requests;
create policy "Anyone can create blood requests"
  on public.blood_requests for insert
  with check (true);

drop policy if exists "Anyone can view open blood requests" on public.blood_requests;
create policy "Anyone can view open blood requests"
  on public.blood_requests for select
  using (status = 'open');

drop policy if exists "Admins can view all blood requests" on public.blood_requests;
create policy "Admins can view all blood requests"
  on public.blood_requests for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "Admins can update blood requests" on public.blood_requests;
create policy "Admins can update blood requests"
  on public.blood_requests for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Testimonials: Anyone can insert and view approved, admins manage
drop policy if exists "Anyone can submit testimonials" on public.testimonials;
create policy "Anyone can submit testimonials"
  on public.testimonials for insert
  with check (true);

drop policy if exists "Anyone can view approved testimonials" on public.testimonials;
create policy "Anyone can view approved testimonials"
  on public.testimonials for select
  using (is_approved = true);

drop policy if exists "Admins can manage testimonials" on public.testimonials;
create policy "Admins can manage testimonials"
  on public.testimonials for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Blog Posts: Anyone can view published, admins manage
drop policy if exists "Anyone can view published posts" on public.blog_posts;
create policy "Anyone can view published posts"
  on public.blog_posts for select
  using (is_published = true);

drop policy if exists "Admins can manage all posts" on public.blog_posts;
create policy "Admins can manage all posts"
  on public.blog_posts for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Newsletter: Anyone can subscribe, admins manage
drop policy if exists "Anyone can subscribe" on public.newsletter_subscribers;
create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert
  with check (true);

drop policy if exists "Admins can manage subscribers" on public.newsletter_subscribers;
create policy "Admins can manage subscribers"
  on public.newsletter_subscribers for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Bookings: Anyone can insert, admins manage
drop policy if exists "Anyone can create bookings" on public.bookings;
create policy "Anyone can create bookings"
  on public.bookings for insert
  with check (true);

drop policy if exists "Admins can manage bookings" on public.bookings;
create policy "Admins can manage bookings"
  on public.bookings for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Site Settings: Anyone can read, admins manage
drop policy if exists "Anyone can read settings" on public.site_settings;
create policy "Anyone can read settings"
  on public.site_settings for select
  using (true);

drop policy if exists "Admins can update settings" on public.site_settings;
create policy "Admins can update settings"
  on public.site_settings for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

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

-- Apply triggers
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at before update on public.profiles
  for each row execute procedure public.update_updated_at();

drop trigger if exists update_orders_updated_at on public.orders;
create trigger update_orders_updated_at before update on public.orders
  for each row execute procedure public.update_updated_at();

drop trigger if exists update_blood_requests_updated_at on public.blood_requests;
create trigger update_blood_requests_updated_at before update on public.blood_requests
  for each row execute procedure public.update_updated_at();

drop trigger if exists update_blog_posts_updated_at on public.blog_posts;
create trigger update_blog_posts_updated_at before update on public.blog_posts
  for each row execute procedure public.update_updated_at();

drop trigger if exists update_bookings_updated_at on public.bookings;
create trigger update_bookings_updated_at before update on public.bookings
  for each row execute procedure public.update_updated_at();

drop trigger if exists update_settings_updated_at on public.site_settings;
create trigger update_settings_updated_at before update on public.site_settings
  for each row execute procedure public.update_updated_at();

-- Auto-create profile on user signup
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

drop trigger if exists on_auth_user_created on auth.users;
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
  ]'::jsonb)
on conflict (key) do nothing;

-- ══════════════════════════════════════════════════════
-- DONE! ✅
-- ══════════════════════════════════════════════════════
