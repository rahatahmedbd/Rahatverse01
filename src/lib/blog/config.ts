import type {
  BlogAuthorProfile,
  BlogCategory,
  BlogConfig,
  BlogSectionContent,
  CommentSettings,
} from "@/types/blog";

// ── Default Blog Config ────────────────────────────────
// Preserves the original public blog categories and wording.

const MAX_SHORT = 260;

const DEFAULT_SECTION: BlogSectionContent = {
  badgeBn: "📝 ব্লগ",
  badgeEn: "📝 Blog",
  titleBn: "আমার লেখা",
  titleEn: "Articles",
  subtitleBn: "শিক্ষা, প্রযুক্তি ও সমাজসেবা নিয়ে আমার লেখা",
  subtitleEn: "My writing on education, technology, and social service",
};

const DEFAULT_CATEGORIES: BlogCategory[] = [
  { id: "cat-science", value: "science", labelBn: "বিজ্ঞান", labelEn: "Science", visible: true },
  { id: "cat-social", value: "social", labelBn: "সমাজসেবা", labelEn: "Social", visible: true },
  { id: "cat-education", value: "education", labelBn: "শিক্ষা", labelEn: "Education", visible: true },
  { id: "cat-tech", value: "tech", labelBn: "প্রযুক্তি", labelEn: "Technology", visible: true },
];

const DEFAULT_AUTHOR: BlogAuthorProfile = {
  nameBn: "রাহাত আহমেদ",
  nameEn: "Rahat Ahmed",
  roleBn: "লেখক",
  roleEn: "Author",
  avatar: "",
  bioBn: "শিক্ষা, প্রযুক্তি ও সমাজসেবা নিয়ে লেখা।",
  bioEn: "Writing about education, technology, and social service.",
};

const DEFAULT_COMMENTS: CommentSettings = {
  requireApproval: true,
  adminBadgeBn: "অ্যাডমিন / লেখক",
  adminBadgeEn: "Admin / Author",
  replyAuthorBn: "রাহাত আহমেদ",
  replyAuthorEn: "Rahat Ahmed",
  headingBn: "মন্তব্য",
  headingEn: "Comments",
};

export const DEFAULT_BLOG_CONFIG: BlogConfig = {
  visible: true,
  section: DEFAULT_SECTION,
  categories: DEFAULT_CATEGORIES,
  author: DEFAULT_AUTHOR,
  comments: DEFAULT_COMMENTS,
  readingWpm: 200,
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

function validateCategories(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 20) return false;
  return value.every((item) => {
    if (!isRecord(item)) return false;
    return (
      isText(item.id, 80) &&
      isSlug(item.value) &&
      isText(item.labelBn) &&
      isText(item.labelEn) &&
      typeof item.visible === "boolean"
    );
  });
}

function validateAuthor(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    isText(value.nameBn) &&
    isText(value.nameEn) &&
    isText(value.roleBn) &&
    isText(value.roleEn) &&
    isText(value.avatar, 500, true) &&
    isText(value.bioBn, 1000, true) &&
    isText(value.bioEn, 1000, true)
  );
}

function validateComments(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    typeof value.requireApproval === "boolean" &&
    isText(value.adminBadgeBn) &&
    isText(value.adminBadgeEn) &&
    isText(value.replyAuthorBn) &&
    isText(value.replyAuthorEn) &&
    isText(value.headingBn) &&
    isText(value.headingEn)
  );
}

export function validateBlogConfig(input: unknown): BlogConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!validateSection(input.section)) return null;
  if (!validateCategories(input.categories)) return null;
  if (!validateAuthor(input.author)) return null;
  if (!validateComments(input.comments)) return null;
  const wpm = Number(input.readingWpm);
  if (!Number.isFinite(wpm) || wpm < 20 || wpm > 1000) return null;

  return input as unknown as BlogConfig;
}
