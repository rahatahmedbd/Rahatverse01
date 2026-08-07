import { createClient } from "@/lib/supabase/server";
import { DEFAULT_NEWSLETTER_CONFIG, validateNewsletterConfig } from "@/lib/newsletter/config";
import type { NewsletterConfig } from "@/types/newsletter";

/** Fetches the public newsletter payload with a safe fallback for local/CI builds. */
export async function getNewsletterConfig(): Promise<NewsletterConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_NEWSLETTER_CONFIG;
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "newsletter_config")
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_NEWSLETTER_CONFIG;
    return validateNewsletterConfig(data.value) ?? DEFAULT_NEWSLETTER_CONFIG;
  } catch {
    return DEFAULT_NEWSLETTER_CONFIG;
  }
}
