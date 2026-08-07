import type {
  AnalyticsConfig,
  AnalyticsSectionContent,
  AnalyticsSettings,
} from "@/types/analytics";

const MAX_SHORT = 260;

const DEFAULT_SECTION: AnalyticsSectionContent = {
  badgeBn: "📊 অ্যানালিটিক্স",
  badgeEn: "📊 Analytics",
  titleBn: "ট্রাফিক ও পারফরম্যান্স",
  titleEn: "Traffic & Performance",
  subtitleBn: "ভিজিটর টেলিমেট্রি, ডিভাইস এবং কোর ওয়েব ভাইটাল",
  subtitleEn: "Visitor telemetry, devices and Core Web Vitals",
};

const DEFAULT_SETTINGS: AnalyticsSettings = {
  telemetryEnabled: true,
  showDemographics: true,
  showDevices: true,
  showGeo: true,
  showVitals: true,
  conversionGoalBn: "সম্পন্ন অর্ডার",
  conversionGoalEn: "Completed Orders",
  vitals: {
    lcpTargetMs: 2500,
    inpTargetMs: 200,
    clsTarget: 0.1,
  },
};

export const DEFAULT_ANALYTICS_CONFIG: AnalyticsConfig = {
  visible: true,
  section: DEFAULT_SECTION,
  settings: DEFAULT_SETTINGS,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isText(value: unknown, max = MAX_SHORT, allowEmpty = false): value is string {
  return typeof value === "string" && value.length <= max && (allowEmpty || value.trim().length > 0);
}
function validateSection(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isText(value.badgeBn) && isText(value.badgeEn) && isText(value.titleBn) && isText(value.titleEn) && isText(value.subtitleBn, MAX_SHORT, true) && isText(value.subtitleEn, MAX_SHORT, true);
}
function validateVitals(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const lcp = Number(value.lcpTargetMs);
  const inp = Number(value.inpTargetMs);
  const cls = Number(value.clsTarget);
  return Number.isFinite(lcp) && lcp >= 500 && lcp <= 10000 &&
    Number.isFinite(inp) && inp >= 50 && inp <= 1000 &&
    Number.isFinite(cls) && cls >= 0 && cls <= 1;
}
function validateSettings(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return typeof value.telemetryEnabled === "boolean" &&
    typeof value.showDemographics === "boolean" &&
    typeof value.showDevices === "boolean" &&
    typeof value.showGeo === "boolean" &&
    typeof value.showVitals === "boolean" &&
    isText(value.conversionGoalBn, MAX_SHORT, true) &&
    isText(value.conversionGoalEn, MAX_SHORT, true) &&
    validateVitals(value.vitals);
}

export function validateAnalyticsConfig(input: unknown): AnalyticsConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!validateSection(input.section)) return null;
  if (!validateSettings(input.settings)) return null;
  return input as unknown as AnalyticsConfig;
}
