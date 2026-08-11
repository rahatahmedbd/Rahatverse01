import { getCachedSiteSetting } from "@/lib/site-settings";
import { DEFAULT_NEWSLETTER_CONFIG, validateNewsletterConfig } from "@/lib/newsletter/config";
import type { NewsletterConfig } from "@/types/newsletter";

/** Fetches the public newsletter payload with a safe fallback for local/CI builds. */
export async function getNewsletterConfig(): Promise<NewsletterConfig> {
  try {
    const value = await getCachedSiteSetting("newsletter_config");
    if (value == null) return DEFAULT_NEWSLETTER_CONFIG;
    return validateNewsletterConfig(value) ?? DEFAULT_NEWSLETTER_CONFIG;
  } catch {
    return DEFAULT_NEWSLETTER_CONFIG;
  }
}
