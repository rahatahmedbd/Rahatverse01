import type {
  BloodActivity,
  BloodActivityIconName,
  BloodCoverageArea,
  BloodSocietyConfig,
  BloodStat,
  ExperienceConfig,
  ExperienceIconName,
  ExperienceItem,
  ExperienceSectionContent,
  ExperienceStatus,
  MemorialConfig,
  MemorialRole,
  MemorialRoleIconName,
} from "@/types/experience";

// ── Default Experience / Blood / Memorial Config ───────
// These values preserve the original public content when Supabase is not
// configured or before migration 015 has been applied.

const MAX_TEXT = 5_000;
const MAX_SHORT = 260;

const DEFAULT_EXPERIENCE_SECTION: ExperienceSectionContent = {
  badgeBn: "💼 কর্মজীবন ও উদ্যোগ",
  badgeEn: "💼 Experience & Initiatives",
  titleBn: "অভিজ্ঞতা ও প্রতিষ্ঠান",
  titleEn: "Experience & Organizations",
  subtitleBn: "শিক্ষা, সমাজসেবা এবং প্রযুক্তির ক্ষেত্রে আমার প্রতিষ্ঠিত সংগঠন ও ভূমিকাসমূহ",
  subtitleEn: "Organizations and roles in education, social service, and technology",
};

const DEFAULT_BLOOD_SECTION: ExperienceSectionContent = {
  badgeBn: "🩸 রক্তই জীবন",
  badgeEn: "🩸 Blood is Life",
  titleBn: "শান্তিচক্র ব্লাড সোসাইটি",
  titleEn: "Shantichakra Blood Society",
  subtitleBn: "সুনামগঞ্জ ভিত্তিক একটি স্বেচ্ছাসেবী রক্তদান সংগঠন — যেখানে প্রতিটি ফোঁটা রক্ত একটি জীবন বাঁচায়",
  subtitleEn: "A voluntary blood donation organization based in Sunamganj",
};

const DEFAULT_MEMORIAL_SECTION: ExperienceSectionContent = {
  badgeBn: "🕯️ স্মৃতিতে অম্লান",
  badgeEn: "🕯️ Eternal Memory",
  titleBn: "শ্রদ্ধাঞ্জলি",
  titleEn: "Tribute",
  subtitleBn: "তাঁর সততা, নেতৃত্ব ও মানুষের প্রতি ভালোবাসা আজও হাজারো মানুষের হৃদয়ে অম্লান",
  subtitleEn: "His honesty, leadership, and love for people remain eternal in thousands of hearts",
};

const defaultExperienceItems: ExperienceItem[] = [
  {
    id: "exp-fs-coaching",
    icon: "Building2",
    titleBn: "FS কোচিং সেন্টার",
    titleEn: "FS Coaching Center",
    roleBn: "প্রতিষ্ঠাতা ও পরিচালক",
    roleEn: "Founder & Director",
    periodBn: "প্রতিষ্ঠিত ৩১ ডিসেম্বর, ২০২৪ — সাময়িক বন্ধ",
    periodEn: "Established Dec 31, 2024 — Temporarily Paused",
    status: "paused",
    descriptionBn:
      "গ্রামের গরিব, দরিদ্র ও অসহায় মেধাবী শিক্ষার্থীদের অত্যন্ত সুলভ মূল্যে মানসম্মত শিক্ষা প্রদানের লক্ষ্যে জীবদাড়া বাজারে FS কোচিং সেন্টার প্রতিষ্ঠা করি।",
    descriptionEn:
      "Founded FS Coaching Center to provide quality education at affordable prices for underprivileged students in Jibdara Bazar.",
    details: [
      {
        id: "fs-location",
        labelBn: "ঠিকানা",
        labelEn: "Location",
        valueBn: "জীবদাড়া বাজার, শান্তিগঞ্জ, সুনামগঞ্জ",
        valueEn: "Jibdara Bazar, Shantiganj, Sunamganj",
      },
      {
        id: "fs-classes",
        labelBn: "শ্রেণি",
        labelEn: "Classes",
        valueBn: "৬ষ্ঠ — ১০ম শ্রেণি",
        valueEn: "Class 6 — 10",
      },
      {
        id: "fs-duration",
        labelBn: "সময়কাল",
        labelEn: "Duration",
        valueBn: "প্রায় ১ বছর সফল পরিচালনা",
        valueEn: "~1 year of successful operation",
      },
    ],
    link: "",
  },
  {
    id: "exp-helping-hand",
    icon: "Users",
    titleBn: "হেল্পিং হ্যান্ড অর্গানাইজেশন",
    titleEn: "Helping Hand Organization",
    roleBn: "প্রতিষ্ঠাতা",
    roleEn: "Founder",
    periodBn: "২০২৩ — সাময়িক বন্ধ",
    periodEn: "2023 — Temporarily Paused",
    status: "paused",
    descriptionBn:
      "গরিব, দুঃখী ও অসহায় মানুষের পাশে দাঁড়ানোর লক্ষ্যে ২০২৩ সালের শেষের দিকে হেল্পিং হ্যান্ড অর্গানাইজেশন প্রতিষ্ঠা করি।",
    descriptionEn:
      "Founded Helping Hand Organization in late 2023 to support poor and helpless people in the community.",
    details: [
      {
        id: "hh-purpose",
        labelBn: "উদ্দেশ্য",
        labelEn: "Purpose",
        valueBn: "দরিদ্র ও অসহায় মানুষদের সহায়তা",
        valueEn: "Support for the poor and helpless",
      },
    ],
    link: "https://www.facebook.com/share/p/1JDAkxehvJ/",
  },
  {
    id: "exp-tutor",
    icon: "GraduationCap",
    titleBn: "গৃহশিক্ষক",
    titleEn: "Private Tutor",
    roleBn: "শিক্ষক",
    roleEn: "Teacher",
    periodBn: "২০২৩ — বর্তমান",
    periodEn: "2023 — Present",
    status: "active",
    descriptionBn: "ক্লাস নাইন থেকে শুরু করে ৭ম, ৮ম এবং ৯ম শ্রেণির শিক্ষার্থীদের একাডেমিক পাঠদান করি।",
    descriptionEn:
      "Teaching academic subjects to students of class 7, 8, and 9 since class 9 myself.",
    details: [],
    link: "",
  },
  {
    id: "exp-bncc",
    icon: "Shield",
    titleBn: "BNCC ক্যাডেট",
    titleEn: "BNCC Cadet",
    roleBn: "সক্রিয় ক্যাডেট",
    roleEn: "Active Cadet",
    periodBn: "বর্তমান",
    periodEn: "Present",
    status: "active",
    descriptionBn:
      "বাংলাদেশ ন্যাশনাল ক্যাডেট কোরের একজন সক্রিয় ক্যাডেট হিসেবে শৃঙ্খলা, নেতৃত্ব ও দেশপ্রেমের চর্চা করছি।",
    descriptionEn:
      "Active cadet of Bangladesh National Cadet Corps, practicing discipline, leadership, and patriotism.",
    details: [
      { id: "bncc-no", labelBn: "ক্যাডেট নং", labelEn: "Cadet No", valueBn: "25071152", valueEn: "25071152" },
    ],
    link: "",
  },
  {
    id: "exp-content",
    icon: "Video",
    titleBn: "কনটেন্ট ক্রিয়েটর",
    titleEn: "Content Creator",
    roleBn: "YouTube · TikTok",
    roleEn: "YouTube · TikTok",
    periodBn: "সক্রিয়",
    periodEn: "Active",
    status: "active",
    descriptionBn:
      "শিক্ষা, প্রযুক্তি ও সামাজিক সচেতনতা নিয়ে বিভিন্ন প্ল্যাটফর্মে কনটেন্ট তৈরি করি।",
    descriptionEn:
      "Creating content on education, technology, and social awareness across multiple platforms.",
    details: [],
    link: "",
  },
];

const defaultBloodStats: BloodStat[] = [
  { id: "stat-donations", value: 4, text: "", suffix: "", labelBn: "বার রক্তদান", labelEn: "Donations" },
  { id: "stat-group", value: null, text: "A+", suffix: "", labelBn: "আমার রক্তের গ্রুপ", labelEn: "My Blood Group" },
  { id: "stat-founded", value: 2025, text: "", suffix: "", labelBn: "প্রতিষ্ঠার সাল", labelEn: "Founded" },
  { id: "stat-lives", value: 100, text: "", suffix: "+", labelBn: "জীবন বাঁচানোর অঙ্গীকার", labelEn: "Lives Committed" },
];

const defaultBloodActivities: BloodActivity[] = [
  {
    id: "act-donor",
    icon: "Users",
    titleBn: "রক্তদাতা ব্যবস্থাপনা",
    titleEn: "Donor Management",
    descriptionBn: "জরুরি মুহূর্তে দ্রুত রক্তদাতা খুঁজে পাওয়া নিশ্চিত করা",
    descriptionEn: "Ensuring quick access to blood donors in emergencies",
  },
  {
    id: "act-volunteer",
    icon: "MessageCircle",
    titleBn: "স্বেচ্ছাসেবক সমন্বয়",
    titleEn: "Volunteer Coordination",
    descriptionBn: "সংগঠনের স্বেচ্ছাসেবকদের কার্যক্রম পরিচালনা ও প্রশিক্ষণ",
    descriptionEn: "Managing and training organization volunteers",
  },
  {
    id: "act-awareness",
    icon: "Heart",
    titleBn: "সচেতনতা প্রচারাভিযান",
    titleEn: "Awareness Campaigns",
    descriptionBn: "রক্তদানের গুরুত্ব সম্পর্কে জনসাধারণকে সচেতন করা",
    descriptionEn: "Raising public awareness about blood donation",
  },
  {
    id: "act-emergency",
    icon: "Siren",
    titleBn: "জরুরি সহায়তা",
    titleEn: "Emergency Support",
    descriptionBn: "২৪/৭ জরুরি রক্তের প্রয়োজনে সহায়তা প্রদান",
    descriptionEn: "24/7 emergency blood assistance",
  },
  {
    id: "act-camp",
    icon: "Droplets",
    titleBn: "ব্লাড ক্যাম্প",
    titleEn: "Blood Camps",
    descriptionBn: "নিয়মিত রক্তদান ক্যাম্প আয়োজন ও পরিচালনা",
    descriptionEn: "Regular blood donation camps organization",
  },
  {
    id: "act-db",
    icon: "Database",
    titleBn: "ডোনার ডেটাবেস",
    titleEn: "Donor Database",
    descriptionBn: "নিয়মিত দাতাদের তথ্য সংগ্রহ ও ব্যবস্থাপনা",
    descriptionEn: "Regular donor information collection and management",
  },
];

const defaultCoverageAreas: BloodCoverageArea[] = [
  { id: "cov-sunamganj", nameBn: "সুনামগঞ্জ সদর", nameEn: "Sunamganj Sadar" },
  { id: "cov-shantiganj", nameBn: "শান্তিগঞ্জ", nameEn: "Shantiganj" },
  { id: "cov-jamalganj", nameBn: "জামালগঞ্জ", nameEn: "Jamalganj" },
  { id: "cov-tahirpur", nameBn: "তাহিরপুর", nameEn: "Tahirpur" },
  { id: "cov-derai", nameBn: "দিরাই", nameEn: "Derai" },
  { id: "cov-dowarabazar", nameBn: "দোয়ারাবাজার", nameEn: "Dowarabazar" },
];

const DEFAULT_BLOOD_CONFIG: BloodSocietyConfig = {
  section: DEFAULT_BLOOD_SECTION,
  roleBadgeBn: "আমার ভূমিকা",
  roleBadgeEn: "My Role",
  roleTitleBn: "সহ-প্রতিষ্ঠাতা ও সাধারণ সম্পাদক",
  roleTitleEn: "Co-Founder & General Secretary",
  roleBodyBn:
    "২০২৫ সালে শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ প্রতিষ্ঠায় সক্রিয় ভূমিকা রাখি এবং বর্তমানে সাধারণ সম্পাদক হিসেবে রক্তদাতা ব্যবস্থাপনা, স্বেচ্ছাসেবক সমন্বয় ও সচেতনতামূলক কার্যক্রম পরিচালনার দায়িত্ব পালন করছি।",
  roleBodyEn:
    "Played an active role in establishing Shantichakra Blood Society Sunamganj in 2025, currently serving as General Secretary managing donor coordination, volunteer management, and awareness campaigns.",
  stats: defaultBloodStats,
  activitiesSectionTitleBn: "আমাদের কার্যক্রম",
  activitiesSectionTitleEn: "Our Activities",
  activities: defaultBloodActivities,
  cta: {
    headingBn: "রক্তদানে আগ্রহী?",
    headingEn: "Interested in Donating?",
    bodyBn: "আপনার একটু সাহায্য কারো পরিবারের হাসি ফিরিয়ে আনতে পারে।",
    bodyEn: "Your help can bring a smile back to someone's family.",
    buttonLabelBn: "ফেসবুক গ্রুপে জয়েন করুন",
    buttonLabelEn: "Join Facebook Group",
    buttonHref: "https://www.facebook.com/share/g/192g4S4brD/",
    duaBn: "নিশ্চয়ই আমরা আল্লাহর জন্য এবং নিশ্চয়ই আমরা তাঁর দিকেই ফিরে যাব",
    duaEn: "Indeed we belong to Allah, and indeed to Him we will return",
    duaArabic: "۞ ইন্না লিল্লাহি ওয়া ইন্না ইলাইহি রাজিউন ۞",
  },
  emergency: {
    hotlineBn: "জরুরি রক্ত হটলাইন",
    hotlineEn: "Emergency Blood Hotline",
    hotlineNumber: "+880 1XXX-XXXXXX",
    whatsappLink: "https://wa.me/8801XXXXXXXXX",
    whatsappLabelBn: "হোয়াটসঅ্যাপে যোগাযোগ করুন",
    whatsappLabelEn: "Contact on WhatsApp",
    coverageTitleBn: "আমাদের সেবা এলাকা",
    coverageTitleEn: "Our Coverage Area",
    coverageAreas: defaultCoverageAreas,
  },
};

const defaultMemorialRoles: MemorialRole[] = [
  {
    id: "mem-chairman",
    icon: "Building",
    titleBn: "সাবেক চেয়ারম্যান",
    titleEn: "Former Chairman",
    descriptionBn: "শিমুলবাঁক ইউনিয়ন পরিষদ",
    descriptionEn: "Shimulbank Union Parishad",
    periodBn: "০৩/০৫/২০০৩ — ০২/০৮/২০১১",
    periodEn: "03/05/2003 — 02/08/2011",
  },
  {
    id: "mem-president",
    icon: "GraduationCap",
    titleBn: "সাবেক সভাপতি",
    titleEn: "Former President",
    descriptionBn: "সাতগাঁও জীবদাড়া উচ্চ বিদ্যালয়",
    descriptionEn: "Satgaon Jibdara High School",
    periodBn: "২০/০৬/২০২০ — ০৪/০৭/২০২৩",
    periodEn: "20/06/2020 — 04/07/2023",
  },
  {
    id: "mem-madrasa",
    icon: "BookOpen",
    titleBn: "সভাপতি",
    titleEn: "President",
    descriptionBn: "পঞ্চগ্রাম জীবদাড়া মাদ্রাসা",
    descriptionEn: "Panchgaon Jibdara Madrasa",
    periodBn: "",
    periodEn: "",
  },
  {
    id: "mem-deed",
    icon: "Pen",
    titleBn: "ডিড রাইটার",
    titleEn: "Deed Writer",
    descriptionBn: "শান্তিগঞ্জ সাব রেজিস্ট্রার অফিস",
    descriptionEn: "Shantiganj Sub-Registrar Office",
    periodBn: "",
    periodEn: "",
  },
  {
    id: "mem-arbitrator",
    icon: "Scale",
    titleBn: "প্রখ্যাত সালিশ ব্যক্তিত্ব",
    titleEn: "Renowned Arbitrator",
    descriptionBn: "শিমুলবাঁক ইউনিয়ন ও ভাটি অঞ্চল",
    descriptionEn: "Shimulbank Union & Haor Region",
    periodBn: "",
    periodEn: "",
  },
];

const DEFAULT_MEMORIAL_CONFIG: MemorialConfig = {
  section: DEFAULT_MEMORIAL_SECTION,
  epigraphBn: "ইন্না লিল্লাহি ওয়া ইন্না ইলাইহি রাজিউন",
  epigraphEn: "Indeed we belong to Allah, and indeed to Him we will return",
  imagePublicId: "rahatverse/father-photo",
  imageUrl: "https://rahatahmedbd.github.io/assets/images/baba-farid-ahmed.jpg",
  nameBn: "মরহুম জনাব ফরিদ আহমেদ",
  nameEn: "Late Md. Farid Ahmed",
  relationBn: "আমার শ্রদ্ধেয় পিতা",
  relationEn: "My Beloved Father",
  deathBadgeBn: "মৃত্যু: ৩ মে, ২০২৩",
  deathBadgeEn: "Passed: May 3, 2023",
  tributeBn:
    "তিনি শুধু আমার বাবা ছিলেন না — তিনি ছিলেন শিমুলবাঁক ইউনিয়নের একজন উজ্জ্বল নক্ষত্র, একজন কিংবদন্তি। তাঁর সততা, নেতৃত্ব ও মানুষের প্রতি ভালোবাসা আজও হাজারো মানুষের হৃদয়ে অম্লান।",
  tributeEn:
    "He was not just my father — he was a shining star of Shimulbank Union, a legend. His honesty, leadership, and love for people remain eternal in thousands of hearts.",
  rolesTitleBn: "✦ তাঁর পরিচয় ✦",
  rolesTitleEn: "✦ His Identity ✦",
  roles: defaultMemorialRoles,
  developmentsTitleBn: "✦ উন্নয়নমূলক কাজের ঝলক ✦",
  developmentsTitleEn: "✦ Development Work Highlights ✦",
  developmentsBn: [
    "নোয়াখালী — ভীমখালী রাস্তা নির্মাণে অগ্রণী ভূমিকা",
    "শিমুলবাঁক ইউনিয়ন পরিষদ ভবন নির্মাণ ও বাস্তবায়ন",
    "ইউনিয়ন ডিজিটাল সেন্টার (ইউডিসি) চালু",
    "কান্দাগাঁও — মুক্তাখাই দৃষ্টিনন্দন সড়ক নির্মাণ",
    "মুক্তাখাই — চানপুর সড়ক নির্মাণ",
    "নুরপুর — কেশবপুর সড়ক নির্মাণ",
    "নেতাই নদীতে বাঁধ ও ব্রিজ নির্মাণে ভূমিকা",
    "ধনপুর হতে জামালগঞ্জ — সুনামগঞ্জ সংযোগ রাস্তা",
    "জীবদাড়া সিঙ্গি বিলের জাঙ্গাল নির্মাণ",
    "জীবদাড়া — গোভিন্দপুর রাস্তা নির্মাণ",
  ],
  developmentsEn: [
    "Key role in Noakhali-Bheemkhali road construction",
    "Construction of Shimulbank Union Parishad building",
    "Launch of Union Digital Center (UDC)",
    "Kandagaon-Mukhtakhai scenic road construction",
    "Mukhtakhai-Chanpur road construction",
    "Nurpur-Keshabpur road construction",
    "Role in Netai River dam and bridge construction",
    "Dhanpur-Jamalgonj-Sunamganj connecting road",
    "Jibdara-Singi Beel canal construction",
    "Jibdara-Gobindapur road construction",
  ],
  developmentsMoreBn: "এবং আরও অনেক উন্নয়নমূলক কাজ...",
  developmentsMoreEn: "And many more development works...",
  duaBn: "আল্লাহ পাক যেন আমার বাবার সকল ভালো কাজের বিনিময়ে তাঁকে মাফ করে দেন এবং জান্নাতুল ফেরদাউস দান করেন। আমিন।",
  duaEn: "May Allah forgive my father for all his good deeds and grant him Jannatul Firdaus. Ameen.",
  signedByBn: "— শ্রদ্ধা ও ভালোবাসায়, রাহাত আহমেদ ও পরিবার",
  signedByEn: "— With respect and love, Rahat Ahmed & Family",
};

export const DEFAULT_EXPERIENCE_CONFIG: ExperienceConfig = {
  visible: true,
  experience: {
    section: DEFAULT_EXPERIENCE_SECTION,
    items: defaultExperienceItems,
  },
  blood: DEFAULT_BLOOD_CONFIG,
  memorial: DEFAULT_MEMORIAL_CONFIG,
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

function isSafeUrl(value: unknown): boolean {
  return (
    typeof value === "string" &&
    value.length <= 1_000 &&
    (value === "" ||
      value.startsWith("/") ||
      /^https:\/\//i.test(value) ||
      /^whatsapp:\/\//i.test(value))
  );
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

const EXPERIENCE_ICONS = new Set<ExperienceIconName>([
  "Building2",
  "Users",
  "GraduationCap",
  "Shield",
  "Video",
  "Code",
  "Heart",
  "BookOpen",
  "Award",
  "Briefcase",
  "Star",
  "Globe",
]);
const BLOOD_ICONS = new Set<BloodActivityIconName>([
  "Users",
  "MessageCircle",
  "Heart",
  "Siren",
  "Droplets",
  "Database",
  "MapPin",
  "Phone",
  "Clock",
]);
const MEMORIAL_ICONS = new Set<MemorialRoleIconName>([
  "Building",
  "GraduationCap",
  "BookOpen",
  "Pen",
  "Scale",
  "Star",
  "Landmark",
  "Users",
]);
const STATUSES = new Set<ExperienceStatus>(["active", "paused", "completed"]);

function isExperienceIcon(value: unknown): value is ExperienceIconName {
  return typeof value === "string" && EXPERIENCE_ICONS.has(value as ExperienceIconName);
}
function isBloodIcon(value: unknown): value is BloodActivityIconName {
  return typeof value === "string" && BLOOD_ICONS.has(value as BloodActivityIconName);
}
function isMemorialIcon(value: unknown): value is MemorialRoleIconName {
  return typeof value === "string" && MEMORIAL_ICONS.has(value as MemorialRoleIconName);
}
function isStatus(value: unknown): value is ExperienceStatus {
  return typeof value === "string" && STATUSES.has(value as ExperienceStatus);
}

function validateDetails(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 12) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      isText(item.labelBn, MAX_SHORT) &&
      isText(item.labelEn, MAX_SHORT) &&
      isText(item.valueBn, MAX_SHORT) &&
      isText(item.valueEn, MAX_SHORT)
    );
  });
}

function validateExperienceItems(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 24) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      isExperienceIcon(item.icon) &&
      isText(item.titleBn, MAX_SHORT) &&
      isText(item.titleEn, MAX_SHORT) &&
      isText(item.roleBn, MAX_SHORT) &&
      isText(item.roleEn, MAX_SHORT) &&
      isText(item.periodBn, MAX_SHORT, true) &&
      isText(item.periodEn, MAX_SHORT, true) &&
      isStatus(item.status) &&
      isText(item.descriptionBn, MAX_TEXT, true) &&
      isText(item.descriptionEn, MAX_TEXT, true) &&
      validateDetails(item.details) &&
      isSafeUrl(item.link)
    );
  });
}

function validateBloodStats(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 12) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    const numeric = item.value === null || item.value === undefined ? null : Number(item.value);
    if (numeric !== null && (!Number.isFinite(numeric) || numeric < 0 || numeric > 1_000_000)) {
      return false;
    }
    return (
      isText(item.id, 80) &&
      isText(item.text, 40, true) &&
      isText(item.suffix, 20, true) &&
      isText(item.labelBn, MAX_SHORT) &&
      isText(item.labelEn, MAX_SHORT)
    );
  });
}

function validateBloodActivities(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 24) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      isBloodIcon(item.icon) &&
      isText(item.titleBn, MAX_SHORT) &&
      isText(item.titleEn, MAX_SHORT) &&
      isText(item.descriptionBn, MAX_SHORT) &&
      isText(item.descriptionEn, MAX_SHORT)
    );
  });
}

function validateCoverageAreas(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 30) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      isText(item.nameBn, MAX_SHORT) &&
      isText(item.nameEn, MAX_SHORT)
    );
  });
}

function validateCta(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isText(value.headingBn, MAX_SHORT) &&
    isText(value.headingEn, MAX_SHORT) &&
    isText(value.bodyBn, MAX_SHORT) &&
    isText(value.bodyEn, MAX_SHORT) &&
    isText(value.buttonLabelBn, MAX_SHORT) &&
    isText(value.buttonLabelEn, MAX_SHORT) &&
    isSafeUrl(value.buttonHref) &&
    isText(value.duaBn, MAX_SHORT) &&
    isText(value.duaEn, MAX_SHORT) &&
    isText(value.duaArabic, MAX_SHORT, true)
  );
}

function validateBlood(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (!validateSection(value.section)) return false;
  if (
    !isText(value.roleBadgeBn, MAX_SHORT) ||
    !isText(value.roleBadgeEn, MAX_SHORT) ||
    !isText(value.roleTitleBn, MAX_SHORT) ||
    !isText(value.roleTitleEn, MAX_SHORT) ||
    !isText(value.roleBodyBn, MAX_TEXT) ||
    !isText(value.roleBodyEn, MAX_TEXT) ||
    !isText(value.activitiesSectionTitleBn, MAX_SHORT) ||
    !isText(value.activitiesSectionTitleEn, MAX_SHORT)
  ) {
    return false;
  }
  if (!validateBloodStats(value.stats)) return false;
  if (!validateBloodActivities(value.activities)) return false;
  if (!validateCta(value.cta)) return false;
  const emergency = value.emergency;
  if (!isRecord(emergency)) return false;
  if (
    !isText(emergency.hotlineBn, MAX_SHORT) ||
    !isText(emergency.hotlineEn, MAX_SHORT) ||
    !isText(emergency.hotlineNumber, 40) ||
    !isText(emergency.whatsappLabelBn, MAX_SHORT) ||
    !isText(emergency.whatsappLabelEn, MAX_SHORT) ||
    !isSafeUrl(emergency.whatsappLink) ||
    !isText(emergency.coverageTitleBn, MAX_SHORT) ||
    !isText(emergency.coverageTitleEn, MAX_SHORT) ||
    !validateCoverageAreas(emergency.coverageAreas)
  ) {
    return false;
  }
  return true;
}

function validateMemorialRoles(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 16) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      isMemorialIcon(item.icon) &&
      isText(item.titleBn, MAX_SHORT) &&
      isText(item.titleEn, MAX_SHORT) &&
      isText(item.descriptionBn, MAX_SHORT) &&
      isText(item.descriptionEn, MAX_SHORT) &&
      isText(item.periodBn, MAX_SHORT, true) &&
      isText(item.periodEn, MAX_SHORT, true)
    );
  });
}

function validateStringArray(value: unknown, max: number): boolean {
  if (!Array.isArray(value) || value.length > max) return false;
  return value.every((item) => isText(item, MAX_TEXT));
}

function validateMemorial(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (!validateSection(value.section)) return false;
  if (
    !isText(value.epigraphBn, MAX_SHORT) ||
    !isText(value.epigraphEn, MAX_SHORT) ||
    !isText(value.imagePublicId, 300, true) ||
    !isSafeUrl(value.imageUrl) ||
    !isText(value.nameBn, MAX_SHORT) ||
    !isText(value.nameEn, MAX_SHORT) ||
    !isText(value.relationBn, MAX_SHORT) ||
    !isText(value.relationEn, MAX_SHORT) ||
    !isText(value.deathBadgeBn, MAX_SHORT) ||
    !isText(value.deathBadgeEn, MAX_SHORT) ||
    !isText(value.tributeBn, MAX_TEXT) ||
    !isText(value.tributeEn, MAX_TEXT) ||
    !isText(value.rolesTitleBn, MAX_SHORT) ||
    !isText(value.rolesTitleEn, MAX_SHORT) ||
    !isText(value.developmentsTitleBn, MAX_SHORT) ||
    !isText(value.developmentsTitleEn, MAX_SHORT) ||
    !validateStringArray(value.developmentsBn, 40) ||
    !validateStringArray(value.developmentsEn, 40) ||
    !isText(value.developmentsMoreBn, MAX_SHORT, true) ||
    !isText(value.developmentsMoreEn, MAX_SHORT, true) ||
    !isText(value.duaBn, MAX_TEXT) ||
    !isText(value.duaEn, MAX_TEXT) ||
    !isText(value.signedByBn, MAX_SHORT) ||
    !isText(value.signedByEn, MAX_SHORT)
  ) {
    return false;
  }
  if (!validateMemorialRoles(value.roles)) return false;
  return true;
}

export function validateExperienceConfig(input: unknown): ExperienceConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  const experience = input.experience;
  if (!isRecord(experience)) return null;
  if (!validateSection(experience.section)) return null;
  if (!validateExperienceItems(experience.items)) return null;
  if (!validateBlood(input.blood)) return null;
  if (!validateMemorial(input.memorial)) return null;

  return input as unknown as ExperienceConfig;
}
