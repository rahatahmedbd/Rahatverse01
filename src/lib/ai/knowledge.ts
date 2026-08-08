// ── Nuva — AI Knowledge Base ──────────────────────────
// Single source of truth about the site for the AI assistant.
// Used in two ways:
//   1. As the system prompt context for the real LLM providers (Grok AI
//      on Vercel, then Groq) — see /api/chat and /lib/ai/server.ts.
//   2. As a built-in keyword-matched FAQ so the assistant still answers
//      common questions instantly and for free when no provider is set.
//
// GREETING RULE: Nuva says Salam ("Assalamu Alaikum") ONLY on the very first
// message of a conversation. Follow-up replies must NOT repeat the greeting.
// NEVER use Nomoskar/Namaskar/Namaste as a greeting.

export type AiLocale = "en" | "bn";

export interface AiLink {
  href: string;
  labelEn: string;
  labelBn: string;
  external?: boolean;
}

export interface AiFaqEntry {
  id: string;
  /** Lowercase keywords/phrases matched against the visitor message (EN + BN). */
  keywords: string[];
  answerEn: string;
  answerBn: string;
  links?: AiLink[];
}

// ── Shared links ───────────────────────────────────────
export const AI_LINKS = {
  about: { href: "/about", labelEn: "About Rahat", labelBn: "রাহাত সম্পর্কে" },
  order: { href: "/order", labelEn: "Order Now", labelBn: "অর্ডার করুন" },
  services: { href: "/services", labelEn: "View Services", labelBn: "সেবা দেখুন" },
  portfolio: { href: "/portfolio", labelEn: "See Portfolio", labelBn: "পোর্টফোলিও দেখুন" },
  experience: {
    href: "/experience",
    labelEn: "Experience & Blood Society",
    labelBn: "অভিজ্ঞতা ও রক্তদান",
  },
  achievements: {
    href: "/achievements",
    labelEn: "See Achievements",
    labelBn: "অর্জন দেখুন",
  },
  gallery: { href: "/gallery", labelEn: "View Gallery", labelBn: "গ্যালারি দেখুন" },
  blog: { href: "/blog", labelEn: "Read the Blog", labelBn: "ব্লগ পড়ুন" },
  links: {
    href: "/links",
    labelEn: "Link Hub (Socials)",
    labelBn: "সব লিংক (সোশ্যাল)",
  },
  login: { href: "/login", labelEn: "Login / Dashboard", labelBn: "লগইন / ড্যাশবোর্ড" },
  privacy: { href: "/privacy", labelEn: "Privacy Policy", labelBn: "প্রাইভেসি নীতি" },
  refund: { href: "/refund", labelEn: "Refund Policy", labelBn: "রিফান্ড নীতি" },
  terms: {
    href: "/terms-of-service",
    labelEn: "Terms of Service",
    labelBn: "সেবার শর্তাবলী",
  },
  contact: { href: "/contact", labelEn: "Contact Page", labelBn: "যোগাযোগ করুন" },
  whatsapp: {
    href: "https://wa.me/8801626224878",
    labelEn: "Chat on WhatsApp",
    labelBn: "হোয়াটসঅ্যাপে কথা বলুন",
    external: true,
  },
} as const satisfies Record<string, AiLink>;

// ── Site facts (fed to LLM providers as system context) ─
// Keep this accurate: it mirrors src/lib/{services,contact,about,portfolio,
// experience,blog,content,links}/config.ts and src/lib/constants.ts defaults.
export const SITE_FACTS = `
You are "Nuva", the mature, friendly and professional AI assistant built into Rahat
Ahmed's personal website, RahatVerse (https://rahatverse01.vercel.app). Rahat is a
Muslim web developer from Sunamganj, Bangladesh. You represent his website with
honesty, good manners and Islamic etiquette.

ABOUT RAHAT AHMED:
- Web developer building modern websites and web apps with Next.js, React,
  TypeScript, Tailwind CSS, Supabase and Cloudinary.
- Student: HSC 2nd Year (Science) at Sunamganj Govt. College (current). SSC (2025)
  with GPA 5.00 (Golden A+) from Sunamganj Govt. Jubilee High School. Earlier
  primary education in Sylhet (Scholars Home) and PSC from Jibdara Govt. Primary School.
- BNCC Army Cadet (Cadet No. 25071152), blood donor (blood group A+, 4 donations),
  member of Shantichakra Blood Society (a voluntary blood donation organization in Sunamganj).
- Founder & director of FS Coaching Center (Jibdara Bazar, Shantiganj, Sunamganj), which
  provided affordable quality tuition for underprivileged students of class 6-10 —
  currently temporarily paused.
- Born 21 June 2006; from Sunamganj, Bangladesh.

ABOUT THIS WEBSITE (RAHATVERSE):
- A bilingual (Bangla + English) interactive portfolio and website-ordering platform.
- Built with Next.js 16, TypeScript, Tailwind CSS, Supabase, Cloudinary; hosted on Vercel.
- Includes: home, about, portfolio, services & pricing, experience (incl. blood society),
  achievements, gallery & video portfolio, blog, order wizard, contact, link hub,
  newsletter (double opt-in), legal pages (privacy, refund, terms, cookie), an admin
  dashboard, appointment booking, gamified interactive elements, day/night themes,
  and the AI assistant (you).

SERVICES AND STARTING PRICES (Bangladeshi Taka):
- Web Development: modern fast responsive websites, from ৳5,000 (1-3 week delivery)
- Portfolio Website: professional personal portfolio, from ৳5,000 (1-2 weeks)
- Business Website: company profile, service pages, blog, ৳10,000-৳25,000 (1-3 weeks)
- Educational Institution website: courses, teachers, admission info, ৳10,000-৳25,000
- Blood Donation Organization website: donor registration, blood requests, ৳15,000-৳30,000
- E-Commerce Website: product catalog, cart, payment integration, from ৳30,000 (2-4 weeks)
- Also: News portals and Landing pages.

FIXED PACKAGES:
- Basic: ৳5,000 (~$60) — 1-3 pages, responsive design, contact form, basic SEO, ~1 week
- Standard (most popular): ৳15,000 (~$180) — 5-10 pages, blog section, advanced SEO, ~2 weeks
- Premium: ৳30,000 (~$360) — unlimited pages, e-commerce, payment gateway, admin dashboard, ~3 weeks
- Enterprise: custom pricing — custom features, priority support, monthly maintenance

HOW TO ORDER:
1. Fill the order form on the /order page (website type, pages, features).
2. Rahat confirms details and the final price.
3. Your project starts — delivery is typically 1-3 weeks depending on the package.
Payments: bKash, Nagad and SSLCommerz (details are discussed after ordering). Visitors
can also message Rahat directly on WhatsApp.

PORTFOLIO PROJECTS (see /portfolio for details):
- RahatVerse — this very site (Next.js 16, TypeScript, Tailwind, Supabase, Cloudinary, i18n).
- Shantichakra Blood Society — digital donor directory & emergency blood request portal.
- EduCare — interactive tutoring & student management platform.

BLOG: articles about education, technology and social service (categories: Science,
Social, Education, Technology).

CONTACT: Email rahatbd20505@gmail.com — Phone/WhatsApp +880 1626-224878 (usually replies
within 24 hours). Pages: /services (services & pricing), /portfolio (past work),
/achievements, /experience, /gallery, /blog, /links (all social media), /order (order
form), /contact (contact form & channels).

GREETING RULE — MOST IMPORTANT:
- Say the Islamic greeting "Assalamu Alaikum" (English) or "আসসালামু আলাইকুম" (Bangla)
  ONLY on the FIRST message of a brand-new conversation.
- If the conversation has already started (the visitor already asked something, or you
  already greeted them), DO NOT repeat the greeting — answer directly and naturally.
  Never start every reply with Salam.
- NEVER use "Nomoskar", "Nomoshkar", "Namaskar", "Namaste", "Hello" or "Hi" as the
  primary greeting. The only greeting is Salam, and it appears once, at the start.
- If the visitor greets you mid-conversation, respond warmly WITHOUT repeating Salam.

RULES FOR YOUR ANSWERS:
- Be mature, realistic and honest: give practical, grounded, professional answers.
  No hype, no exaggerated claims, no invented facts, prices, discounts or promises.
- If you don't know something (e.g. exact availability), say so honestly and suggest
  contacting Rahat on WhatsApp or via the /contact page.
- Keep answers concise (under ~150 words), warm and professional.
- Answer in the same language the visitor used (English or Bangla).
- Encourage visitors toward ordering or contacting only when genuinely relevant.
`.trim();

// ── FAQ entries for the free built-in fallback ─────────
// NOTE: keywords are lowercase; matching is a substring check after
// lowercasing the visitor message, so include both EN and BN variants.
export const AI_FAQ: AiFaqEntry[] = [
  {
    id: "services",
    keywords: [
      "service",
      "services",
      "what do you do",
      "what can you build",
      "offer",
      "সেবা",
      "সার্ভিস",
      "কী কী",
      "কি কি",
      "তৈরি কর",
      "বানান",
    ],
    answerEn:
      "Rahat builds modern websites & web apps:\n• Portfolio websites (from ৳5,000)\n• Business websites (৳10,000–25,000)\n• E-commerce stores (from ৳30,000)\n• Educational institution sites (৳10,000–25,000)\n• Blood donation organization sites (৳15,000–30,000)\n• News portals & landing pages\n\nEverything is built with Next.js, React, Tailwind CSS and Supabase — fast, responsive and SEO-friendly.",
    answerBn:
      "রাহাত আধুনিক ওয়েবসাইট ও ওয়েব অ্যাপ তৈরি করেন:\n• পোর্টফোলিও ওয়েবসাইট (৳৫,০০০ থেকে শুরু)\n• ব্যবসায়িক ওয়েবসাইট (৳১০,০০০–২৫,০০০)\n• ই-কমার্স ওয়েবসাইট (৳৩০,০০০ থেকে শুরু)\n• শিক্ষা প্রতিষ্ঠানের ওয়েবসাইট (৳১০,০০০–২৫,০০০)\n• রক্তদান সংগঠনের ওয়েবসাইট (৳১৫,০০০–৩০,০০০)\n• নিউজ পোর্টাল ও ল্যান্ডিং পেজ\n\nসবকিছু Next.js, React, Tailwind CSS ও Supabase দিয়ে তৈরি — দ্রুত, রেসপনসিভ ও SEO-ফ্রেন্ডলি।",
    links: [AI_LINKS.services, AI_LINKS.portfolio],
  },
  {
    id: "pricing",
    keywords: [
      "price",
      "pricing",
      "cost",
      "how much",
      "charge",
      "fee",
      "budget",
      "taka",
      "package",
      "দাম",
      "খরচ",
      "কত টাকা",
      "কত",
      "প্যাকেজ",
      "বাজেট",
    ],
    answerEn:
      "Here are the website packages:\n• Basic — ৳5,000 (~$60): 1–3 pages, contact form, basic SEO, 1 week\n• Standard — ৳15,000 (~$180): 5–10 pages, blog, advanced SEO, 2 weeks (most popular)\n• Premium — ৳30,000 (~$360): unlimited pages, e-commerce + payment gateway, admin dashboard, 3 weeks\n• Enterprise — custom pricing for custom needs\n\nFinal cost depends on your exact requirements — message us for a free quote.",
    answerBn:
      "ওয়েবসাইট প্যাকেজগুলো:\n• বেসিক — ৳৫,০০০ (~$60): ১–৩ পেজ, কন্টাক্ট ফর্ম, বেসিক SEO, ১ সপ্তাহ\n• স্ট্যান্ডার্ড — ৳১৫,০০০ (~$180): ৫–১০ পেজ, ব্লগ, অ্যাডভান্সড SEO, ২ সপ্তাহ (সবচেয়ে জনপ্রিয়)\n• প্রিমিয়াম — ৳৩০,০০০ (~$360): আনলিমিটেড পেজ, ই-কমার্স + পেমেন্ট গেটওয়ে, অ্যাডমিন ড্যাশবোর্ড, ৩ সপ্তাহ\n• এন্টারপ্রাইজ — প্রয়োজন অনুযায়ী কাস্টম মূল্য\n\nচূড়ান্ত খরচ আপনার প্রয়োজনের উপর নির্ভর করে — ফ্রি কোটেশনের জন্য মেসেজ করুন।",
    links: [AI_LINKS.services, AI_LINKS.whatsapp],
  },
  {
    id: "order",
    keywords: [
      "order",
      "buy",
      "hire",
      "start",
      "book",
      "place an order",
      "get started",
      "অর্ডার",
      "অর্ডার কর",
      "শুরু",
      "নিতে চাই",
      "বানাতে চাই",
      "কাজ দিতে",
    ],
    answerEn:
      "Ordering is easy:\n1. Go to the Order page and fill in the project form (type of website, pages, features)\n2. Rahat will contact you to confirm details and pricing\n3. Your project starts!\n\nPrefer talking first? Just message on WhatsApp and describe what you need.",
    answerBn:
      "অর্ডার করা খুবই সহজ:\n১. অর্ডার পেজে গিয়ে প্রজেক্ট ফর্মটি পূরণ করুন (ওয়েবসাইটের ধরন, পেজ, ফিচার)\n২. রাহাত বিস্তারিত ও মূল্য নিশ্চিত করতে আপনার সাথে যোগাযোগ করবেন\n৩. আপনার প্রজেক্ট শুরু!\n\nআগে কথা বলতে চান? হোয়াটসঅ্যাপে মেসেজ করে আপনার প্রয়োজন লিখুন।",
    links: [AI_LINKS.order, AI_LINKS.whatsapp],
  },
  {
    id: "contact",
    keywords: [
      "contact",
      "email",
      "phone",
      "whatsapp",
      "call",
      "reach",
      "talk",
      "message",
      "যোগাযোগ",
      "ইমেইল",
      "মেইল",
      "ফোন",
      "হোয়াটসঅ্যাপ",
      "কল",
      "মেসেজ",
    ],
    answerEn:
      "You can reach Rahat here:\n• WhatsApp: +880 1626-224878 (fastest reply)\n• Email: rahatbd20505@gmail.com\n• Or use the contact form on the Contact page.",
    answerBn:
      "রাহাতের সাথে যোগাযোগের উপায়:\n• হোয়াটসঅ্যাপ: +880 1626-224878 (দ্রুততম উত্তর)\n• ইমেইল: rahatbd20505@gmail.com\n• অথবা Contact পেজের ফর্ম ব্যবহার করুন।",
    links: [AI_LINKS.whatsapp, AI_LINKS.contact],
  },
  {
    id: "delivery",
    keywords: [
      "delivery",
      "how long",
      "time",
      "deadline",
      "fast",
      "duration",
      "week",
      "ডেলিভারি",
      "সময়",
      "কতদিন",
      "দিন লাগবে",
      "দ্রুত",
    ],
    answerEn:
      "Typical delivery times:\n• Basic package: ~1 week\n• Standard: ~2 weeks\n• Premium / e-commerce: 2–4 weeks\n\nUrgent project? Mention it on WhatsApp — rush delivery may be possible.",
    answerBn:
      "সাধারণ ডেলিভারি সময়:\n• বেসিক প্যাকেজ: ~১ সপ্তাহ\n• স্ট্যান্ডার্ড: ~২ সপ্তাহ\n• প্রিমিয়াম / ই-কমার্স: ২–৪ সপ্তাহ\n\nজরুরি প্রজেক্ট? হোয়াটসঅ্যাপে জানান — দ্রুত ডেলিভারি সম্ভব হতে পারে।",
    links: [AI_LINKS.services, AI_LINKS.whatsapp],
  },
  {
    id: "portfolio",
    keywords: [
      "portfolio",
      "previous work",
      "examples",
      "projects",
      "past work",
      "sample",
      "পোর্টফোলিও",
      "আগের কাজ",
      "প্রজেক্ট",
      "নমুনা",
      "কাজ দেখ",
    ],
    answerEn:
      "You can browse Rahat's previous projects on the Portfolio page, and his achievements & certifications on the Achievements page. Live site links and case-study details are included there.",
    answerBn:
      "পোর্টফোলিও পেজে রাহাতের আগের প্রজেক্টগুলো দেখতে পারবেন, আর Achievements পেজে তার অর্জন ও সার্টিফিকেট। সেখানে লাইভ সাইটের লিংক ও বিস্তারিত তথ্য রয়েছে।",
    links: [AI_LINKS.portfolio],
  },
  {
    id: "technology",
    keywords: [
      "technology",
      "tech",
      "stack",
      "next",
      "react",
      "wordpress",
      "language",
      "টেকনোলজি",
      "প্রযুক্তি",
      "ওয়ার্ডপ্রেস",
    ],
    answerEn:
      "Websites are built with a modern stack: Next.js + React + TypeScript, styled with Tailwind CSS, powered by a Supabase database and Cloudinary media. That means your site loads fast, ranks better on Google and works perfectly on mobile.",
    answerBn:
      "ওয়েবসাইটগুলো আধুনিক প্রযুক্তিতে তৈরি হয়: Next.js + React + TypeScript, Tailwind CSS দিয়ে ডিজাইন, Supabase ডেটাবেস ও Cloudinary মিডিয়া। ফলে আপনার সাইট দ্রুত লোড হয়, Google-এ ভালো র‍্যাংক করে এবং মোবাইলে নিখুঁতভাবে চলে।",
    links: [AI_LINKS.services],
  },
  {
    id: "about-rahat",
    keywords: [
      "who is rahat",
      "who are you",
      "about rahat",
      "your name",
      "rahat",
      "রাহাত কে",
      "তুমি কে",
      "আপনি কে",
      "রাহাত",
    ],
    answerEn:
      "I'm Nuva — the AI assistant on Rahat's website. Rahat is a web developer from Bangladesh who builds fast, modern websites for individuals, businesses and organizations. Ask me about his services, prices or how to order!",
    answerBn:
      "আমি নুভা — রাহাতের ওয়েবসাইটের এআই সহকারী। রাহাত বাংলাদেশের একজন ওয়েব ডেভেলপার, যিনি ব্যক্তি, ব্যবসা ও প্রতিষ্ঠানের জন্য দ্রুত ও আধুনিক ওয়েবসাইট তৈরি করেন। তার সেবা, দাম বা অর্ডার প্রক্রিয়া সম্পর্কে আমাকে জিজ্ঞেস করুন!",
  },
  {
    id: "maintenance",
    keywords: [
      "maintenance",
      "support",
      "update my site",
      "fix",
      "bug",
      "hosting",
      "domain",
      "মেইনটেন্যান্স",
      "সাপোর্ট",
      "হোস্টিং",
      "ডোমেইন",
      "ঠিক",
    ],
    answerEn:
      "Yes — ongoing support and maintenance is available. The Enterprise package includes monthly maintenance, and any past client can ask for updates or fixes. Hosting and domain setup guidance is also provided with every project.",
    answerBn:
      "হ্যাঁ — নিয়মিত সাপোর্ট ও মেইনটেন্যান্স সেবা রয়েছে। এন্টারপ্রাইজ প্যাকেজে মাসিক মেইনটেন্যান্স অন্তর্ভুক্ত, আর যেকোনো পূর্বের ক্লায়েন্ট আপডেট বা সমস্যা সমাধানের জন্য যোগাযোগ করতে পারেন। প্রতিটি প্রজেক্টেই হোস্টিং ও ডোমেইন সেটআপে সহায়তা দেওয়া হয়।",
    links: [AI_LINKS.whatsapp],
  },
  {
    id: "site-info",
    keywords: [
      "what is rahatverse",
      "what is this site",
      "about this website",
      "what is this website",
      "rahatverse",
      "রাহাতভার্স",
      "এই ওয়েবসাইট কী",
      "এই সাইট কী",
      "সাইট সম্পর্কে",
      "ওয়েবসাইট সম্পর্কে",
    ],
    answerEn:
      "RahatVerse is Rahat Ahmed's bilingual (Bangla + English) personal website. It combines an interactive portfolio with a website-ordering platform: visitors can explore his work, services and achievements, read his blog, browse the gallery, and order a website through the /order page. It is built with Next.js, TypeScript, Tailwind CSS, Supabase and Cloudinary, and hosted on Vercel.",
    answerBn:
      "RahatVerse হলো রাহাত আহমেদের দ্বিভাষিক (বাংলা + ইংরেজি) ব্যক্তিগত ওয়েবসাইট। এটি একটি ইন্টারঅ্যাকটিভ পোর্টফোলিও ও ওয়েবসাইট অর্ডারিং প্ল্যাটফর্ম — এখানে তাঁর কাজ, সেবা, অর্জন, ব্লগ ও গ্যালারি দেখতে পারবেন, এবং /order পেজ থেকে ওয়েবসাইট অর্ডার করতে পারবেন। এটি Next.js, TypeScript, Tailwind CSS, Supabase ও Cloudinary দিয়ে তৈরি এবং Vercel-এ হোস্ট করা।",
    links: [AI_LINKS.about, AI_LINKS.portfolio],
  },
  {
    id: "achievements",
    keywords: [
      "achievement",
      "achievements",
      "award",
      "awards",
      "prize",
      "certificate",
      "honor",
      "medal",
      "অর্জন",
      "পুরস্কার",
      "এওয়ার্ড",
      "সার্টিফিকেট",
      "সম্মাননা",
      "মেডেল",
    ],
    answerEn:
      "Rahat has several notable achievements:\n• SSC 2025 — GPA 5.00 (Golden A+) in Science\n• 45th National Science Fair — 1st place (district)\n• 44th Science Exhibition — 1st place (regional, smart-city model)\n• Creative Talent Search 2024 — 1st place (Science)\n• 46th National Science Fair — 1st in Quiz, 3rd in Project, 4th in Olympiad\n• Outstanding Student Honor (among top A+ students)\n\nSee the Achievements page for the full list.",
    answerBn:
      "রাহাতের উল্লেখযোগ্য অর্জনগুলো:\n• SSC ২০২৫ — জিপিএ ৫.০০ (গোল্ডেন এ+) বিজ্ঞান বিভাগে\n• ৪৫তম জাতীয় বিজ্ঞান মেলা — ১ম স্থান (জেলা)\n• ৪৪তম বিজ্ঞান প্রদর্শনী — ১ম স্থান (আঞ্চলিক, স্মার্ট-সিটি মডেল)\n• সৃজনশীল মেধা অন্বেষণ ২০২৪ — ১ম স্থান (বিজ্ঞান)\n• ৪৬তম বিজ্ঞান মেলা — কুইজে ১ম, প্রজেক্টে ৩য়, অলিম্পিয়াডে ৪র্থ\n• কৃতী শিক্ষার্থী সংবর্ধনা\n\nসম্পূর্ণ তালিকার জন্য Achievements পেজ দেখুন।",
    links: [AI_LINKS.achievements],
  },
  {
    id: "gallery",
    keywords: [
      "gallery",
      "photo",
      "photos",
      "picture",
      "pictures",
      "image",
      "video",
      "গ্যালারি",
      "ছবি",
      "ফটো",
      "ভিডিও",
    ],
    answerEn:
      "The Gallery page contains Rahat's photo collection, and there is also a video portfolio section. Everything is optimized and delivered through Cloudinary for fast loading. You can browse both on the /gallery page.",
    answerBn:
      "Gallery পেজে রাহাতের ছবির সংগ্রহ রয়েছে, সাথে একটি ভিডিও পোর্টফোলিও সেকশনও আছে। সব মিডিয়া Cloudinary দিয়ে অপটিমাইজড হয়ে দ্রুত লোড হয়। /gallery পেজে দুটোই দেখতে পারবেন।",
    links: [AI_LINKS.gallery],
  },
  {
    id: "blog",
    keywords: [
      "blog",
      "article",
      "articles",
      "post",
      "posts",
      "write",
      "writing",
      "লেখা",
      "ব্লগ",
      "আর্টিকেল",
      "পোস্ট",
    ],
    answerEn:
      "Rahat writes on the Blog page about education, technology and social service. Posts are organized into categories: Science, Social, Education and Technology. You can read the latest articles at /blog.",
    answerBn:
      "রাহাত ব্লগ পেজে শিক্ষা, প্রযুক্তি ও সমাজসেবা নিয়ে লেখেন। পোস্টগুলো ক্যাটাগরিতে সাজানো: বিজ্ঞান, সমাজসেবা, শিক্ষা ও প্রযুক্তি। /blog পেজে সর্বশেষ লেখাগুলো পড়তে পারবেন।",
    links: [AI_LINKS.blog],
  },
  {
    id: "blood",
    keywords: [
      "blood",
      "donate",
      "donation",
      "donor",
      "blood group",
      "রক্ত",
      "রক্তদান",
      "দান",
      "রক্তের গ্রুপ",
      "ডোনার",
    ],
    answerEn:
      "Rahat is a voluntary blood donor (blood group A+) and has donated 4 times. He is a member of Shantichakra Blood Society, a voluntary blood donation organization based in Sunamganj that connects donors with patients in emergencies. Details are on the /experience page.",
    answerBn:
      "রাহাত একজন স্বেচ্ছাসেবক রক্তদাতা (রক্তের গ্রুপ A+) এবং ৪ বার রক্তদান করেছেন। তিনি সুনামগঞ্জ ভিত্তিক স্বেচ্ছাসেবী রক্তদান সংগঠন শান্তিচক্র ব্লাড সোসাইটির সদস্য, যা জরুরি প্রয়োজনে রক্তদাতা ও রোগীদের সংযোগ ঘটায়। বিস্তারিত /experience পেজে আছে।",
    links: [AI_LINKS.experience, AI_LINKS.whatsapp],
  },
  {
    id: "experience",
    keywords: [
      "experience",
      "coaching",
      "organization",
      "organizations",
      "bncc",
      "cadet",
      "blood society",
      "অভিজ্ঞতা",
      "কোচিং",
      "সংগঠন",
      "বিএনসিসি",
      "ক্যাডেট",
      "ব্লাড সোসাইটি",
    ],
    answerEn:
      "Rahat's experience includes:\n• Founder & director of FS Coaching Center (Jibdara Bazar, Shantiganj, Sunamganj) — affordable tuition for class 6-10 students; temporarily paused.\n• Member of Shantichakra Blood Society — voluntary blood donation.\n• BNCC Army Cadet (Cadet No. 25071152).\n\nSee the /experience page for the full story.",
    answerBn:
      "রাহাতের অভিজ্ঞতা:\n• FS কোচিং সেন্টারের প্রতিষ্ঠাতা ও পরিচালক (জীবদাড়া বাজার, শান্তিগঞ্জ, সুনামগঞ্জ) — ৬ষ্ঠ-১০ম শ্রেণির শিক্ষার্থীদের সুলভ মূল্যে পাঠদান; বর্তমানে সাময়িক বন্ধ।\n• শান্তিচক্র ব্লাড সোসাইটির সদস্য — স্বেচ্ছাসেবী রক্তদান।\n• BNCC আর্মি ক্যাডেট (ক্যাডেট নং 25071152)।\n\nসম্পূর্ণ বিবরণ /experience পেজে।",
    links: [AI_LINKS.experience],
  },
  {
    id: "education",
    keywords: [
      "education",
      "study",
      "studies",
      "school",
      "college",
      "ssc",
      "hsc",
      "gpa",
      "university",
      "পড়াশোনা",
      "শিক্ষা",
      "স্কুল",
      "কলেজ",
      "জিপিএ",
      "এসএসসি",
      "এইচএসসি",
    ],
    answerEn:
      "Rahat's education:\n• Primary: Scholars Home, Sylhet; PSC from Jibdara Govt. Primary School.\n• SSC (2025): Sunamganj Govt. Jubilee High School — GPA 5.00 (Golden A+) in Science.\n• HSC: currently 2nd Year (Science) at Sunamganj Govt. College.\n\nMore details are on the About page.",
    answerBn:
      "রাহাতের শিক্ষাজীবন:\n• প্রাথমিক: স্কলারস হোম, সিলেট; জীবদাড়া সরকারি প্রাথমিক বিদ্যালয় থেকে PSC।\n• SSC (২০২৫): সুনামগঞ্জ সরকারি জুবিলী উচ্চ বিদ্যালয় — বিজ্ঞানে জিপিএ ৫.০০ (গোল্ডেন এ+)।\n• HSC: বর্তমানে সুনামগঞ্জ সরকারি কলেজে ২য় বর্ষ (বিজ্ঞান)।\n\nবিস্তারিত About পেজে।",
    links: [AI_LINKS.about],
  },
  {
    id: "payments",
    keywords: [
      "payment",
      "pay",
      "bkash",
      "bikash",
      "nagad",
      "sslcommerz",
      "card",
      "পেমেন্ট",
      "বিকাশ",
      "নগদ",
      "কীভাবে পেমেন্ট",
      "টাকা",
      "পরিশোধ",
    ],
    answerEn:
      "Payments are accepted via bKash, Nagad and SSLCommerz. Payment details are confirmed after you place an order — you'll receive the exact amount and instructions once your project scope and package are finalized.",
    answerBn:
      "পেমেন্ট বিকাশ, নগদ ও SSLCommerz-এর মাধ্যমে নেওয়া হয়। অর্ডার করার পর পেমেন্টের বিস্তারিত নিশ্চিত করা হয় — প্রজেক্টের ধরন ও প্যাকেজ চূড়ান্ত হলে সঠিক পরিমাণ ও নির্দেশনা পেয়ে যাবেন।",
    links: [AI_LINKS.order, AI_LINKS.whatsapp],
  },
  {
    id: "link-hub",
    keywords: [
      "social media",
      "facebook",
      "instagram",
      "youtube",
      "tiktok",
      "github",
      "link hub",
      "links",
      "সোশ্যাল",
      "ফেসবুক",
      "ইনস্টাগ্রাম",
      "ইউটিউব",
      "টিকটক",
      "গিটহাব",
      "লিংক",
    ],
    answerEn:
      "All of Rahat's social profiles — Facebook, Instagram, YouTube, TikTok, WhatsApp, Email, Phone and GitHub — are collected in one place on the Link Hub page (/links). There you'll also find the tools he uses and his resume.",
    answerBn:
      "রাহাতের সব সোশ্যাল প্রোফাইল — ফেসবুক, ইনস্টাগ্রাম, ইউটিউব, টিকটক, হোয়াটসঅ্যাপ, ইমেইল, ফোন ও গিটহাব — এক জায়গায় Link Hub পেজে (/links) পাবেন। সেখানে তাঁর ব্যবহৃত টুলস ও রিজিউমও রয়েছে।",
    links: [AI_LINKS.links],
  },
  {
    id: "newsletter",
    keywords: [
      "newsletter",
      "subscribe",
      "subscription",
      "email update",
      "updates",
      "নিউজলেটার",
      "সাবস্ক্রাইব",
      "আপডেট",
    ],
    answerEn:
      "Yes! You can subscribe to the newsletter to receive updates and new articles by email. Signup uses double opt-in — you'll get a confirmation email first. You can unsubscribe anytime.",
    answerBn:
      "জি! নিউজলেটারে সাবস্ক্রাইব করে ইমেইলে নতুন আপডেট ও আর্টিকেল পেতে পারেন। সাইনআপে ডাবল অপ্ট-ইন ব্যবহৃত হয় — আগে একটি কনফার্মেশন ইমেইল আসবে। যেকোনো সময় আনসাবস্ক্রাইব করতে পারবেন।",
    links: [AI_LINKS.blog],
  },
  {
    id: "legal",
    keywords: [
      "privacy",
      "refund",
      "terms",
      "policy",
      "cookie",
      "legal",
      "প্রাইভেসি",
      "রিফান্ড",
      "শর্তাবলী",
      "শর্ত",
      "নীতি",
      "কুকি",
      "আইনি",
    ],
    answerEn:
      "The site has clear legal pages: Privacy Policy, Refund Policy, Terms of Service and Cookie Policy — all linked in the footer. They explain what data is collected, how it's used, and the refund terms for orders.",
    answerBn:
      "সাইটে স্পষ্ট আইনি পেজ রয়েছে: প্রাইভেসি নীতি, রিফান্ড নীতি, সেবার শর্তাবলী ও কুকি নীতি — সব ফুটারে লিংক করা আছে। সেখানে কী ডেটা সংগ্রহ হয়, কীভাবে ব্যবহৃত হয় এবং অর্ডারের রিফান্ড শর্তাবলী বর্ণিত আছে।",
    links: [AI_LINKS.privacy, AI_LINKS.refund, AI_LINKS.terms],
  },
  {
    id: "dashboard",
    keywords: [
      "admin",
      "dashboard",
      "login",
      "sign in",
      "log in",
      "control panel",
      "অ্যাডমিন",
      "ড্যাশবোর্ড",
      "লগইন",
      "সাইন ইন",
    ],
    answerEn:
      "RahatVerse includes an admin dashboard where the site owner manages content, orders, blog posts, the gallery, settings and more. Visitors can log in at /login; most dashboard features are for the site owner and authorized users.",
    answerBn:
      "RahatVerse-এ একটি অ্যাডমিন ড্যাশবোর্ড আছে যেখানে সাইটের মালিক কন্টেন্ট, অর্ডার, ব্লগ পোস্ট, গ্যালারি ও সেটিংস ম্যানেজ করেন। দর্শকরা /login পেজ থেকে লগইন করতে পারেন; বেশিরভাগ ড্যাশবোর্ড ফিচার সাইট মালিক ও অনুমোদিত ব্যবহারকারীদের জন্য।",
    links: [AI_LINKS.login],
  },
];

// ── Greeting & fallback texts ──────────────────────────
// Nuva says Salam on the first message only — never Nomoskar/Namaskar
const GREETING_WORDS = [
  "hi",
  "hello",
  "hey",
  "salam",
  "assalamu",
  "assalamu alaikum",
  "walaikum",
  "good morning",
  "good evening",
  "nomoskar",
  "nomoshkar",
  "namaskar",
  "namaste",
  "adab",
  "হাই",
  "হ্যালো",
  "সালাম",
  "আসসালামু",
  "ওয়ালাইকুম",
  "নমস্কার",
  "নমস",
  "আদাব",
  "শুভ",
];

export const AI_TEXTS = {
  // First message of a conversation — this is where the single Salam lives.
  greetingEn:
    "Assalamu Alaikum! 👋 I'm Nuva, Rahat's AI assistant. Ask me anything about services, pricing, delivery time or how to order — or just tap a suggestion below.",
  greetingBn:
    "আসসালামু আলাইকুম! 👋 আমি নুভা, রাহাতের এআই সহকারী। সেবা, মূল্য, ডেলিভারির সময় বা কীভাবে অর্ডার করবেন — যা জানতে চান, জিজ্ঞেস করুন অথবা নিচের সাজেশনে ট্যাপ করুন।",
  // Follow-up messages never repeat the Salam.
  followupGreetingEn:
    "I'm here! 😊 What would you like to know — services, pricing, ordering, delivery time, or how to contact Rahat?",
  followupGreetingBn:
    "আমি এখানেই আছি! 😊 কী জানতে চান — সেবা, মূল্য, অর্ডার, ডেলিভারির সময়, না রাহাতের সাথে যোগাযোগ?",
  fallbackEn:
    "I want to make sure you get the right answer! I can help with:\n• Services & pricing\n• How to order\n• Delivery time\n• About Rahat\n• Contacting Rahat\n\nTry asking about one of those, or message Rahat directly on WhatsApp.",
  fallbackBn:
    "সঠিক উত্তরটি দিতে চাই! আমি এসব বিষয়ে সাহায্য করতে পারি:\n• সেবা ও মূল্য\n• কীভাবে অর্ডার করবেন\n• ডেলিভারির সময়\n• রাহাত সম্পর্কে\n• রাহাতের সাথে যোগাযোগ\n\nএর যেকোনো একটি নিয়ে জিজ্ঞেস করুন, অথবা সরাসরি হোয়াটসঅ্যাপে মেসেজ করুন।",
} as const;

export const QUICK_PROMPTS: { id: string; en: string; bn: string }[] = [
  { id: "qp-services", en: "What services do you offer?", bn: "আপনারা কী কী সেবা দেন?" },
  { id: "qp-pricing", en: "How much does a website cost?", bn: "ওয়েবসাইটের দাম কত?" },
  { id: "qp-order", en: "How do I place an order?", bn: "কীভাবে অর্ডার করবো?" },
  { id: "qp-contact", en: "How can I contact Rahat?", bn: "রাহাতের সাথে কীভাবে যোগাযোগ করবো?" },
];

// ── Fallback matcher ───────────────────────────────────
export interface AiKbReply {
  reply: string;
  links: AiLink[];
}

function normalize(text: string): string {
  return ` ${text.toLowerCase().replace(/\s+/g, " ").trim()} `;
}

/**
 * Scores a visitor message against the built-in FAQ. Returns the best entry
 * plus a hit count, or null when nothing matches. Word-boundary-ish matching:
 * every keyword is checked as a substring of the padded, normalized message.
 */
export function matchFaq(message: string): { entry: AiFaqEntry; score: number } | null {
  const text = normalize(message);
  let best: { entry: AiFaqEntry; score: number } | null = null;

  for (const entry of AI_FAQ) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (text.includes(keyword)) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score };
    }
  }
  return best;
}

function isGreeting(text: string): boolean {
  const normalized = normalize(text);
  // Greeting only when the message is short — "hello, what's the price of..."
  // should match the pricing FAQ instead.
  if (normalized.trim().length > 28) return false;
  return GREETING_WORDS.some((word) => normalized.includes(` ${word}`));
}

// ── Salam helper — only the FIRST message of a conversation gets Salam ──
function hasSalamPrefix(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return (
    lower.startsWith("assalamu alaikum") ||
    lower.startsWith("আসসালামু আলাইকুম") ||
    lower.startsWith("আসসালামু") ||
    lower.startsWith("assalamu")
  );
}

function withSalam(reply: string, isBn: boolean): string {
  if (hasSalamPrefix(reply)) return reply;
  const prefix = isBn ? "আসসালামু আলাইকুম! " : "Assalamu Alaikum! ";
  return prefix + reply;
}

/**
 * Free, offline answer generator — the assistant's brain when no LLM provider
 * is configured (or when the providers are unreachable).
 * Salam is added ONLY for the first exchange of a conversation (isFirstExchange);
 * follow-up replies answer directly without repeating the greeting.
 */
export function answerFromKnowledgeBase(
  message: string,
  locale: AiLocale,
  isFirstExchange = true,
): AiKbReply {
  const isBn = locale === "bn";

  if (isGreeting(message)) {
    return {
      reply: isFirstExchange
        ? isBn
          ? AI_TEXTS.greetingBn
          : AI_TEXTS.greetingEn
        : isBn
          ? AI_TEXTS.followupGreetingBn
          : AI_TEXTS.followupGreetingEn,
      links: [],
    };
  }

  const match = matchFaq(message);
  if (match) {
    const { entry } = match;
    const rawReply = isBn ? entry.answerBn : entry.answerEn;
    return {
      reply: isFirstExchange ? withSalam(rawReply, isBn) : rawReply,
      links: entry.links?.map((link) => ({ ...link })) ?? [],
    };
  }

  const rawFallback = isBn ? AI_TEXTS.fallbackBn : AI_TEXTS.fallbackEn;
  return {
    reply: isFirstExchange ? withSalam(rawFallback, isBn) : rawFallback,
    links: [
      { ...AI_LINKS.services },
      { ...AI_LINKS.order },
      { ...AI_LINKS.whatsapp },
    ],
  };
}
