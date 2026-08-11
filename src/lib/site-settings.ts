import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/server";

// ── Cached public site_settings reads ──────────────────
// Every localized page used to hit Supabase 2–7 times per navigation
// (layout configs + page configs), and the middleware added another DB
// round-trip on top. These values change only when an admin saves settings,
// so they are cached for 60s and invalidated instantly via revalidateTag
// from the admin settings API. Result: route changes render with zero
// database latency in the hot path.

/** Tag invalidated when ANY site setting changes (admin save/delete). */
export const SITE_SETTINGS_TAG = "site-settings";

/** Per-key tag for fine-grained invalidation. */
export function siteSettingTag(key: string): string {
  return `site-settings:${key}`;
}

/**
 * Reads a single `site_settings.value` by key, cached and tagged.
 * Returns `null` when missing, on error, or when Supabase env vars are
 * absent (local/CI builds) — callers decide their own fallback + validation.
 */
export function getCachedSiteSetting(key: string): Promise<unknown | null> {
  return unstable_cache(
    async () => {
      try {
        const supabase = createPublicClient();
        if (!supabase) return null;
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", key)
          .maybeSingle();
        if (error || !data) return null;
        return data.value as unknown;
      } catch {
        return null;
      }
    },
    ["site-setting", key],
    { revalidate: 60, tags: [SITE_SETTINGS_TAG, siteSettingTag(key)] }
  )();
}
