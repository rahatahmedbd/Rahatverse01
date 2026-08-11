import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import { robotsDisallowPaths } from "@/lib/seo-routes";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin/auth/API exclusion — robots paths are prefix-matched, so both the
      // bare routes and every locale-prefixed variant must be listed.
      disallow: robotsDisallowPaths(),
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
