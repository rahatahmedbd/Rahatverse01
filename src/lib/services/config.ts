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
    id: "business-website",
    visible: true,
    icon: "Building2",
    titleBn: "বিজনেস ওয়েবসাইট",
    titleEn: "Business Website",
    descriptionBn: "আপনার ব্যবসার জন্য প্রফেশনাল, আস্থা-জাগানো ওয়েবসাইট",
    descriptionEn: "A professional, trust-building online home for your business",
    featuresBn: [
      "কোম্পানি প্রোফাইল ও সার্ভিস পেজ",
      "লিড জেনারেশন ফর্ম",
      "মোবাইল-ফার্স্ট রেসপনসিভ ডিজাইন",
      "SEO-রেডি কাঠামো",
      "অ্যানালিটিক্স সেটআপ",
    ],
    featuresEn: [
      "Company profile & service pages",
      "Lead generation forms",
      "Mobile-first responsive design",
      "SEO-ready structure",
      "Analytics setup",
    ],
    priceBn: "৳১০,০০০ থেকে শুরু",
    priceEn: "Starting from ৳10,000",
    deliveryBn: "১-৩ সপ্তাহ ডেলিভারি",
    deliveryEn: "1-3 week delivery",
  },
  {
    id: "landing-page",
    visible: true,
    icon: "Rocket",
    titleBn: "ল্যান্ডিং পেজ",
    titleEn: "Landing Page",
    descriptionBn: "ক্যাম্পেইন বা প্রোডাক্টের জন্য হাই-কনভার্সন ল্যান্ডিং পেজ",
    descriptionEn: "High-converting landing page for campaigns and products",
    featuresBn: [
      "কনভার্সন-ফোকাসড কপি লেআউট",
      "স্পষ্ট CTA ও লিড ফর্ম",
      "দ্রুত লোডিং (৯০+ পারফরম্যান্স টার্গেট)",
      "A/B টেস্টের জন্য প্রস্তুত সেকশন",
      "মেটা/Google Ads-এ লিংক করার উপযোগী",
    ],
    featuresEn: [
      "Conversion-focused copy layout",
      "Clear CTAs & lead forms",
      "Fast loading (90+ performance target)",
      "Sections ready for A/B testing",
      "Ready to link from Meta / Google Ads",
    ],
    priceBn: "৳৫,০০০ থেকে শুরু",
    priceEn: "Starting from ৳5,000",
    deliveryBn: "১-২ সপ্তাহ ডেলিভারি",
    deliveryEn: "1-2 week delivery",
  },
  {
    id: "ecommerce-website",
    visible: true,
    icon: "ShoppingBag",
    titleBn: "ই-কমার্স সাইট",
    titleEn: "E-Commerce Website",
    descriptionBn: "অনলাইনে পণ্য বিক্রির জন্য সম্পূর্ণ ই-কমার্স সমাধান",
    descriptionEn: "Complete e-commerce solution for selling products online",
    featuresBn: [
      "পণ্য ক্যাটালগ ও সার্চ",
      "শপিং কার্ট ও চেকআউট",
      "পেমেন্ট ইন্টিগ্রেশন",
      "অর্ডার ম্যানেজমেন্ট ড্যাশবোর্ড",
      "ইনভেন্টরি ট্র্যাকিং",
    ],
    featuresEn: [
      "Product catalog & search",
      "Shopping cart & checkout",
      "Payment integration",
      "Order management dashboard",
      "Inventory tracking",
    ],
    priceBn: "৳৩০,০০০ থেকে শুরু",
    priceEn: "Starting from ৳30,000",
    deliveryBn: "২-৪ সপ্তাহ ডেলিভারি",
    deliveryEn: "2-4 week delivery",
  },
  {
    id: "web-application",
    visible: true,
    icon: "Code",
    titleBn: "ওয়েব অ্যাপ্লিকেশন",
    titleEn: "Web Application",
    descriptionBn: "কাস্টম ফিচার, ড্যাশবোর্ড ও ডেটাবেসসহ ওয়েব অ্যাপ",
    descriptionEn: "Custom web apps with dashboards, auth and databases",
    featuresBn: [
      "ইউজার অ্যাকাউন্ট ও রোল-ভিত্তিক পারমিশন",
      "কাস্টম ড্যাশবোর্ড ও রিপোর্ট",
      "Supabase ডেটাবেস ও API",
      "অ্যাডমিন প্যানেল",
      "স্কেলেবল আর্কিটেকচার",
    ],
    featuresEn: [
      "User accounts & role-based access",
      "Custom dashboards & reports",
      "Supabase database & APIs",
      "Admin panel",
      "Scalable architecture",
    ],
    priceBn: "কাস্টম কোটেশন",
    priceEn: "Custom quote",
    deliveryBn: "স্কোপ অনুযায়ী সময়রেখা",
    deliveryEn: "Timeline depends on scope",
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
    id: "feat-responsive",
    visible: true,
    icon: "Smartphone",
    titleBn: "সম্পূর্ণ রেসপনসিভ",
    titleEn: "Fully Responsive",
    descriptionBn: "মোবাইল, ট্যাব ও ডেস্কটপ — সব স্ক্রিনে নিখুঁত অভিজ্ঞতা",
    descriptionEn: "Pixel-perfect on mobile, tablet and every desktop size",
  },
  {
    id: "feat-speed",
    visible: true,
    icon: "Zap",
    titleBn: "দ্রুতগতির পারফরম্যান্স",
    titleEn: "Blazing Fast",
    descriptionBn: "অপটিমাইজড কোড, ছবি ও CDN — দ্রুত লোডিং ও ভালো Core Web Vitals",
    descriptionEn: "Optimized code, images and CDN for great Core Web Vitals",
  },
  {
    id: "feat-seo",
    visible: true,
    icon: "Search",
    titleBn: "SEO-রেডি",
    titleEn: "SEO-Ready",
    descriptionBn: "মেটাডেটা, সাইটম্যাপ ও স্ট্রাকচার্ড ডেটাসহ সার্চ-বান্ধব কাঠামো",
    descriptionEn: "Search-friendly structure with metadata, sitemap and schema",
  },
  {
    id: "feat-clean-code",
    visible: true,
    icon: "Code2",
    titleBn: "পরিষ্কার কোড",
    titleEn: "Clean Code",
    descriptionBn: "TypeScript, পরিষ্কার আর্কিটেকচার — ভবিষ্যতে সহজে মেইনটেইন ও এক্সটেন্ড করা যায়",
    descriptionEn: "TypeScript and clean architecture that is easy to maintain",
  },
  {
    id: "feat-modern-ui",
    visible: true,
    icon: "Sparkles",
    titleBn: "মডার্ন UI",
    titleEn: "Modern UI",
    descriptionBn: "আজকের মানের পরিষ্কার, আধুনিক ও ইউজার-কেন্দ্রিক ডিজাইন",
    descriptionEn: "Clean, contemporary, user-centred design that converts",
  },
  {
    id: "feat-support",
    visible: true,
    icon: "CheckCircle2",
    titleBn: "সাপোর্ট",
    titleEn: "Real Support",
    descriptionBn: "ডেলিভারির পরও সাপোর্ট — প্রশ্ন থাকলে সরাসরি আমার সাথে যোগাযোগ",
    descriptionEn: "Support after delivery — you talk directly to the developer",
  },
];

const defaultFeaturedPackages: ServicesFeaturedPackage[] = [
  {
    id: "featured-business",
    visible: true,
    icon: "Building2",
    titleBn: "বিজনেস ওয়েবসাইট",
    titleEn: "Business Website",
    subtitleBn: "কোম্পানি প্রোফাইল, সার্ভিস পেজ ও লিড ফর্মসহ পেশাদার ওয়েবসাইট।",
    subtitleEn: "Company profile, service pages and lead forms — a professional online home.",
    badgeBn: "জনপ্রিয়",
    badgeEn: "Popular",
    badgeVariant: "glow",
    featuresBn: [
      "৫-১০ পেজ পর্যন্ত কাস্টম ডিজাইন",
      "লিড জেনারেশন ও যোগাযোগ ফর্ম",
      "মোবাইল-ফার্স্ট রেসপনসিভ লেআউট",
      "SEO-রেডি মেটাডেটা ও সাইটম্যাপ",
    ],
    featuresEn: [
      "Custom design, up to 5-10 pages",
      "Lead generation & contact forms",
      "Mobile-first responsive layout",
      "SEO-ready metadata & sitemap",
    ],
    pricingPackageId: "standard",
  },
  {
    id: "featured-landing",
    visible: true,
    icon: "Rocket",
    titleBn: "ল্যান্ডিং পেজ",
    titleEn: "Landing Page",
    subtitleBn: "ক্যাম্পেইন বা প্রোডাক্ট লঞ্চের জন্য এক পেজের হাই-কনভার্সন সাইট।",
    subtitleEn: "A one-page, high-converting site for campaigns and product launches.",
    badgeBn: "দ্রুততম",
    badgeEn: "Fastest",
    badgeVariant: "outline",
    featuresBn: [
      "কনভার্সন-ফোকাসড সেকশন লেআউট",
      "স্পষ্ট CTA ও লিড ক্যাপচার",
      "অতিরিক্ত দ্রুত লোডিং",
      "Ads ক্যাম্পেইনে সরাসরি ব্যবহারযোগ্য",
    ],
    featuresEn: [
      "Conversion-focused section layout",
      "Clear CTAs & lead capture",
      "Extremely fast loading",
      "Ready to plug into ad campaigns",
    ],
    pricingPackageId: "basic",
  },
  {
    id: "featured-ecommerce",
    visible: true,
    icon: "ShoppingBag",
    titleBn: "ই-কমার্স সাইট",
    titleEn: "E-Commerce Website",
    subtitleBn: "পণ্য ক্যাটালগ, কার্ট, পেমেন্ট ও অর্ডার ম্যানেজমেন্টসহ অনলাইন শপ।",
    subtitleEn: "Catalog, cart, payments and order management — a complete online shop.",
    badgeBn: "প্রফেশনাল",
    badgeEn: "Professional",
    badgeVariant: "secondary",
    featuresBn: [
      "পণ্য ক্যাটালগ ও সার্চ",
      "পেমেন্ট গেটওয়ে ইন্টিগ্রেশন",
      "অর্ডার ম্যানেজমেন্ট ড্যাশবোর্ড",
      "কাস্টমার নোটিফিকেশন",
    ],
    featuresEn: [
      "Product catalog & search",
      "Payment gateway integration",
      "Order management dashboard",
      "Customer notifications",
    ],
    pricingPackageId: "premium",
  },
  {
    id: "featured-webapp",
    visible: true,
    icon: "Code2",
    titleBn: "ওয়েব অ্যাপ্লিকেশন",
    titleEn: "Web Application",
    subtitleBn: "অথ, ড্যাশবোর্ড ও ডেটাবেসসহ কাস্টম ওয়েব অ্যাপ — আপনার প্রয়োজন অনুযায়ী।",
    subtitleEn: "Custom web apps with auth, dashboards and databases — scoped to your needs.",
    badgeBn: "এন্টারপ্রাইজ",
    badgeEn: "Enterprise",
    badgeVariant: "gradient",
    featuresBn: [
      "ইউজার রোল ও সিকিউরিটি পারমিশন",
      "কাস্টম ডেটাবেস স্কিমা ও API",
      "অ্যাডমিন কমান্ড সেন্টার",
      "স্কেলেবল আর্কিটেকচার",
    ],
    featuresEn: [
      "User roles & security permissions",
      "Custom database schema & APIs",
      "Admin command center",
      "Scalable architecture",
    ],
    pricingPackageId: "enterprise",
  },
];

const defaultPackages: ServicesPackage[] = [
  {
    id: "basic",
    visible: true,
    orderValue: "basic",
    nameBn: "বেসিক",
    nameEn: "Basic",
    priceBdt: 5000,
    priceUsd: 60,
    includedPages: 3,
    includedFeatureValues: ["responsive", "seo", "contact_form"],
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
    orderValue: "standard",
    nameBn: "স্ট্যান্ডার্ড",
    nameEn: "Standard",
    priceBdt: 15000,
    priceUsd: 180,
    includedPages: 10,
    includedFeatureValues: ["responsive", "seo", "blog", "contact_form", "map"],
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
    orderValue: "premium",
    nameBn: "প্রিমিয়াম",
    nameEn: "Premium",
    priceBdt: 30000,
    priceUsd: 360,
    includedPages: null,
    includedFeatureValues: ["responsive", "seo", "blog", "contact_form", "map", "payment", "admin"],
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
    orderValue: "enterprise",
    nameBn: "এন্টারপ্রাইজ",
    nameEn: "Enterprise",
    priceBdt: 0,
    priceUsd: 0,
    includedPages: null,
    includedFeatureValues: ["responsive", "seo", "blog", "contact_form", "map", "payment", "auth", "admin", "multilang", "analytics"],
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
    valuesEn: { basic: "1-3", standard: "5-10", premium: "Unlimited", enterprise: "Custom" },
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
    valuesEn: { basic: "Basic", standard: "Advanced", premium: "Full", enterprise: "Full" },
  },
  {
    id: "cmp-support",
    featureBn: "সাপোর্ট",
    featureEn: "Support",
    values: { basic: "সীমিত", standard: "স্ট্যান্ডার্ড", premium: "প্রায়োরিটি", enterprise: "প্রায়োরিটি" },
    valuesEn: { basic: "Limited", standard: "Standard", premium: "Priority", enterprise: "Priority" },
  },
  {
    id: "cmp-delivery",
    featureBn: "ডেলিভারি",
    featureEn: "Delivery",
    values: { basic: "১ সপ্তাহ", standard: "২ সপ্তাহ", premium: "৩ সপ্তাহ", enterprise: "কাস্টম" },
    valuesEn: { basic: "1 week", standard: "2 weeks", premium: "3 weeks", enterprise: "Custom" },
  },
  {
    id: "cmp-revisions",
    featureBn: "বিনামূল্যে রিভিশন",
    featureEn: "Free Revisions",
    values: { basic: "৩ বার", standard: "৩ বার", premium: "৩ বার", enterprise: "৩ বার" },
    valuesEn: { basic: "3 rounds", standard: "3 rounds", premium: "3 rounds", enterprise: "3 rounds" },
  },
];

const defaultProcessSteps: ServicesProcessStep[] = [
  {
    id: "step-discover",
    stepBn: "০১",
    stepEn: "01",
    titleBn: "ডিসকভার",
    titleEn: "Discover",
    descriptionBn: "আপনার লক্ষ্য, অডিয়েন্স ও প্রয়োজন বুঝে নেওয়া",
    descriptionEn: "I understand your goals, audience and requirements",
  },
  {
    id: "step-plan",
    stepBn: "০২",
    stepEn: "02",
    titleBn: "প্ল্যান",
    titleEn: "Plan",
    descriptionBn: "স্কোপ, পেজ স্ট্রাকচার, সময়রেখা ও বাজেট নির্ধারণ",
    descriptionEn: "We fix scope, page structure, timeline and budget",
  },
  {
    id: "step-design",
    stepBn: "০৩",
    stepEn: "03",
    titleBn: "ডিজাইন",
    titleEn: "Design",
    descriptionBn: "আপনার ব্র্যান্ডের সাথে মানানসই আধুনিক UI ডিজাইন",
    descriptionEn: "A modern UI design that fits your brand",
  },
  {
    id: "step-develop",
    stepBn: "০৪",
    stepEn: "04",
    titleBn: "ডেভেলপ",
    titleEn: "Develop",
    descriptionBn: "কোড লেখা, কনটেন্ট বসানো ও প্রতিটি ফিচার টেস্ট করা",
    descriptionEn: "Clean code, real content and every feature tested",
  },
  {
    id: "step-launch",
    stepBn: "০৫",
    stepEn: "05",
    titleBn: "লঞ্চ",
    titleEn: "Launch",
    descriptionBn: "ডিপ্লয়, ডোমেইন কনেক্ট ও ডেলিভারির পর সাপোর্ট",
    descriptionEn: "Deploy, connect your domain, and support afterwards",
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
      isStringArray(item.featuresEn, 16, MAX_ITEM_TEXT) &&
      (item.pricingPackageId === undefined || isText(item.pricingPackageId, 80, true))
    );
  });
}

function validatePackages(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > MAX_PACKAGES) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    const bdt = Number(item.priceBdt);
    const usd = Number(item.priceUsd);
    const includedPages = item.includedPages;
    return (
      isText(item.id, 80) &&
      typeof item.visible === "boolean" &&
      (item.orderValue === undefined || isText(item.orderValue, 80)) &&
      isText(item.nameBn, MAX_SHORT) &&
      isText(item.nameEn, MAX_SHORT) &&
      Number.isFinite(bdt) &&
      bdt >= 0 &&
      bdt <= 100_000_000 &&
      Number.isFinite(usd) &&
      usd >= 0 &&
      usd <= 1_000_000 &&
      (includedPages === undefined ||
        includedPages === null ||
        (typeof includedPages === "number" &&
          Number.isInteger(includedPages) &&
          includedPages >= 0 &&
          includedPages <= 10_000)) &&
      (item.includedFeatureValues === undefined ||
        isStringArray(item.includedFeatureValues, 30, 80)) &&
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
    const cellsValid = Object.entries(row.values).every(([key, cell]) => {
      if (!packageIds.has(key)) return false;
      return isText(cell, MAX_SHORT, true);
    });
    if (!cellsValid) return false;
    // valuesEn is optional English cell text; when present it follows the same
    // key/shape rules as `values`.
    if (row.valuesEn !== undefined) {
      if (!isRecord(row.valuesEn)) return false;
      return Object.entries(row.valuesEn).every(([key, cell]) => {
        if (!packageIds.has(key)) return false;
        return isText(cell, MAX_SHORT, true);
      });
    }
    return true;
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

function legacyIncludedPages(packageId: string): number | null {
  if (packageId === "basic") return 3;
  if (packageId === "standard") return 10;
  return null;
}

function legacyIncludedFeatureValues(packageId: string): string[] {
  const included: Record<string, string[]> = {
    basic: ["responsive", "seo", "contact_form"],
    standard: ["responsive", "seo", "blog", "contact_form", "map"],
    premium: ["responsive", "seo", "blog", "contact_form", "map", "payment", "admin"],
    enterprise: ["responsive", "seo", "blog", "contact_form", "map", "payment", "auth", "admin", "multilang", "analytics"],
  };
  return included[packageId] ?? [];
}

function legacyFeaturedPricingId(featuredId: string, index: number, packages: ServicesPackage[]): string {
  const knownLinks: Record<string, string> = {
    "featured-portfolio": "basic",
    "featured-ecommerce": "premium",
    "featured-custom": "enterprise",
  };
  return knownLinks[featuredId] ?? packages[index]?.id ?? "";
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

  // Hydrate Phase 32 fields so existing production JSON remains valid until the
  // additive migration is applied. Explicit stored values always win.
  const packages = (input.packages as Record<string, unknown>[]).map((item) => ({
    ...item,
    orderValue: typeof item.orderValue === "string" ? item.orderValue : String(item.id),
    includedPages:
      item.includedPages === undefined ? legacyIncludedPages(String(item.id)) : item.includedPages,
    includedFeatureValues:
      item.includedFeatureValues === undefined
        ? legacyIncludedFeatureValues(String(item.id))
        : item.includedFeatureValues,
  })) as unknown as ServicesPackage[];

  const packageIds = new Set(packages.map((pkg) => pkg.id));
  const orderValues = new Set(packages.map((pkg) => pkg.orderValue));
  if (packageIds.size !== packages.length || orderValues.size !== packages.length) return null;
  if (!validateComparisonRows(input.comparisonRows, packageIds)) return null;

  if (!validateSection(input.processSection)) return null;
  if (!validateProcessSteps(input.processSteps)) return null;
  if (!validateCta(input.cta)) return null;

  const featuredPackages = (input.featuredPackages as Record<string, unknown>[]).map(
    (item, index) => ({
      ...item,
      pricingPackageId:
        typeof item.pricingPackageId === "string"
          ? item.pricingPackageId
          : legacyFeaturedPricingId(String(item.id), index, packages),
    })
  ) as unknown as ServicesFeaturedPackage[];

  return {
    ...(input as unknown as ServicesConfig),
    packages,
    featuredPackages,
  };
}
