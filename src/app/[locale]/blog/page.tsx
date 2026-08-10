/* eslint-disable @typescript-eslint/no-explicit-any */
import BlogListSection from "@/components/blog/BlogListSection";
import { FadeInUp } from "@/components/animations/FadeIn";
import { JsonLd, getBlogCollectionSchema } from "@/components/seo/JsonLd";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import {
  absoluteUrl,
  localeAlternates,
  localePath,
  SITE_IMAGE,
  SITE_NAME,
} from "@/lib/seo";

// ── Blog Page ──────────────────────────────────────────
// Render on every request so newly published posts appear immediately and the
// listing never serves a stale "no posts yet" snapshot while published posts
// exist in the CMS.
export const dynamic = "force-dynamic";

interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  const canonicalUrl = absoluteUrl(localePath(locale, "/blog"));
  const title = isBn ? "ব্লগ — রাহাত আহমেদের লেখা" : "Blog — Articles by Rahat Ahmed";
  const description = isBn
    ? "ওয়েব ডেভেলপমেন্ট, প্রযুক্তি, শিক্ষা, রক্তদান ও সমাজসেবা নিয়ে রাহাত আহমেদের লেখা ও অভিজ্ঞতা।"
    : "Articles and insights by Rahat Ahmed on web development, technology, education, blood donation and social service.";
  const ogImageAlt = isBn ? "রাহাত আহমেদ — রাহাতভার্স" : "Rahat Ahmed — RahatVerse";

  return {
    title,
    description,
    alternates: localeAlternates(locale, "/blog"),
    openGraph: {
      type: "website",
      locale: isBn ? "bn_BD" : "en_US",
      alternateLocale: isBn ? "en_US" : "bn_BD",
      siteName: SITE_NAME,
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: SITE_IMAGE,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_IMAGE],
    },
  };
}

async function getPublishedPosts() {
  try {
    const supabase = await createClient();
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, title_bn, excerpt, excerpt_bn, summary, summary_bn, category, tags, read_time, reading_time, published_at, featured_image, cover_image, author")
      .eq("is_published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(50);
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";
  const posts = await getPublishedPosts();

  const collectionSchema = getBlogCollectionSchema({
    locale,
    posts: posts.map((p: any) => ({
      slug: p.slug,
      title: p.title,
      titleBn: p.title_bn,
    })),
  });

  return (
    <div className="min-h-screen py-12">
      <JsonLd type="CollectionPage" data={collectionSchema} />
      {/* Fallback ItemList for crawlers that expect explicit ItemList */}
      <JsonLd
        type="ItemList"
        data={{
          itemListElement: (collectionSchema.mainEntity as any)?.itemListElement || [],
          numberOfItems: posts.length,
        }}
      />
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInUp>
          <div className="text-center mb-12">
            <h1 className="text-gradient text-display-lg mb-4 font-bold">
              {isBn ? "ব্লগ" : "Blog"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {isBn
                ? "আমার চিন্তাভাবনা ও অভিজ্ঞতা শেয়ার করি"
                : "Sharing my thoughts and experiences"}
            </p>
          </div>
        </FadeInUp>

        {/* Blog List — interactive client island, now hydrates with SSR data for crawlability */}
        <FadeInUp delay={0.2}>
          <BlogListSection locale={locale} initialPosts={posts as any} />
        </FadeInUp>
      </div>
    </div>
  );
}
