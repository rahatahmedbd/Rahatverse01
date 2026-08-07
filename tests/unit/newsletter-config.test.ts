import { describe, it, expect } from "vitest";
import { validateNewsletterConfig, DEFAULT_NEWSLETTER_CONFIG } from "@/lib/newsletter/config";
import type { NewsletterConfig } from "@/types/newsletter";

function clone(value: NewsletterConfig): NewsletterConfig {
  return JSON.parse(JSON.stringify(value)) as NewsletterConfig;
}

describe("newsletter config validation", () => {
  it("accepts default config", () => {
    expect(validateNewsletterConfig(DEFAULT_NEWSLETTER_CONFIG)).not.toBeNull();
  });

  it("rejects missing visible flag", () => {
    const bad = clone(DEFAULT_NEWSLETTER_CONFIG);
    delete (bad as unknown as Record<string, unknown>).visible;
    expect(validateNewsletterConfig(bad)).toBeNull();
  });

  it("accepts hiding a topic", () => {
    const cfg = clone(DEFAULT_NEWSLETTER_CONFIG);
    cfg.topics[0].visible = false;
    expect(validateNewsletterConfig(cfg)?.topics[0].visible).toBe(false);
  });

  it("rejects an invalid topic slug", () => {
    const bad = clone(DEFAULT_NEWSLETTER_CONFIG);
    bad.topics[0].value = "has space";
    expect(validateNewsletterConfig(bad)).toBeNull();
  });

  it("rejects empty from email", () => {
    const bad = clone(DEFAULT_NEWSLETTER_CONFIG);
    bad.campaignDefaults.fromEmail = "";
    expect(validateNewsletterConfig(bad)).toBeNull();
  });

  it("accepts empty subject defaults", () => {
    const cfg = clone(DEFAULT_NEWSLETTER_CONFIG);
    cfg.campaignDefaults.defaultSubjectBn = "";
    expect(validateNewsletterConfig(cfg)).not.toBeNull();
  });
});
