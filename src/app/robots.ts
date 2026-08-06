import { MetadataRoute } from "next";

// ── Robots.txt ─────────────────────────────────────────
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/dashboard/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
    ],
    sitemap: "https://rahatverse01.vercel.app/sitemap.xml",
    host: "https://rahatverse01.vercel.app",
  };
}
