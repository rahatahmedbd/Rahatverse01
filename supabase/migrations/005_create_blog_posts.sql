-- Migration: Create blog_posts table
-- Phase 23: Blog System Enhancement

-- Create blog_posts table with all necessary columns
CREATE TABLE IF NOT EXISTS public.blog_posts (
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

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- Create index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);

-- Create index for faster published posts filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy: Anyone can read published posts
CREATE POLICY "Anyone can read published blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (is_published = true);

-- Create policy: Admins can read all posts (including unpublished)
CREATE POLICY "Admins can read all blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create policy: Admins can insert blog posts
CREATE POLICY "Admins can insert blog posts"
  ON public.blog_posts
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create policy: Admins can update blog posts
CREATE POLICY "Admins can update blog posts"
  ON public.blog_posts
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create policy: Admins can delete blog posts
CREATE POLICY "Admins can delete blog posts"
  ON public.blog_posts
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert sample blog post (optional - can be removed if not needed)
-- INSERT INTO public.blog_posts (title, title_bn, slug, content, content_bn, excerpt, excerpt_bn, category, tags, author, reading_time, is_published, published_at)
-- VALUES (
--   'Welcome to RahatVerse Blog',
--   'রাহাতভার্স ব্লগে স্বাগতম',
--   'welcome-to-rahatverse-blog',
--   'This is the first blog post on RahatVerse. Stay tuned for more content about web development, technology, and more!',
--   'এটি রাহাতভার্সের প্রথম ব্লগ পোস্ট। ওয়েব ডেভেলপমেন্ট, প্রযুক্তি এবং আরও অনেক কিছু নিয়ে আরও কন্টেন্টের জন্য অপেক্ষা করুন!',
--   'First blog post on RahatVerse',
--   'রাহাতভার্সের প্রথম ব্লগ পোস্ট',
--   'General',
--   ARRAY['welcome', 'blog', 'rahatverse'],
--   'Rahat Ahmed',
--   3,
--   true,
--   NOW()
-- );

-- Update updated_at timestamp on update
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.blog_posts IS 'Blog posts for the RahatVerse blog system';
COMMENT ON COLUMN public.blog_posts.title IS 'Blog post title in English';
COMMENT ON COLUMN public.blog_posts.title_bn IS 'Blog post title in Bengali';
COMMENT ON COLUMN public.blog_posts.slug IS 'URL-friendly slug for the blog post';
COMMENT ON COLUMN public.blog_posts.content IS 'Blog post content in English';
COMMENT ON COLUMN public.blog_posts.content_bn IS 'Blog post content in Bengali';
COMMENT ON COLUMN public.blog_posts.excerpt IS 'Short excerpt in English';
COMMENT ON COLUMN public.blog_posts.excerpt_bn IS 'Short excerpt in Bengali';
COMMENT ON COLUMN public.blog_posts.cover_image IS 'Cover image URL from Cloudinary';
COMMENT ON COLUMN public.blog_posts.category IS 'Blog post category';
COMMENT ON COLUMN public.blog_posts.tags IS 'Array of tags';
COMMENT ON COLUMN public.blog_posts.author IS 'Author name';
COMMENT ON COLUMN public.blog_posts.reading_time IS 'Estimated reading time in minutes';
COMMENT ON COLUMN public.blog_posts.is_published IS 'Whether the post is published';
COMMENT ON COLUMN public.blog_posts.published_at IS 'Publication timestamp';
