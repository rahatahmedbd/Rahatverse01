import { describe, it, expect } from "vitest";
import { validateOrdersConfig, DEFAULT_ORDERS_CONFIG } from "@/lib/orders/config";
import { normalizeStage } from "@/types/orders";
import type { OrdersConfig } from "@/types/orders";

function clone(value: OrdersConfig): OrdersConfig {
  return JSON.parse(JSON.stringify(value)) as OrdersConfig;
}

describe("orders config validation", () => {
  it("accepts default config", () => {
    expect(validateOrdersConfig(DEFAULT_ORDERS_CONFIG)).not.toBeNull();
  });

  it("rejects missing visible flag", () => {
    const bad = clone(DEFAULT_ORDERS_CONFIG);
    delete (bad as unknown as Record<string, unknown>).visible;
    expect(validateOrdersConfig(bad)).toBeNull();
  });

  it("rejects an empty package label", () => {
    const bad = clone(DEFAULT_ORDERS_CONFIG);
    bad.packages[0].labelEn = "   ";
    expect(validateOrdersConfig(bad)).toBeNull();
  });

  it("accepts hiding a website type", () => {
    const cfg = clone(DEFAULT_ORDERS_CONFIG);
    cfg.websiteTypes[0].visible = false;
    expect(validateOrdersConfig(cfg)?.websiteTypes[0].visible).toBe(false);
  });

  it("rejects too many packages", () => {
    const bad = clone(DEFAULT_ORDERS_CONFIG);
    bad.packages = Array.from({ length: 13 }, (_, i) => ({ ...bad.packages[0], id: `p-${i}`, value: `v-${i}` }));
    expect(validateOrdersConfig(bad)).toBeNull();
  });

  it("allows empty page increments (hides the page selector)", () => {
    const cfg = clone(DEFAULT_ORDERS_CONFIG);
    cfg.pageIncrements = [];
    expect(validateOrdersConfig(cfg)).not.toBeNull();
  });

  it("rejects an invalid page increment value", () => {
    const bad = clone(DEFAULT_ORDERS_CONFIG);
    bad.pageIncrements = [1, 3, 0];
    expect(validateOrdersConfig(bad)).toBeNull();
  });

  it("rejects invalid design style description types", () => {
    const bad = clone(DEFAULT_ORDERS_CONFIG);
    bad.designStyles[0].descriptionEn = 123 as never;
    expect(validateOrdersConfig(bad)).toBeNull();
  });

  it("rejects empty CTA submit label", () => {
    const bad = clone(DEFAULT_ORDERS_CONFIG);
    bad.cta.submitBn = "";
    expect(validateOrdersConfig(bad)).toBeNull();
  });

  it("hydrates live-quote fields on legacy stored config", () => {
    const legacy = clone(DEFAULT_ORDERS_CONFIG);
    delete (legacy as unknown as Record<string, unknown>).quote;
    for (const addon of legacy.featureAddons) {
      delete (addon as unknown as Record<string, unknown>).priceBdt;
      delete (addon as unknown as Record<string, unknown>).priceUsd;
    }

    const validated = validateOrdersConfig(legacy);
    expect(validated?.quote.enabled).toBe(true);
    expect(validated?.featureAddons.find((addon) => addon.value === "payment")).toMatchObject({
      priceBdt: 5_000,
      priceUsd: 60,
    });
  });

  it("rejects invalid quote values and duplicate option values", () => {
    const invalidQuote = clone(DEFAULT_ORDERS_CONFIG);
    invalidQuote.quote.rangePercent = 101;
    expect(validateOrdersConfig(invalidQuote)).toBeNull();

    const duplicate = clone(DEFAULT_ORDERS_CONFIG);
    duplicate.packages[1].value = duplicate.packages[0].value;
    expect(validateOrdersConfig(duplicate)).toBeNull();
  });
});

describe("order kanban stage normalization", () => {
  it("maps legacy statuses onto canonical stages", () => {
    expect(normalizeStage("pending")).toBe("new_lead");
    expect(normalizeStage("review")).toBe("under_review");
    expect(normalizeStage("in_progress")).toBe("in_progress");
    expect(normalizeStage("cancelled")).toBe("archived");
    expect(normalizeStage("completed")).toBe("completed");
    expect(normalizeStage(null)).toBe("new_lead");
    expect(normalizeStage("unknown")).toBe("new_lead");
  });
});
