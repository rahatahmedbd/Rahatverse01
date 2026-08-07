import { createClient } from "@/lib/supabase/server";
import { DEFAULT_EXPERIENCE_CONFIG, validateExperienceConfig } from "@/lib/experience/config";
import type { ExperienceConfig } from "@/types/experience";

/** Fetches the public experience/blood/memorial payload with a safe fallback for local/CI builds. */
export async function getExperienceConfig(): Promise<ExperienceConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_EXPERIENCE_CONFIG;

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "experience_config")
      .maybeSingle();

    if (error || !data?.value) return DEFAULT_EXPERIENCE_CONFIG;
    return validateExperienceConfig(data.value) ?? DEFAULT_EXPERIENCE_CONFIG;
  } catch {
    return DEFAULT_EXPERIENCE_CONFIG;
  }
}
