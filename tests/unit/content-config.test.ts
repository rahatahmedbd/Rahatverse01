import { describe, it, expect } from "vitest";
import { validateContentConfig, DEFAULT_CONTENT_CONFIG } from "@/lib/content/config";
import type { ContentConfig } from "@/types/content";

function clone(value: ContentConfig): ContentConfig {
  return JSON.parse(JSON.stringify(value)) as ContentConfig;
}

describe("content config validation", () => {
  it("accepts default config", () => {
    expect(validateContentConfig(DEFAULT_CONTENT_CONFIG)).not.toBeNull();
  });

  it("rejects missing visible flag", () => {
    const bad = clone(DEFAULT_CONTENT_CONFIG);
    delete (bad as unknown as Record<string, unknown>).visible;
    expect(validateContentConfig(bad)).toBeNull();
  });

  it("rejects an invalid FAQ category slug", () => {
    const bad = clone(DEFAULT_CONTENT_CONFIG);
    bad.faqCategories[0].value = "has space";
    expect(validateContentConfig(bad)).toBeNull();
  });

  it("rejects empty FAQ answer", () => {
    const bad = clone(DEFAULT_CONTENT_CONFIG);
    bad.faqItems[0].answerEn = "";
    expect(validateContentConfig(bad)).toBeNull();
  });

  it("rejects a negative search weight", () => {
    const bad = clone(DEFAULT_CONTENT_CONFIG);
    bad.searchScope[0].weight = -1;
    expect(validateContentConfig(bad)).toBeNull();
  });

  it("accepts disabling a search scope item", () => {
    const cfg = clone(DEFAULT_CONTENT_CONFIG);
    cfg.searchScope[0].enabled = false;
    expect(validateContentConfig(cfg)?.searchScope[0].enabled).toBe(false);
  });

  it("rejects empty legal title", () => {
    const bad = clone(DEFAULT_CONTENT_CONFIG);
    bad.legalPages[0].titleEn = "";
    expect(validateContentConfig(bad)).toBeNull();
  });

  it("accepts empty legal body", () => {
    const cfg = clone(DEFAULT_CONTENT_CONFIG);
    cfg.legalPages[0].bodyBn = "";
    expect(validateContentConfig(cfg)).not.toBeNull();
  });
});
