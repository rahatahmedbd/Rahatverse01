import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CONTENT_CONFIG, validateContentConfig } from "@/lib/content/config";
import type { ContentConfig } from "@/types/content";

/** Fetches the public search/FAQ/legal config with a safe fallback. */
export async function getContentConfig(): Promise<ContentConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_CONTENT_CONFIG;
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "content_config")
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_CONTENT_CONFIG;
    return validateContentConfig(data.value) ?? DEFAULT_CONTENT_CONFIG;
  } catch {
    return DEFAULT_CONTENT_CONFIG;
  }
}
