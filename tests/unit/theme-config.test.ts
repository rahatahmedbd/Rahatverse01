import { describe, it, expect } from "vitest";
import { validateThemeConfig, DEFAULT_THEME_CONFIG } from "@/lib/theme/config";
import type { ThemeConfig } from "@/types/theme";

function clone(value: ThemeConfig): ThemeConfig {
  return JSON.parse(JSON.stringify(value)) as ThemeConfig;
}

describe("theme config validation", () => {
  it("accepts default config", () => {
    expect(validateThemeConfig(DEFAULT_THEME_CONFIG)).not.toBeNull();
  });

  it("rejects missing visible flag", () => {
    const bad = clone(DEFAULT_THEME_CONFIG);
    delete (bad as unknown as Record<string, unknown>).visible;
    expect(validateThemeConfig(bad)).toBeNull();
  });

  it("rejects an invalid hex primary color", () => {
    const bad = clone(DEFAULT_THEME_CONFIG);
    bad.presets[0].primary = "red";
    expect(validateThemeConfig(bad)).toBeNull();
  });

  it("rejects an invalid default theme value", () => {
    const bad = clone(DEFAULT_THEME_CONFIG);
    bad.defaults.defaultTheme = "sepia" as never;
    expect(validateThemeConfig(bad)).toBeNull();
  });

  it("rejects a negative XP rule points value", () => {
    const bad = clone(DEFAULT_THEME_CONFIG);
    bad.xp.rules[0].points = -5;
    expect(validateThemeConfig(bad)).toBeNull();
  });

  it("accepts toggling effects off", () => {
    const cfg = clone(DEFAULT_THEME_CONFIG);
    cfg.effects.customCursor = false;
    cfg.effects.sparkleTrail = true;
    expect(validateThemeConfig(cfg)?.effects.customCursor).toBe(false);
  });

  it("rejects an out-of-range volume", () => {
    const bad = clone(DEFAULT_THEME_CONFIG);
    bad.audio.defaultVolume = 150;
    expect(validateThemeConfig(bad)).toBeNull();
  });

  it("rejects an out-of-range intensity", () => {
    const bad = clone(DEFAULT_THEME_CONFIG);
    bad.effects.intensity = 101;
    expect(validateThemeConfig(bad)).toBeNull();
  });
});
