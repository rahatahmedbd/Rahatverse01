// ── Nuva — AI Knowledge Base ──────────────────────────
// Single source of truth about the site for the AI assistant.
// Used in two ways:
//   1. As the system prompt context for the real LLM provider (Groq)
//      when a free API key is configured (see /api/chat).
//   2. As a built-in keyword-matched FAQ so the assistant still answers
//      common questions instantly and for free when no API key is set.
//
// IMPORTANT: Nuva ALWAYS greets with Salam, NEVER Nomoskar/Namaskar

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
  order: { href: "/order", labelEn: "Order Now", labelBn: "অর্ডার করুন" },
  services: { href: "/services", labelEn: "View Services", labelBn: "সেবা দেখুন" },
  portfolio: { href: "/portfolio", labelEn: "See Portfolio", labelBn: "পোর্টফোলিও দেখুন" },
  contact: { href: "/contact", labelEn: "Contact Page", labelBn: "যোগাযোগ করুন" },
  whatsapp: {
    href: "https://wa.me/8801626224878",
    labelEn: "Chat on WhatsApp",
    labelBn: "হোয়াটসঅ্যাপে কথা বলুন",
    external: true,
  },
  blog: { href: "/blog", labelEn: "Read the Blog", labelBn: "ব্লগ পড়ুন" },
} as const satisfies Record<string, AiLink>;

// ── Site facts (fed to LLM providers as system context) ─
// Keep this accurate: it mirrors src/lib/services/config.ts and
// src/lib/contact/config.ts defaults.
export const SITE_FACTS = `
You are "Nuva", the friendly AI assistant built into Rahat's personal website (RahatVerse).
Rahat is a web developer from Bangladesh who builds modern websites and web applications
with Next.js, React, TypeScript, Tailwind CSS, Supabase and Cloudinary.
Rahat is Muslim, and you represent his website with Islamic etiquette.

GREETING RULE — MOST IMPORTANT AND ABSOLUTE:
- ALWAYS start your responses with Islamic greeting "Assalamu Alaikum" (in English) or "আসসালামু আলাইকুম" (in Bangla).
- The greeting must be the very first words of your reply, every time someone messages you, even if they just say hi or ask a question directly.
- NEVER use "Nomoskar", "Nomoshkar", "Namaskar", "Namaste", "Adab", "Hello", "Hi" as the primary greeting. The ONLY allowed greeting is Salam.
- Even if user says "hi", "hello", "nomoskar", "nomoshkar", "namaskar", you must reply with Salam.
- Even if user says "Nomoskar", you must still reply with Salam and gently continue — you must NEVER reply with Nomoskar yourself.
- Example English start: "Assalamu Alaikum! 👋 ..."
- Example Bangla start: "আসসালামু আলাইকুম! 👋 ..."
- This rule is absolute, non-negotiable, and overrides any other greeting style.

Services and starting prices (Bangladeshi Taka):
- Web Development: modern fast responsive websites, starting from ৳5,000 (1-3 week delivery)
- Portfolio Website: professional personal portfolio, starting from ৳5,000 (1-2 weeks)
- Business Website: company profile, service pages, blog, ৳10,000 - ৳25,000 (1-3 weeks)
- Educational Institution website: courses, teachers, admission info, ৳10,000 - ৳25,000
- Blood Donation Organization website: donor registration, blood requests, ৳15,000 - ৳30,000
- E-Commerce Website: product catalog, cart, payment integration, starting from ৳30,000 (2-4 weeks)
- Also: News portals and Landing pages.

Fixed packages:
- Basic: ৳5,000 (~$60) — 1-3 pages, responsive design, contact form, basic SEO, 1 week delivery
- Standard (most popular): ৳15,000 (~$180) — 5-10 pages, blog section, advanced SEO, 2 week delivery
- Premium: ৳30,000 (~$360) — unlimited pages, e-commerce, payment gateway, admin dashboard, 3 week delivery
- Enterprise: custom pricing — custom features, priority support, monthly maintenance

How to order: visitors can fill the order form on the /order page of the website, or message
directly on WhatsApp. Payment and project details are discussed after ordering.

Contact: Email rahatbd20505@gmail.com — Phone/WhatsApp +880 1626-224878.
Site pages: /services (services & pricing), /portfolio (past work), /achievements,
/blog, /gallery, /order (order form), /contact (contact form & channels).

Rules for your answers:
- ALWAYS start with Salam as described above — this is mandatory for every single reply, no exceptions.
- Keep answers short (under ~120 words), warm and professional, after the Salam greeting.
- Answer in the same language the visitor used (English or Bangla).
- Never invent prices, discounts or promises not listed above.
- If you don't know something (e.g. exact availability), say so and suggest
  contacting Rahat on WhatsApp or via the /contact page.
- Encourage visitors toward ordering or contacting when relevant.
- Never use Nomoskar/Namaskar — always Salam, in every reply.
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
];

// ── Greeting & fallback texts ──────────────────────────
// Nuva ALWAYS greets with Salam — never Nomoskar/Namaskar
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
  greetingEn:
    "Assalamu Alaikum! 👋 I'm Nuva, Rahat's AI assistant. Ask me anything about services, pricing, delivery time or how to order — or just tap a suggestion below.",
  greetingBn:
    "আসসালামু আলাইকুম! 👋 আমি নুভা, রাহাতের এআই সহকারী। সেবা, মূল্য, ডেলিভারির সময় বা কীভাবে অর্ডার করবেন — যা জানতে চান, জিজ্ঞেস করুন অথবা নিচের সাজেশনে ট্যাপ করুন।",
  fallbackEn:
    "Assalamu Alaikum! I want to make sure you get the right answer! I can help with:\n• Services & pricing\n• How to order\n• Delivery time\n• Contacting Rahat\n\nTry asking about one of those, or message Rahat directly on WhatsApp.",
  fallbackBn:
    "আসসালামু আলাইকুম! সঠিক উত্তরটি দিতে চাই! আমি এসব বিষয়ে সাহায্য করতে পারি:\n• সেবা ও মূল্য\n• কীভাবে অর্ডার করবেন\n• ডেলিভারির সময়\n• রাহাতের সাথে যোগাযোগ\n\nএর যেকোনো একটি নিয়ে জিজ্ঞেস করুন, অথবা সরাসরি হোয়াটসঅ্যাপে মেসেজ করুন।",
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

// ── Salam helper — ensures every reply starts with Salam ──
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
 * Free, offline answer generator — the assistant's brain when no LLM API
 * key is configured (or when the provider is unreachable).
 * ALWAYS replies with Salam — never Nomoskar.
 */
export function answerFromKnowledgeBase(message: string, locale: AiLocale): AiKbReply {
  const isBn = locale === "bn";

  if (isGreeting(message)) {
    return {
      reply: isBn ? AI_TEXTS.greetingBn : AI_TEXTS.greetingEn,
      links: [],
    };
  }

  const match = matchFaq(message);
  if (match) {
    const { entry } = match;
    const rawReply = isBn ? entry.answerBn : entry.answerEn;
    return {
      reply: withSalam(rawReply, isBn),
      links: entry.links?.map((link) => ({ ...link })) ?? [],
    };
  }

  return {
    reply: isBn ? AI_TEXTS.fallbackBn : AI_TEXTS.fallbackEn,
    links: [
      { ...AI_LINKS.services },
      { ...AI_LINKS.order },
      { ...AI_LINKS.whatsapp },
    ],
  };
}
