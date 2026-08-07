import { createClient } from "@/lib/supabase/server";
import { DEFAULT_BLOG_CONFIG, validateBlogConfig } from "@/lib/blog/config";
import type { BlogConfig } from "@/types/blog";

/** Fetches the public blog payload with a safe fallback for local/CI builds. */
export async function getBlogConfig(): Promise<BlogConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_BLOG_CONFIG;
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "blog_config")
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_BLOG_CONFIG;
    return validateBlogConfig(data.value) ?? DEFAULT_BLOG_CONFIG;
  } catch {
    return DEFAULT_BLOG_CONFIG;
  }
}
