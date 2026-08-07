import type {
  ContentConfig,
  FaqCategory,
  FaqItem,
  LegalPage,
  SearchScopeItem,
} from "@/types/content";

const MAX_SHORT = 260;
const MAX_BODY = 50_000;

const DEFAULT_FAQ_CATEGORIES: FaqCategory[] = [
  { id: "faq-cat-ordering", value: "ordering", labelBn: "অর্ডারিং", labelEn: "Ordering", visible: true },
  { id: "faq-cat-payments", value: "payments", labelBn: "পেমেন্ট", labelEn: "Payments", visible: true },
  { id: "faq-cat-timeline", value: "timeline", labelBn: "টাইমলাইন", labelEn: "Timeline", visible: true },
  { id: "faq-cat-blood", value: "blood", labelBn: "রক্তদান", labelEn: "Blood Donation", visible: true },
  { id: "faq-cat-general", value: "general", labelBn: "সাধারণ", labelEn: "General", visible: true },
];

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  { id: "faq-cost", category: "ordering", questionBn: "একটি ওয়েবসাইটের খরচ কত?", questionEn: "How much does a website cost?", answerBn: "ওয়েবসাইট প্যাকেজ ৳৫,০০০ (বেসিক) থেকে ৳৩০,০০০+ (প্রিমিয়াম) পর্যন্ত। এন্টারপ্রাইজ সলিউশনের জন্য কাস্টম প্রাইসিং পাওয়া যায়।", answerEn: "Website packages start from ৳5,000 (Basic) to ৳30,000+ (Premium). Custom pricing available for enterprise solutions.", visible: true },
  { id: "faq-delivery", category: "timeline", questionBn: "কত সময়ে ওয়েবসাইট ডেলিভারি করা হয়?", questionEn: "How long does delivery take?", answerBn: "প্যাকেজ অনুযায়ী ১–৩ সপ্তাহ। বড় প্রজেক্টে সময় আরও বাড়তে পারে।", answerEn: "Delivery takes 1–3 weeks depending on the package. Larger projects may take longer.", visible: true },
];

const DEFAULT_SEARCH_SCOPE: SearchScopeItem[] = [
  { id: "search-blog", value: "blog", labelBn: "ব্লগ পোস্ট", labelEn: "Blog posts", weight: 10, enabled: true },
  { id: "search-services", value: "services", labelBn: "সেবা", labelEn: "Services", weight: 8, enabled: true },
  { id: "search-portfolio", value: "portfolio", labelBn: "পোর্টফোলিও", labelEn: "Portfolio", weight: 6, enabled: true },
  { id: "search-gallery", value: "gallery", labelBn: "গ্যালারি", labelEn: "Gallery", weight: 4, enabled: true },
];

const DEFAULT_LEGAL: LegalPage[] = [
  { key: "privacy", titleBn: "প্রাইভেসি পলিসি", titleEn: "Privacy Policy", bodyBn: "## আপনার তথ্য\nআমরা আপনার যোগাযোগের তথ্য শুধুমাত্র আপনার সাথে যোগাযোগের জন্য ব্যবহার করি।", bodyEn: "## Your data\nWe only use your contact information to communicate with you.", updatedAtBn: "১ জানুয়ারি, ২০২৬", updatedAtEn: "January 1, 2026", visible: true },
  { key: "terms", titleBn: "সার্ভিস শর্তাবলি", titleEn: "Terms of Service", bodyBn: "## শর্তাবলি\nআমাদের সেবা ব্যবহার করে আপনি এই শর্তাবলিতে সম্মত হচ্ছেন।", bodyEn: "## Terms\nBy using our services you agree to these terms.", updatedAtBn: "১ জানুয়ারি, ২০২৬", updatedAtEn: "January 1, 2026", visible: true },
  { key: "cookie", titleBn: "কুকি নোটিশ", titleEn: "Cookie Notice", bodyBn: "## কুকি\nআমরা অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করি।", bodyEn: "## Cookies\nWe use cookies to improve your experience.", updatedAtBn: "১ জানুয়ারি, ২০২৬", updatedAtEn: "January 1, 2026", visible: true },
  { key: "refund", titleBn: "রিফান্ড পলিসি", titleEn: "Refund Policy", bodyBn: "## রিফান্ড\nপ্রজেক্ট শুরু হওয়ার আগে জমা দেওয়া অগ্রিম সম্পূর্ণ ফেরত দেওয়া হয়।", bodyEn: "## Refunds\nAdvances paid before project start are fully refundable.", updatedAtBn: "১ জানুয়ারি, ২০২৬", updatedAtEn: "January 1, 2026", visible: true },
];

export const DEFAULT_CONTENT_CONFIG: ContentConfig = {
  visible: true,
  faqSectionTitleBn: "প্রশ্নোত্তর",
  faqSectionTitleEn: "Frequently Asked Questions",
  faqSectionSubtitleBn: "সাধারণ প্রশ্নের উত্তর খুঁজুন",
  faqSectionSubtitleEn: "Find answers to common questions",
  faqCategories: DEFAULT_FAQ_CATEGORIES,
  faqItems: DEFAULT_FAQ_ITEMS,
  searchScope: DEFAULT_SEARCH_SCOPE,
  searchPlaceholderBn: "সাইটে খুঁজুন...",
  searchPlaceholderEn: "Search the site...",
  legalPages: DEFAULT_LEGAL,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isText(value: unknown, max = MAX_SHORT, allowEmpty = false): value is string {
  return typeof value === "string" && value.length <= max && (allowEmpty || value.trim().length > 0);
}
function isId(value: unknown): boolean {
  return isText(value, 80);
}
function isSlug(value: unknown): boolean {
  return typeof value === "string" && value.length <= 50 && /^[a-z0-9_-]+$/.test(value);
}
function validateCategories(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 20) return false;
  return value.every((item) => isRecord(item) && isId(item.id) && isSlug(item.value) && isText(item.labelBn) && isText(item.labelEn) && typeof item.visible === "boolean");
}
function validateFaqItems(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 100) return false;
  return value.every((item) => isRecord(item) && isId(item.id) && isText(item.category, 80, true) && isText(item.questionBn) && isText(item.questionEn) && isText(item.answerBn, 5000) && isText(item.answerEn, 5000) && typeof item.visible === "boolean");
}
function validateSearchScope(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 30) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    const w = Number(item.weight);
    return isId(item.id) && isText(item.value) && isText(item.labelBn) && isText(item.labelEn) && Number.isFinite(w) && w >= 0 && w <= 100 && typeof item.enabled === "boolean";
  });
}
function validateLegal(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 20) return false;
  return value.every((item) => isRecord(item) && isId(item.key) && isText(item.titleBn) && isText(item.titleEn) && isText(item.bodyBn, MAX_BODY, true) && isText(item.bodyEn, MAX_BODY, true) && isText(item.updatedAtBn, MAX_SHORT, true) && isText(item.updatedAtEn, MAX_SHORT, true) && typeof item.visible === "boolean");
}

export function validateContentConfig(input: unknown): ContentConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!isText(input.faqSectionTitleBn) || !isText(input.faqSectionTitleEn)) return null;
  if (!isText(input.faqSectionSubtitleBn, MAX_SHORT, true) || !isText(input.faqSectionSubtitleEn, MAX_SHORT, true)) return null;
  if (!validateCategories(input.faqCategories)) return null;
  if (!validateFaqItems(input.faqItems)) return null;
  if (!validateSearchScope(input.searchScope)) return null;
  if (!isText(input.searchPlaceholderBn, MAX_SHORT, true) || !isText(input.searchPlaceholderEn, MAX_SHORT, true)) return null;
  if (!validateLegal(input.legalPages)) return null;
  return input as unknown as ContentConfig;
}
