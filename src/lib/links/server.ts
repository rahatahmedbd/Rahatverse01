import { getCachedSiteSetting } from "@/lib/site-settings";
import { DEFAULT_LINKS_CONFIG, validateLinksConfig } from "@/lib/links/config";
import type { LinksConfig } from "@/types/links";

/** Fetches the public links/tools/resume payload with a safe fallback. */
export async function getLinksConfig(): Promise<LinksConfig> {
  try {
    const value = await getCachedSiteSetting("links_config");
    if (value == null) return DEFAULT_LINKS_CONFIG;
    return validateLinksConfig(value) ?? DEFAULT_LINKS_CONFIG;
  } catch {
    return DEFAULT_LINKS_CONFIG;
  }
}
