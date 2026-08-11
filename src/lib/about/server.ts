import { getCachedSiteSetting } from "@/lib/site-settings";
import { DEFAULT_ABOUT_CONFIG, validateAboutConfig } from "@/lib/about/config";
import type { AboutConfig } from "@/types/about";

/** Fetches the public about payload with a safe fallback for local/CI builds. */
export async function getAboutConfig(): Promise<AboutConfig> {
  try {
    const value = await getCachedSiteSetting("about_config");
    if (value == null) return DEFAULT_ABOUT_CONFIG;
    return validateAboutConfig(value) ?? DEFAULT_ABOUT_CONFIG;
  } catch {
    return DEFAULT_ABOUT_CONFIG;
  }
}
