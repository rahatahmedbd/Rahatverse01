import type { OrdersFeatureAddon, OrdersQuoteConfig } from "@/types/orders";
import type { ServicesPackage } from "@/types/services";

export interface QuoteCurrencyBreakdown {
  base: number;
  pages: number;
  addons: number;
  minimum: number;
  maximum: number;
}

export interface LiveQuoteEstimate {
  package: ServicesPackage;
  customQuote: boolean;
  pages: number;
  extraPages: number;
  selectedAddons: OrdersFeatureAddon[];
  bdt: QuoteCurrencyBreakdown;
  usd: QuoteCurrencyBreakdown;
}

export interface CalculateQuoteInput {
  packageValue: string;
  pages: number;
  featureValues: string[];
}

function safePages(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(10_000, Math.floor(value)));
}

function upperBound(minimum: number, rangePercent: number, step: number): number {
  if (minimum <= 0) return 0;
  const raw = minimum * (1 + rangePercent / 100);
  return Math.ceil(raw / step) * step;
}

/**
 * Calculates a display-only estimate from admin-controlled package and add-on
 * prices. The server still confirms the final commercial quote after review.
 */
export function calculateLiveQuote(
  input: CalculateQuoteInput,
  packages: ServicesPackage[],
  addons: OrdersFeatureAddon[],
  config: OrdersQuoteConfig
): LiveQuoteEstimate | null {
  if (!config.enabled) return null;

  const selectedPackage = packages.find(
    (pkg) => pkg.visible && pkg.orderValue === input.packageValue
  );
  if (!selectedPackage) return null;

  const pages = safePages(input.pages);
  const extraPages =
    selectedPackage.includedPages === null
      ? 0
      : Math.max(0, pages - selectedPackage.includedPages);

  const selectedValues = new Set(input.featureValues);
  const includedValues = new Set(selectedPackage.includedFeatureValues);
  const selectedAddons = addons.filter(
    (addon) =>
      addon.visible &&
      selectedValues.has(addon.value) &&
      !includedValues.has(addon.value)
  );

  const customQuote = selectedPackage.priceBdt <= 0;
  const pageBdt = customQuote ? 0 : extraPages * config.pagePriceBdt;
  const pageUsd = customQuote ? 0 : extraPages * config.pagePriceUsd;
  const addonBdt = customQuote
    ? 0
    : selectedAddons.reduce((total, addon) => total + addon.priceBdt, 0);
  const addonUsd = customQuote
    ? 0
    : selectedAddons.reduce((total, addon) => total + addon.priceUsd, 0);
  const minimumBdt = customQuote ? 0 : selectedPackage.priceBdt + pageBdt + addonBdt;
  const minimumUsd = customQuote ? 0 : selectedPackage.priceUsd + pageUsd + addonUsd;

  return {
    package: selectedPackage,
    customQuote,
    pages,
    extraPages,
    selectedAddons,
    bdt: {
      base: customQuote ? 0 : selectedPackage.priceBdt,
      pages: pageBdt,
      addons: addonBdt,
      minimum: minimumBdt,
      maximum: upperBound(minimumBdt, config.rangePercent, 100),
    },
    usd: {
      base: customQuote ? 0 : selectedPackage.priceUsd,
      pages: pageUsd,
      addons: addonUsd,
      minimum: minimumUsd,
      maximum: upperBound(minimumUsd, config.rangePercent, 1),
    },
  };
}

export function formatQuoteAmount(amount: number, currency: "BDT" | "USD", locale: string): string {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
