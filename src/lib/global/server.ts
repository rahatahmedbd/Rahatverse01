import { getCachedSiteSetting } from "@/lib/site-settings";
import { DEFAULT_GLOBAL_CONFIG, validateGlobalConfig } from "@/lib/global/config";
import type { GlobalConfig } from "@/types/global";

/** Fetches the public global config with a safe fallback for local/CI builds. */
export async function getGlobalConfig(): Promise<GlobalConfig> {
  try {
    const value = await getCachedSiteSetting("global_config");
    if (value == null) return DEFAULT_GLOBAL_CONFIG;
    return validateGlobalConfig(value) ?? DEFAULT_GLOBAL_CONFIG;
  } catch {
    return DEFAULT_GLOBAL_CONFIG;
  }
}
