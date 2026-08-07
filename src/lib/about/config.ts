import { IMAGE_IDS } from "@/lib/cloudinary/utils";
import type {
  AboutAchievement,
  AboutBadgeType,
  AboutConfig,
  AboutEducationItem,
  AboutFrameStyle,
  AboutIconName,
  AchievementIconName,
  AchievementRarity,
} from "@/types/about";

// ── Default About Config ───────────────────────────────
// These values preserve the original public content when Supabase is not
// configured or before migration 012 has been applied.

const defaultEducation: AboutEducationItem[] = [
  {
    id: "education-primary-sylhet",
    yearBn: "২০১৬ — ২০১৯",
    yearEn: "2016 — 2019",
    titleBn: "প্রাথমিক পড়াশোনা (সিলেট)",
    titleEn: "Primary Education (Sylhet)",
    institutionBn: "স্কলারস হোম, সিলেট",
    institutionEn: "Scholars Home, Sylhet",
    locationBn: "সিলেট",
    locationEn: "Sylhet",
    descriptionBn: "চতুর্থ শ্রেণি পর্যন্ত সিলেটে থেকে পড়াশোনা করেছি। শহরের বৈচিত্র্যপূর্ণ পরিবেশে নতুন অভিজ্ঞতা অর্জন করি।",
    descriptionEn: "Class 4 onwards, studied in Sylhet. Gained diverse experiences in the city environment.",
    badgeBn: "",
    badgeEn: "",
    badgeType: "outline",
    gpa: "",
  },
  {
    id: "education-psc",
    yearBn: "২০১৯",
    yearEn: "2019",
    titleBn: "PSC — প্রাথমিক শিক্ষা সমাপনী",
    titleEn: "PSC — Primary School Certificate",
    institutionBn: "জীবদাড়া সরকারি প্রাথমিক বিদ্যালয়",
    institutionEn: "Jibdara Govt. Primary School",
    locationBn: "সুনামগঞ্জ",
    locationEn: "Sunamganj",
    descriptionBn: "সুনামগঞ্জে এসে জীবদাড়া সরকারি প্রাথমিক বিদ্যালয় থেকে পিএসসি পরীক্ষায় অংশগ্রহণ করি এবং কৃতিত্বের সাথে উত্তীর্ণ হই।",
    descriptionEn: "Appeared in PSC exam from Sunamganj. Completed primary education with distinction.",
    badgeBn: "",
    badgeEn: "",
    badgeType: "outline",
    gpa: "",
  },
  {
    id: "education-high-school",
    yearBn: "২০২০ — ২০২৩",
    yearEn: "2020 — 2023",
    titleBn: "মাধ্যমিক শিক্ষাজীবন",
    titleEn: "High School Journey",
    institutionBn: "সুনামগঞ্জ সরকারি জুবিলী উচ্চ বিদ্যালয়",
    institutionEn: "Sunamganj Govt. Jubilee High School",
    locationBn: "সুনামগঞ্জ",
    locationEn: "Sunamganj",
    descriptionBn: "বিজ্ঞান ও প্রযুক্তির প্রতি গভীর আগ্রহ তৈরি হয়। পাশাপাশি ওয়েব ডেভেলপমেন্ট শেখা শুরু করি।",
    descriptionEn: "Gained foundational interest in Science, Technology, and Mathematics. Started web development self-study.",
    badgeBn: "",
    badgeEn: "",
    badgeType: "outline",
    gpa: "",
  },
  {
    id: "education-science-fair-2023",
    yearBn: "২০২৩",
    yearEn: "2023",
    titleBn: "৪৫তম জাতীয় বিজ্ঞান মেলা",
    titleEn: "45th National Science Fair",
    institutionBn: "জেলা বিজ্ঞান মেলা, সুনামগঞ্জ",
    institutionEn: "District Science Fair, Sunamganj",
    locationBn: "সুনামগঞ্জ",
    locationEn: "Sunamganj",
    descriptionBn: "৪৫তম জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহে প্রজেক্ট প্রদর্শন করে প্রথম স্থান অর্জন করি।",
    descriptionEn: "Showcased technology project at the 45th National Science and Technology Week. Awarded 1st place.",
    badgeBn: "১ম স্থান",
    badgeEn: "1st Place",
    badgeType: "glow",
    gpa: "",
  },
  {
    id: "education-science-exhibition-2024",
    yearBn: "২০২৪",
    yearEn: "2024",
    titleBn: "৪৪তম বিজ্ঞান প্রদর্শনী ও প্রতিযোগিতা",
    titleEn: "44th Science Exhibition & Competition",
    institutionBn: "আঞ্চলিক পর্যায়",
    institutionEn: "Regional Level",
    locationBn: "আঞ্চলিক",
    locationEn: "Regional",
    descriptionBn: "স্মার্ট সিটি মডেল নিয়ে ৪৪তম বিজ্ঞান প্রদর্শনীতে অংশগ্রহণ ও পুরস্কার লাভ।",
    descriptionEn: "Participated in the 44th Science Exhibition with an innovative smart-city model.",
    badgeBn: "১ম স্থান",
    badgeEn: "1st Place",
    badgeType: "glow",
    gpa: "",
  },
  {
    id: "education-talent-search-2024",
    yearBn: "২০২৪",
    yearEn: "2024",
    titleBn: "সৃজনশীল মেধা অন্বেষণ ২০২৪",
    titleEn: "Creative Talent Search 2024",
    institutionBn: "জাতীয় মেধা অন্বেষণ প্রতিযোগিতা",
    institutionEn: "National Talent Search",
    locationBn: "জাতীয়",
    locationEn: "National",
    descriptionBn: "সৃজনশীল মেধা অন্বেষণ প্রতিযোগিতায় বিজ্ঞান বিভাগে প্রথম স্থান অর্জন।",
    descriptionEn: "Won 1st place in Science category at the Creative Talent Search competition.",
    badgeBn: "১ম স্থান",
    badgeEn: "1st Place",
    badgeType: "glow",
    gpa: "",
  },
  {
    id: "education-ssc",
    yearBn: "২০২৫",
    yearEn: "2025",
    titleBn: "SSC — মাধ্যমিক স্কুল সার্টিফিকেট",
    titleEn: "SSC — Secondary School Certificate",
    institutionBn: "সুনামগঞ্জ সরকারি জুবিলী উচ্চ বিদ্যালয়",
    institutionEn: "Sunamganj Govt. Jubilee High School",
    locationBn: "সুনামগঞ্জ",
    locationEn: "Sunamganj",
    descriptionBn: "বিজ্ঞান বিভাগ থেকে জিপিএ ৫.০০ (গোল্ডেন এ+) অর্জন করে এসএসসি পাস। কৃতী শিক্ষার্থী সংবর্ধনা লাভ।",
    descriptionEn: "Passed SSC from Science group with GPA 5.00 (Golden A+). Honored at Meritorious Student Ceremony.",
    badgeBn: "GPA 5.00 (A+)",
    badgeEn: "GPA 5.00 (A+)",
    badgeType: "glow",
    gpa: "5.00",
  },
  {
    id: "education-hsc-current",
    yearBn: "২০২৫ — বর্তমান",
    yearEn: "2025 — Present",
    titleBn: "HSC — উচ্চ মাধ্যমিক (বিজ্ঞান)",
    titleEn: "HSC — Higher Secondary (Science)",
    institutionBn: "সুনামগঞ্জ সরকারি কলেজ",
    institutionEn: "Sunamganj Govt. College",
    locationBn: "সুনামগঞ্জ",
    locationEn: "Sunamganj",
    descriptionBn: "বর্তমানে সুনামগঞ্জ সরকারি কলেজে এইচএসসি ২য় বর্ষে বিজ্ঞান বিভাগে অধ্যায়নরত। বিএনসিসি ক্যাডেট এবং শান্তিচক্র ব্লাড সোসাইটির সদস্য।",
    descriptionEn: "Currently studying in HSC 2nd Year (Science). Active BNCC cadet (No: 25071152) and Shantichakra Blood Society member.",
    badgeBn: "বর্তমান",
    badgeEn: "Current",
    badgeType: "glow",
    gpa: "",
  },
];

const defaultAchievements: AboutAchievement[] = [
  {
    id: "achievement-ssc-gpa",
    yearBn: "২০২৫",
    yearEn: "2025",
    titleBn: "SSC — জিপিএ ৫.০০ (A+)",
    titleEn: "SSC — GPA 5.00 (A+)",
    descriptionBn: "বিজ্ঞান বিভাগ থেকে জিপিএ ৫.০০ (A+)। শান্তিচক্র ব্লাড সোসাইটি কর্তৃক বিশেষ সম্মাননা।",
    descriptionEn: "Science department, special recognition from Shantichakra Blood Society",
    icon: "Trophy",
    rarity: "legendary",
    unlockCriteriaBn: "SSC-তে GPA 5.00 অর্জন",
    unlockCriteriaEn: "Achieve GPA 5.00 in SSC",
    completedAt: "2025",
    sparkle: true,
    sound: true,
    certificateUrl: "",
    certificatePublicId: "",
  },
  {
    id: "achievement-science-fair-46",
    yearBn: "২০২৫",
    yearEn: "2025",
    titleBn: "৪৬তম বিজ্ঞান মেলা",
    titleEn: "46th National Science Fair",
    descriptionBn: "বিজ্ঞান কুইজে ১ম, প্রজেক্টে ৩য়, অলিম্পিয়াডে ৪র্থ স্থান।",
    descriptionEn: "1st in Quiz, 3rd in Project, 4th in Olympiad",
    icon: "Trophy",
    rarity: "epic",
    unlockCriteriaBn: "জাতীয় বিজ্ঞান মেলায় একাধিক পুরস্কার",
    unlockCriteriaEn: "Earn multiple awards at the national science fair",
    completedAt: "2025",
    sparkle: true,
    sound: false,
    certificateUrl: "",
    certificatePublicId: "",
  },
  {
    id: "achievement-student-honor",
    yearBn: "২০২৫",
    yearEn: "2025",
    titleBn: "কৃতী শিক্ষার্থী সংবর্ধনা",
    titleEn: "Outstanding Student Honor",
    descriptionBn: "A+ প্রাপ্ত তিনজন কৃতী শিক্ষার্থীর অন্যতম। সম্মাননা ক্রেস্ট ও আর্থিক সহায়তা।",
    descriptionEn: "Among 3 top A+ students, received honor crest and financial support",
    icon: "Award",
    rarity: "legendary",
    unlockCriteriaBn: "কৃতী শিক্ষার্থী হিসেবে নির্বাচিত হওয়া",
    unlockCriteriaEn: "Be selected as an outstanding student",
    completedAt: "2025",
    sparkle: true,
    sound: true,
    certificateUrl: "",
    certificatePublicId: "",
  },
  {
    id: "achievement-shantichakra-crest",
    yearBn: "২০২৫",
    yearEn: "2025",
    titleBn: "শান্তিচক্র সম্মাননা ক্রেস্ট",
    titleEn: "Shantichakra Honor Crest",
    descriptionBn: "SSC-তে A+ অর্জনের জন্য শান্তিচক্র ব্লাড সোসাইটি কর্তৃক সম্মাননা স্মারক।",
    descriptionEn: "Received honor crest for achieving A+ in SSC",
    icon: "Medal",
    rarity: "epic",
    unlockCriteriaBn: "A+ ফলাফলের জন্য সম্মাননা পাওয়া",
    unlockCriteriaEn: "Receive recognition for an A+ result",
    completedAt: "2025",
    sparkle: false,
    sound: false,
    certificateUrl: "",
    certificatePublicId: "",
  },
  {
    id: "achievement-talent-search",
    yearBn: "২০২৪",
    yearEn: "2024",
    titleBn: "সৃজনশীল মেধা অন্বেষণ — বিজ্ঞানে ১ম",
    titleEn: "Creative Talent Search — 1st in Science",
    descriptionBn: "সৃজনশীল মেধা অন্বেষণ প্রতিযোগিতায় বিজ্ঞান বিষয়ে প্রথম স্থান।",
    descriptionEn: "First place in Creative Talent Search competition in Science",
    icon: "Star",
    rarity: "rare",
    unlockCriteriaBn: "বিজ্ঞান বিভাগে প্রথম স্থান অর্জন",
    unlockCriteriaEn: "Win first place in the Science category",
    completedAt: "2024",
    sparkle: false,
    sound: false,
    certificateUrl: "",
    certificatePublicId: "",
  },
  {
    id: "achievement-science-exhibition",
    yearBn: "২০২৪",
    yearEn: "2024",
    titleBn: "৪৪তম বিজ্ঞান প্রদর্শনী — ১ম স্থান",
    titleEn: "44th Science Exhibition — 1st Place",
    descriptionBn: "জাতীয় বিজ্ঞান প্রদর্শনীতে দ্বিতীয়বারের মতো প্রথম স্থান অর্জন।",
    descriptionEn: "Second consecutive first place in national science exhibition",
    icon: "Trophy",
    rarity: "epic",
    unlockCriteriaBn: "বিজ্ঞান প্রদর্শনীতে প্রথম স্থান",
    unlockCriteriaEn: "Win first place at a science exhibition",
    completedAt: "2024",
    sparkle: true,
    sound: false,
    certificateUrl: "",
    certificatePublicId: "",
  },
  {
    id: "achievement-science-fair-45",
    yearBn: "২০২৩",
    yearEn: "2023",
    titleBn: "৪৫তম বিজ্ঞান মেলা",
    titleEn: "45th National Science Fair",
    descriptionBn: "বিজ্ঞান কুইজে ১ম, উপস্থিত বক্তৃতায় ২য়, বিজ্ঞান প্রজেক্টে ৩য় স্থান।",
    descriptionEn: "1st in Quiz, 2nd in Speech, 3rd in Science Project",
    icon: "Trophy",
    rarity: "rare",
    unlockCriteriaBn: "জাতীয় বিজ্ঞান মেলায় পুরস্কার অর্জন",
    unlockCriteriaEn: "Earn an award at the national science fair",
    completedAt: "2023",
    sparkle: false,
    sound: false,
    certificateUrl: "",
    certificatePublicId: "",
  },
  {
    id: "achievement-science-fair-42",
    yearBn: "২০২০",
    yearEn: "2020",
    titleBn: "৪২তম বিজ্ঞান মেলা — ১ম স্থান",
    titleEn: "42nd National Science Fair — 1st Place",
    descriptionBn: "জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহে উপজেলা পর্যায়ে প্রথম স্থান অর্জন।",
    descriptionEn: "First ever win at the national science fair, district level",
    icon: "Trophy",
    rarity: "rare",
    unlockCriteriaBn: "প্রথম বিজ্ঞান মেলা জয়",
    unlockCriteriaEn: "Win the first science fair award",
    completedAt: "2020",
    sparkle: false,
    sound: false,
    certificateUrl: "",
    certificatePublicId: "",
  },
  {
    id: "achievement-psc-gpa",
    yearBn: "২০১৯",
    yearEn: "2019",
    titleBn: "PSC — জিপিএ ৫.০০",
    titleEn: "PSC — GPA 5.00",
    descriptionBn: "জিপিএ ৫.০০ পেয়ে PSC পরীক্ষায় উত্তীর্ণ।",
    descriptionEn: "Passed PSC examination with perfect GPA 5.00",
    icon: "Award",
    rarity: "rare",
    unlockCriteriaBn: "PSC পরীক্ষায় GPA 5.00",
    unlockCriteriaEn: "Achieve GPA 5.00 in the PSC examination",
    completedAt: "2019",
    sparkle: false,
    sound: false,
    certificateUrl: "",
    certificatePublicId: "",
  },
];

export const DEFAULT_ABOUT_CONFIG: AboutConfig = {
  visible: true,
  profileImage: {
    url: "",
    publicId: IMAGE_IDS.PROFILE,
    altBn: "রাহাত আহমেদের প্রোফাইল ছবি",
    altEn: "Rahat Ahmed profile photo",
    frame: "amber",
    showStatus: true,
    statusLabelBn: "সক্রিয়",
    statusLabelEn: "Available",
  },
  section: {
    badgeBn: "👤 আমার গল্প",
    badgeEn: "👤 My Story",
    titleBn: "আমার সম্পর্কে",
    titleEn: "About Me",
    subtitleBn: "গ্রাম থেকে শহর, স্বপ্ন থেকে বাস্তব — একটি অবিরাম যাত্রার গল্প",
    subtitleEn: "From village to city, dream to reality — a continuous journey",
  },
  biography: {
    paragraphs: [
      {
        bn: "আমি রাহাত আহমেদ। ২০০৬ সালের ২১ জুন সুনামগঞ্জ জেলার শান্তিগঞ্জ উপজেলার জীবদাড়া গ্রামে আমার জন্ম। প্রকৃতির কোলে বেড়ে ওঠা এই গ্রামই আমাকে শিখিয়েছে স্বপ্ন দেখতে এবং লড়াই করতে।",
        en: "I am Rahat Ahmed. I was born on June 21, 2006 in Jibdara village, Shantiganj, Sunamganj. This village, raised in the lap of nature, taught me to dream and to fight.",
      },
      {
        bn: "বর্তমানে আমি সুনামগঞ্জ সরকারি কলেজে HSC ২য় বর্ষে বিজ্ঞান বিভাগের শিক্ষার্থী। পড়াশোনার পাশাপাশি আমি একজন শিক্ষক, শান্তিচক্র ব্লাড সোসাইটির সহ-প্রতিষ্ঠাতা ও সাধারণ সম্পাদক, এবং BNCC-এর একজন সক্রিয় ক্যাডেট।",
        en: "Currently I am a 2nd year HSC student in the Science department at Sunamganj Government College. Alongside studies, I am a teacher, co-founder and General Secretary of Shantichakra Blood Society, and an active BNCC cadet.",
      },
      {
        bn: "ওয়েব ডেভেলপমেন্ট, আর্টিফিশিয়াল ইন্টেলিজেন্স, কনটেন্ট ক্রিয়েশন এবং সামাজিক সেবা — এই বিষয়গুলো নিয়ে কাজ করতে ভালোবাসি। আমার লক্ষ্য শিক্ষা ও প্রযুক্তির মাধ্যমে সমাজে ইতিবাচক পরিবর্তন আনা।",
        en: "I love working on web development, artificial intelligence, content creation, and social service. My goal is to bring positive change in society through education and technology.",
      },
    ],
    quote: {
      bn: "মানুষের পাশে দাঁড়ানো, শেখা এবং শেখানো — এই তিনটি জিনিস আমাকে এগিয়ে নিয়ে যায়।",
      en: "Standing by people, learning, and teaching — these three things drive me forward.",
    },
    quoteBy: { bn: "— রাহাত আহমেদ", en: "— Rahat Ahmed" },
    interestsTitleBn: "আমার আগ্রহ",
    interestsTitleEn: "My Interests",
  },
  personalInfo: [
    { id: "birth-date", icon: "Calendar", labelBn: "জন্ম তারিখ", labelEn: "Birth Date", valueBn: "২১ জুন, ২০০৬", valueEn: "June 21, 2006" },
    { id: "location", icon: "MapPin", labelBn: "অবস্থান", labelEn: "Location", valueBn: "সুনামগঞ্জ, বাংলাদেশ", valueEn: "Sunamganj, Bangladesh" },
    { id: "blood-group", icon: "Droplets", labelBn: "রক্তের গ্রুপ", labelEn: "Blood Group", valueBn: "A+ Positive", valueEn: "A+ Positive" },
    { id: "education", icon: "GraduationCap", labelBn: "শিক্ষা", labelEn: "Education", valueBn: "HSC ২য় বর্ষ (বিজ্ঞান)", valueEn: "HSC 2nd Year (Science)" },
    { id: "institution", icon: "BookOpen", labelBn: "প্রতিষ্ঠান", labelEn: "Institution", valueBn: "সুনামগঞ্জ সরকারি কলেজ", valueEn: "Sunamganj Govt. College" },
    { id: "bncc-number", icon: "Award", labelBn: "BNCC ক্যাডেট নং", labelEn: "BNCC Cadet No", valueBn: "25071152", valueEn: "25071152" },
  ],
  interests: [
    { id: "web-development", icon: "Code", labelBn: "ওয়েব ডেভেলপমেন্ট", labelEn: "Web Development" },
    { id: "social-service", icon: "Users", labelBn: "সমাজসেবা", labelEn: "Social Service" },
    { id: "education-interest", icon: "BookOpen", labelBn: "শিক্ষা", labelEn: "Education" },
    { id: "blood-donation", icon: "Heart", labelBn: "রক্তদান", labelEn: "Blood Donation" },
  ],
  educationSection: {
    badgeBn: "🎓 একাডেমিক যাত্রা",
    badgeEn: "🎓 Academic Journey",
    titleBn: "শিক্ষাজীবন",
    titleEn: "Education Timeline",
    subtitleBn: "সিলেট থেকে সুনামগঞ্জ — শিক্ষার একটি অবিরাম যাত্রা",
    subtitleEn: "From Sylhet to Sunamganj — a continuous educational journey",
  },
  education: defaultEducation,
  achievementsSection: {
    badgeBn: "🏆 স্বীকৃতি ও পুরস্কার",
    badgeEn: "🏆 Recognition & Awards",
    titleBn: "অর্জনসমূহ",
    titleEn: "Achievements",
    subtitleBn: "বিজ্ঞান, শিক্ষা এবং সমাজসেবায় অর্জিত সম্মাননা ও পুরস্কারসমূহ",
    subtitleEn: "Awards and recognition in science, education, and social service",
  },
  achievements: defaultAchievements,
  achievementStats: [
    { id: "total", labelBn: "মোট অর্জন", labelEn: "Total", value: 9, suffix: "" },
    { id: "first-place", labelBn: "১ম স্থান", labelEn: "1st Places", value: 5, suffix: "×" },
    { id: "gpa", labelBn: "GPA 5.00", labelEn: "GPA 5.00", value: 2, suffix: "×" },
    { id: "science-fairs", labelBn: "বিজ্ঞান মেলা", labelEn: "Science Fairs", value: 4, suffix: "" },
  ],
};

const MAX_TEXT = 5_000;
const MAX_SHORT = 240;
const MAX_ITEMS = 24;
const ALLOWED_ICONS = new Set<AboutIconName>([
  "Calendar",
  "MapPin",
  "Droplets",
  "GraduationCap",
  "BookOpen",
  "Award",
  "Code",
  "Users",
  "Heart",
  "Trophy",
  "Medal",
  "Star",
]);
const ALLOWED_ACHIEVEMENT_ICONS = new Set<AchievementIconName>([
  "Trophy",
  "Medal",
  "Award",
  "Star",
]);
const ALLOWED_RARITIES = new Set<AchievementRarity>([
  "common",
  "rare",
  "epic",
  "legendary",
]);
const ALLOWED_FRAMES = new Set<AboutFrameStyle>([
  "amber",
  "blue",
  "emerald",
  "purple",
  "rose",
]);
const ALLOWED_BADGE_TYPES = new Set<AboutBadgeType>([
  "default",
  "glow",
  "outline",
  "secondary",
  "gradient",
  "success",
  "warning",
  "info",
]);

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

function isSafeUrl(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 1_000 &&
    (value === "" ||
      (value.startsWith("/") && !value.startsWith("//")) ||
      /^https:\/\//i.test(value))
  );
}

function isTextPair(value: unknown, max = MAX_TEXT): boolean {
  return isRecord(value) && isText(value.bn, max) && isText(value.en, max);
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

function validateProfileImage(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isSafeUrl(value.url) &&
    isText(value.publicId, 300) &&
    isText(value.altBn, MAX_SHORT) &&
    isText(value.altEn, MAX_SHORT) &&
    ALLOWED_FRAMES.has(value.frame as AboutFrameStyle) &&
    typeof value.showStatus === "boolean" &&
    isText(value.statusLabelBn, MAX_SHORT) &&
    isText(value.statusLabelEn, MAX_SHORT)
  );
}

function validatePersonalInfo(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 12) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      ALLOWED_ICONS.has(item.icon as AboutIconName) &&
      isText(item.labelBn, MAX_SHORT) &&
      isText(item.labelEn, MAX_SHORT) &&
      isText(item.valueBn, MAX_SHORT) &&
      isText(item.valueEn, MAX_SHORT)
    );
  });
}

function validateInterests(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 12) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      ALLOWED_ICONS.has(item.icon as AboutIconName) &&
      isText(item.labelBn, MAX_SHORT) &&
      isText(item.labelEn, MAX_SHORT)
    );
  });
}

function validateEducation(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > MAX_ITEMS) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      isText(item.yearBn, MAX_SHORT) &&
      isText(item.yearEn, MAX_SHORT) &&
      isText(item.titleBn, MAX_SHORT) &&
      isText(item.titleEn, MAX_SHORT) &&
      isText(item.institutionBn, MAX_SHORT) &&
      isText(item.institutionEn, MAX_SHORT) &&
      isText(item.locationBn, MAX_SHORT) &&
      isText(item.locationEn, MAX_SHORT) &&
      isText(item.descriptionBn, MAX_TEXT) &&
      isText(item.descriptionEn, MAX_TEXT) &&
      isText(item.badgeBn, MAX_SHORT, true) &&
      isText(item.badgeEn, MAX_SHORT, true) &&
      ALLOWED_BADGE_TYPES.has(item.badgeType as AboutBadgeType) &&
      isText(item.gpa, 40, true)
    );
  });
}

function validateAchievements(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > MAX_ITEMS) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      isText(item.yearBn, MAX_SHORT) &&
      isText(item.yearEn, MAX_SHORT) &&
      isText(item.titleBn, MAX_SHORT) &&
      isText(item.titleEn, MAX_SHORT) &&
      isText(item.descriptionBn, MAX_TEXT) &&
      isText(item.descriptionEn, MAX_TEXT) &&
      ALLOWED_ACHIEVEMENT_ICONS.has(item.icon as AchievementIconName) &&
      ALLOWED_RARITIES.has(item.rarity as AchievementRarity) &&
      isText(item.unlockCriteriaBn, MAX_SHORT) &&
      isText(item.unlockCriteriaEn, MAX_SHORT) &&
      isText(item.completedAt, MAX_SHORT) &&
      typeof item.sparkle === "boolean" &&
      typeof item.sound === "boolean" &&
      isSafeUrl(item.certificateUrl) &&
      isText(item.certificatePublicId, 300, true)
    );
  });
}

function validateStats(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 8) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    const numericValue = Number(item.value);
    return (
      isText(item.id, 80) &&
      isText(item.labelBn, MAX_SHORT) &&
      isText(item.labelEn, MAX_SHORT) &&
      Number.isFinite(numericValue) &&
      numericValue >= 0 &&
      numericValue <= 100_000 &&
      isText(item.suffix, 20, true)
    );
  });
}

export function validateAboutConfig(input: unknown): AboutConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!validateProfileImage(input.profileImage)) return null;
  if (!validateSection(input.section) || !validateSection(input.educationSection) || !validateSection(input.achievementsSection)) {
    return null;
  }

  const biography = input.biography;
  if (!isRecord(biography)) return null;
  if (
    !Array.isArray(biography.paragraphs) ||
    biography.paragraphs.length === 0 ||
    biography.paragraphs.length > 12 ||
    !biography.paragraphs.every((paragraph) => isTextPair(paragraph, MAX_TEXT)) ||
    !isTextPair(biography.quote, 500) ||
    !isTextPair(biography.quoteBy, MAX_SHORT) ||
    !isText(biography.interestsTitleBn, MAX_SHORT) ||
    !isText(biography.interestsTitleEn, MAX_SHORT)
  ) {
    return null;
  }

  if (!validatePersonalInfo(input.personalInfo)) return null;
  if (!validateInterests(input.interests)) return null;
  if (!validateEducation(input.education)) return null;
  if (!validateAchievements(input.achievements)) return null;
  if (!validateStats(input.achievementStats)) return null;

  return input as unknown as AboutConfig;
}

