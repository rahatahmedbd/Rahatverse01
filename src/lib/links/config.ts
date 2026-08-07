import type {
  LinkIconName,
  LinkItem,
  LinksConfig,
  LinksProfile,
  LinksSectionContent,
  ResumeSettings,
  ToolRecommendation,
} from "@/types/links";

const MAX_SHORT = 260;

const DEFAULT_SECTION: LinksSectionContent = {
  badgeBn: "🔗 সব লিংক",
  badgeEn: "🔗 All Links",
  titleBn: "সংযুক্ত হোন",
  titleEn: "Link Hub",
  subtitleBn: "সব সোশ্যাল মিডিয়া ও যোগাযোগ এক জায়গায়",
  subtitleEn: "All social media and contact links in one place",
};

const DEFAULT_PROFILE: LinksProfile = {
  initials: "RA",
  nameBn: "রাহাত আহমেদ",
  nameEn: "Rahat Ahmed",
  taglineBn: "শিক্ষার্থী • শিক্ষক • ওয়েব ডেভেলপার",
  taglineEn: "Student • Teacher • Web Developer",
  avatar: "",
};

const DEFAULT_LINKS: LinkItem[] = [
  { id: "link-fb", labelBn: "ফেসবুক", labelEn: "Facebook", url: "https://www.facebook.com/rahat.ahmed.948943", icon: "Facebook", color: "text-blue-400", bgColor: "bg-blue-500/10", visible: true, clicks: 0 },
  { id: "link-ig", labelBn: "ইনস্টাগ্রাম", labelEn: "Instagram", url: "https://www.instagram.com/rahatahm6d/", icon: "Instagram", color: "text-pink-400", bgColor: "bg-pink-500/10", visible: true, clicks: 0 },
  { id: "link-yt", labelBn: "ইউটিউব", labelEn: "YouTube", url: "https://www.youtube.com/@RahatAhmedOfficial0", icon: "Youtube", color: "text-red-400", bgColor: "bg-red-500/10", visible: true, clicks: 0 },
  { id: "link-tt", labelBn: "টিকটক", labelEn: "TikTok", url: "https://www.tiktok.com/@rahatvives", icon: "TikTok", color: "text-white", bgColor: "bg-white/10", visible: true, clicks: 0 },
  { id: "link-wa", labelBn: "হোয়াটসঅ্যাপ", labelEn: "WhatsApp", url: "https://wa.me/8801626224878", icon: "MessageCircle", color: "text-green-400", bgColor: "bg-green-500/10", visible: true, clicks: 0 },
  { id: "link-mail", labelBn: "ইমেইল", labelEn: "Email", url: "mailto:rahatbd20505@gmail.com", icon: "Mail", color: "text-amber-400", bgColor: "bg-amber-500/10", visible: true, clicks: 0 },
  { id: "link-phone", labelBn: "ফোন", labelEn: "Phone", url: "tel:+8801626224878", icon: "Phone", color: "text-blue-400", bgColor: "bg-blue-500/10", visible: true, clicks: 0 },
  { id: "link-gh", labelBn: "গিটহাব", labelEn: "GitHub", url: "https://github.com/rahatahmedbd", icon: "Github", color: "text-gray-300", bgColor: "bg-gray-500/10", visible: true, clicks: 0 },
];

const DEFAULT_TOOLS: ToolRecommendation[] = [
  { id: "tool-vscode", nameBn: "VS Code", nameEn: "VS Code", category: "development", descriptionBn: "কোড এডিটর", descriptionEn: "Code editor", url: "https://code.visualstudio.com/", visible: true },
  { id: "tool-figma", nameBn: "Figma", nameEn: "Figma", category: "design", descriptionBn: "UI ডিজাইন", descriptionEn: "UI design", url: "https://www.figma.com/", visible: true },
  { id: "tool-notion", nameBn: "Notion", nameEn: "Notion", category: "productivity", descriptionBn: "নোট ও প্রোডাক্টিভিটি", descriptionEn: "Notes & productivity", url: "https://www.notion.so/", visible: true },
];

const DEFAULT_RESUME: ResumeSettings = {
  sectionBadgeBn: "📄 রিজিউম",
  sectionBadgeEn: "📄 Resume",
  sectionTitleBn: "রিজিউম ডাউনলোড",
  sectionTitleEn: "Download Resume",
  sectionSubtitleBn: "আমার CV PDF ফরম্যাটে",
  sectionSubtitleEn: "My CV in PDF format",
  cvBnUrl: "",
  cvEnUrl: "",
  previewInBrowser: false,
  downloadLabelBn: "ডাউনলোড",
  downloadLabelEn: "Download",
  comingSoonBn: "শীঘ্রই আসছে...",
  comingSoonEn: "Coming soon...",
};

export const DEFAULT_LINKS_CONFIG: LinksConfig = {
  visible: true,
  section: DEFAULT_SECTION,
  profile: DEFAULT_PROFILE,
  links: DEFAULT_LINKS,
  toolsSectionTitleBn: "আমার টুলস",
  toolsSectionTitleEn: "Tools I Use",
  toolsSectionSubtitleBn: "ডেভেলপমেন্ট, ডিজাইন ও প্রোডাক্টিভিটি টুল",
  toolsSectionSubtitleEn: "Development, design and productivity tools",
  tools: DEFAULT_TOOLS,
  resume: DEFAULT_RESUME,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isText(value: unknown, max = MAX_SHORT, allowEmpty = false): value is string {
  return typeof value === "string" && value.length <= max && (allowEmpty || value.trim().length > 0);
}
function isSafeUrl(value: unknown, allowEmpty = false): boolean {
  return (
    typeof value === "string" &&
    value.length <= 1000 &&
    (value === "" ||
      /^https?:\/\//i.test(value) ||
      /^mailto:/i.test(value) ||
      /^tel:/i.test(value) ||
      /^whatsapp:\/\//i.test(value)) &&
    (allowEmpty || value.length > 0)
  );
}
const LINK_ICONS = new Set<LinkIconName>(["Facebook", "Instagram", "Youtube", "TikTok", "MessageCircle", "Mail", "Phone", "Github", "Linkedin", "Twitter", "Globe", "Link2"]);
const TOOL_CATEGORIES = new Set(["development", "design", "productivity"]);

function validateSection(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isText(value.badgeBn) && isText(value.badgeEn) && isText(value.titleBn) && isText(value.titleEn) && isText(value.subtitleBn) && isText(value.subtitleEn);
}
function validateProfile(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isText(value.initials, 10) && isText(value.nameBn) && isText(value.nameEn) && isText(value.taglineBn, 300, true) && isText(value.taglineEn, 300, true) && isText(value.avatar, 500, true);
}
function validateLinks(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 40) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    const clicks = Number(item.clicks);
    return isText(item.id, 80) && isText(item.labelBn) && isText(item.labelEn) && isSafeUrl(item.url) &&
      typeof item.icon === "string" && LINK_ICONS.has(item.icon as LinkIconName) &&
      isText(item.color, 60, true) && isText(item.bgColor, 60, true) &&
      typeof item.visible === "boolean" && Number.isFinite(clicks) && clicks >= 0;
  });
}
function validateTools(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 60) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return isText(item.id, 80) && isText(item.nameBn) && isText(item.nameEn) &&
      TOOL_CATEGORIES.has(item.category as string) &&
      isText(item.descriptionBn, MAX_SHORT, true) && isText(item.descriptionEn, MAX_SHORT, true) &&
      isSafeUrl(item.url, true) && typeof item.visible === "boolean";
  });
}
function validateResume(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isText(value.sectionBadgeBn) && isText(value.sectionBadgeEn) && isText(value.sectionTitleBn) && isText(value.sectionTitleEn) &&
    isText(value.sectionSubtitleBn, MAX_SHORT, true) && isText(value.sectionSubtitleEn, MAX_SHORT, true) &&
    isSafeUrl(value.cvBnUrl, true) && isSafeUrl(value.cvEnUrl, true) &&
    typeof value.previewInBrowser === "boolean" &&
    isText(value.downloadLabelBn) && isText(value.downloadLabelEn) &&
    isText(value.comingSoonBn, 200, true) && isText(value.comingSoonEn, 200, true);
}

export function validateLinksConfig(input: unknown): LinksConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!validateSection(input.section)) return null;
  if (!validateProfile(input.profile)) return null;
  if (!validateLinks(input.links)) return null;
  if (!isText(input.toolsSectionTitleBn, MAX_SHORT, true) || !isText(input.toolsSectionTitleEn, MAX_SHORT, true)) return null;
  if (!isText(input.toolsSectionSubtitleBn, MAX_SHORT, true) || !isText(input.toolsSectionSubtitleEn, MAX_SHORT, true)) return null;
  if (!validateTools(input.tools)) return null;
  if (!validateResume(input.resume)) return null;
  return input as unknown as LinksConfig;
}
