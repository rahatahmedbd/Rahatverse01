import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BlogPostContent from "@/components/blog/BlogPostContent";
import { BlogComments } from "@/components/blog/BlogComments";
import { FadeInUp } from "@/components/animations/FadeIn";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogPostingSchema, localeAlternates, SITE_IMAGE } from "@/lib/seo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

interface BlogPostRecord {
  id: string;
  title: string;
  title_bn?: string | null;
  content: string;
  content_bn?: string | null;
  excerpt?: string | null;
  excerpt_bn?: string | null;
  cover_image?: string | null;
  category?: string | null;
  tags?: string[] | null;
  author?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  reading_time?: number | null;
  slug: string;
}

async function getPublishedPost(slug: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) return null;
  return data as BlogPostRecord;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    return {
      title: locale === "bn" ? "ব্লগ পোস্ট" : "Blog post",
      alternates: localeAlternates(locale, `/blog/${slug}`),
    };
  }

  const isBn = locale === "bn";
  const title = isBn && post.title_bn ? post.title_bn : post.title;
  const description = isBn && post.excerpt_bn ? post.excerpt_bn : post.excerpt || post.content.slice(0, 160);
  const image = post.cover_image || SITE_IMAGE;

  return {
    title,
    description,
    alternates: localeAlternates(locale, `/blog/${slug}`),
    openGraph: {
      type: "article",
      title,
      description,
      url: `/${locale}/blog/${slug}`,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || post.published_at || undefined,
      authors: [post.author || "Rahat Ahmed"],
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const post = await getPublishedPost(slug);
  const isBn = locale === "bn";

  if (!post) {
    notFound();
  }

  const title = isBn && post.title_bn ? post.title_bn : post.title;
  const content = isBn && post.content_bn ? post.content_bn : post.content;
  const excerpt = isBn && post.excerpt_bn ? post.excerpt_bn : post.excerpt;

  return (
    <div className="min-h-screen py-12">
      <JsonLd
        type="BlogPosting"
        data={getBlogPostingSchema({
          title,
          description: excerpt,
          slug: post.slug,
          locale,
          coverImage: post.cover_image,
          publishedAt: post.published_at,
          updatedAt: post.updated_at,
          author: post.author,
          tags: post.tags,
          readingTime: post.reading_time,
        })}
      />
      <div className="container mx-auto px-4">
        <FadeInUp>
          <Link
            href={`/${locale}/blog`}
            className="mb-8 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {isBn ? "ব্লগে ফিরে যান" : "Back to Blog"}
          </Link>
        </FadeInUp>

        <BlogPostContent
          title={title}
          content={content}
          author={post.author || undefined}
          publishedAt={post.published_at || undefined}
          readingTime={post.reading_time || undefined}
          category={post.category || undefined}
          tags={post.tags || undefined}
          locale={locale}
        />

        <BlogComments postId={post.id} locale={locale} />
      </div>
    </div>
  );
}
