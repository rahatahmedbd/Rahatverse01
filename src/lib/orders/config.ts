import type {
  OrdersBudgetRange,
  OrdersConfig,
  OrdersCta,
  OrdersDesignStyle,
  OrdersFeatureAddon,
  OrdersOption,
  OrdersQuoteConfig,
  OrdersSectionContent,
  OrdersStepLabels,
} from "@/types/orders";

// ── Default Order Intake Config ───────────────────────
// These values preserve the original public wizard content when Supabase is not
// configured or before migration 014 has been applied.

const MAX_TEXT = 500;
const MAX_SHORT = 200;

const DEFAULT_SECTION: OrdersSectionContent = {
  badgeBn: "🛒 ওয়েবসাইট অর্ডার",
  badgeEn: "🛒 Order Website",
  titleBn: "আপনার ওয়েবসাইট অর্ডার করুন",
  titleEn: "Order Your Website",
  subtitleBn: "কয়েকটি সহজ ধাপে আপনার স্বপ্নের ওয়েবসাইট অর্ডার করুন",
  subtitleEn: "Order your dream website in a few simple steps",
};

const DEFAULT_STEPS: OrdersStepLabels = {
  packageBn: "প্যাকেজ",
  packageEn: "Package",
  designBn: "ডিজাইন",
  designEn: "Design",
  detailsBn: "বিস্তারিত",
  detailsEn: "Details",
  contactBn: "যোগাযোগ",
  contactEn: "Contact",
  reviewBn: "রিভিউ",
  reviewEn: "Review",
};

const DEFAULT_PACKAGES: OrdersOption[] = [
  { id: "pkg-basic", value: "basic", labelBn: "বেসিক", labelEn: "Basic", visible: true },
  { id: "pkg-standard", value: "standard", labelBn: "স্ট্যান্ডার্ড", labelEn: "Standard", visible: true },
  { id: "pkg-premium", value: "premium", labelBn: "প্রিমিয়াম", labelEn: "Premium", visible: true },
  { id: "pkg-enterprise", value: "enterprise", labelBn: "এন্টারপ্রাইজ", labelEn: "Enterprise", visible: true },
];

const DEFAULT_WEBSITE_TYPES: OrdersOption[] = [
  { id: "wt-portfolio", value: "portfolio", labelBn: "পোর্টফোলিও", labelEn: "Portfolio", visible: true },
  { id: "wt-business", value: "business", labelBn: "ব্যবসায়িক", labelEn: "Business", visible: true },
  { id: "wt-ecommerce", value: "ecommerce", labelBn: "ই-কমার্স", labelEn: "E-Commerce", visible: true },
  { id: "wt-education", value: "education", labelBn: "শিক্ষা প্রতিষ্ঠান", labelEn: "Education", visible: true },
  { id: "wt-blood", value: "blood_org", labelBn: "রক্ত সংগঠন", labelEn: "Blood Organization", visible: true },
  { id: "wt-news", value: "news_portal", labelBn: "নিউজ পোর্টাল", labelEn: "News Portal", visible: true },
  { id: "wt-landing", value: "landing_page", labelBn: "ল্যান্ডিং পেজ", labelEn: "Landing Page", visible: true },
  { id: "wt-custom", value: "custom", labelBn: "কাস্টম", labelEn: "Custom", visible: true },
];

const DEFAULT_FEATURE_ADDONS: OrdersFeatureAddon[] = [
  { id: "feat-responsive", value: "responsive", labelBn: "রেসপনসিভ ডিজাইন", labelEn: "Responsive Design", visible: true, priceBdt: 0, priceUsd: 0 },
  { id: "feat-seo", value: "seo", labelBn: "SEO অপটিমাইজেশন", labelEn: "SEO Optimization", visible: true, priceBdt: 1500, priceUsd: 18 },
  { id: "feat-blog", value: "blog", labelBn: "ব্লগ সেকশন", labelEn: "Blog Section", visible: true, priceBdt: 2500, priceUsd: 30 },
  { id: "feat-contact", value: "contact_form", labelBn: "কন্টাক্ট ফর্ম", labelEn: "Contact Form", visible: true, priceBdt: 1000, priceUsd: 12 },
  { id: "feat-map", value: "map", labelBn: "Google Maps", labelEn: "Google Maps", visible: true, priceBdt: 500, priceUsd: 6 },
  { id: "feat-payment", value: "payment", labelBn: "পেমেন্ট ইন্টিগ্রেশন", labelEn: "Payment Integration", visible: true, priceBdt: 5000, priceUsd: 60 },
  { id: "feat-auth", value: "auth", labelBn: "লগইন/সাইনআপ", labelEn: "Login/Signup", visible: true, priceBdt: 4000, priceUsd: 48 },
  { id: "feat-admin", value: "admin", labelBn: "অ্যাডমিন প্যানেল", labelEn: "Admin Panel", visible: true, priceBdt: 7000, priceUsd: 84 },
  { id: "feat-multilang", value: "multilang", labelBn: "মাল্টি-ল্যাংগুয়েজ", labelEn: "Multi-Language", visible: true, priceBdt: 2500, priceUsd: 30 },
  { id: "feat-analytics", value: "analytics", labelBn: "অ্যানালিটিক্স", labelEn: "Analytics", visible: true, priceBdt: 1500, priceUsd: 18 },
];

const DEFAULT_DESIGN_STYLES: OrdersDesignStyle[] = [
  {
    id: "style-modern",
    value: "modern",
    labelBn: "মডার্ন",
    labelEn: "Modern",
    descriptionBn: "পরিষ্কার, মিনিমাল এবং পেশাদার লুক",
    descriptionEn: "Clean, minimal and professional look",
    visible: true,
  },
  {
    id: "style-glass",
    value: "glassmorphism",
    labelBn: "গ্লাসমর্ফিজম",
    labelEn: "Glassmorphism",
    descriptionBn: "ফ্রস্টেড গ্লাস ও গ্রেডিয়েন্ট ইফেক্ট",
    descriptionEn: "Frosted glass and gradient effects",
    visible: true,
  },
  {
    id: "style-dark",
    value: "dark",
    labelBn: "ডার্ক",
    labelEn: "Dark",
    descriptionBn: "ডার্ক থিম, নিয়ন অ্যাকসেন্ট",
    descriptionEn: "Dark theme with neon accents",
    visible: true,
  },
  {
    id: "style-playful",
    value: "playful",
    labelBn: "প্লে ফুল",
    labelEn: "Playful",
    descriptionBn: "রঙিন ও প্রাণবন্ত ডিজাইন",
    descriptionEn: "Colorful and lively design",
    visible: true,
  },
];

const DEFAULT_PAGE_INCREMENTS = [1, 3, 5, 10, 20, 50];

const DEFAULT_QUOTE: OrdersQuoteConfig = {
  enabled: true,
  pagePriceBdt: 1000,
  pagePriceUsd: 12,
  rangePercent: 15,
  titleBn: "লাইভ আনুমানিক কোট",
  titleEn: "Live estimated quote",
  disclaimerBn: "এটি একটি প্রাথমিক আনুমানিক রেঞ্জ। চূড়ান্ত মূল্য প্রয়োজন যাচাই ও আলোচনার পর নিশ্চিত হবে।",
  disclaimerEn: "This is an initial estimate. The final price is confirmed after requirements review and consultation.",
};

const DEFAULT_BUDGET_RANGES: OrdersBudgetRange[] = [
  { id: "budget-1", value: "5k-10k", label: "৳5,000 - ৳10,000", visible: true },
  { id: "budget-2", value: "10k-20k", label: "৳10,000 - ৳20,000", visible: true },
  { id: "budget-3", value: "20k-35k", label: "৳20,000 - ৳35,000", visible: true },
  { id: "budget-4", value: "35k-50k", label: "৳35,000 - ৳50,000", visible: true },
  { id: "budget-5", value: "50k+", label: "৳50,000+", visible: true },
];

const DEFAULT_TIMELINE_OPTIONS: OrdersOption[] = [
  { id: "time-1w", value: "1-week", labelBn: "১ সপ্তাহ", labelEn: "1 Week", visible: true },
  { id: "time-2w", value: "2-weeks", labelBn: "২ সপ্তাহ", labelEn: "2 Weeks", visible: true },
  { id: "time-1m", value: "1-month", labelBn: "১ মাস", labelEn: "1 Month", visible: true },
  { id: "time-flex", value: "flexible", labelBn: "ফ্লেক্সিবল", labelEn: "Flexible", visible: true },
];

const DEFAULT_CTA: OrdersCta = {
  nextBn: "পরবর্তী",
  nextEn: "Next",
  backBn: "পিছনে",
  backEn: "Back",
  submitBn: "অর্ডার জমা দিন",
  submitEn: "Submit Order",
  submittingBn: "জমা হচ্ছে...",
  submittingEn: "Submitting...",
  successTitleBn: "অর্ডার সফলভাবে জমা হয়েছে!",
  successTitleEn: "Order Submitted Successfully!",
  successMessageBn: "আপনার অর্ডার পাওয়া গেছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
  successMessageEn: "We received your order. We will contact you shortly.",
};

export const DEFAULT_ORDERS_CONFIG: OrdersConfig = {
  visible: true,
  section: DEFAULT_SECTION,
  steps: DEFAULT_STEPS,
  packages: DEFAULT_PACKAGES,
  websiteTypes: DEFAULT_WEBSITE_TYPES,
  featureAddons: DEFAULT_FEATURE_ADDONS,
  designStyles: DEFAULT_DESIGN_STYLES,
  pageIncrements: DEFAULT_PAGE_INCREMENTS,
  quote: DEFAULT_QUOTE,
  budgetRanges: DEFAULT_BUDGET_RANGES,
  timelineOptions: DEFAULT_TIMELINE_OPTIONS,
  cta: DEFAULT_CTA,
};

// ── Validation helpers ─────────────────────────────────
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown, max = MAX_TEXT, allowEmpty = false): value is string {
  return (
    typeof value === "string" &&
    value.length <= max &&
    (allowEmpty || value.trim().length > 0)
  );
}

function isId(value: unknown): boolean {
  return isText(value, 80);
}

function isValue(value: unknown): boolean {
  return isText(value, 80);
}

function isPrice(value: unknown, max: number): boolean {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= max;
}

function validateSection(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isText(value.badgeBn, MAX_SHORT) &&
    isText(value.badgeEn, MAX_SHORT) &&
    isText(value.titleBn, MAX_SHORT) &&
    isText(value.titleEn, MAX_SHORT) &&
    isText(value.subtitleBn, MAX_SHORT) &&
    isText(value.subtitleEn, MAX_SHORT)
  );
}

function validateSteps(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isText(value.packageBn, MAX_SHORT) &&
    isText(value.packageEn, MAX_SHORT) &&
    isText(value.designBn, MAX_SHORT) &&
    isText(value.designEn, MAX_SHORT) &&
    isText(value.detailsBn, MAX_SHORT) &&
    isText(value.detailsEn, MAX_SHORT) &&
    isText(value.contactBn, MAX_SHORT) &&
    isText(value.contactEn, MAX_SHORT) &&
    isText(value.reviewBn, MAX_SHORT) &&
    isText(value.reviewEn, MAX_SHORT)
  );
}

function validateCta(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isText(value.nextBn, MAX_SHORT) &&
    isText(value.nextEn, MAX_SHORT) &&
    isText(value.backBn, MAX_SHORT) &&
    isText(value.backEn, MAX_SHORT) &&
    isText(value.submitBn, MAX_SHORT) &&
    isText(value.submitEn, MAX_SHORT) &&
    isText(value.submittingBn, MAX_SHORT) &&
    isText(value.submittingEn, MAX_SHORT) &&
    isText(value.successTitleBn, MAX_SHORT) &&
    isText(value.successTitleEn, MAX_SHORT) &&
    isText(value.successMessageBn, MAX_TEXT) &&
    isText(value.successMessageEn, MAX_TEXT)
  );
}

function validateOptions(value: unknown, max: number): boolean {
  if (!Array.isArray(value) || value.length > max) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isId(item.id) &&
      isValue(item.value) &&
      isText(item.labelBn, MAX_SHORT) &&
      isText(item.labelEn, MAX_SHORT) &&
      typeof item.visible === "boolean"
    );
  });
}

function validateFeatureAddons(value: unknown, max: number): boolean {
  if (!Array.isArray(value) || value.length > max) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isId(item.id) &&
      isValue(item.value) &&
      isText(item.labelBn, MAX_SHORT) &&
      isText(item.labelEn, MAX_SHORT) &&
      typeof item.visible === "boolean" &&
      (item.priceBdt === undefined || isPrice(item.priceBdt, 100_000_000)) &&
      (item.priceUsd === undefined || isPrice(item.priceUsd, 1_000_000))
    );
  });
}

function validateQuote(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    typeof value.enabled === "boolean" &&
    isPrice(value.pagePriceBdt, 100_000_000) &&
    isPrice(value.pagePriceUsd, 1_000_000) &&
    typeof value.rangePercent === "number" &&
    Number.isFinite(value.rangePercent) &&
    value.rangePercent >= 0 &&
    value.rangePercent <= 100 &&
    isText(value.titleBn, MAX_SHORT) &&
    isText(value.titleEn, MAX_SHORT) &&
    isText(value.disclaimerBn, MAX_TEXT) &&
    isText(value.disclaimerEn, MAX_TEXT)
  );
}

function validateDesignStyles(value: unknown, max: number): boolean {
  if (!Array.isArray(value) || value.length > max) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isId(item.id) &&
      isValue(item.value) &&
      isText(item.labelBn, MAX_SHORT) &&
      isText(item.labelEn, MAX_SHORT) &&
      isText(item.descriptionBn, MAX_SHORT, true) &&
      isText(item.descriptionEn, MAX_SHORT, true) &&
      typeof item.visible === "boolean"
    );
  });
}

function validateBudgetRanges(value: unknown, max: number): boolean {
  if (!Array.isArray(value) || value.length > max) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isId(item.id) &&
      isValue(item.value) &&
      isText(item.label, MAX_SHORT) &&
      typeof item.visible === "boolean"
    );
  });
}

function validatePageIncrements(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 30) return false;
  return value.every((item) => {
    const num = Number(item);
    return Number.isFinite(num) && num >= 1 && num <= 10_000;
  });
}

function hasUniqueIdsAndValues(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  const items = value as Record<string, unknown>[];
  return (
    new Set(items.map((item) => item.id)).size === items.length &&
    new Set(items.map((item) => item.value)).size === items.length
  );
}

export function validateOrdersConfig(input: unknown): OrdersConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!validateSection(input.section)) return null;
  if (!validateSteps(input.steps)) return null;
  if (!validateOptions(input.packages, 12) || !hasUniqueIdsAndValues(input.packages)) return null;
  if (!validateOptions(input.websiteTypes, 20) || !hasUniqueIdsAndValues(input.websiteTypes)) return null;
  if (!validateFeatureAddons(input.featureAddons, 30) || !hasUniqueIdsAndValues(input.featureAddons)) return null;
  if (!validateDesignStyles(input.designStyles, 12) || !hasUniqueIdsAndValues(input.designStyles)) return null;
  if (!validatePageIncrements(input.pageIncrements)) return null;
  if (input.quote !== undefined && !validateQuote(input.quote)) return null;
  if (!validateBudgetRanges(input.budgetRanges, 12) || !hasUniqueIdsAndValues(input.budgetRanges)) return null;
  if (!validateOptions(input.timelineOptions, 12) || !hasUniqueIdsAndValues(input.timelineOptions)) return null;
  if (!validateCta(input.cta)) return null;

  // Backward-compatible hydration keeps existing admin-managed JSON usable
  // before migration 026 adds quote and add-on price fields in production.
  const featureAddons = (input.featureAddons as Record<string, unknown>[]).map((item) => {
    const defaults = DEFAULT_FEATURE_ADDONS.find((addon) => addon.value === item.value);
    return {
      ...item,
      priceBdt: typeof item.priceBdt === "number" ? item.priceBdt : defaults?.priceBdt ?? 0,
      priceUsd: typeof item.priceUsd === "number" ? item.priceUsd : defaults?.priceUsd ?? 0,
    };
  }) as unknown as OrdersFeatureAddon[];

  return {
    ...(input as unknown as OrdersConfig),
    featureAddons,
    quote: input.quote === undefined ? DEFAULT_QUOTE : (input.quote as unknown as OrdersQuoteConfig),
  };
}
