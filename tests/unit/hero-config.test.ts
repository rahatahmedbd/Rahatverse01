import { describe, it, expect } from "vitest";
import { validateHeroConfig, DEFAULT_HERO_CONFIG } from "@/lib/hero/config";

describe("hero config validation", () => {
  it("accepts default config", () => {
    expect(validateHeroConfig(DEFAULT_HERO_CONFIG)).not.toBeNull();
  });

  it("rejects empty typewriter", () => {
    const bad = { ...DEFAULT_HERO_CONFIG, typewriter: { bn: [], en: [] } };
    expect(validateHeroConfig(bad)).toBeNull();
  });

  it("rejects invalid duration", () => {
    const bad = { ...DEFAULT_HERO_CONFIG, intro: { ...DEFAULT_HERO_CONFIG.intro, durationMs: 500 } };
    expect(validateHeroConfig(bad)).toBeNull();
    const bad2 = { ...DEFAULT_HERO_CONFIG, intro: { ...DEFAULT_HERO_CONFIG.intro, durationMs: 20000 } };
    expect(validateHeroConfig(bad2)).toBeNull();
  });

  it("accepts pulse toggle per CTA", () => {
    const cfg = {
      ...DEFAULT_HERO_CONFIG,
      ctas: DEFAULT_HERO_CONFIG.ctas.map((c, i) => (i === 0 ? { ...c, pulse: !c.pulse } : c)),
    };
    expect(validateHeroConfig(cfg)?.ctas[0].pulse).toBe(false);
  });

  it("rejects too many badges", () => {
    const many = Array.from({ length: 13 }, (_, i) => ({ id: `b-${i}`, labelBn: "x", labelEn: "x" }));
    const bad = { ...DEFAULT_HERO_CONFIG, badges: many as never };
    expect(validateHeroConfig(bad)).toBeNull();
  });

  it("rejects missing visible", () => {
    const { visible: _v, ...rest } = DEFAULT_HERO_CONFIG as unknown as Record<string, unknown>;
    void _v;
    expect(validateHeroConfig(rest)).toBeNull();
  });
});
