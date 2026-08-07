import { describe, it, expect } from "vitest";
import { validateAnalyticsConfig, DEFAULT_ANALYTICS_CONFIG } from "@/lib/analytics/config";
import type { AnalyticsConfig } from "@/types/analytics";

function clone(value: AnalyticsConfig): AnalyticsConfig {
  return JSON.parse(JSON.stringify(value)) as AnalyticsConfig;
}

describe("analytics config validation", () => {
  it("accepts default config", () => {
    expect(validateAnalyticsConfig(DEFAULT_ANALYTICS_CONFIG)).not.toBeNull();
  });

  it("rejects missing visible flag", () => {
    const bad = clone(DEFAULT_ANALYTICS_CONFIG);
    delete (bad as unknown as Record<string, unknown>).visible;
    expect(validateAnalyticsConfig(bad)).toBeNull();
  });

  it("accepts disabling telemetry and panels", () => {
    const cfg = clone(DEFAULT_ANALYTICS_CONFIG);
    cfg.settings.telemetryEnabled = false;
    cfg.settings.showVitals = false;
    expect(validateAnalyticsConfig(cfg)?.settings.telemetryEnabled).toBe(false);
  });

  it("rejects an out-of-range LCP target", () => {
    const bad = clone(DEFAULT_ANALYTICS_CONFIG);
    bad.settings.vitals.lcpTargetMs = 100;
    expect(validateAnalyticsConfig(bad)).toBeNull();
  });

  it("rejects an out-of-range INP target", () => {
    const bad = clone(DEFAULT_ANALYTICS_CONFIG);
    bad.settings.vitals.inpTargetMs = 2000;
    expect(validateAnalyticsConfig(bad)).toBeNull();
  });

  it("rejects an out-of-range CLS target", () => {
    const bad = clone(DEFAULT_ANALYTICS_CONFIG);
    bad.settings.vitals.clsTarget = 1.5;
    expect(validateAnalyticsConfig(bad)).toBeNull();
  });

  it("allows empty conversion goal label (falls back to default)", () => {
    const cfg = clone(DEFAULT_ANALYTICS_CONFIG);
    cfg.settings.conversionGoalEn = "";
    expect(validateAnalyticsConfig(cfg)).not.toBeNull();
  });
});
