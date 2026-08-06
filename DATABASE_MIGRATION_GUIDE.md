# Database Migration Guide - Blog Posts Table

## Problem
আপনার `blog_posts` table এ কিছু columns missing আছে যেমন `author`, `reading_time`, ইত্যাদি।

## Solution

### Step 1: Supabase SQL Editor এ যান
1. Supabase Dashboard এ লগইন করুন
2. আপনার project সিলেক্ট করুন
3.左側 メニュー থেকে "SQL Editor" ক্লিক করুন

### Step 2: Migration SQL Run করুন

নিচের SQL কোডটি কপি করে Supabase SQL Editor এ paste করুন এবং "Run" বাটনে ক্লিক করুন:

```sql
-- Drop existing table if exists (WARNING: This will delete all existing data)
DROP TABLE IF EXISTS public.blog_posts CASCADE;

-- Create blog_posts table with all necessary columns
CREATE TABLE public.blog_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  title_bn text,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  content_bn text,
  excerpt text,
  excerpt_bn text,
  cover_image text,
  category text,
  tags text[],
  author text,
  reading_time integer DEFAULT 5,
  is_published boolean DEFAULT false,
  published_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can manage all blog posts"
  ON public.blog_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert a sample blog post
INSERT INTO public.blog_posts (
  title, 
  title_bn, 
  slug, 
  content, 
  content_bn, 
  excerpt, 
  excerpt_bn, 
  category, 
  tags, 
  author, 
  reading_time, 
  is_published, 
  published_at
) VALUES (
  'Welcome to RahatVerse Blog',
  'রাহাতভার্স ব্লগে স্বাগতম',
  'welcome-to-rahatverse-blog',
  '# Welcome to RahatVerse Blog

This is the first blog post on RahatVerse. 

## What to Expect

Stay tuned for more content about:
- Web Development
- Technology
- Programming Tips
- Project Updates

## About the Author

I am Rahat Ahmed, a web developer from Sunamganj, Bangladesh. I love building modern web applications using Next.js, React, and TypeScript.

Thank you for visiting my blog!',
  '# রাহাতভার্স ব্লগে স্বাগতম

এটি রাহাতভার্সের প্রথম ব্লগ পোস্ট।

## কী কী থাকবে

আরও কন্টেন্টের জন্য অপেক্ষা করুন:
- ওয়েব ডেভেলপমেন্ট
- প্রযুক্তি
- প্রোগ্রামিং টিপস
- প্রজেক্ট আপডেট

## লেখক সম্পর্কে

আমি রাহাত আহমেদ, সুনামগঞ্জ, বাংলাদেশ থেকে একজন ওয়েব ডেভেলপার। আমি Next.js, React, এবং TypeScript ব্যবহার করে আধুনিক ওয়েব অ্যাপ্লিকেশন তৈরি করতে ভালোবাসি।

আমার ব্লগ_visit করার জন্য ধন্যবাদ!',
  'First blog post on RahatVerse',
  'রাহাতভার্সের প্রথম ব্লগ পোস্ট',
  'General',
  ARRAY['welcome', 'blog', 'rahatverse'],
  'Rahat Ahmed',
  3,
  true,
  NOW()
);
```

### Step 3: Verify Table Created

SQL run হওয়ার পর, "Table Editor" এ গিয়ে `blog_posts` table টি দেখুন। সব columns থাকতে হবে:
- id
- title
- title_bn
- slug
- content
- content_bn
- excerpt
- excerpt_bn
- cover_image
- category
- tags
- **author** ✅
- **reading_time** ✅
- is_published
- published_at
- created_at
- updated_at

### Step 4: Test Blog Page

এখন আপনার ব্লগ পেজ visit করুন:
- https://rahatverse01.vercel.app/bn/blog
- https://rahatverse01.vercel.app/en/blog

আপনি sample blog post টি দেখতে পাবেন।

## Important Notes

1. **Existing Data Loss**: যদি আপনার আগে থেকে কোনো blog post data থাকে, `DROP TABLE` command সেগুলো delete করে দিবে।

2. **Safe Alternative**: যদি existing data keep করতে চান, তাহলে `DROP TABLE` line টা remove করে শুধু missing columns add করুন:

```sql
-- Only add missing columns (safe for existing data)
ALTER TABLE public.blog_posts 
  ADD COLUMN IF NOT EXISTS author text,
  ADD COLUMN IF NOT EXISTS reading_time integer DEFAULT 5,
  ADD COLUMN IF NOT EXISTS title_bn text,
  ADD COLUMN IF NOT EXISTS content_bn text,
  ADD COLUMN IF NOT EXISTS excerpt_bn text;
```

3. **Sample Post**: Sample post টা optional। যদি না চান, INSERT statement টা remove করে দিন।

## Need Help?

যদি কোনো problem হয়, আমাকে জানান!
