import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SERVICES_CONFIG, validateServicesConfig } from "@/lib/services/config";
import type { ServicesConfig } from "@/types/services";

/** Fetches the public services/pricing payload with a safe fallback for local/CI builds. */
export async function getServicesConfig(): Promise<ServicesConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_SERVICES_CONFIG;

    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "services_config")
      .maybeSingle();

    if (error || !data?.value) return DEFAULT_SERVICES_CONFIG;
    return validateServicesConfig(data.value) ?? DEFAULT_SERVICES_CONFIG;
  } catch {
    return DEFAULT_SERVICES_CONFIG;
  }
}
