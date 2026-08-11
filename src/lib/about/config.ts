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
    institutionBn: "স্কলারস হোম মেজরটিলা, সিলেট",
    institutionEn: "Scholars Home Majortila, Sylhet",
    locationBn: "সিলেট",
    locationEn: "Sylhet",
    descriptionBn: "পরিবারসহ সিলেটে থেকে চতুর্থ শ্রেণি পর্যন্ত পড়াশোনা করেছি। শহরের প্রতিযোগিতামূলক ও বৈচিত্র্যপূর্ণ শিক্ষা পরিবেশ পড়াশোনার মজবুত ভিত এবং ইংরেজি ও যোগাযোগ দক্ষতা গড়ে দিয়েছে।",
    descriptionEn: "Completed schooling up to class 4 in Sylhet city. A competitive, diverse academic environment that built my foundation in study discipline, English and communication.",
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
    descriptionBn: "পঞ্চম শ্রেণিতে গ্রামে ফিরে এসে প্রাথমিক শিক্ষা সমাপনী পরীক্ষায় জিপিএ ৫.০০ অর্জন করি — এটিই আমার শিক্ষাজীবনের প্রথম বড় অর্জন এবং পরবর্তী প্রতিটি সাফল্যের ভিত্তি।",
    descriptionEn: "Returned to my home village for class 5 and completed the Primary School Certificate examination with a perfect GPA 5.00 — the first major milestone of my academic record.",
    badgeBn: "GPA 5.00",
    badgeEn: "GPA 5.00",
    badgeType: "glow",
    gpa: "5.00",
  },
  {
    id: "education-high-school",
    yearBn: "২০২০ — ২০২৫",
    yearEn: "2020 — 2025",
    titleBn: "মাধ্যমিক শিক্ষাজীবন (৬ষ্ঠ — ১০ম শ্রেণি)",
    titleEn: "Secondary Education (Class 6 — 10)",
    institutionBn: "সুনামগঞ্জ সরকারি জুবিলী উচ্চ বিদ্যালয়",
    institutionEn: "Sunamganj Govt. Jubilee High School",
    locationBn: "সুনামগঞ্জ",
    locationEn: "Sunamganj",
    descriptionBn: "বিজ্ঞান, গণিত ও প্রযুক্তিতে গভীর আগ্রহ তৈরি হয় এবং স্ব-উদ্যোগে ওয়েব ডেভেলপমেন্ট শেখা শুরু করি। এই সময়েই একাধিক জাতীয় বিজ্ঞান মেলায় প্রথম স্থান অর্জন, ২০২৩ সাল থেকে শিক্ষকতা শুরু, হেল্পিং হ্যান্ড অর্গানাইজেশন ও FS কোচিং সেন্টার প্রতিষ্ঠা করি।",
    descriptionEn: "Built a strong foundation in science, mathematics and technology while teaching myself web development. During these years I won multiple national science fairs, began tutoring in 2023, and founded both Helping Hand Organization and FS Coaching Center.",
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
    descriptionBn: "৩১ আগস্ট, ২০২৩ — ৪৫তম জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহে বিজ্ঞান কুইজে ১ম, উপস্থিত বক্তৃতায় ২য় এবং বিজ্ঞান প্রজেক্টে ৩য় স্থান অর্জন করি।",
    descriptionEn: "On 31 August 2023 at the 45th National Science & Technology Week: 1st place in the science quiz, 2nd in extempore speech and 3rd in the science project.",
    badgeBn: "কুইজে ১ম স্থান",
    badgeEn: "1st in Quiz",
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
    descriptionBn: "২ মে, ২০২৪ — ৪৪তম জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহের বিজ্ঞান প্রদর্শনীতে দ্বিতীয়বারের মতো প্রথম স্থান অর্জন করি।",
    descriptionEn: "On 2 May 2024 at the 44th National Science & Technology Week exhibition, I secured first place for the second time in my science-fair record.",
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
    descriptionBn: "সৃজনশীল মেধা অন্বেষণ প্রতিযোগিতায় বিজ্ঞান বিষয়ে প্রথম স্থান অর্জন করি — সৃজনশীল চিন্তা ও বিশ্লেষণী দক্ষতার স্বীকৃতি।",
    descriptionEn: "Won first place in the Science category of the Creative Talent Search competition — recognition for creative problem-solving and analytical skill.",
    badgeBn: "১ম স্থান",
    badgeEn: "1st Place",
    badgeType: "glow",
    gpa: "",
  },
  {
    id: "education-ssc",
    yearBn: "১০ জুলাই, ২০২৫",
    yearEn: "10 July 2025",
    titleBn: "SSC — মাধ্যমিক স্কুল সার্টিফিকেট",
    titleEn: "SSC — Secondary School Certificate",
    institutionBn: "সুনামগঞ্জ সরকারি জুবিলী উচ্চ বিদ্যালয়",
    institutionEn: "Sunamganj Govt. Jubilee High School",
    locationBn: "সুনামগঞ্জ",
    locationEn: "Sunamganj",
    descriptionBn: "বিজ্ঞান বিভাগ থেকে জিপিএ ৫.০০ (এ+) অর্জন করে এসএসসি উত্তীর্ণ হই। এই ফলাফলের জন্য বিদ্যালয় কর্তৃপক্ষ কৃতী শিক্ষার্থী সংবর্ধনা এবং শান্তিচক্র ব্লাড সোসাইটি সম্মাননা ক্রেস্ট প্রদান করে।",
    descriptionEn: "Completed the Secondary School Certificate examination from the Science group with GPA 5.00 (A+). The result was recognised with a meritorious-student reception by the school and an honour crest from Shantichakra Blood Society.",
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
    descriptionBn: "বর্তমানে সুনামগঞ্জ সরকারি কলেজে এইচএসসি ২য় বর্ষে বিজ্ঞান বিভাগে (পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও গণিত) অধ্যয়নরত। পড়াশোনার পাশাপাশি শিক্ষকতা, ওয়েব ডেভেলপমেন্ট, বিএনসিসি ক্যাডেট কার্যক্রম এবং শান্তিচক্র ব্লাড সোসাইটির সাধারণ সম্পাদকের দায়িত্ব পালন করছি।",
    descriptionEn: "Currently in HSC 2nd Year (Science — Physics, Chemistry, Biology, Mathematics) at Sunamganj Govt. College. Alongside academics I teach, build websites, serve as an active BNCC cadet (No: 25071152) and hold the post of General Secretary at Shantichakra Blood Society.",
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
    descriptionBn: "১০ জুলাই, ২০২৫ — বিজ্ঞান বিভাগ থেকে জিপিএ ৫.০০ (A+) অর্জন। বিদ্যালয় ও শান্তিচক্র ব্লাড সোসাইটি উভয়ের কাছ থেকে বিশেষ সম্মাননা লাভ।",
    descriptionEn: "10 July 2025 — GPA 5.00 (A+) from the Science group, recognised with special honours by both the school and Shantichakra Blood Society.",
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
    descriptionBn: "৪৬তম জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহে বিজ্ঞান কুইজে ১ম, বিজ্ঞান প্রজেক্টে ৩য় এবং বিজ্ঞান অলিম্পিয়াডে ৪র্থ স্থান — একই আসরে তিনটি বিভাগে পুরস্কার।",
    descriptionEn: "46th National Science & Technology Week: 1st in the science quiz, 3rd in the science project and 4th in the science olympiad — awards in three categories at a single event.",
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
    descriptionBn: "বিদ্যালয়ের A+ প্রাপ্ত তিনজন কৃতী শিক্ষার্থীর অন্যতম হিসেবে নির্বাচিত; সম্মাননা ক্রেস্ট ও আর্থিক সহায়তা প্রদান করা হয়।",
    descriptionEn: "Selected as one of the school's three top A+ achievers of the year and presented with an honour crest and a financial award.",
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
    descriptionBn: "SSC-তে A+ অর্জনের স্বীকৃতিস্বরূপ শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ কর্তৃক প্রদত্ত সম্মাননা স্মারক (ক্রেস্ট)।",
    descriptionEn: "Honour crest presented by Shantichakra Blood Society Sunamganj in recognition of the A+ result in SSC.",
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
    descriptionBn: "সৃজনশীল মেধা অন্বেষণ প্রতিযোগিতায় বিজ্ঞান বিষয়ে প্রথম স্থান অর্জন — সৃজনশীল ও বিশ্লেষণী দক্ষতার স্বীকৃতি।",
    descriptionEn: "First place in the Science category of the Creative Talent Search competition, recognising creative and analytical problem-solving.",
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
    descriptionBn: "২ মে, ২০২৪ — ৪৪তম জাতীয় বিজ্ঞান প্রদর্শনীতে দ্বিতীয়বারের মতো প্রথম স্থান অর্জন।",
    descriptionEn: "2 May 2024 — first place at the 44th National Science Exhibition, my second science-fair title.",
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
    descriptionBn: "৩১ আগস্ট, ২০২৩ — বিজ্ঞান কুইজে ১ম, উপস্থিত বক্তৃতায় ২য় এবং বিজ্ঞান প্রজেক্টে ৩য় স্থান অর্জন।",
    descriptionEn: "31 August 2023 — 1st in the science quiz, 2nd in extempore speech and 3rd in the science project.",
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
    descriptionBn: "২৬ নভেম্বর, ২০২০ — ৪২তম জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহে উপজেলা পর্যায়ে প্রথম স্থান; এটিই আমার প্রথম বিজ্ঞান মেলা জয়।",
    descriptionEn: "26 November 2020 — first place at upazila level in the 42nd National Science & Technology Week; my first ever science-fair win.",
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
    descriptionBn: "জীবদাড়া সরকারি প্রাথমিক বিদ্যালয় থেকে জিপিএ ৫.০০ পেয়ে প্রাথমিক শিক্ষা সমাপনী পরীক্ষায় উত্তীর্ণ।",
    descriptionEn: "Completed the Primary School Certificate examination with a perfect GPA 5.00 from Jibdara Govt. Primary School.",
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
    url: "/images/legacy/rahat-profile.jpg",
    publicId: "rahatverse/profile/1786125213546",
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
    titleBn: "রাহাত আহমেদ সম্পর্কে",
    titleEn: "About Rahat Ahmed",
    subtitleBn: "গ্রাম থেকে শহর, স্বপ্ন থেকে বাস্তব — একটি অবিরাম যাত্রার গল্প",
    subtitleEn: "From village to city, dream to reality — a continuous journey",
  },
  biography: {
    paragraphs: [
      {
        bn: "আমি রাহাত আহমেদ — সুনামগঞ্জের একজন শিক্ষার্থী, শিক্ষক, সংগঠক ও ওয়েব ডেভেলপার। ২০০৬ সালের ২১ জুন সুনামগঞ্জ জেলার শান্তিগঞ্জ উপজেলায় আমার জন্ম। গ্রামীণ পরিবেশে বেড়ে ওঠা আমাকে শিখিয়েছে পরিশ্রম, ধৈর্য এবং মানুষের পাশে দাঁড়ানোর দায়বদ্ধতা।",
        en: "I am Rahat Ahmed — a student, teacher, organiser and web developer from Sunamganj, Bangladesh. I was born on 21 June 2006 in Shantiganj, Sunamganj. Growing up in a rural community taught me discipline, persistence and a lasting sense of responsibility towards the people around me.",
      },
      {
        bn: "একাডেমিকভাবে আমি ধারাবাহিক ফলাফল ধরে রেখেছি — PSC-তে জিপিএ ৫.০০ এবং ২০২৫ সালে বিজ্ঞান বিভাগ থেকে SSC-তে জিপিএ ৫.০০ (A+)। বর্তমানে সুনামগঞ্জ সরকারি কলেজে HSC ২য় বর্ষে (পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান ও গণিত) অধ্যয়নরত। ২০২০ সাল থেকে জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহের একাধিক আসরে বিজ্ঞান প্রজেক্ট, কুইজ ও উপস্থিত বক্তৃতায় প্রথম স্থানসহ বিভিন্ন পুরস্কার অর্জন করেছি।",
        en: "Academically I have kept a consistent record — GPA 5.00 in PSC and GPA 5.00 (A+) in the 2025 SSC examination from the Science group. I am currently in HSC 2nd Year (Physics, Chemistry, Biology and Mathematics) at Sunamganj Govt. College. Since 2020 I have won first place and other awards across several editions of the National Science & Technology Week in science projects, quizzes and extempore speaking.",
      },
      {
        bn: "পড়াশোনার পাশাপাশি আমি ২০২৩ সাল থেকে ৭ম–৯ম শ্রেণির শিক্ষার্থীদের পাঠদান করছি, ২০২৪ সালের ৩১ ডিসেম্বর প্রতিষ্ঠা করেছি FS কোচিং সেন্টার — যেখানে গ্রামের সুবিধাবঞ্চিত মেধাবী শিক্ষার্থীরা সুলভ মূল্যে মানসম্মত শিক্ষা পেয়েছে। ২০২৩ সালে অসহায় মানুষের সহায়তার লক্ষ্যে প্রতিষ্ঠা করেছি হেল্পিং হ্যান্ড অর্গানাইজেশন, এবং ২০২৫ সালে শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ প্রতিষ্ঠায় সহ-প্রতিষ্ঠাতা হিসেবে যুক্ত হয়ে বর্তমানে সাধারণ সম্পাদকের দায়িত্ব পালন করছি। আমি একজন নিয়মিত A+ রক্তদাতা এবং BNCC-এর একজন সক্রিয় ক্যাডেট।",
        en: "Alongside my studies I have been teaching class 7–9 students since 2023 and, on 31 December 2024, founded FS Coaching Center — an initiative that made quality lessons affordable for talented but underprivileged students in my village. In 2023 I founded Helping Hand Organization to support families in need, and in 2025 I co-founded Shantichakra Blood Society Sunamganj, where I now serve as General Secretary. I am a regular A+ blood donor and an active BNCC cadet.",
      },
      {
        bn: "প্রযুক্তির দিক থেকে আমি আধুনিক, দ্রুতগতির, রেসপনসিভ ও SEO-বান্ধব ওয়েবসাইট তৈরি করি — Next.js, React, TypeScript, Tailwind CSS ও Supabase ব্যবহার করে। পোর্টফোলিও, ব্যবসায়িক, শিক্ষাপ্রতিষ্ঠান, রক্তদান সংগঠন, ই-কমার্স ও ল্যান্ডিং পেজ — বিভিন্ন ধরনের সাইট নিয়ে কাজ করি; এই রাহাতভার্স সাইটটিও সম্পূর্ণ নিজে ডিজাইন ও ডেভেলপ করা। ওয়েব ডেভেলপমেন্ট, আর্টিফিশিয়াল ইন্টেলিজেন্স, কনটেন্ট ক্রিয়েশন ও সমাজসেবা — এই চারটি ক্ষেত্রকে একসাথে কাজে লাগিয়ে শিক্ষা ও প্রযুক্তির মাধ্যমে সমাজে ইতিবাচক পরিবর্তন আনাই আমার লক্ষ্য।",
        en: "On the technology side I build modern, fast, fully responsive and SEO-friendly websites using Next.js, React, TypeScript, Tailwind CSS and Supabase — portfolio, business, educational-institution, blood-donation, e-commerce and landing-page projects among them. RahatVerse, the site you are reading, was designed and developed entirely by me. Web development, artificial intelligence, content creation and social service are the four areas I combine with one goal: creating positive change through education and technology.",
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
    { id: "blood-group", icon: "Droplets", labelBn: "রক্তের গ্রুপ", labelEn: "Blood Group", valueBn: "A+", valueEn: "A+" },
    { id: "education", icon: "GraduationCap", labelBn: "শিক্ষা", labelEn: "Education", valueBn: "HSC ২য় বর্ষ (বিজ্ঞান)", valueEn: "HSC 2nd Year (Science)" },
    { id: "institution", icon: "BookOpen", labelBn: "প্রতিষ্ঠান", labelEn: "Institution", valueBn: "সুনামগঞ্জ সরকারি কলেজ", valueEn: "Sunamganj Govt. College" },
    { id: "bncc-number", icon: "Award", labelBn: "BNCC ক্যাডেট নং", labelEn: "BNCC Cadet No", valueBn: "25071152", valueEn: "25071152" },
    { id: "organization-role", icon: "Users", labelBn: "সাংগঠনিক দায়িত্ব", labelEn: "Organisational Role", valueBn: "সাধারণ সম্পাদক, শান্তিচক্র ব্লাড সোসাইটি", valueEn: "General Secretary, Shantichakra Blood Society" },
    { id: "blood-donations", icon: "Heart", labelBn: "স্বেচ্ছায় রক্তদান", labelEn: "Voluntary Donations", valueBn: "৪ বার", valueEn: "4 times" },
    { id: "languages", icon: "BookOpen", labelBn: "ভাষা", labelEn: "Languages", valueBn: "বাংলা, English", valueEn: "Bangla, English" },
  ],
  interests: [
    { id: "web-development", icon: "Code", labelBn: "ওয়েব ডেভেলপমেন্ট", labelEn: "Web Development" },
    { id: "artificial-intelligence", icon: "Code", labelBn: "আর্টিফিশিয়াল ইন্টেলিজেন্স", labelEn: "Artificial Intelligence" },
    { id: "education-interest", icon: "BookOpen", labelBn: "শিক্ষা", labelEn: "Education" },
    { id: "teaching", icon: "GraduationCap", labelBn: "শিক্ষকতা", labelEn: "Teaching" },
    { id: "science-research", icon: "Star", labelBn: "বিজ্ঞান ও গবেষণা", labelEn: "Science & Research" },
    { id: "content-creation", icon: "Star", labelBn: "কনটেন্ট ক্রিয়েশন", labelEn: "Content Creation" },
    { id: "social-service", icon: "Users", labelBn: "সমাজসেবা", labelEn: "Social Service" },
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

