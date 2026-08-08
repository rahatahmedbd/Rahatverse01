import type {
  PortfolioCategory,
  PortfolioConfig,
  PortfolioProject,
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
    title: "RahatVerse — Complete Personal Ecosystem & CMS",
    titleBn: "রাহাতভার্স — সম্পূর্ণ ব্যক্তিগত ইকোসিস্টেম ও CMS",
    description: "A production-grade multilingual portfolio and CMS built with Next.js 16, TypeScript, Tailwind CSS, Supabase, and Cloudinary.",
    descriptionBn: "Next.js 16, TypeScript, Tailwind CSS, Supabase ও Cloudinary দিয়ে তৈরি মাল্টি-ল্যাংগুয়েজ পোর্টফোলিও এবং অ্যাডমিন ড্যাশবোর্ড।",
    longDescription: "Designed and engineered as a central digital presence featuring blog management, dynamic photo gallery with Cloudinary optimization, SEO automation, client order wizard, and role-based administration.",
    longDescriptionBn: "ব্লগ ম্যানেজমেন্ট, Cloudinary অপটিমাইজেশন সহ ডাইনামিক গ্যালারি, স্বয়ংক্রিয় SEO, ক্লায়েন্ট অর্ডার উইজার্ড এবং অ্যাডমিন প্যানেল সমৃদ্ধ সম্পূর্ণ ডিজিটাল পোর্টফোলিও।",
    image: "https://res.cloudinary.com/kbc3dfnj/image/upload/v1723000000/rahatverse/portfolio-rahatverse.jpg",
    tags: ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase", "Cloudinary", "i18n"],
    tagsBn: ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase", "Cloudinary", "i18n"],
    liveUrl: "https://rahatverse01.vercel.app",
    githubUrl: "https://github.com/rahatahmedbd/Rahatverse01",
    category: "portfolio",
    featured: true,
    visible: true,
    completedAt: "2026",
  },
  {
    id: "proj-shantichakra",
    title: "Shantichakra Blood Society — Digital Donor Directory",
    titleBn: "শান্তিচক্র ব্লাড সোসাইটি — ডিজিটাল রক্তদাতা ডিরেক্টরি",
    description: "A life-saving donor directory and emergency blood request management portal connecting voluntary donors with patients.",
    descriptionBn: "জরুরি রক্তের প্রয়োজনে স্বেচ্ছাসেবক রক্তদাতাদের সাথে রোগীদের দ্রুত সংযোগ স্থাপনের ডিজিটাল প্ল্যাটফর্ম।",
    longDescription: "Features real-time blood group filtering, district-wise donor search, automated notification dispatch, and community awareness blog articles.",
    longDescriptionBn: "রক্তের গ্রুপভিত্তিক ফিল্টারিং, জেলাভিত্তিক রক্তদাতা সন্ধান, জরুরি নোটিফিকেশন সিস্টেম এবং সচেতনতামূলক ব্লগ আর্টিকেল ফিচার সমৃদ্ধ।",
    image: "https://res.cloudinary.com/kbc3dfnj/image/upload/v1723000000/rahatverse/portfolio-shantichakra.jpg",
    tags: ["Next.js", "React", "Supabase", "Tailwind CSS", "Real-time Alerts"],
    tagsBn: ["Next.js", "React", "Supabase", "Tailwind CSS", "Real-time Alerts"],
    liveUrl: "https://rahatverse01.vercel.app/bn/experience",
    githubUrl: "https://github.com/rahatahmedbd",
    category: "blood-donation",
    featured: true,
    visible: true,
    completedAt: "2025",
  },
  {
    id: "proj-educare",
    title: "EduCare — Interactive Tutoring & Student Management",
    titleBn: "এডুকেয়ার — ইন্টারঅ্যাক্টিভ টিউটরিং ও স্টুডেন্ট ট্র্যাকার",
    description: "An educational management solution designed for private tutors to organize batch schedules, student progress, and lecture notes.",
    descriptionBn: "শিক্ষক ও শিক্ষার্থীদের ব্যাচ শিডিউল, উপস্থিতি, পরীক্ষার অগ্রগতি এবং নোটস ব্যবস্থাপনার আধুনিক প্ল্যাটফর্ম।",
    longDescription: "Includes attendance tracking, exam performance visualization, PDF resource distribution, and direct parent communication channels.",
    longDescriptionBn: "উপস্থিতি ট্র্যাকিং, পরীক্ষার ফলাফল বিশ্লেষণ, স্টাডি ম্যাটেরিয়াল বিতরণ এবং অভিভাবক যোগাযোগের সুবিধা সম্বলিত সিস্টেম।",
    image: "https://res.cloudinary.com/kbc3dfnj/image/upload/v1723000000/rahatverse/portfolio-educare.jpg",
    tags: ["React", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"],
    tagsBn: ["React", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "https://github.com/rahatahmedbd",
    category: "education",
    featured: true,
    visible: true,
    completedAt: "2025",
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

function validateProjects(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 50) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    const tagsOk = Array.isArray(item.tags) && item.tags.every((t) => typeof t === "string");
    const tagsBnOk = !item.tagsBn || (Array.isArray(item.tagsBn) && item.tagsBn.every((t) => typeof t === "string"));
    return (
      isId(item.id) &&
      isText(item.title, MAX_SHORT) &&
      isText(item.titleBn, MAX_SHORT) &&
      isText(item.description, MAX_TEXT) &&
      isText(item.descriptionBn, MAX_TEXT) &&
      typeof item.image === "string" &&
      tagsOk &&
      tagsBnOk &&
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
