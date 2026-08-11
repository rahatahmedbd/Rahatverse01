import { getCachedSiteSetting } from "@/lib/site-settings";
import { DEFAULT_HERO_CONFIG, validateHeroConfig } from "@/lib/hero/config";
import type { HeroConfig } from "@/types/hero";

/** Fetches the public hero payload with a safe fallback for local/CI builds. */
export async function getHeroConfig(): Promise<HeroConfig> {
  try {
    const value = await getCachedSiteSetting("hero_config");
    if (value == null) return DEFAULT_HERO_CONFIG;
    return validateHeroConfig(value) ?? DEFAULT_HERO_CONFIG;
  } catch {
    return DEFAULT_HERO_CONFIG;
  }
}
