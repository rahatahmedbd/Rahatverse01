import type {
  CampaignDefaults,
  NewsletterConfig,
  NewsletterSectionContent,
  NewsletterTopic,
} from "@/types/newsletter";

const MAX_SHORT = 260;

const DEFAULT_SECTION: NewsletterSectionContent = {
  badgeBn: "📰 নিউজলেটার",
  badgeEn: "📰 Newsletter",
  titleBn: "নিউজলেটারে যুক্ত হোন",
  titleEn: "Join the newsletter",
  subtitleBn: "শিক্ষা, প্রযুক্তি ও সমাজসেবা নিয়ে আমার নতুন লেখা এবং প্রজেক্ট আপডেট — সরাসরি ইনবক্সে। স্প্যাম নয়।",
  subtitleEn: "New stories on education, tech & social service — plus project updates. No spam, unsubscribe anytime.",
};

const DEFAULT_TOPICS: NewsletterTopic[] = [
  { id: "topic-tech", value: "tech_updates", labelBn: "টেক আপডেট", labelEn: "Tech Updates", visible: true },
  { id: "topic-webdev", value: "webdev_tips", labelBn: "ওয়েব ডেভ টিপস", labelEn: "Web Dev Tips", visible: true },
  { id: "topic-blood", value: "blood_drives", labelBn: "রক্তদান ড্রাইভ", labelEn: "Blood Donation Drives", visible: true },
];

const DEFAULT_CAMPAIGN: CampaignDefaults = {
  fromNameBn: "রাহাত আহমেদ",
  fromNameEn: "Rahat Ahmed",
  fromEmail: "newsletter@rahatverse.dev",
  defaultSubjectBn: "রাহাতভার্স আপডেট",
  defaultSubjectEn: "RahatVerse Update",
  personalizationHintBn: "{{name}} ট্যাগ ব্যবহার করে পাঠকের নাম বসান",
  personalizationHintEn: "Use the {{name}} tag to personalize each reader's name",
};

export const DEFAULT_NEWSLETTER_CONFIG: NewsletterConfig = {
  visible: true,
  section: DEFAULT_SECTION,
  topics: DEFAULT_TOPICS,
  campaignDefaults: DEFAULT_CAMPAIGN,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isText(value: unknown, max = MAX_SHORT, allowEmpty = false): value is string {
  return typeof value === "string" && value.length <= max && (allowEmpty || value.trim().length > 0);
}
function isSlug(value: unknown): boolean {
  return typeof value === "string" && value.length <= 50 && /^[a-z0-9_-]+$/.test(value);
}
function validateSection(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isText(value.badgeBn) && isText(value.badgeEn) && isText(value.titleBn) && isText(value.titleEn) && isText(value.subtitleBn) && isText(value.subtitleEn);
}
function validateTopics(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 20) return false;
  return value.every((item) => isRecord(item) && isText(item.id, 80) && isSlug(item.value) && isText(item.labelBn) && isText(item.labelEn) && typeof item.visible === "boolean");
}
function validateCampaign(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isText(value.fromNameBn) && isText(value.fromNameEn) && isText(value.fromEmail, 120) &&
    isText(value.defaultSubjectBn, MAX_SHORT, true) && isText(value.defaultSubjectEn, MAX_SHORT, true) &&
    isText(value.personalizationHintBn, MAX_SHORT, true) && isText(value.personalizationHintEn, MAX_SHORT, true);
}

export function validateNewsletterConfig(input: unknown): NewsletterConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!validateSection(input.section)) return null;
  if (!validateTopics(input.topics)) return null;
  if (!validateCampaign(input.campaignDefaults)) return null;
  return input as unknown as NewsletterConfig;
}
