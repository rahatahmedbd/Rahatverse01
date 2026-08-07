import { createClient } from "@/lib/supabase/server";
import { DEFAULT_THEME_CONFIG, validateThemeConfig } from "@/lib/theme/config";
import type { ThemeConfig } from "@/types/theme";

/** Fetches the public theme/xp/audio config with a safe fallback for local/CI builds. */
export async function getThemeConfig(): Promise<ThemeConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_THEME_CONFIG;
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "theme_config")
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_THEME_CONFIG;
    return validateThemeConfig(data.value) ?? DEFAULT_THEME_CONFIG;
  } catch {
    return DEFAULT_THEME_CONFIG;
  }
}
