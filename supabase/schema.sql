-- RahatVerse base database schema
--
-- Use Supabase migrations for production deployments. This file is a safe
-- reference/fresh-install base and intentionally contains NO permissive RLS
-- policies. Apply every SQL file in supabase/migrations afterward, in order.
-- Never use destructive SQL against a database containing production data.

create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  phone text,
  role text not null default 'visitor' check (role in ('admin', 'client', 'visitor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
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
  num_pages integer not null default 1 check (num_pages > 0),
  features jsonb not null default '[]',
  color_preference text,
  reference_sites jsonb not null default '[]',
  budget_range text,
  timeline text,
  status text not null default 'pending',
  admin_notes text,
  payment_status text not null default 'unpaid',
  payment_amount decimal(10,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blood_requests (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text not null,
  blood_group text not null,
  location text not null,
  urgency text not null default 'normal',
  message text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  role text,
  company text,
  content text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete set null,
  author text,
  title text not null,
  title_bn text,
  slug text unique not null,
  content text not null,
  content_bn text,
  excerpt text,
  excerpt_bn text,
  cover_image text,
  category text,
  tags text[] not null default array[]::text[],
  is_published boolean not null default false,
  published_at timestamptz,
  reading_time integer not null default 1 check (reading_time > 0),
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  name text,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table if not exists public.bookings (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text not null,
  date date not null,
  time_slot text not null,
  purpose text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid default uuid_generate_v4() primary key,
  key text unique not null,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles for each row execute procedure public.update_updated_at();
drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated before update on public.orders for each row execute procedure public.update_updated_at();
drop trigger if exists trg_blood_updated on public.blood_requests;
create trigger trg_blood_updated before update on public.blood_requests for each row execute procedure public.update_updated_at();
drop trigger if exists trg_blog_updated on public.blog_posts;
create trigger trg_blog_updated before update on public.blog_posts for each row execute procedure public.update_updated_at();
drop trigger if exists trg_bookings_updated on public.bookings;
create trigger trg_bookings_updated before update on public.bookings for each row execute procedure public.update_updated_at();
drop trigger if exists trg_settings_updated on public.site_settings;
create trigger trg_settings_updated before update on public.site_settings for each row execute procedure public.update_updated_at();
drop trigger if exists trg_images_updated on public.images;
create trigger trg_images_updated before update on public.images for each row execute procedure public.update_updated_at();
drop trigger if exists trg_new_user on auth.users;
create trigger trg_new_user after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.messages enable row level security;
alter table public.orders enable row level security;
alter table public.blood_requests enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.bookings enable row level security;
alter table public.site_settings enable row level security;
alter table public.images enable row level security;

insert into public.site_settings (key, value)
values ('packages', '[{"id":"basic","name":"Basic","nameBn":"বেসিক","price":5000,"features":["1-3 Pages","Responsive","Contact Form"]},{"id":"standard","name":"Standard","nameBn":"স্ট্যান্ডার্ড","price":15000,"features":["5-10 Pages","Blog","SEO"]},{"id":"premium","name":"Premium","nameBn":"প্রিমিয়াম","price":30000,"features":["E-Commerce","Payment","SEO"]},{"id":"enterprise","name":"Enterprise","nameBn":"এন্টারপ্রাইজ","price":0,"features":["Custom","Contact for pricing"]}]'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();
