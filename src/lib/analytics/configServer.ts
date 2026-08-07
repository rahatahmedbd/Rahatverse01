import { createClient } from "@/lib/supabase/server";
import { DEFAULT_ANALYTICS_CONFIG, validateAnalyticsConfig } from "@/lib/analytics/config";
import type { AnalyticsConfig } from "@/types/analytics";

/** Fetches the public analytics config with a safe fallback for local/CI builds. */
export async function getAnalyticsConfig(): Promise<AnalyticsConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_ANALYTICS_CONFIG;
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "analytics_config")
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_ANALYTICS_CONFIG;
    return validateAnalyticsConfig(data.value) ?? DEFAULT_ANALYTICS_CONFIG;
  } catch {
    return DEFAULT_ANALYTICS_CONFIG;
  }
}
