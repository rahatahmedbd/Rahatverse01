import { getCachedSiteSetting } from "@/lib/site-settings";
import { DEFAULT_CONTACT_CONFIG, validateContactConfig } from "@/lib/contact/config";
import type { ContactConfig } from "@/types/contact";

/** Fetches the public contact/booking/testimonial payload with a safe fallback. */
export async function getContactConfig(): Promise<ContactConfig> {
  try {
    const value = await getCachedSiteSetting("contact_config");
    if (value == null) return DEFAULT_CONTACT_CONFIG;
    return validateContactConfig(value) ?? DEFAULT_CONTACT_CONFIG;
  } catch {
    return DEFAULT_CONTACT_CONFIG;
  }
}
