import { MetadataRoute } from "next";

// ── Dynamic Sitemap ────────────────────────────────────
// Generates sitemap.xml for all pages
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://rahatverse01.vercel.app";
  const locales = ["bn", "en"];

  // Static pages
  const staticPages = [
    "",
    "/about",
    "/achievements",
    "/experience",
    "/gallery",
    "/order",
    "/contact",
    "/blog",
    "/links",
    "/dashboard",
    "/dashboard/orders",
    "/dashboard/messages",
    "/privacy",
    "/terms",
    "/sitemap",
  ];

  // Generate URLs for all locales
  const urls: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    staticPages.forEach((page) => {
      urls.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: getChangeFrequency(page),
        priority: getPriority(page),
      });
    });
  });

  return urls;
}

function getChangeFrequency(page: string): MetadataRoute.Sitemap[0]["changeFrequency"] {
  if (page === "") return "daily";
  if (page === "/blog") return "daily";
  if (page === "/achievements") return "weekly";
  if (page === "/gallery") return "weekly";
  return "monthly";
}

function getPriority(page: string): number {
  if (page === "") return 1.0;
  if (page === "/about" || page === "/order") return 0.9;
  if (page === "/achievements" || page === "/experience") return 0.8;
  if (page === "/gallery" || page === "/contact") return 0.7;
  if (page === "/blog" || page === "/links") return 0.6;
  return 0.5;
}
