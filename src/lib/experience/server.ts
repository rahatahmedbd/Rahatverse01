import { getCachedSiteSetting } from "@/lib/site-settings";
import { DEFAULT_EXPERIENCE_CONFIG, validateExperienceConfig } from "@/lib/experience/config";
import type { ExperienceConfig } from "@/types/experience";

/** Fetches the public experience/blood/memorial payload with a safe fallback for local/CI builds. */
export async function getExperienceConfig(): Promise<ExperienceConfig> {
  try {
    const value = await getCachedSiteSetting("experience_config");
    if (value == null) return DEFAULT_EXPERIENCE_CONFIG;
    return validateExperienceConfig(value) ?? DEFAULT_EXPERIENCE_CONFIG;
  } catch {
    return DEFAULT_EXPERIENCE_CONFIG;
  }
}
