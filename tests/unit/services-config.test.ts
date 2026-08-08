import { describe, it, expect } from "vitest";
import { validateServicesConfig, DEFAULT_SERVICES_CONFIG } from "@/lib/services/config";
import type { ServicesConfig } from "@/types/services";

function clone(value: ServicesConfig): ServicesConfig {
  return JSON.parse(JSON.stringify(value)) as ServicesConfig;
}

describe("services config validation", () => {
  it("accepts default config", () => {
    expect(validateServicesConfig(DEFAULT_SERVICES_CONFIG)).not.toBeNull();
  });

  it("rejects missing visible flag", () => {
    const bad = clone(DEFAULT_SERVICES_CONFIG);
    delete (bad as unknown as Record<string, unknown>).visible;
    expect(validateServicesConfig(bad)).toBeNull();
  });

  it("rejects a service with an empty title", () => {
    const bad = clone(DEFAULT_SERVICES_CONFIG);
    bad.services = bad.services.map((s, i) => (i === 0 ? { ...s, titleEn: "   " } : s));
    expect(validateServicesConfig(bad)).toBeNull();
  });

  it("accepts per-package popular toggle", () => {
    const cfg = clone(DEFAULT_SERVICES_CONFIG);
    cfg.packages = cfg.packages.map((p, i) => (i === 0 ? { ...p, popular: !p.popular } : p));
    expect(validateServicesConfig(cfg)?.packages[0].popular).toBe(true);
  });

  it("rejects negative or invalid package price", () => {
    const bad = clone(DEFAULT_SERVICES_CONFIG);
    bad.packages = bad.packages.map((p, i) => (i === 0 ? { ...p, priceBdt: -5 } : p));
    expect(validateServicesConfig(bad)).toBeNull();
    const bad2 = clone(DEFAULT_SERVICES_CONFIG);
    bad2.packages = bad2.packages.map((p, i) => (i === 0 ? { ...p, priceBdt: Number.NaN } : p));
    expect(validateServicesConfig(bad2)).toBeNull();
  });

  it("rejects too many packages", () => {
    const bad = clone(DEFAULT_SERVICES_CONFIG);
    const extra = { ...bad.packages[0], id: "extra" };
    bad.packages = Array.from({ length: 9 }, (_, i) => ({ ...extra, id: `p-${i}` }));
    expect(validateServicesConfig(bad)).toBeNull();
  });

  it("rejects a comparison row referencing an unknown package", () => {
    const bad = clone(DEFAULT_SERVICES_CONFIG);
    bad.comparisonRows[0].values = { ...bad.comparisonRows[0].values, does_not_exist: "✓" };
    expect(validateServicesConfig(bad)).toBeNull();
  });

  it("rejects an invalid icon name", () => {
    const bad = clone(DEFAULT_SERVICES_CONFIG);
    bad.services[0].icon = "HackerIcon" as never;
    expect(validateServicesConfig(bad)).toBeNull();
  });

  it("rejects an invalid featured badge variant", () => {
    const bad = clone(DEFAULT_SERVICES_CONFIG);
    bad.featuredPackages[0].badgeVariant = "weird" as never;
    expect(validateServicesConfig(bad)).toBeNull();
  });

  it("rejects invalid CTA (empty primary label)", () => {
    const bad = clone(DEFAULT_SERVICES_CONFIG);
    bad.cta.primaryLabelEn = "   ";
    expect(validateServicesConfig(bad)).toBeNull();
  });

  it("hydrates Phase 32 pricing fields on legacy stored config", () => {
    const legacy = clone(DEFAULT_SERVICES_CONFIG);
    for (const pkg of legacy.packages) {
      delete (pkg as unknown as Record<string, unknown>).orderValue;
      delete (pkg as unknown as Record<string, unknown>).includedPages;
      delete (pkg as unknown as Record<string, unknown>).includedFeatureValues;
    }
    for (const featured of legacy.featuredPackages) {
      delete (featured as unknown as Record<string, unknown>).pricingPackageId;
    }

    const validated = validateServicesConfig(legacy);
    expect(validated?.packages[0]).toMatchObject({
      orderValue: "basic",
      includedPages: 3,
      includedFeatureValues: ["responsive", "seo", "contact_form"],
    });
    expect(validated?.featuredPackages[0].pricingPackageId).toBe("basic");
  });

  it("rejects duplicate order mappings and invalid included-page values", () => {
    const duplicate = clone(DEFAULT_SERVICES_CONFIG);
    duplicate.packages[1].orderValue = duplicate.packages[0].orderValue;
    expect(validateServicesConfig(duplicate)).toBeNull();

    const invalidPages = clone(DEFAULT_SERVICES_CONFIG);
    invalidPages.packages[0].includedPages = -1;
    expect(validateServicesConfig(invalidPages)).toBeNull();
  });
});
