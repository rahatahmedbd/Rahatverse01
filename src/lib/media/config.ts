import type {
  GalleryAlbum,
  GalleryConfig,
  GallerySocialNote,
  MediaSectionContent,
  VideoConfig,
  VideoItem,
  VideoPlatform,
  VideoSocialLink,
} from "@/types/media";

// ── Default Gallery Config ─────────────────────────────
// Preserves the original public gallery categories and wording.

const MAX_SHORT = 260;

const DEFAULT_GALLERY_SECTION: MediaSectionContent = {
  badgeBn: "🖼️ মুহূর্তগুলো",
  badgeEn: "🖼️ Moments",
  titleBn: "গ্যালারি",
  titleEn: "Photo Gallery",
  subtitleBn: "আমার শিক্ষাজীবন, অর্জন, সামাজিক কার্যক্রম ও উদ্যোগের কিছু মুহূর্ত",
  subtitleEn: "Moments from my academic journey, achievements, and social activities",
};

const DEFAULT_ALBUMS: GalleryAlbum[] = [
  { id: "alb-achievements", value: "achievements", nameBn: "অর্জন", nameEn: "Achievements", descriptionBn: "প্রতিযোগিতা ও স্বীকৃতি", descriptionEn: "Competitions & recognition", featuredPublicId: "", visible: true },
  { id: "alb-blood", value: "blood-donation", nameBn: "রক্তদান", nameEn: "Blood Donation", descriptionBn: "শান্তিচক্র কার্যক্রম", descriptionEn: "Shantichakra activities", featuredPublicId: "", visible: true },
  { id: "alb-education", value: "experience", nameBn: "শিক্ষা ও অভিজ্ঞতা", nameEn: "Education & Experience", descriptionBn: "পাঠদান ও উদ্যোগ", descriptionEn: "Teaching & initiatives", featuredPublicId: "", visible: true },
  { id: "alb-social", value: "social-service", nameBn: "সমাজসেবা", nameEn: "Social Service", descriptionBn: "মানুষের পাশে", descriptionEn: "Standing with people", featuredPublicId: "", visible: true },
  { id: "alb-profile", value: "profile", nameBn: "প্রোফাইল", nameEn: "Profile", descriptionBn: "ব্যক্তিগত মুহূর্ত", descriptionEn: "Personal moments", featuredPublicId: "", visible: true },
  { id: "alb-memorial", value: "memorial", nameBn: "স্মৃতিচারণ", nameEn: "Memorial", descriptionBn: "শ্রদ্ধাঞ্জলি", descriptionEn: "Tribute", featuredPublicId: "", visible: true },
];

const DEFAULT_GALLERY_NOTE: GallerySocialNote = {
  bn: "📸 ছবিগুলো Cloudinary থেকে লোড হয়।",
  en: "📸 Images are loaded from Cloudinary.",
};

export const DEFAULT_GALLERY_CONFIG: GalleryConfig = {
  visible: true,
  section: DEFAULT_GALLERY_SECTION,
  defaultLayout: "mosaic",
  albums: DEFAULT_ALBUMS,
  note: DEFAULT_GALLERY_NOTE,
};

// ── Default Video Config ───────────────────────────────
const DEFAULT_VIDEO_SECTION: MediaSectionContent = {
  badgeBn: "🎬 ভিডিও পোর্টফোলিও",
  badgeEn: "🎬 Video Portfolio",
  titleBn: "ভিডিও কনটেন্ট",
  titleEn: "Video Content",
  subtitleBn: "শিক্ষা, প্রযুক্তি ও সামাজিক সচেতনতা নিয়ে তৈরি কনটেন্ট",
  subtitleEn: "Content on education, technology, and social awareness",
};

const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "vid-youtube",
    titleBn: "YouTube চ্যানেল",
    titleEn: "YouTube Channel",
    descriptionBn: "শিক্ষামূলক কনটেন্ট ও সামাজিক সচেতনতা",
    descriptionEn: "Educational content and social awareness",
    platform: "youtube",
    url: "https://www.youtube.com/@RahatAhmedOfficial0",
    videoId: "",
    categoryBn: "শিক্ষা",
    categoryEn: "Education",
    thumbnail: "",
    visible: true,
  },
  {
    id: "vid-tiktok",
    titleBn: "TikTok কনটেন্ট",
    titleEn: "TikTok Content",
    descriptionBn: "ছোট শিক্ষামূলক ও সচেতনতামূলক ভিডিও",
    descriptionEn: "Short educational and awareness videos",
    platform: "youtube",
    url: "https://www.tiktok.com/@rahatvives",
    videoId: "",
    categoryBn: "সচেতনতা",
    categoryEn: "Awareness",
    thumbnail: "",
    visible: true,
  },
];

const DEFAULT_SOCIAL_LINKS: VideoSocialLink[] = [
  { id: "soc-yt", label: "YouTube", url: "https://www.youtube.com/@RahatAhmedOfficial0" },
  { id: "soc-tt", label: "TikTok", url: "https://www.tiktok.com/@rahatvives" },
  { id: "soc-fb", label: "Facebook", url: "https://www.facebook.com/rahat.ahmed.948943" },
  { id: "soc-ig", label: "Instagram", url: "https://www.instagram.com/rahatahm6d/" },
];

export const DEFAULT_VIDEO_CONFIG: VideoConfig = {
  visible: true,
  section: DEFAULT_VIDEO_SECTION,
  videos: DEFAULT_VIDEOS,
  socialFollowBn: "আমার সোশ্যাল মিডিয়া অনুসরণ করুন:",
  socialFollowEn: "Follow me on social media:",
  socialLinks: DEFAULT_SOCIAL_LINKS,
};

// ── Validation helpers ─────────────────────────────────
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown, max = MAX_SHORT, allowEmpty = false): value is string {
  return (
    typeof value === "string" &&
    value.length <= max &&
    (allowEmpty || value.trim().length > 0)
  );
}

function isSafeUrl(value: unknown, allowEmpty = false): boolean {
  return (
    typeof value === "string" &&
    value.length <= 1_000 &&
    (allowEmpty ? true : value.length > 0) &&
    (value === "" ||
      value.startsWith("/") ||
      /^https:\/\//i.test(value) ||
      /^http:\/\//i.test(value))
  );
}

function isId(value: unknown): boolean {
  return isText(value, 80);
}

function isSlug(value: unknown): boolean {
  return typeof value === "string" && value.length <= 50 && /^[a-z0-9-]+$/.test(value);
}

function validateSection(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isText(value.badgeBn) &&
    isText(value.badgeEn) &&
    isText(value.titleBn) &&
    isText(value.titleEn) &&
    isText(value.subtitleBn) &&
    isText(value.subtitleEn)
  );
}

function validateAlbums(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 30) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isId(item.id) &&
      isSlug(item.value) &&
      isText(item.nameBn) &&
      isText(item.nameEn) &&
      isText(item.descriptionBn, MAX_SHORT, true) &&
      isText(item.descriptionEn, MAX_SHORT, true) &&
      isText(item.featuredPublicId, 300, true) &&
      typeof item.visible === "boolean"
    );
  });
}

export function validateGalleryConfig(input: unknown): GalleryConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!validateSection(input.section)) return null;
  if (input.defaultLayout !== "mosaic" && input.defaultLayout !== "grid") return null;
  if (!validateAlbums(input.albums)) return null;
  const note = input.note;
  if (!isRecord(note)) return null;
  if (!isText(note.bn, MAX_SHORT, true) || !isText(note.en, MAX_SHORT, true)) return null;

  return input as unknown as GalleryConfig;
}

const PLATFORMS = new Set<VideoPlatform>(["youtube", "vimeo", "direct"]);

function validateVideos(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 30) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isId(item.id) &&
      isText(item.titleBn) &&
      isText(item.titleEn) &&
      isText(item.descriptionBn, MAX_SHORT, true) &&
      isText(item.descriptionEn, MAX_SHORT, true) &&
      PLATFORMS.has(item.platform as VideoPlatform) &&
      isSafeUrl(item.url) &&
      isText(item.videoId, 200, true) &&
      isText(item.categoryBn, MAX_SHORT, true) &&
      isText(item.categoryEn, MAX_SHORT, true) &&
      isText(item.thumbnail, 500, true) &&
      typeof item.visible === "boolean"
    );
  });
}

function validateSocialLinks(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 20) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return isId(item.id) && isText(item.label) && isSafeUrl(item.url);
  });
}

export function validateVideoConfig(input: unknown): VideoConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!validateSection(input.section)) return null;
  if (!validateVideos(input.videos)) return null;
  if (!isText(input.socialFollowBn, MAX_SHORT, true) || !isText(input.socialFollowEn, MAX_SHORT, true)) {
    return null;
  }
  if (!validateSocialLinks(input.socialLinks)) return null;

  return input as unknown as VideoConfig;
}
