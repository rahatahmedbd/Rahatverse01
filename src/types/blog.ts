// ── Bilingual Blog & Comment Moderation admin config ──
// Stored as JSON in `site_settings` under the `blog_config` key. Drives the
// public blog listing (categories, section headings) and comment-moderation
// labels/behaviour (approval requirement, admin reply badge, author profile).

export interface BlogSectionContent {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

export interface BlogCategory {
  id: string;
  /** Slug used as the post `category` value. */
  value: string;
  labelBn: string;
  labelEn: string;
  visible: boolean;
}

export interface BlogAuthorProfile {
  nameBn: string;
  nameEn: string;
  roleBn: string;
  roleEn: string;
  avatar: string;
  bioBn: string;
  bioEn: string;
}

export interface CommentSettings {
  /** When true, new comments require admin approval before display. */
  requireApproval: boolean;
  /** Labels used for the verified admin badge when replying. */
  adminBadgeBn: string;
  adminBadgeEn: string;
  /** Default author label for admin replies. */
  replyAuthorBn: string;
  replyAuthorEn: string;
  /** Section heading shown above the comment list. */
  headingBn: string;
  headingEn: string;
}

export interface BlogConfig {
  visible: boolean;
  section: BlogSectionContent;
  categories: BlogCategory[];
  author: BlogAuthorProfile;
  comments: CommentSettings;
  /** Words-per-minute used to compute reading time. */
  readingWpm: number;
}
