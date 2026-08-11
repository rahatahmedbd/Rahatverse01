import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";
import { SITE_SETTINGS_TAG } from "@/lib/site-settings";
import { DEFAULT_PORTFOLIO_CONFIG, validatePortfolioConfig } from "@/lib/portfolio/config";
import type { PortfolioConfig } from "@/types/portfolio";

/**
 * Server-side loader for the public portfolio configuration.
 *
 * Reads the validated CMS payload (`content_config.portfolio_config`) and
 * falls back to the built-in defaults so the /portfolio page always renders
 * meaningful, crawlable project content — including local dev, CI, a missing
 * migration, or an invalid/empty stored row. Public data only: this mirrors
 * the exact read path + guard of GET /api/portfolio-config.
 */
/** Cache tag for the portfolio CMS row (content_config table). */
export const PORTFOLIO_TAG = "portfolio-config";

export async function getPortfolioConfig(): Promise<PortfolioConfig> {
  return unstable_cache(
    async () => {
      try {
        const supabase = createPublicClient();
        if (!supabase) return DEFAULT_PORTFOLIO_CONFIG;

        const { data, error } = await supabase
          .from("content_config")
          .select("value")
          .eq("key", "portfolio_config")
          .single();

        if (error || !data?.value) return DEFAULT_PORTFOLIO_CONFIG;

        const validated = validatePortfolioConfig(data.value);
        // Mirror the public API guard: a stored config with no visible projects
        // must never blank the page — fall back to the seeded defaults.
        if (!validated || validated.projects.filter((p) => p.visible).length === 0) {
          return DEFAULT_PORTFOLIO_CONFIG;
        }
        return validated;
      } catch {
        return DEFAULT_PORTFOLIO_CONFIG;
      }
    },
    ["portfolio-config"],
    { revalidate: 60, tags: [SITE_SETTINGS_TAG, PORTFOLIO_TAG] }
  )();
}
