import { getCachedSiteSetting } from "@/lib/site-settings";
import { DEFAULT_BLOG_CONFIG, validateBlogConfig } from "@/lib/blog/config";
import type { BlogConfig } from "@/types/blog";

/** Fetches the public blog payload with a safe fallback for local/CI builds. */
export async function getBlogConfig(): Promise<BlogConfig> {
  try {
    const value = await getCachedSiteSetting("blog_config");
    if (value == null) return DEFAULT_BLOG_CONFIG;
    return validateBlogConfig(value) ?? DEFAULT_BLOG_CONFIG;
  } catch {
    return DEFAULT_BLOG_CONFIG;
  }
}
