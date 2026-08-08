import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CONTENT_CONFIG, validateContentConfig } from "@/lib/content/config";
import type { ContentConfig, LegalPage } from "@/types/content";

// Legal bodies are expected to be structured into `## Heading` blocks. A
// stored entry that is essentially a one-liner (e.g. "We only use your contact
// information...") is treated as incomplete and replaced with the rich default
// content so the privacy/terms pages never render a bare sentence.
function isThinLegalBody(body: string): boolean {
  const text = (body || "").trim();
  if (text.length < 200) return true;
  // Require at least one markdown-style heading line.
  return !/^\s*#+\s/m.test(text);
}

function fillThinLegalPages(config: ContentConfig): ContentConfig {
  if (!config.legalPages || config.legalPages.length === 0) return config;
  const defaultsByKey = new Map<string, LegalPage>(
    DEFAULT_CONTENT_CONFIG.legalPages.map((p) => [p.key, p])
  );
  const legalPages = config.legalPages.map((page) => {
    const fallback = defaultsByKey.get(page.key) || defaultsByKey.get("privacy");
    if (!fallback) return page;
    const needsFallback = isThinLegalBody(page.bodyEn) || isThinLegalBody(page.bodyBn);
    if (!needsFallback) return page;
    return {
      ...page,
      bodyBn: fallback.bodyBn,
      bodyEn: fallback.bodyEn,
      titleBn: fallback.titleBn,
      titleEn: fallback.titleEn,
      updatedAtBn: fallback.updatedAtBn,
      updatedAtEn: fallback.updatedAtEn,
    };
  });
  return { ...config, legalPages };
}

/** Fetches the public search/FAQ/legal config with a safe fallback. */
export async function getContentConfig(): Promise<ContentConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_CONTENT_CONFIG;
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "content_config")
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_CONTENT_CONFIG;
    const validated = validateContentConfig(data.value);
    if (!validated) return DEFAULT_CONTENT_CONFIG;
    return fillThinLegalPages(validated);
  } catch {
    return DEFAULT_CONTENT_CONFIG;
  }
}
