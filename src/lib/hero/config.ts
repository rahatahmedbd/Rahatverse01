import type { HeroConfig } from "@/types/hero";

// ── Default Hero Config (fallback when DB unavailable) ──
// Keep in sync with supabase/migrations/011_hero_admin_control.sql

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  intro: {
    welcomeTextBn: "স্বাগতম আমার ডিজিটাল জগতে",
    welcomeTextEn: "Welcome to my digital world",
    greetingBn: "বিসমিল্লাহির রাহমানির রাহিম",
    greetingEn: "Bismillahir Rahmanir Rahim",
    durationMs: 3500,
  },
  typewriter: {
    bn: ["ওয়েব ডেভেলপার", "শিক্ষার্থী", "গৃহশিক্ষক", "রক্তদাতা", "BNCC ক্যাডেট"],
    en: ["Web Developer", "Student", "Teacher", "Blood Donor", "BNCC Cadet"],
  },
  badges: [
    { id: "badge-1", labelBn: "ওয়েব ডেভেলপার", labelEn: "Web Developer" },
    { id: "badge-2", labelBn: "রক্তদাতা", labelEn: "Blood Donor" },
    { id: "badge-3", labelBn: "BNCC ক্যাডেট", labelEn: "BNCC Cadet" },
  ],
  counters: [
    { id: "c-1", labelBn: "অর্জন", labelEn: "Achievements", value: 9, suffix: "" },
    { id: "c-2", labelBn: "১ম স্থান", labelEn: "1st Places", value: 5, suffix: "×" },
    { id: "c-3", labelBn: "রক্তদান", labelEn: "Blood Donations", value: 4, suffix: "" },
    { id: "c-4", labelBn: "GPA 5.00", labelEn: "GPA 5.00", value: 2, suffix: "×" },
  ],
  ctas: [
    {
      id: "cta-order",
      labelBn: "ওয়েবসাইট অর্ডার করুন",
      labelEn: "Order a Website",
      href: "/order",
      variant: "gradient",
      icon: "Zap",
      pulse: true,
    },
    {
      id: "cta-portfolio",
      labelBn: "প্রজেক্ট দেখুন",
      labelEn: "View Projects",
      href: "/portfolio",
      variant: "glass",
      icon: "Eye",
      pulse: false,
    },
    {
      id: "cta-contact",
      labelBn: "যোগাযোগ",
      labelEn: "Contact",
      href: "/contact",
      variant: "outline",
      icon: "MessageCircle",
      pulse: false,
    },
  ],
  visible: true,
};

// ── Validation ─────────────────────────────────────────
const MAX_STR = 120;
const MAX_ARRAY = 12;

function isString(v: unknown, max = MAX_STR): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

export function validateHeroConfig(input: unknown): HeroConfig | null {
  if (!input || typeof input !== "object") return null;
  const o = input as Record<string, unknown>;

  // intro
  const intro = o.intro as Record<string, unknown> | undefined;
  if (!intro || typeof intro !== "object") return null;
  if (
    !isString(intro.welcomeTextBn, 80) ||
    !isString(intro.welcomeTextEn, 80) ||
    !isString(intro.greetingBn, 80) ||
    !isString(intro.greetingEn, 80)
  )
    return null;
  const durationMs = Number(intro.durationMs);
  if (!Number.isFinite(durationMs) || durationMs < 1000 || durationMs > 15000) return null;

  // typewriter
  const tw = o.typewriter as Record<string, unknown> | undefined;
  if (!tw || !Array.isArray(tw.bn) || !Array.isArray(tw.en)) return null;
  if (
    tw.bn.length === 0 ||
    tw.bn.length > MAX_ARRAY ||
    tw.en.length === 0 ||
    tw.en.length > MAX_ARRAY
  )
    return null;
  if (!tw.bn.every((s: unknown) => isString(s, 40)) || !tw.en.every((s: unknown) => isString(s, 40)))
    return null;

  // badges
  if (!Array.isArray(o.badges) || o.badges.length > MAX_ARRAY) return null;
  for (const b of o.badges as unknown[]) {
    const badge = b as Record<string, unknown>;
    if (!isString(badge.id, 40) || !isString(badge.labelBn, 40) || !isString(badge.labelEn, 40))
      return null;
    if (badge.icon !== undefined && badge.icon !== null && !isString(badge.icon as string, 30))
      return null;
  }

  // counters
  if (!Array.isArray(o.counters) || o.counters.length > MAX_ARRAY) return null;
  for (const c of o.counters as unknown[]) {
    const counter = c as Record<string, unknown>;
    if (!isString(counter.id, 40) || !isString(counter.labelBn, 40) || !isString(counter.labelEn, 40))
      return null;
    const val = Number(counter.value);
    if (!Number.isFinite(val) || val < 0 || val > 100000) return null;
    if (typeof counter.suffix !== "string" || counter.suffix.length > 10) return null;
  }

  // ctas
  if (!Array.isArray(o.ctas) || o.ctas.length === 0 || o.ctas.length > 8) return null;
  const allowedVariants = new Set(["gradient", "glass", "outline"]);
  for (const c of o.ctas as unknown[]) {
    const cta = c as Record<string, unknown>;
    if (!isString(cta.id, 40) || !isString(cta.labelBn, 60) || !isString(cta.labelEn, 60))
      return null;
    if (!isString(cta.href, 200) || !isString(cta.icon, 30)) return null;
    if (!allowedVariants.has(cta.variant as string)) return null;
    if (typeof cta.pulse !== "boolean") return null;
  }

  if (typeof o.visible !== "boolean") return null;

  return o as unknown as HeroConfig;
}

export function mergeWithDefaults(partial: Partial<HeroConfig>): HeroConfig {
  return {
    ...DEFAULT_HERO_CONFIG,
    ...partial,
    intro: { ...DEFAULT_HERO_CONFIG.intro, ...(partial.intro ?? {}) },
    typewriter: { ...DEFAULT_HERO_CONFIG.typewriter, ...(partial.typewriter ?? {}) },
    badges: partial.badges ?? DEFAULT_HERO_CONFIG.badges,
    counters: partial.counters ?? DEFAULT_HERO_CONFIG.counters,
    ctas: partial.ctas ?? DEFAULT_HERO_CONFIG.ctas,
    visible: partial.visible ?? DEFAULT_HERO_CONFIG.visible,
  };
}
