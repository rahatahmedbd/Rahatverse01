import { getCachedSiteSetting } from "@/lib/site-settings";
import { DEFAULT_ANALYTICS_CONFIG, validateAnalyticsConfig } from "@/lib/analytics/config";
import type { AnalyticsConfig } from "@/types/analytics";

/** Fetches the public analytics config with a safe fallback for local/CI builds. */
export async function getAnalyticsConfig(): Promise<AnalyticsConfig> {
  try {
    const value = await getCachedSiteSetting("analytics_config");
    if (value == null) return DEFAULT_ANALYTICS_CONFIG;
    return validateAnalyticsConfig(value) ?? DEFAULT_ANALYTICS_CONFIG;
  } catch {
    return DEFAULT_ANALYTICS_CONFIG;
  }
}
