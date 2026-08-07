import { createClient } from "@/lib/supabase/server";
import { DEFAULT_GLOBAL_CONFIG, validateGlobalConfig } from "@/lib/global/config";
import type { GlobalConfig } from "@/types/global";

/** Fetches the public global config with a safe fallback for local/CI builds. */
export async function getGlobalConfig(): Promise<GlobalConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_GLOBAL_CONFIG;
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "global_config")
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_GLOBAL_CONFIG;
    return validateGlobalConfig(data.value) ?? DEFAULT_GLOBAL_CONFIG;
  } catch {
    return DEFAULT_GLOBAL_CONFIG;
  }
}
