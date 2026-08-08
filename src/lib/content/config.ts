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

const PRIVACY_BODY_BN = `## ১. তথ্য সংগ্রহ (Information Collection)
আমরা আমাদের যোগাযোগ ফর্ম, ওয়েবসাইট অর্ডার উইজার্ড এবং নিউজলেটার সাইনআপের মাধ্যমে আপনার নাম, ইমেইল ঠিকানা, ফোন বা হোয়াটসঅ্যাপ নম্বর এবং প্রজেক্ট বিবরণী সংগ্রহ করি।

## ২. তথ্যের ব্যবহার (How We Use Your Data)
সংগৃহীত তথ্য শুধুমাত্র আপনার সাথে যোগাযোগ, প্রজেক্ট কোটেশন প্রদান, কারিগরি সহায়তা এবং আপনার সম্মতিতে নিউজলেটার বা আর্টিকেলের আপডেট পাঠানোর কাজে ব্যবহার করা হয়। আমরা কখনোই কোনো তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বিক্রয় বা হস্তান্তর করি না।

## ৩. ডেটা সুরক্ষা ও তৃতীয় পক্ষ (Data Protection & Third-Party Services)
আমাদের সাইট এবং ডেটাবেস পরিচালনার জন্য আমরা Supabase (ডেটাবেস ও সিকিউরিটি), Cloudinary (মিডিয়া অপটিমাইজেশন), এবং Vercel (হোস্টিং ও SSL এনক্রিপশন) ব্যবহার করি। সমস্ত তথ্য আন্তর্জাতিক ডেটা নিরাপত্তা মানদণ্ড অনুযায়ী সুরক্ষিত রাখা হয়।

## ৪. কুকি ও অ্যানালিটিক্স (Cookies & Analytics)
ওয়েবসাইটের গতি ও পারফরম্যান্স পরিমাপের জন্য আমরা Google Analytics এবং Lighthouse Web Vitals ব্যবহার করি, যা সম্পূর্ণ বেনামী (Anonymous) ব্যবহারকারী পরিসংখ্যান সংগ্রহ করে।

## ৫. আপনার অধিকার ও যোগাযোগ (Your Rights & Contact)
আপনার সংরক্ষিত যেকোনো তথ্য দেখতে, সংশোধন করতে বা মুছে ফেলার অনুরোধ করতে সরাসরি ইমেইল করুন rahatbd20505@gmail.com অথবা হোয়াটসঅ্যাপে যোগাযোগ করুন +880 1626-224878 নম্বরে।`;

const PRIVACY_BODY_EN = `## 1. Information We Collect
We collect personal information including your full name, email address, phone/WhatsApp number, and project details when you interact with our contact forms, service order wizard, or newsletter signup.

## 2. How We Use Your Data
Your information is used strictly to communicate regarding project requirements, provide price estimates, deliver customer support, and (with your explicit consent) send technical newsletter articles. We never sell, trade, or share your personal data with third-party advertisers.

## 3. Data Protection & Third-Party Services
To ensure enterprise-grade security and speed, our services integrate with Supabase (secure database & authentication), Cloudinary (media optimization), and Vercel (cloud hosting & SSL encryption). All data transmission is encrypted.

## 4. Cookies & Performance Analytics
We use Google Analytics and automated Lighthouse Web Vitals to monitor site health and performance. These tools collect anonymized usage data and do not track individual identity.

## 5. Client Rights & Contact Information
You have the right to inspect, update, or request the permanent deletion of your data at any time. Contact us at rahatbd20505@gmail.com or WhatsApp +880 1626-224878 for any privacy-related requests.`;

const TERMS_BODY_BN = `## ১. কাজের পরিধি ও চুক্তি (Freelance Engagement & Scope)
রাহাতভার্স (রাহাত আহমেদ) বাংলাদেশ-ভিত্তিক কাস্টম ওয়েব ডেভেলপমেন্ট, পোর্টফোলিও ডিজাইন এবং ই-কমার্স সলিউশন প্রদান করে। প্রতিটি প্রজেক্ট শুরু হওয়ার পূর্বে ইমেইল বা হোয়াটসঅ্যাপের মাধ্যমে কাজের পরিধি, মূল্য এবং সময়সীমা লিখিতভাবে নির্ধারণ করা হয়।

## ২. পেমেন্ট পদ্ধতি ও শর্তাবলি (Payment Terms & Methods - Bangladesh Context)
**পেমেন্ট মাধ্যম:** আমরা বাংলাদেশী মোবাইল ফিন্যান্সিয়াল সার্ভিস (bKash, Nagad) এবং সরাসরি ব্যাংক ট্রান্সফার (Direct Bank Transfer / EFT) এর মাধ্যমে বাংলাদেশি টাকা (৳) বা মার্কিন ডলারে ($) পেমেন্ট গ্রহণ করি।
**পেমেন্ট শিডিউল:** প্রজেক্ট শুরু করার পূর্বে মোট মূল্যের ৫০% অগ্রিম (Advance Deposit) প্রদান করতে হবে। অবশিষ্ট ৫০% কাজ সম্পন্ন হওয়ার পর এবং ফাইনাল কোড/সাইট ডেলিভারির পূর্বে পরিশোধযোগ্য।

## ৩. রিভিশন পলিসি (Revision & Modification Policy)
প্রতিটি ওয়েবসাইট প্যাকেজের সাথে কাজের চলাকালীন সর্বোচ্চ ৩ বার বিনামূল্যে রিভিশন (UI পরিবর্তন, টেক্সট বা লেআউট সমন্বয়) প্রদান করা হয়। মূল চুক্তির বাইরের কোনো নতুন ফিচার বা অতিরিক্ত কাজের জন্য আলোচনা সাপেক্ষে আলাদা ফি প্রযোজ্য হবে।

## ৪. রিফান্ড ও বাতিল পলিসি (Refund & Cancellation Policy)
প্রজেক্টের কাজ শুরু হওয়ার পূর্বে কোনো কারণে চুক্তি বাতিল করা হলে প্রদত্ত অগ্রিম ১০০% ফেরতযোগ্য। কাজ শুরু হওয়ার পর প্রজেক্ট বাতিল করা হলে সম্পন্ন কাজের অংশ কেটে অবশিষ্ট অর্থ ফেরত দেওয়া হবে। ফাইনাল কোড বা প্রজেক্ট ডেলিভারি সম্পন্ন হওয়ার পর কোনো রিফান্ড প্রযোজ্য হবে না।

## ৫. কোড মালিকানা ও স্বত্বাধিকার (Intellectual Property & Ownership)
সম্পূর্ণ পেমেন্ট পরিশোধের পর প্রজেক্টের সমস্ত কাস্টম সোর্স কোড এবং ডিজাইন অ্যাসেটের পূর্ণ স্বত্বাধিকার ক্লায়েন্টকে হস্তান্তর করা হয়। রাহাতভার্স প্রজেক্টটিকে নিজের পোর্টফোলিও এবং কেস স্টাডিতে প্রদর্শনের অধিকার সংরক্ষণ করে (যদি না প্রজেক্ট শুরুর পূর্বে কোনো NDA বা গোপনীয়তা চুক্তি স্বাক্ষরিত হয়)।`;

const TERMS_BODY_EN = `## 1. Freelance Engagement & Scope
RahatVerse (Rahat Ahmed) operates as a Bangladesh-based professional web development and software engineering studio. Every project commences upon written confirmation (email or WhatsApp) outlining feature specifications, timeline, and package costs.

## 2. Payment Terms & Methods (Bangladesh Context)
**Accepted Methods:** We accept payments via Bangladeshi Mobile Financial Services (**bKash**, **Nagad**) and Direct Bank Transfer / Electronic Fund Transfer in BDT (৳) or USD ($).
**Payment Schedule:** A 50% upfront advance deposit is required prior to initiating design and development. The remaining 50% balance is payable upon satisfactory completion of User Acceptance Testing (UAT) and prior to production deployment or source code handover.

## 3. Revision & Modification Policy
All web development packages include up to **3 rounds of complimentary revisions** during the active development phase (covering layout refinements, text modifications, and minor UI adjustments). Substantial scope expansions or new architectural features outside the original agreement will be billed separately at an agreed rate.

## 4. Refund & Cancellation Policy
**Before Project Start:** Upfront advance deposits are 100% refundable if cancellation is requested prior to code or design commencement.
**During Active Development:** If a project is cancelled while underway, refunds are calculated proportionally based on completed deliverables. No refunds are issued after final delivery and codebase transfer.

## 5. Intellectual Property & Code Ownership
Upon receipt of full 100% payment, total ownership of all custom-developed source code, graphics, and project assets transfers to the client. RahatVerse retains the right to display the completed work in our public portfolio and case studies unless a Non-Disclosure Agreement (NDA) has been signed.`;

const DEFAULT_LEGAL: LegalPage[] = [
  { key: "privacy", titleBn: "প্রাইভেসি পলিসি", titleEn: "Privacy Policy", bodyBn: PRIVACY_BODY_BN, bodyEn: PRIVACY_BODY_EN, updatedAtBn: "৭ আগস্ট, ২০২৬", updatedAtEn: "August 7, 2026", visible: true },
  { key: "privacy-policy", titleBn: "প্রাইভেসি পলিসি", titleEn: "Privacy Policy", bodyBn: PRIVACY_BODY_BN, bodyEn: PRIVACY_BODY_EN, updatedAtBn: "৭ আগস্ট, ২০২৬", updatedAtEn: "August 7, 2026", visible: true },
  { key: "terms", titleBn: "সার্ভিস শর্তাবলি", titleEn: "Terms of Service", bodyBn: TERMS_BODY_BN, bodyEn: TERMS_BODY_EN, updatedAtBn: "৭ আগস্ট, ২০২৬", updatedAtEn: "August 7, 2026", visible: true },
  { key: "terms-of-service", titleBn: "সার্ভিস শর্তাবলি", titleEn: "Terms of Service", bodyBn: TERMS_BODY_BN, bodyEn: TERMS_BODY_EN, updatedAtBn: "৭ আগস্ট, ২০২৬", updatedAtEn: "August 7, 2026", visible: true },
  { key: "cookie", titleBn: "কুকি নোটিশ", titleEn: "Cookie Notice", bodyBn: "## কুকি\nআমরা অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করি।", bodyEn: "## Cookies\nWe use cookies to improve your experience.", updatedAtBn: "৭ আগস্ট, ২০২৬", updatedAtEn: "August 7, 2026", visible: true },
  { key: "refund", titleBn: "রিফান্ড পলিসি", titleEn: "Refund Policy", bodyBn: "## রিফান্ড\nপ্রজেক্ট শুরু হওয়ার আগে জমা দেওয়া অগ্রিম সম্পূর্ণ ফেরত দেওয়া হয়। কাজ শুরু হওয়ার পর সম্পন্ন কাজের অংশ কেটে অবশিষ্ট অর্থ ফেরতযোগ্য।", bodyEn: "## Refunds\nAdvances paid before project start are fully refundable. Refunds during development are prorated based on completed milestones.", updatedAtBn: "৭ আগস্ট, ২০২৬", updatedAtEn: "August 7, 2026", visible: true },
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
