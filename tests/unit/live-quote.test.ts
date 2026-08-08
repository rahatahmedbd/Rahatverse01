import { describe, expect, it } from "vitest";
import { calculateLiveQuote, formatQuoteAmount } from "@/lib/orders/quote";
import { DEFAULT_ORDERS_CONFIG } from "@/lib/orders/config";
import { DEFAULT_SERVICES_CONFIG } from "@/lib/services/config";

const packages = DEFAULT_SERVICES_CONFIG.packages;
const addons = DEFAULT_ORDERS_CONFIG.featureAddons;
const quoteConfig = DEFAULT_ORDERS_CONFIG.quote;

describe("Phase 32 live quote calculator", () => {
  it("adds package, extra-page, and selected feature prices", () => {
    const estimate = calculateLiveQuote(
      {
        packageValue: "basic",
        pages: 5,
        featureValues: ["seo", "payment"],
      },
      packages,
      addons,
      quoteConfig
    );

    expect(estimate).not.toBeNull();
    expect(estimate?.extraPages).toBe(2);
    expect(estimate?.bdt).toMatchObject({
      base: 5_000,
      pages: 2_000,
      addons: 5_000,
      minimum: 12_000,
      maximum: 13_800,
    });
    expect(estimate?.usd).toMatchObject({
      base: 60,
      pages: 24,
      addons: 60,
      minimum: 144,
      maximum: 166,
    });
  });

  it("does not charge again for features included in the package", () => {
    const estimate = calculateLiveQuote(
      { packageValue: "basic", pages: 1, featureValues: ["responsive", "seo", "contact_form"] },
      packages,
      addons,
      quoteConfig
    );

    expect(estimate?.selectedAddons).toEqual([]);
    expect(estimate?.bdt.addons).toBe(0);
    expect(estimate?.bdt.minimum).toBe(5_000);
  });

  it("does not add page charges to an unlimited-page package", () => {
    const estimate = calculateLiveQuote(
      { packageValue: "premium", pages: 50, featureValues: [] },
      packages,
      addons,
      quoteConfig
    );

    expect(estimate?.extraPages).toBe(0);
    expect(estimate?.bdt.pages).toBe(0);
    expect(estimate?.bdt.minimum).toBe(30_000);
  });

  it("returns a custom quote for a zero-priced package", () => {
    const estimate = calculateLiveQuote(
      { packageValue: "enterprise", pages: 20, featureValues: ["admin"] },
      packages,
      addons,
      quoteConfig
    );

    expect(estimate?.customQuote).toBe(true);
    expect(estimate?.bdt.minimum).toBe(0);
    expect(estimate?.bdt.maximum).toBe(0);
  });

  it("ignores duplicate, hidden, and unknown add-ons", () => {
    const hiddenAddons = addons.map((addon) =>
      addon.value === "seo" ? { ...addon, visible: false } : addon
    );
    const estimate = calculateLiveQuote(
      {
        packageValue: "basic",
        pages: 1,
        featureValues: ["payment", "payment", "seo", "unknown"],
      },
      packages,
      hiddenAddons,
      quoteConfig
    );

    expect(estimate?.selectedAddons.map((addon) => addon.value)).toEqual(["payment"]);
    expect(estimate?.bdt.addons).toBe(5_000);
  });

  it("returns null when quote display is disabled or no package mapping exists", () => {
    expect(
      calculateLiveQuote(
        { packageValue: "basic", pages: 1, featureValues: [] },
        packages,
        addons,
        { ...quoteConfig, enabled: false }
      )
    ).toBeNull();
    expect(
      calculateLiveQuote(
        { packageValue: "missing", pages: 1, featureValues: [] },
        packages,
        addons,
        quoteConfig
      )
    ).toBeNull();
  });

  it("formats both supported currencies", () => {
    expect(formatQuoteAmount(5_000, "BDT", "en")).toContain("5,000");
    expect(formatQuoteAmount(60, "USD", "en")).toContain("60");
  });
});
