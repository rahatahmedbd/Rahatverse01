import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { absoluteUrl, localePath } from "@/lib/seo";

const locales = ["bn", "en"];
const staticPages = [
  "",
  "/about",
  "/achievements",
  "/experience",
  "/gallery",
  "/services",
  "/portfolio",
  "/order",
  "/contact",
  "/blog",
  "/links",
  "/privacy",
  "/privacy-policy",
  "/terms",
  "/terms-of-service",
  "/sitemap",
  "/summary",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: absoluteUrl(localePath(locale, page)),
      changeFrequency: getChangeFrequency(page),
      priority: getPriority(page),
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
    locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, `/blog/${post.slug}`)),
      lastModified: post.updated_at || post.published_at || undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  return [...staticUrls, ...blogUrls];
}

function getChangeFrequency(page: string): MetadataRoute.Sitemap[0]["changeFrequency"] {
  if (page === "" || page === "/blog") return "weekly";
  if (page === "/achievements" || page === "/gallery" || page === "/portfolio") return "monthly";
  return "yearly";
}

function getPriority(page: string): number {
  if (page === "") return 1;
  if (page === "/about" || page === "/services" || page === "/order" || page === "/portfolio") return 0.9;
  if (page === "/achievements" || page === "/experience") return 0.8;
  if (page === "/gallery" || page === "/contact" || page === "/blog") return 0.7;
  return 0.5;
}
