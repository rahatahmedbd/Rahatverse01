import type {
  AudioSettings,

  EffectsSettings,
  ThemeConfig,
  ThemeDefaults,
  ThemePreset,
  ThemeSectionContent,
  XpLevel,
  XpRule,
} from "@/types/theme";

const MAX_SHORT = 260;

const DEFAULT_SECTION: ThemeSectionContent = {
  badgeBn: "🎨 থিম ও ইন্টারঅ্যাক্টিভিটি",
  badgeEn: "🎨 Theme & Interactivity",
  titleBn: "থিম কাস্টমাইজার",
  titleEn: "Theme Customizer",
  subtitleBn: "অ্যাকসেন্ট কালার, ডে/নাইট ও ইন্টারঅ্যাকটিভ ইফেক্ট",
  subtitleEn: "Accent colors, day/night and interactive effects",
};

const DEFAULT_PRESETS: ThemePreset[] = [
  { id: "cyberpunk", nameBn: "সাইবারপাঙ্ক", nameEn: "Cyberpunk", primary: "#f0abfc", primaryForeground: "#170b1f", ring: "#f0abfc", gradientStart: "#d946ef", gradientMiddle: "#8b5cf6", gradientEnd: "#06b6d4", selectionBg: "rgba(217,70,239,0.35)", visible: true },
  { id: "aurora", nameBn: "অরোরা", nameEn: "Aurora", primary: "#34d399", primaryForeground: "#020817", ring: "#34d399", gradientStart: "#10b981", gradientMiddle: "#06b6d4", gradientEnd: "#3b82f6", selectionBg: "rgba(16,185,129,0.35)", visible: true },
  { id: "sunset", nameBn: "সানসেট", nameEn: "Sunset", primary: "#fbbf24", primaryForeground: "#020817", ring: "#fbbf24", gradientStart: "#f59e0b", gradientMiddle: "#f97316", gradientEnd: "#ef4444", selectionBg: "rgba(245,158,11,0.35)", visible: true },
  { id: "ocean", nameBn: "ওশান", nameEn: "Ocean", primary: "#38bdf8", primaryForeground: "#020817", ring: "#38bdf8", gradientStart: "#3b82f6", gradientMiddle: "#06b6d4", gradientEnd: "#14b8a6", selectionBg: "rgba(59,130,246,0.35)", visible: true },
  { id: "voidgold", nameBn: "ভয়েড গোল্ড", nameEn: "Void Gold", primary: "#fde047", primaryForeground: "#020817", ring: "#fde047", gradientStart: "#eab308", gradientMiddle: "#f59e0b", gradientEnd: "#a3e635", selectionBg: "rgba(234,179,8,0.35)", visible: true },
];

const DEFAULT_DEFAULTS: ThemeDefaults = {
  defaultAccent: "aurora",
  defaultTheme: "dark",
  allowCustomAccent: true,
};

const DEFAULT_XP_RULES: XpRule[] = [
  { id: "xp-read-blog", action: "read_blog", points: 10, labelBn: "ব্লগ পড়া", labelEn: "Read a blog post", enabled: true },
  { id: "xp-explore", action: "explore_all", points: 25, labelBn: "সব সেকশন ঘুরে দেখা", labelEn: "Explore all sections", enabled: true },
  { id: "xp-form", action: "submit_form", points: 15, labelBn: "ফর্ম জমা", labelEn: "Submit a form", enabled: true },
  { id: "xp-easter", action: "easter_egg", points: 50, labelBn: "ইস্টার এগ খোঁজা", labelEn: "Find an easter egg", enabled: true },
];

const DEFAULT_XP_LEVELS: XpLevel[] = [
  { id: "lvl-1", minXp: 0, nameBn: "নবীন", nameEn: "Beginner", rewardMessageBn: "স্বাগতম!", rewardMessageEn: "Welcome!" },
  { id: "lvl-2", minXp: 50, nameBn: "এক্সপ্লোরার", nameEn: "Explorer", rewardMessageBn: "অনেক কিছু আবিষ্কার করছেন!", rewardMessageEn: "Exploring a lot!" },
  { id: "lvl-3", minXp: 150, nameBn: "মাস্টার", nameEn: "Master", rewardMessageBn: "চমৎকার!", rewardMessageEn: "Excellent!" },
];

const DEFAULT_AUDIO: AudioSettings = {
  enabled: false,
  defaultVolume: 50,
  tracks: [
    { id: "track-1", titleBn: "অ্যাম্বিয়েন্ট ১", titleEn: "Ambient 1", url: "", visible: true },
  ],
};

const DEFAULT_EFFECTS: EffectsSettings = {
  particleField: true,
  particleIntensity: 50,
  auroraMesh: true,
  customCursor: true,
  sparkleTrail: false,
  intensity: 50,
};

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  visible: true,
  section: DEFAULT_SECTION,
  presets: DEFAULT_PRESETS,
  defaults: DEFAULT_DEFAULTS,
  xp: { rules: DEFAULT_XP_RULES, levels: DEFAULT_XP_LEVELS },
  audio: DEFAULT_AUDIO,
  effects: DEFAULT_EFFECTS,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isText(value: unknown, max = MAX_SHORT, allowEmpty = false): value is string {
  return typeof value === "string" && value.length <= max && (allowEmpty || value.trim().length > 0);
}
function isColor(value: unknown): boolean {
  return typeof value === "string" && value.length <= 40;
}
function isHexColor(value: unknown): boolean {
  return typeof value === "string" && /^#[0-9a-fA-F]{3,8}$/.test(value);
}
function isId(value: unknown): boolean {
  return isText(value, 80);
}
function validateSection(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isText(value.badgeBn) && isText(value.badgeEn) && isText(value.titleBn) && isText(value.titleEn) && isText(value.subtitleBn) && isText(value.subtitleEn);
}
function validatePresets(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 30) return false;
  return value.every((item) => isRecord(item) && isId(item.id) && isText(item.nameBn) && isText(item.nameEn) &&
    isHexColor(item.primary) && isHexColor(item.primaryForeground) && isHexColor(item.ring) &&
    isHexColor(item.gradientStart) && isHexColor(item.gradientMiddle) && isHexColor(item.gradientEnd) &&
    isColor(item.selectionBg) && typeof item.visible === "boolean");
}
function validateDefaults(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isId(value.defaultAccent) && ["dark", "light", "system"].includes(value.defaultTheme as string) && typeof value.allowCustomAccent === "boolean";
}
function validateXpRules(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 30) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    const points = Number(item.points);
    return isId(item.id) && isText(item.action) && Number.isFinite(points) && points >= 0 && points <= 100000 && isText(item.labelBn) && isText(item.labelEn) && typeof item.enabled === "boolean";
  });
}
function validateXpLevels(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 30) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    const minXp = Number(item.minXp);
    return isId(item.id) && Number.isFinite(minXp) && minXp >= 0 && isText(item.nameBn) && isText(item.nameEn) && isText(item.rewardMessageBn, MAX_SHORT, true) && isText(item.rewardMessageEn, MAX_SHORT, true);
  });
}
function validateAudioTracks(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 30) return false;
  return value.every((item) => isRecord(item) && isId(item.id) && isText(item.titleBn, MAX_SHORT, true) && isText(item.titleEn, MAX_SHORT, true) && typeof item.url === "string" && item.url.length <= 1000 && typeof item.visible === "boolean");
}
function validateAudio(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const vol = Number(value.defaultVolume);
  return typeof value.enabled === "boolean" && Number.isFinite(vol) && vol >= 0 && vol <= 100 && validateAudioTracks(value.tracks);
}
function validateEffects(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const pi = Number(value.particleIntensity);
  const it = Number(value.intensity);
  return typeof value.particleField === "boolean" && typeof value.auroraMesh === "boolean" && typeof value.customCursor === "boolean" && typeof value.sparkleTrail === "boolean" &&
    Number.isFinite(pi) && pi >= 0 && pi <= 100 && Number.isFinite(it) && it >= 0 && it <= 100;
}

export function validateThemeConfig(input: unknown): ThemeConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!validateSection(input.section)) return null;
  if (!validatePresets(input.presets)) return null;
  if (!validateDefaults(input.defaults)) return null;
  const xp = input.xp;
  if (!isRecord(xp) || !validateXpRules(xp.rules) || !validateXpLevels(xp.levels)) return null;
  if (!validateAudio(input.audio)) return null;
  if (!validateEffects(input.effects)) return null;
  return input as unknown as ThemeConfig;
}
