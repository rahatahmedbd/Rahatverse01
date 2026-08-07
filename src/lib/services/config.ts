import type {
  ServiceBadgeVariant,
  ServicesCta,
  ServicesComparisonRow,
  ServicesConfig,
  ServicesFeaturedPackage,
  ServicesFeature,
  ServicesIconName,
  ServicesPackage,
  ServicesProcessStep,
  ServicesSectionContent,
  ServicesService,
  ServicesWebsiteType,
} from "@/types/services";

// ── Default Services Config ────────────────────────────
// These values preserve the original public content when Supabase is not
// configured or before migration 013 has been applied.

const MAX_TEXT = 5_000;
const MAX_SHORT = 240;
const MAX_ITEM_TEXT = 300;
const MAX_SERVICES = 12;
const MAX_TYPES = 16;
const MAX_FEATURES = 12;
const MAX_FEATURED = 8;
const MAX_PACKAGES = 8;
const MAX_COMPARISON_ROWS = 24;
const MAX_PROCESS_STEPS = 12;

const ALLOWED_ICONS = new Set<ServicesIconName>([
  "Code",
  "Palette",
  "ShoppingBag",
  "GraduationCap",
  "Droplets",
  "Building2",
  "Globe",
  "Briefcase",
  "Newspaper",
  "Zap",
  "Shield",
  "Smartphone",
  "Search",
  "Clock",
  "Users",
  "Code2",
  "Sparkles",
  "Rocket",
  "PenTool",
  "BarChart3",
  "Layers",
  "Wallet",
  "Database",
  "Server",
  "Gauge",
  "CheckCircle2",
]);

const ALLOWED_BADGE_VARIANTS = new Set<ServiceBadgeVariant>([
  "gradient",
  "glow",
  "outline",
  "secondary",
  "default",
]);

const DEFAULT_SECTION: ServicesSectionContent = {
  badgeBn: "💻 ওয়েব সেবা সমূহ",
  badgeEn: "💻 Web Services",
  titleBn: "আমার সেবাসমূহ",
  titleEn: "What I Build",
  subtitleBn: "আধুনিক প্রযুক্তি ব্যবহার করে যেকোনো ধরণের ওয়েবসাইট ও ওয়েব অ্যাপ্লিকেশন তৈরি করি",
  subtitleEn: "I build all types of websites and web applications using modern technologies",
};

const DEFAULT_PRICING_SECTION: ServicesSectionContent = {
  badgeBn: "💰 প্যাকেজ সমূহ",
  badgeEn: "💰 Pricing Packages",
  titleBn: "ওয়েবসাইট প্যাকেজ",
  titleEn: "Website Packages",
  subtitleBn: "আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন",
  subtitleEn: "Choose a package that fits your needs",
};

const DEFAULT_COMPARISON_SECTION: ServicesSectionContent = {
  badgeBn: "⚖️ প্যাকেজ তুলনা",
  badgeEn: "⚖️ Package Comparison",
  titleBn: "সবগুলো প্যাকেজ এক নজরে",
  titleEn: "All packages at a glance",
  subtitleBn: "পাশাপাশি তুলনা করে সঠিক প্যাকেজটি বেছে নিন",
  subtitleEn: "Compare side-by-side to choose the right package",
};

const DEFAULT_PROCESS_SECTION: ServicesSectionContent = {
  badgeBn: "🚀 আমাদের কাজের প্রক্রিয়া",
  badgeEn: "🚀 How We Work",
  titleBn: "ধাপে ধাপে আপনার প্রজেক্ট",
  titleEn: "Your project, step by step",
  subtitleBn: "শুরু থেকে শেষ পর্যন্ত — একটি পরিষ্কার ও স্বচ্ছ প্রক্রিয়া",
  subtitleEn: "From start to finish — a clear and transparent process",
};

const defaultServices: ServicesService[] = [
  {
    id: "web-development",
    visible: true,
    icon: "Code",
    titleBn: "ওয়েব ডেভেলপমেন্ট",
    titleEn: "Web Development",
    descriptionBn: "আধুনিক, দ্রুতগতির ও Responsive ওয়েবসাইট তৈরি করি",
    descriptionEn: "Modern, fast, and responsive websites",
    featuresBn: [
      "Next.js ও React দিয়ে তৈরি",
      "TypeScript ব্যবহার",
      "Tailwind CSS দিয়ে স্টাইলিং",
      "Supabase ব্যাকএন্ড",
      "Cloudinary ইমেজ ম্যানেজমেন্ট",
    ],
    featuresEn: [
      "Built with Next.js and React",
      "TypeScript implementation",
      "Tailwind CSS styling",
      "Supabase backend",
      "Cloudinary image management",
    ],
    priceBn: "৳5,000 - ৳30,000",
    priceEn: "৳5,000 - ৳30,000",
    deliveryBn: "১-৩ সপ্তাহ ডেলিভারি",
    deliveryEn: "1-3 week delivery",
  },
  {
    id: "portfolio-website",
    visible: true,
    icon: "Palette",
    titleBn: "পোর্টফোলিও ওয়েবসাইট",
    titleEn: "Portfolio Website",
    descriptionBn: "আপনার কাজ ও দক্ষতা প্রদর্শনের জন্য প্রফেশনাল পোর্টফোলিও",
    descriptionEn: "Professional portfolio to showcase your work and skills",
    featuresBn: [
      "আকর্ষণীয় ডিজাইন",
      "প্রজেক্ট শোকেস",
      "রেজুমে ডাউনলোড",
      "যোগাযোগ ফর্ম",
      "সোশ্যাল মিডিয়া ইন্টিগ্রেশন",
    ],
    featuresEn: [
      "Attractive design",
      "Project showcase",
      "Resume download",
      "Contact form",
      "Social media integration",
    ],
    priceBn: "৳5,000 - ৳10,000",
    priceEn: "৳5,000 - ৳10,000",
    deliveryBn: "১-২ সপ্তাহ ডেলিভারি",
    deliveryEn: "1-2 week delivery",
  },
  {
    id: "ecommerce-website",
    visible: true,
    icon: "ShoppingBag",
    titleBn: "ই-কমার্স ওয়েবসাইট",
    titleEn: "E-Commerce Website",
    descriptionBn: "অনলাইনে পণ্য বিক্রির জন্য সম্পূর্ণ ই-কমার্স সমাধান",
    descriptionEn: "Complete e-commerce solution for selling products online",
    featuresBn: [
      "পণ্য ক্যাটালগ",
      "শপিং কার্ট",
      "পেমেন্ট ইন্টিগ্রেশন",
      "অর্ডার ম্যানেজমেন্ট",
      "ইনভেন্টরি ট্র্যাকিং",
    ],
    featuresEn: [
      "Product catalog",
      "Shopping cart",
      "Payment integration",
      "Order management",
      "Inventory tracking",
    ],
    priceBn: "৳20,000 - ৳50,000",
    priceEn: "৳20,000 - ৳50,000",
    deliveryBn: "২-৪ সপ্তাহ ডেলিভারি",
    deliveryEn: "2-4 week delivery",
  },
  {
    id: "education-website",
    visible: true,
    icon: "GraduationCap",
    titleBn: "শিক্ষা প্রতিষ্ঠান",
    titleEn: "Educational Institution",
    descriptionBn: "স্কুল, কলেজ বা কোচিং সেন্টারের জন্য ওয়েবসাইট",
    descriptionEn: "Website for schools, colleges, or coaching centers",
    featuresBn: [
      "কোর্স তালিকা",
      "শিক্ষক প্রোফাইল",
      "ভর্তি তথ্য",
      "নোটিশ বোর্ড",
      "ইভেন্ট ক্যালেন্ডার",
    ],
    featuresEn: [
      "Course listing",
      "Teacher profiles",
      "Admission info",
      "Notice board",
      "Event calendar",
    ],
    priceBn: "৳10,000 - ৳25,000",
    priceEn: "৳10,000 - ৳25,000",
    deliveryBn: "১-৩ সপ্তাহ ডেলিভারি",
    deliveryEn: "1-3 week delivery",
  },
  {
    id: "blood-organization",
    visible: true,
    icon: "Droplets",
    titleBn: "রক্ত সংগঠন",
    titleEn: "Blood Donation Organization",
    descriptionBn: "রক্তদান সংগঠনের জন্য সম্পূর্ণ ওয়েবসাইট সলিউশন",
    descriptionEn: "Complete website solution for blood donation organizations",
    featuresBn: [
      "ডোনার রেজিস্ট্রেশন",
      "রক্ত অনুরোধ সিস্টেম",
      "ডোনার ডেটাবেস",
      "ইভেন্ট ম্যানেজমেন্ট",
      "রিয়েল-টাইম নোটিফিকেশন",
    ],
    featuresEn: [
      "Donor registration",
      "Blood request system",
      "Donor database",
      "Event management",
      "Real-time notifications",
    ],
    priceBn: "৳15,000 - ৳30,000",
    priceEn: "৳15,000 - ৳30,000",
    deliveryBn: "১-৩ সপ্তাহ ডেলিভারি",
    deliveryEn: "1-3 week delivery",
  },
  {
    id: "business-website",
    visible: true,
    icon: "Building2",
    titleBn: "ব্যবসায়িক ওয়েবসাইট",
    titleEn: "Business Website",
    descriptionBn: "আপনার ব্যবসার জন্য প্রফেশনাল ওয়েবসাইট",
    descriptionEn: "Professional website for your business",
    featuresBn: [
      "কোম্পানি প্রোফাইল",
      "সার্ভিস পেজ",
      "টিম পেজ",
      "ব্লগ সেকশন",
      "লিড জেনারেশন ফর্ম",
    ],
    featuresEn: [
      "Company profile",
      "Service pages",
      "Team page",
      "Blog section",
      "Lead generation form",
    ],
    priceBn: "৳10,000 - ৳25,000",
    priceEn: "৳10,000 - ৳25,000",
    deliveryBn: "১-৩ সপ্তাহ ডেলিভারি",
    deliveryEn: "1-3 week delivery",
  },
];

const defaultWebsiteTypes: ServicesWebsiteType[] = [
  { id: "type-portfolio", visible: true, icon: "Globe", labelBn: "পোর্টফোলিও", labelEn: "Portfolio" },
  { id: "type-business", visible: true, icon: "Briefcase", labelBn: "ব্যবসায়িক", labelEn: "Business" },
  { id: "type-ecommerce", visible: true, icon: "ShoppingBag", labelBn: "ই-কমার্স", labelEn: "E-Commerce" },
  { id: "type-education", visible: true, icon: "GraduationCap", labelBn: "শিক্ষা প্রতিষ্ঠান", labelEn: "Education" },
  { id: "type-news", visible: true, icon: "Newspaper", labelBn: "নিউজ পোর্টাল", labelEn: "News Portal" },
  { id: "type-landing", visible: true, icon: "Palette", labelBn: "ল্যান্ডিং পেজ", labelEn: "Landing Page" },
];

const defaultFeatures: ServicesFeature[] = [
  {
    id: "feat-speed",
    visible: true,
    icon: "Zap",
    titleBn: "দ্রুতগতির পারফরম্যান্স",
    titleEn: "Lightning Fast Performance",
    descriptionBn: "অপটিমাইজড কোড এবং CDN ব্যবহার করে দ্রুত লোডিং",
    descriptionEn: "Fast loading with optimized code and CDN",
  },
  {
    id: "feat-security",
    visible: true,
    icon: "Shield",
    titleBn: "সিকিউরিটি",
    titleEn: "Security",
    descriptionBn: "সর্বোচ্চ নিরাপত্তা ব্যবস্থা সহ সুরক্ষিত ওয়েবসাইট",
    descriptionEn: "Secure websites with the highest safety measures",
  },
  {
    id: "feat-responsive",
    visible: true,
    icon: "Smartphone",
    titleBn: "মোবাইল রেসপনসিভ",
    titleEn: "Mobile Responsive",
    descriptionBn: "সব ডিভাইসে পারফেক্ট দেখায়",
    descriptionEn: "Looks perfect on every device",
  },
  {
    id: "feat-seo",
    visible: true,
    icon: "Search",
    titleBn: "SEO অপটিমাইজড",
    titleEn: "SEO Optimized",
    descriptionBn: "সার্চ ইঞ্জিনে ভালো র‍্যাঙ্কিং পাবে",
    descriptionEn: "Great rankings on search engines",
  },
  {
    id: "feat-delivery",
    visible: true,
    icon: "Clock",
    titleBn: "সময়মতো ডেলিভারি",
    titleEn: "On-Time Delivery",
    descriptionBn: "নির্ধারিত সময়ের মধ্যে ডেলিভারি নিশ্চিত",
    descriptionEn: "Delivery guaranteed within the agreed time",
  },
  {
    id: "feat-support",
    visible: true,
    icon: "Users",
    titleBn: "সাপোর্ট",
    titleEn: "Support",
    descriptionBn: "ডেলিভারির পরও সাপোর্ট পাবেন",
    descriptionEn: "You get support even after delivery",
  },
];

const defaultFeaturedPackages: ServicesFeaturedPackage[] = [
  {
    id: "featured-portfolio",
    visible: true,
    icon: "Globe",
    titleBn: "পার্সোনাল পোর্টফোলিও ও ব্লগ",
    titleEn: "Personal Portfolio & Blog",
    subtitleBn: "আধুনিক ও রেসপনসিভ পোর্টফোলিও ওয়েবসাইট, কাস্টম ব্লগ সিএমএস এবং যোগাযোগের ফরমসহ।",
    subtitleEn: "Modern, responsive portfolio website with custom blog CMS and contact form.",
    badgeBn: "জনপ্রিয়",
    badgeEn: "Popular",
    badgeVariant: "glow",
    featuresBn: [
      "রেসপনসিভ গ্লাসমর্ফিজম ডিজাইন",
      "এসইও অপটিমাইজড ও সাইটম্যাপ",
      "ডাইনামিক ব্লগ ব্যবস্থা",
      "Next.js ১৬ স্ট্যাটিক রেন্ডারিং",
    ],
    featuresEn: [
      "Responsive glassmorphism UI",
      "SEO-ready metadata & sitemap",
      "Dynamic Markdown/MDX blog",
      "Fast Next.js 16 static rendering",
    ],
  },
  {
    id: "featured-ecommerce",
    visible: true,
    icon: "ShoppingBag",
    titleBn: "ব্যবসায়িক ও ই-কমার্স সাইট",
    titleEn: "Business & E-Commerce",
    subtitleBn: "অর্ডার ম্যানেজমেন্ট ও কাস্টমার সাপোর্ট ব্যবস্থাসহ পূর্ণাঙ্গ ব্যবসায়িক ওয়েবসাইট।",
    subtitleEn: "Complete business presence with order management and customer support tools.",
    badgeBn: "প্রফেশনাল",
    badgeEn: "Professional",
    badgeVariant: "outline",
    featuresBn: [
      "প্রোডাক্ট ও অর্ডার উইজার্ড",
      "কাস্টমার ড্যাশবোর্ড",
      "সুপাবেস রিয়েলটাইম ডাটাবেস",
      "স্বয়ংক্রিয় ইমেইল নোটিফিকেশন",
    ],
    featuresEn: [
      "Product & order wizard",
      "Customer dashboard",
      "Supabase real-time database",
      "Automated email notifications",
    ],
  },
  {
    id: "featured-custom",
    visible: true,
    icon: "Code2",
    titleBn: "কাস্টম ওয়েব অ্যাপ্লিকেশন",
    titleEn: "Custom Web Application",
    subtitleBn: "জটিল ব্যাকএন্ড এপিআই এবং অ্যাডমিন ড্যাশবোর্ডসহ কাস্টম ওয়েব অ্যাপ্লিকেশন সমাধান।",
    subtitleEn: "Tailor-made web solutions with complex backend APIs and admin dashboards.",
    badgeBn: "এন্টারপ্রাইজ",
    badgeEn: "Enterprise",
    badgeVariant: "secondary",
    featuresBn: [
      "ইউজার রোল ও সিকিউরিটি পারমিশন",
      "কাস্টম সুপাবেস ও ডাটাবেস স্কিমা",
      "ক্লাউডিনারি মিডিয়া ইন্টিগ্রেশন",
      "সম্পূর্ণ অ্যাডমিন কমান্ড সেন্টার",
    ],
    featuresEn: [
      "RBAC authentication & roles",
      "Custom Supabase RPC & triggers",
      "Cloudinary media integration",
      "Full admin command center",
    ],
  },
];

const defaultPackages: ServicesPackage[] = [
  {
    id: "basic",
    visible: true,
    nameBn: "বেসিক",
    nameEn: "Basic",
    priceBdt: 5000,
    priceUsd: 60,
    descriptionBn: "ব্যক্তিগত পোর্টফোলিও সাইটের জন্য",
    descriptionEn: "Perfect for personal portfolio sites",
    featuresBn: ["১-৩ পেজ", "রেসপনসিভ ডিজাইন", "কন্টাক্ট ফর্ম", "বেসিক SEO", "১ সপ্তাহ ডেলিভারি"],
    featuresEn: ["1-3 Pages", "Responsive Design", "Contact Form", "Basic SEO", "1 Week Delivery"],
    popular: false,
    ctaBn: "অর্ডার করুন",
    ctaEn: "Order Now",
  },
  {
    id: "standard",
    visible: true,
    nameBn: "স্ট্যান্ডার্ড",
    nameEn: "Standard",
    priceBdt: 15000,
    priceUsd: 180,
    descriptionBn: "ছোট ব্যবসার জন্য আদর্শ",
    descriptionEn: "Great for small businesses",
    featuresBn: ["৫-১০ পেজ", "রেসপনসিভ ডিজাইন", "ব্লগ সেকশন", "অ্যাডভান্সড SEO", "কন্টাক্ট + ম্যাপ", "২ সপ্তাহ ডেলিভারি"],
    featuresEn: ["5-10 Pages", "Responsive Design", "Blog Section", "Advanced SEO", "Contact + Map", "2 Week Delivery"],
    popular: true,
    ctaBn: "অর্ডার করুন",
    ctaEn: "Order Now",
  },
  {
    id: "premium",
    visible: true,
    nameBn: "প্রিমিয়াম",
    nameEn: "Premium",
    priceBdt: 30000,
    priceUsd: 360,
    descriptionBn: "সম্পূর্ণ ই-কমার্স সলিউশন",
    descriptionEn: "Full e-commerce solution",
    featuresBn: ["আনলিমিটেড পেজ", "ই-কমার্স", "পেমেন্ট গেটওয়ে", "অ্যাডমিন ড্যাশবোর্ড", "ফুল SEO", "৩ সপ্তাহ ডেলিভারি"],
    featuresEn: ["Unlimited Pages", "E-Commerce", "Payment Gateway", "Admin Dashboard", "Full SEO", "3 Week Delivery"],
    popular: false,
    ctaBn: "অর্ডার করুন",
    ctaEn: "Order Now",
  },
  {
    id: "enterprise",
    visible: true,
    nameBn: "এন্টারপ্রাইজ",
    nameEn: "Enterprise",
    priceBdt: 0,
    priceUsd: 0,
    descriptionBn: "আপনার প্রয়োজনে কাস্টম সলিউশন",
    descriptionEn: "Custom solution for your needs",
    featuresBn: ["প্রিমিয়ামের সবকিছু", "কাস্টম ফিচার", "প্রায়োরিটি সাপোর্ট", "মাসিক মেইনটেন্যান্স", "ট্রেনিং সেশন"],
    featuresEn: ["Everything in Premium", "Custom Features", "Priority Support", "Monthly Maintenance", "Training Session"],
    popular: false,
    ctaBn: "যোগাযোগ করুন",
    ctaEn: "Contact Us",
  },
];

const defaultComparisonRows: ServicesComparisonRow[] = [
  {
    id: "cmp-pages",
    featureBn: "পেজ সংখ্যা",
    featureEn: "Pages",
    values: { basic: "১-৩", standard: "৫-১০", premium: "আনলিমিটেড", enterprise: "কাস্টম" },
  },
  {
    id: "cmp-responsive",
    featureBn: "রেসপনসিভ ডিজাইন",
    featureEn: "Responsive Design",
    values: { basic: "✓", standard: "✓", premium: "✓", enterprise: "✓" },
  },
  {
    id: "cmp-blog",
    featureBn: "ব্লগ সেকশন",
    featureEn: "Blog Section",
    values: { basic: "—", standard: "✓", premium: "✓", enterprise: "✓" },
  },
  {
    id: "cmp-ecommerce",
    featureBn: "ই-কমার্স",
    featureEn: "E-Commerce",
    values: { basic: "—", standard: "—", premium: "✓", enterprise: "✓" },
  },
  {
    id: "cmp-payment",
    featureBn: "পেমেন্ট গেটওয়ে",
    featureEn: "Payment Gateway",
    values: { basic: "—", standard: "—", premium: "✓", enterprise: "✓" },
  },
  {
    id: "cmp-seo",
    featureBn: "SEO",
    featureEn: "SEO",
    values: { basic: "বেসিক", standard: "অ্যাডভান্সড", premium: "ফুল", enterprise: "ফুল" },
  },
  {
    id: "cmp-support",
    featureBn: "সাপোর্ট",
    featureEn: "Support",
    values: { basic: "সীমিত", standard: "স্ট্যান্ডার্ড", premium: "প্রায়োরিটি", enterprise: "প্রায়োরিটি" },
  },
  {
    id: "cmp-delivery",
    featureBn: "ডেলিভারি",
    featureEn: "Delivery",
    values: { basic: "১ সপ্তাহ", standard: "২ সপ্তাহ", premium: "৩ সপ্তাহ", enterprise: "কাস্টম" },
  },
];

const defaultProcessSteps: ServicesProcessStep[] = [
  {
    id: "step-discussion",
    stepBn: "০১",
    stepEn: "01",
    titleBn: "আলোচনা",
    titleEn: "Discussion",
    descriptionBn: "আপনার প্রয়োজনীয়তা বুঝে নেওয়া",
    descriptionEn: "Understand your requirements",
  },
  {
    id: "step-design",
    stepBn: "০২",
    stepEn: "02",
    titleBn: "ডিজাইন",
    titleEn: "Design",
    descriptionBn: "আকর্ষণীয় ডিজাইন তৈরি",
    descriptionEn: "Create an attractive design",
  },
  {
    id: "step-development",
    stepBn: "০৩",
    stepEn: "03",
    titleBn: "ডেভেলপমেন্ট",
    titleEn: "Development",
    descriptionBn: "কোড লেখা এবং ফিচার যোগ করা",
    descriptionEn: "Write code and add features",
  },
  {
    id: "step-testing",
    stepBn: "০৪",
    stepEn: "04",
    titleBn: "টেস্টিং",
    titleEn: "Testing",
    descriptionBn: "সব ফিচার টেস্ট করা",
    descriptionEn: "Test every feature",
  },
  {
    id: "step-delivery",
    stepBn: "০৫",
    stepEn: "05",
    titleBn: "ডেলিভারি",
    titleEn: "Delivery",
    descriptionBn: "ওয়েবসাইট ডেলিভারি এবং সাপোর্ট",
    descriptionEn: "Deliver the website and support",
  },
];

const DEFAULT_CTA: ServicesCta = {
  titleBn: "আজই আপনার ওয়েবসাইট অর্ডার করুন",
  titleEn: "Order your website today",
  subtitleBn: "আপনার স্বপ্নের ওয়েবসাইট তৈরি করতে আমাদের সাথে যোগাযোগ করুন",
  subtitleEn: "Contact us to build your dream website",
  primaryLabelBn: "অর্ডার করুন",
  primaryLabelEn: "Order Now",
  secondaryLabelBn: "যোগাযোগ করুন",
  secondaryLabelEn: "Contact Us",
};

export const DEFAULT_SERVICES_CONFIG: ServicesConfig = {
  visible: true,
  section: DEFAULT_SECTION,
  services: defaultServices,
  websiteTypes: defaultWebsiteTypes,
  features: defaultFeatures,
  featuredPackages: defaultFeaturedPackages,
  pricingSection: DEFAULT_PRICING_SECTION,
  packages: defaultPackages,
  comparisonSection: DEFAULT_COMPARISON_SECTION,
  comparisonRows: defaultComparisonRows,
  processSection: DEFAULT_PROCESS_SECTION,
  processSteps: defaultProcessSteps,
  cta: DEFAULT_CTA,
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

function isIcon(value: unknown): value is ServicesIconName {
  return typeof value === "string" && ALLOWED_ICONS.has(value as ServicesIconName);
}

function isBadgeVariant(value: unknown): value is ServiceBadgeVariant {
  return typeof value === "string" && ALLOWED_BADGE_VARIANTS.has(value as ServiceBadgeVariant);
}

function isStringArray(value: unknown, maxItems: number, maxText: number, allowEmpty = false): boolean {
  if (!Array.isArray(value) || value.length > maxItems) return false;
  return value.every((item) => isText(item, maxText, allowEmpty));
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

function validateCta(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isText(value.titleBn, MAX_SHORT) &&
    isText(value.titleEn, MAX_SHORT) &&
    isText(value.subtitleBn, MAX_SHORT) &&
    isText(value.subtitleEn, MAX_SHORT) &&
    isText(value.primaryLabelBn, MAX_SHORT) &&
    isText(value.primaryLabelEn, MAX_SHORT) &&
    isText(value.secondaryLabelBn, MAX_SHORT) &&
    isText(value.secondaryLabelEn, MAX_SHORT)
  );
}

function validateServices(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > MAX_SERVICES) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      typeof item.visible === "boolean" &&
      isIcon(item.icon) &&
      isText(item.titleBn, MAX_SHORT) &&
      isText(item.titleEn, MAX_SHORT) &&
      isText(item.descriptionBn, MAX_SHORT) &&
      isText(item.descriptionEn, MAX_SHORT) &&
      isStringArray(item.featuresBn, 16, MAX_ITEM_TEXT) &&
      isStringArray(item.featuresEn, 16, MAX_ITEM_TEXT) &&
      isText(item.priceBn, MAX_SHORT, true) &&
      isText(item.priceEn, MAX_SHORT, true) &&
      isText(item.deliveryBn, MAX_SHORT, true) &&
      isText(item.deliveryEn, MAX_SHORT, true)
    );
  });
}

function validateWebsiteTypes(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > MAX_TYPES) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      typeof item.visible === "boolean" &&
      isIcon(item.icon) &&
      isText(item.labelBn, MAX_SHORT) &&
      isText(item.labelEn, MAX_SHORT)
    );
  });
}

function validateFeatures(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > MAX_FEATURES) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      typeof item.visible === "boolean" &&
      isIcon(item.icon) &&
      isText(item.titleBn, MAX_SHORT) &&
      isText(item.titleEn, MAX_SHORT) &&
      isText(item.descriptionBn, MAX_SHORT) &&
      isText(item.descriptionEn, MAX_SHORT)
    );
  });
}

function validateFeaturedPackages(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > MAX_FEATURED) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      typeof item.visible === "boolean" &&
      isIcon(item.icon) &&
      isText(item.titleBn, MAX_SHORT) &&
      isText(item.titleEn, MAX_SHORT) &&
      isText(item.subtitleBn, MAX_SHORT) &&
      isText(item.subtitleEn, MAX_SHORT) &&
      isText(item.badgeBn, MAX_SHORT, true) &&
      isText(item.badgeEn, MAX_SHORT, true) &&
      isBadgeVariant(item.badgeVariant) &&
      isStringArray(item.featuresBn, 16, MAX_ITEM_TEXT) &&
      isStringArray(item.featuresEn, 16, MAX_ITEM_TEXT)
    );
  });
}

function validatePackages(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > MAX_PACKAGES) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    const bdt = Number(item.priceBdt);
    const usd = Number(item.priceUsd);
    return (
      isText(item.id, 80) &&
      typeof item.visible === "boolean" &&
      isText(item.nameBn, MAX_SHORT) &&
      isText(item.nameEn, MAX_SHORT) &&
      Number.isFinite(bdt) &&
      bdt >= 0 &&
      bdt <= 100_000_000 &&
      Number.isFinite(usd) &&
      usd >= 0 &&
      usd <= 1_000_000 &&
      isText(item.descriptionBn, MAX_SHORT) &&
      isText(item.descriptionEn, MAX_SHORT) &&
      isStringArray(item.featuresBn, 20, MAX_ITEM_TEXT) &&
      isStringArray(item.featuresEn, 20, MAX_ITEM_TEXT) &&
      typeof item.popular === "boolean" &&
      isText(item.ctaBn, MAX_SHORT) &&
      isText(item.ctaEn, MAX_SHORT)
    );
  });
}

function validateComparisonRows(value: unknown, packageIds: Set<string>): boolean {
  if (!Array.isArray(value) || value.length > MAX_COMPARISON_ROWS) return false;
  return value.every((row) => {
    if (!isRecord(row)) return false;
    if (!isText(row.id, 80)) return false;
    if (!isText(row.featureBn, MAX_SHORT) || !isText(row.featureEn, MAX_SHORT)) return false;
    if (!isRecord(row.values)) return false;
    return Object.entries(row.values).every(([key, cell]) => {
      if (!packageIds.has(key)) return false;
      return isText(cell, MAX_SHORT, true);
    });
  });
}

function validateProcessSteps(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > MAX_PROCESS_STEPS) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      isText(item.stepBn, MAX_SHORT) &&
      isText(item.stepEn, MAX_SHORT) &&
      isText(item.titleBn, MAX_SHORT) &&
      isText(item.titleEn, MAX_SHORT) &&
      isText(item.descriptionBn, MAX_SHORT) &&
      isText(item.descriptionEn, MAX_SHORT)
    );
  });
}

export function validateServicesConfig(input: unknown): ServicesConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!validateSection(input.section)) return null;
  if (!validateServices(input.services)) return null;
  if (!validateWebsiteTypes(input.websiteTypes)) return null;
  if (!validateFeatures(input.features)) return null;
  if (!validateFeaturedPackages(input.featuredPackages)) return null;
  if (!validateSection(input.pricingSection)) return null;
  if (!validatePackages(input.packages)) return null;
  if (!validateSection(input.comparisonSection)) return null;

  const packageIds = new Set(
    (input.packages as ServicesPackage[]).filter((p) => p && p.id).map((p) => p.id)
  );
  if (!validateComparisonRows(input.comparisonRows, packageIds)) return null;

  if (!validateSection(input.processSection)) return null;
  if (!validateProcessSteps(input.processSteps)) return null;
  if (!validateCta(input.cta)) return null;

  return input as unknown as ServicesConfig;
}
