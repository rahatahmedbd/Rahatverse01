import { describe, it, expect } from "vitest";
import { validateBlogConfig, DEFAULT_BLOG_CONFIG } from "@/lib/blog/config";
import type { BlogConfig } from "@/types/blog";

function clone(value: BlogConfig): BlogConfig {
  return JSON.parse(JSON.stringify(value)) as BlogConfig;
}

describe("blog config validation", () => {
  it("accepts default config", () => {
    expect(validateBlogConfig(DEFAULT_BLOG_CONFIG)).not.toBeNull();
  });

  it("rejects missing visible flag", () => {
    const bad = clone(DEFAULT_BLOG_CONFIG);
    delete (bad as unknown as Record<string, unknown>).visible;
    expect(validateBlogConfig(bad)).toBeNull();
  });

  it("accepts hiding a category", () => {
    const cfg = clone(DEFAULT_BLOG_CONFIG);
    cfg.categories[0].visible = false;
    expect(validateBlogConfig(cfg)?.categories[0].visible).toBe(false);
  });

  it("rejects an invalid category slug", () => {
    const bad = clone(DEFAULT_BLOG_CONFIG);
    bad.categories[0].value = "has space";
    expect(validateBlogConfig(bad)).toBeNull();
  });

  it("rejects an empty category label", () => {
    const bad = clone(DEFAULT_BLOG_CONFIG);
    bad.categories[0].labelEn = "   ";
    expect(validateBlogConfig(bad)).toBeNull();
  });

  it("accepts turning off comment approval", () => {
    const cfg = clone(DEFAULT_BLOG_CONFIG);
    cfg.comments.requireApproval = false;
    expect(validateBlogConfig(cfg)?.comments.requireApproval).toBe(false);
  });

  it("rejects an invalid reading WPM", () => {
    const bad = clone(DEFAULT_BLOG_CONFIG);
    bad.readingWpm = 0;
    expect(validateBlogConfig(bad)).toBeNull();
  });

  it("rejects empty admin badge", () => {
    const bad = clone(DEFAULT_BLOG_CONFIG);
    bad.comments.adminBadgeEn = "";
    expect(validateBlogConfig(bad)).toBeNull();
  });
});
