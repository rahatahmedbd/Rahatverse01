import { createClient } from "@/lib/supabase/server";
import { DEFAULT_LINKS_CONFIG, validateLinksConfig } from "@/lib/links/config";
import type { LinksConfig } from "@/types/links";

/** Fetches the public links/tools/resume payload with a safe fallback. */
export async function getLinksConfig(): Promise<LinksConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_LINKS_CONFIG;
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "links_config")
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_LINKS_CONFIG;
    return validateLinksConfig(data.value) ?? DEFAULT_LINKS_CONFIG;
  } catch {
    return DEFAULT_LINKS_CONFIG;
  }
}
