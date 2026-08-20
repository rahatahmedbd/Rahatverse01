import type {
  PortfolioCategory,
  PortfolioConfig,
  PortfolioProject,
  PortfolioProjectStatus,
  PortfolioSectionContent,
} from "@/types/portfolio";

const MAX_SHORT = 260;
const MAX_TEXT = 2000;

const DEFAULT_SECTION: PortfolioSectionContent = {
  badgeBn: "🚀 আমার প্রজেক্ট ও কেস স্টাডি",
  badgeEn: "🚀 Projects & Case Studies",
  titleBn: "বাস্তব প্রজেক্ট ও সমাধান",
  titleEn: "Featured Work & Case Studies",
  subtitleBn: "আধুনিক ওয়েব প্রযুক্তি, পরিষ্কার কোড ও ইউজার-কেন্দ্রিক ডিজাইনের মাধ্যমে তৈরি বাস্তব প্রজেক্টসমূহ",
  subtitleEn: "Real-world web solutions built with modern technology, clean architecture, and user-centric design",
};

const DEFAULT_CATEGORIES: PortfolioCategory[] = [
  { id: "pcat-all", value: "all", labelBn: "সব প্রজেক্ট", labelEn: "All Work", visible: true },
  { id: "pcat-portfolio", value: "portfolio", labelBn: "পোর্টফোলিও", labelEn: "Portfolio", visible: true },
  { id: "pcat-blood", value: "blood-donation", labelBn: "রক্তদান ও সমাজসেবা", labelEn: "Blood Donation", visible: true },
  { id: "pcat-education", value: "education", labelBn: "শিক্ষা ও এডুটেক", labelEn: "Education", visible: true },
  { id: "pcat-ecommerce", value: "ecommerce", labelBn: "ই-কমার্স ও ব্যবসা", labelEn: "E-Commerce", visible: true },
];

const DEFAULT_PROJECTS: PortfolioProject[] = [
  {
    id: "proj-rahatverse",
    status: "live",
    title: "RahatVerse — Complete Personal Ecosystem & CMS",
    titleBn: "রাহাতভার্স — সম্পূর্ণ ব্যক্তিগত ইকোসিস্টেম ও CMS",
    description: "A production-grade multilingual portfolio and CMS built with Next.js 16, TypeScript, Tailwind CSS, Supabase, and Cloudinary.",
    descriptionBn: "Next.js 16, TypeScript, Tailwind CSS, Supabase ও Cloudinary দিয়ে তৈরি মাল্টি-ল্যাংগুয়েজ পোর্টফোলিও এবং অ্যাডমিন ড্যাশবোর্ড।",
    longDescription:
      "My own digital home, designed and built end-to-end as a personal project. RahatVerse is a bilingual (Bengali–English) portfolio with a full admin CMS behind it: blog publishing, a dynamic photo gallery with Cloudinary image optimization, service packages with a live order wizard, FAQ and newsletter management, and an on-site AI assistant. The stack is Next.js 16 App Router with server-side rendering, TypeScript, Tailwind CSS, Supabase (PostgreSQL, authentication and file storage) and next-intl for localization, plus automated technical SEO — canonical URLs, hreflang, sitemap, robots.txt and a linked JSON-LD entity graph. Deployed on Vercel. The site you are browsing right now is the live demo.",
    longDescriptionBn:
      "আমার নিজের ডিজিটাল ঠিকানা — শুরু থেকে শেষ পর্যন্ত সম্পূর্ণ নিজে ডিজাইন ও ডেভেলপ করা ব্যক্তিগত প্রজেক্ট। রাহাতভার্স একটি দ্বিভাষিক (বাংলা–ইংরেজি) পোর্টফোলিও, যার পেছনে রয়েছে সম্পূর্ণ অ্যাডমিন CMS: ব্লগ পাবলিশিং, Cloudinary ইমেজ অপটিমাইজেশনসহ ডাইনামিক ফটো গ্যালারি, লাইভ অর্ডার উইজার্ডসহ সার্ভিস প্যাকেজ, FAQ ও নিউজলেটার ব্যবস্থাপনা এবং সাইটে সংযুক্ত AI অ্যাসিস্ট্যান্ট। টেক স্ট্যাক — সার্ভার-সাইড রেন্ডারিংসহ Next.js 16 App Router, TypeScript, Tailwind CSS, Supabase (PostgreSQL, অথেনটিকেশন ও স্টোরেজ) এবং next-intl লোকালাইজেশন; সাথে স্বয়ংক্রিয় টেকনিক্যাল SEO — ক্যানোনিক্যাল URL, hreflang, সাইটম্যাপ, robots.txt ও JSON-LD এন্টিটি গ্রাফ। Vercel-এ ডিপ্লয় করা। আপনি যে সাইটটি ঘুরছেন, সেটিই এই প্রজেক্টের লাইভ ডেমো।",
    image: "/images/gallery-web.svg",
    tags: ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase", "Cloudinary", "i18n"],
    tagsBn: ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase", "Cloudinary", "i18n"],
    liveUrl: "https://rahatahmed.site",
    githubUrl: "https://github.com/rahatahmedbd/Rahatverse01",
    category: "portfolio",
    featured: true,
    visible: true,
    completedAt: "2026",
  },
  {
    id: "proj-shantichakra",
    status: "live",
    title: "Shantichakra Blood Society — Emergency Donor Directory",
    titleBn: "শান্তিচক্র ব্লাড সোসাইটি — জরুরি রক্তদাতা ডিরেক্টরি",
    description: "The live digital donor directory and emergency blood-request platform I built for Shantichakra Blood Society, the voluntary organization I co-founded in Sunamganj.",
    descriptionBn: "আমার সহ-প্রতিষ্ঠিত স্বেচ্ছাসেবী সংগঠন শান্তিচক্র ব্লাড সোসাইটির জন্য তৈরি লাইভ ডিজিটাল রক্তদাতা ডিরেক্টরি ও জরুরি রক্ত-অনুরোধ প্ল্যাটফর্ম।",
    longDescription:
      "Shantichakra Blood Society is a voluntary blood-donation organization I helped establish in Sunamganj in 2025, where I serve as General Secretary. This platform is now live and makes emergency donor discovery faster: registered donors searchable by blood group, district and upazila; emergency blood-request posting with request tracking; a blood-compatibility guide; SOS share messages for WhatsApp/SMS/Facebook; a donation eligibility checker and before/after donation guide; and a quick-assistance wizard that routes visitors to the right service in three questions. The society is active across Sylhet division with a goal of expanding nationwide — the site shows live coverage stats and a Bangladesh division map. Built with Next.js, React, Supabase and Tailwind CSS, with Cloudinary for donor photos.",
    longDescriptionBn:
      "শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জে ২০২৫ সালে প্রতিষ্ঠিত একটি স্বেচ্ছাসেবী রক্তদান সংগঠন, যেখানে আমি সাধারণ সম্পাদক হিসেবে দাতা ব্যবস্থাপনা ও সমন্বয় করি। এই প্ল্যাটফর্মটি এখন লাইভ — জরুরি মুহূর্তে রক্তদাতা খুঁজতে: রক্তের গ্রুপ, জেলা ও উপজেলা দিয়ে নিবন্ধিত দাতা অনুসন্ধান; রোগীর তথ্যসহ জরুরি রক্তের অনুরোধ পোস্ট ও ট্র্যাকিং; রক্ত সামঞ্জস্যতা গাইড; WhatsApp/SMS/Facebook-এর জন্য প্রস্তুত SOS শেয়ার মেসেজ; রক্তদান যোগ্যতা যাচাই ও দানের আগে-পরে গাইড; আর ৩টি প্রশ্নে সঠিক সেবায় পৌঁছে দেওয়া দ্রুত সহায়তা উইজার্ড। সংগঠনটি সিলেট বিভাগ জুড়ে সক্রিয় এবং সারা দেশে সম্প্রসারণের লক্ষ্যে কাজ করছে — সাইটে লাইভ কভারেজ পরিসংখ্যান ও বাংলাদেশের বিভাগ-ম্যাপ রয়েছে। টেক স্ট্যাক: Next.js, React, Supabase ও Tailwind CSS; দাতাদের ছবি Cloudinary-তে।",
    image: "",
    embedUrl: "https://shantichakrabloodsociety.rahatahmed.site/",
    tags: ["Next.js", "React", "Supabase", "Tailwind CSS", "Cloudinary", "Emergency Requests"],
    tagsBn: ["Next.js", "React", "Supabase", "Tailwind CSS", "Cloudinary", "জরুরি অনুরোধ"],
    liveUrl: "https://shantichakrabloodsociety.rahatahmed.site/",
    githubUrl: "https://github.com/rahatahmedbd",
    category: "blood-donation",
    featured: true,
    visible: true,
    completedAt: "2026",
  },
  {
    id: "proj-porasathi",
    status: "live",
    title: "PoraSathi — Tuition Marketplace for Teachers & Students",
    titleBn: "পড়াসাথী — শিক্ষক ও শিক্ষার্থী খোঁজার টিউশন মার্কেটপ্লেস",
    description: "A live tuition marketplace where students and guardians find verified teachers, and teachers find tuition opportunities — with requests, messaging and schedule management in one place.",
    descriptionBn: "শিক্ষার্থী ও অভিভাবক যেখানে যাচাইকৃত শিক্ষক খোঁজেন, শিক্ষকরা পান টিউশন সুযোগ — অনুরোধ, মেসেজ ও সময়সূচি ব্যবস্থাপনা এক জায়গায়।",
    longDescription:
      "PoraSathi (পড়াসাথী) is my live tuition-marketplace project for Bangladesh — born directly from my own experience as a private tutor since 2023. Students and guardians can browse teacher profiles without logging in, filter by class, subject, district and medium (online or in-person), then connect safely: controlled requests, messaging, and schedule/session management from a dashboard. Teachers publish profiles with subjects, fees, availability and verification badges, and discover tuition opportunities posted by students. The platform also includes a teacher leaderboard, free study resources, and a safety guide before contact. Built end-to-end with Next.js, React, TypeScript, Tailwind CSS and Supabase.",
    longDescriptionBn:
      "পড়াসাথী বাংলাদেশের জন্য আমার তৈরি লাইভ টিউশন মার্কেটপ্লেস — ২০২৩ সাল থেকে নিজে গৃহশিক্ষক হিসেবে কাজ করার অভিজ্ঞতা থেকেই এর জন্ম। শিক্ষার্থী ও অভিভাবক লগইন ছাড়াই শিক্ষকদের প্রোফাইল দেখতে পারেন এবং ক্লাস, বিষয়, জেলা ও মাধ্যম (অনলাইন/সরাসরি) দিয়ে ফিল্টার করে যুক্ত হতে পারেন — নিয়ন্ত্রিত অনুরোধ, মেসেজ ও ড্যাশবোর্ড থেকে সময়সূচি/সেশন ব্যবস্থাপনা সব এক জায়গায়। শিক্ষকরা বিষয়, ফি, সুবিধা ও ভেরিফিকেশন ব্যাজসহ প্রোফাইল তৈরি করেন এবং শিক্ষার্থীদের পোস্ট করা টিউশন সুযোগ দেখেন। এছাড়া আছে শিক্ষক লিডারবোর্ড, ফ্রি শিক্ষা রিসোর্স এবং যোগাযোগের আগে পড়ার মতো নিরাপত্তা গাইড। শুরু থেকে শেষ পর্যন্ত Next.js, React, TypeScript, Tailwind CSS ও Supabase দিয়ে তৈরি।",
    image: "",
    embedUrl: "https://porasathi.rahatahmed.site/",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Marketplace"],
    tagsBn: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "মার্কেটপ্লেস"],
    liveUrl: "https://porasathi.rahatahmed.site/",
    githubUrl: "https://github.com/rahatahmedbd",
    category: "education",
    featured: true,
    visible: true,
    completedAt: "2026",
  },
];

export const DEFAULT_PORTFOLIO_CONFIG: PortfolioConfig = {
  visible: true,
  section: DEFAULT_SECTION,
  categories: DEFAULT_CATEGORIES,
  projects: DEFAULT_PROJECTS,
};

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

function validateCategories(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 20) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isId(item.id) &&
      isText(item.value, 80) &&
      isText(item.labelBn, MAX_SHORT) &&
      isText(item.labelEn, MAX_SHORT) &&
      typeof item.visible === "boolean"
    );
  });
}

const PROJECT_STATUSES: ReadonlySet<PortfolioProjectStatus> = new Set([
  "live",
  "in-development",
  "concept",
]);

function validateProjects(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 50) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    const tagsOk = Array.isArray(item.tags) && item.tags.every((t) => typeof t === "string");
    const tagsBnOk = !item.tagsBn || (Array.isArray(item.tagsBn) && item.tagsBn.every((t) => typeof t === "string"));
    const longDescOk =
      item.longDescription === undefined || isText(item.longDescription, MAX_TEXT);
    const longDescBnOk =
      item.longDescriptionBn === undefined || isText(item.longDescriptionBn, MAX_TEXT);
    const completedAtOk =
      item.completedAt === undefined || isText(item.completedAt, 40);
    const statusOk =
      item.status === undefined ||
      (typeof item.status === "string" &&
        PROJECT_STATUSES.has(item.status as PortfolioProjectStatus));
    // embedUrl is optional: missing/empty, or an absolute http(s) URL rendered
    // by the card as a live iframe preview.
    const embedOk =
      item.embedUrl === undefined ||
      (typeof item.embedUrl === "string" &&
        (item.embedUrl === "" || /^https?:\/\//i.test(item.embedUrl)) &&
        item.embedUrl.length <= 500);
    return (
      isId(item.id) &&
      isText(item.title, MAX_SHORT) &&
      isText(item.titleBn, MAX_SHORT) &&
      isText(item.description, MAX_TEXT) &&
      isText(item.descriptionBn, MAX_TEXT) &&
      typeof item.image === "string" &&
      embedOk &&
      tagsOk &&
      tagsBnOk &&
      longDescOk &&
      longDescBnOk &&
      completedAtOk &&
      statusOk &&
      typeof item.liveUrl === "string" &&
      typeof item.githubUrl === "string" &&
      typeof item.category === "string" &&
      typeof item.featured === "boolean" &&
      typeof item.visible === "boolean"
    );
  });
}

export function validatePortfolioConfig(input: unknown): PortfolioConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!validateSection(input.section)) return null;
  if (!validateCategories(input.categories)) return null;
  if (!validateProjects(input.projects)) return null;

  return input as unknown as PortfolioConfig;
}
