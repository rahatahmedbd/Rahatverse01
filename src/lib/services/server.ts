import { getCachedSiteSetting } from "@/lib/site-settings";
import { DEFAULT_SERVICES_CONFIG, validateServicesConfig } from "@/lib/services/config";
import type { ServicesConfig } from "@/types/services";

/** Fetches the public services/pricing payload with a safe fallback for local/CI builds. */
export async function getServicesConfig(): Promise<ServicesConfig> {
  try {
    const value = await getCachedSiteSetting("services_config");
    if (value == null) return DEFAULT_SERVICES_CONFIG;
    return validateServicesConfig(value) ?? DEFAULT_SERVICES_CONFIG;
  } catch {
    return DEFAULT_SERVICES_CONFIG;
  }
}
