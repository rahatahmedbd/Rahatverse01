import { createClient } from "@/lib/supabase/server";
import { DEFAULT_HERO_CONFIG, validateHeroConfig } from "@/lib/hero/config";
import type { HeroConfig } from "@/types/hero";

export async function getHeroConfig(): Promise<HeroConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return DEFAULT_HERO_CONFIG;
    }
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "hero_config")
      .maybeSingle();

    if (error || !data?.value) {
      return DEFAULT_HERO_CONFIG;
    }

    const validated = validateHeroConfig(data.value);
    return validated ?? DEFAULT_HERO_CONFIG;
  } catch {
    return DEFAULT_HERO_CONFIG;
  }
}
