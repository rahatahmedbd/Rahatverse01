import { createClient } from "@/lib/supabase/server";
import { DEFAULT_ABOUT_CONFIG, validateAboutConfig } from "@/lib/about/config";
import type { AboutConfig } from "@/types/about";

/** Fetches the public about payload with a safe fallback for local/CI builds. */
export async function getAboutConfig(): Promise<AboutConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_ABOUT_CONFIG;

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "about_config")
      .maybeSingle();

    if (error || !data?.value) return DEFAULT_ABOUT_CONFIG;
    return validateAboutConfig(data.value) ?? DEFAULT_ABOUT_CONFIG;
  } catch {
    return DEFAULT_ABOUT_CONFIG;
  }
}
