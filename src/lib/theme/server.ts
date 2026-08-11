import { getCachedSiteSetting } from "@/lib/site-settings";
import { DEFAULT_THEME_CONFIG, validateThemeConfig } from "@/lib/theme/config";
import type { ThemeConfig } from "@/types/theme";

/** Fetches the public theme/xp/audio config with a safe fallback for local/CI builds. */
export async function getThemeConfig(): Promise<ThemeConfig> {
  try {
    const value = await getCachedSiteSetting("theme_config");
    if (value == null) return DEFAULT_THEME_CONFIG;
    return validateThemeConfig(value) ?? DEFAULT_THEME_CONFIG;
  } catch {
    return DEFAULT_THEME_CONFIG;
  }
}
