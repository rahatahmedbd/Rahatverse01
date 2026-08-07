import type {
  AnnouncementBanner,
  FooterSettings,
  GlobalConfig,
  HeaderAnnouncement,
  MaintenanceSettings,
} from "@/types/global";

const MAX_SHORT = 260;
const MAX_TEXT = 2000;

const DEFAULT_ANNOUNCEMENT: AnnouncementBanner = {
  enabled: false,
  textBn: "🚀 নতুন আপডেট!",
  textEn: "🚀 New update!",
  link: "",
};

const DEFAULT_HEADER: HeaderAnnouncement = {
  enabled: false,
  textBn: "",
  textEn: "",
};

const DEFAULT_FOOTER: FooterSettings = {
  copyrightBn: "© {year} RahatVerse. সর্বস্বত্ব সংরক্ষিত।",
  copyrightEn: "© {year} RahatVerse. All rights reserved.",
  madeWithBn: "ভালোবাসা দিয়ে তৈরি",
  madeWithEn: "Made with",
  businessPhone: "+880 1626-224878",
  businessEmail: "rahatbd20505@gmail.com",
  businessWhatsapp: "https://wa.me/8801626224878",
  locationBn: "সুনামগঞ্জ, বাংলাদেশ",
  locationEn: "Sunamganj, Bangladesh",
};

const DEFAULT_MAINTENANCE: MaintenanceSettings = {
  enabled: false,
  messageBn: "আমরা শীঘ্রই ফিরে আসছি!",
  messageEn: "We'll be back soon!",
  allowAdmins: true,
};

export const DEFAULT_GLOBAL_CONFIG: GlobalConfig = {
  visible: true,
  announcement: DEFAULT_ANNOUNCEMENT,
  header: DEFAULT_HEADER,
  footer: DEFAULT_FOOTER,
  maintenance: DEFAULT_MAINTENANCE,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isText(value: unknown, max = MAX_SHORT, allowEmpty = false): value is string {
  return typeof value === "string" && value.length <= max && (allowEmpty || value.trim().length > 0);
}
function isSafeUrl(value: unknown, allowEmpty = false): boolean {
  return typeof value === "string" && value.length <= 1000 && (value === "" || /^(https?|whatsapp|tel|mailto):/i.test(value)) && (allowEmpty || value.length > 0);
}
function validateAnnouncement(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return typeof value.enabled === "boolean" && isText(value.textBn, MAX_SHORT, true) && isText(value.textEn, MAX_SHORT, true) && isSafeUrl(value.link, true);
}
function validateHeader(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return typeof value.enabled === "boolean" && isText(value.textBn, MAX_SHORT, true) && isText(value.textEn, MAX_SHORT, true);
}
function validateFooter(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isText(value.copyrightBn, MAX_SHORT, true) && isText(value.copyrightEn, MAX_SHORT, true) &&
    isText(value.madeWithBn, MAX_SHORT, true) && isText(value.madeWithEn, MAX_SHORT, true) &&
    isText(value.businessPhone, 40, true) && isText(value.businessEmail, 120, true) &&
    isSafeUrl(value.businessWhatsapp, true) && isText(value.locationBn, MAX_SHORT, true) && isText(value.locationEn, MAX_SHORT, true);
}
function validateMaintenance(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return typeof value.enabled === "boolean" && isText(value.messageBn, MAX_TEXT, true) && isText(value.messageEn, MAX_TEXT, true) && typeof value.allowAdmins === "boolean";
}

export function validateGlobalConfig(input: unknown): GlobalConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!validateAnnouncement(input.announcement)) return null;
  if (!validateHeader(input.header)) return null;
  if (!validateFooter(input.footer)) return null;
  if (!validateMaintenance(input.maintenance)) return null;
  return input as unknown as GlobalConfig;
}
