import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CONTACT_CONFIG, validateContactConfig } from "@/lib/contact/config";
import type { ContactConfig } from "@/types/contact";

/** Fetches the public contact/booking/testimonial payload with a safe fallback. */
export async function getContactConfig(): Promise<ContactConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_CONTACT_CONFIG;
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "contact_config")
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_CONTACT_CONFIG;
    return validateContactConfig(data.value) ?? DEFAULT_CONTACT_CONFIG;
  } catch {
    return DEFAULT_CONTACT_CONFIG;
  }
}
