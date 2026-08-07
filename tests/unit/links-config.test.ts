import { describe, it, expect } from "vitest";
import { validateLinksConfig, DEFAULT_LINKS_CONFIG } from "@/lib/links/config";
import type { LinksConfig } from "@/types/links";

function clone(value: LinksConfig): LinksConfig {
  return JSON.parse(JSON.stringify(value)) as LinksConfig;
}

describe("links config validation", () => {
  it("accepts default config", () => {
    expect(validateLinksConfig(DEFAULT_LINKS_CONFIG)).not.toBeNull();
  });

  it("rejects missing visible flag", () => {
    const bad = clone(DEFAULT_LINKS_CONFIG);
    delete (bad as unknown as Record<string, unknown>).visible;
    expect(validateLinksConfig(bad)).toBeNull();
  });

  it("accepts incrementing a link click count", () => {
    const cfg = clone(DEFAULT_LINKS_CONFIG);
    cfg.links[0].clicks = 42;
    expect(validateLinksConfig(cfg)?.links[0].clicks).toBe(42);
  });

  it("rejects a negative click count", () => {
    const bad = clone(DEFAULT_LINKS_CONFIG);
    bad.links[0].clicks = -1;
    expect(validateLinksConfig(bad)).toBeNull();
  });

  it("rejects an invalid link icon", () => {
    const bad = clone(DEFAULT_LINKS_CONFIG);
    bad.links[0].icon = "Hacker" as never;
    expect(validateLinksConfig(bad)).toBeNull();
  });

  it("rejects an invalid tool category", () => {
    const bad = clone(DEFAULT_LINKS_CONFIG);
    bad.tools[0].category = "fun" as never;
    expect(validateLinksConfig(bad)).toBeNull();
  });

  it("accepts an empty CV (coming soon)", () => {
    const cfg = clone(DEFAULT_LINKS_CONFIG);
    cfg.resume.cvBnUrl = "";
    cfg.resume.cvEnUrl = "";
    expect(validateLinksConfig(cfg)).not.toBeNull();
  });

  it("rejects empty link label", () => {
    const bad = clone(DEFAULT_LINKS_CONFIG);
    bad.links[0].labelEn = "   ";
    expect(validateLinksConfig(bad)).toBeNull();
  });
});
