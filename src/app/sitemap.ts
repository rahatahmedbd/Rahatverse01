import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { absoluteUrl, localePath } from "@/lib/seo";
import { PUBLIC_ROUTES, SEO_LOCALES } from "@/lib/seo-routes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = SEO_LOCALES.flatMap((locale) =>
    PUBLIC_ROUTES.map((route) => ({
      url: absoluteUrl(localePath(locale, route.path)),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }))
  );

  const supabase = await createClient();
  if (!supabase) return staticUrls;

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, published_at, updated_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const blogUrls = (posts || []).flatMap((post) =>
    SEO_LOCALES.map((locale) => ({
      url: absoluteUrl(localePath(locale, `/blog/${post.slug}`)),
      lastModified: post.updated_at || post.published_at || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticUrls, ...blogUrls];
}
