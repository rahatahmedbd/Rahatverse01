import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin/auth/API exclusion — robots paths are prefix-matched, so both the
      // bare routes and every locale-prefixed variant must be listed.
      disallow: [
        "/api/",
        "/auth/",
        "/dashboard/",
        "/bn/dashboard/",
        "/en/dashboard/",
        "/admin/",
        "/bn/admin/",
        "/en/admin/",
        "/login",
        "/bn/login",
        "/en/login",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
