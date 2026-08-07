// ── Link Hub, Tools & Resume/CV admin config ──────────
// Stored as JSON in `site_settings` under the `links_config` key.

export type LinkIconName =
  | "Facebook"
  | "Instagram"
  | "Youtube"
  | "TikTok"
  | "MessageCircle"
  | "Mail"
  | "Phone"
  | "Github"
  | "Linkedin"
  | "Twitter"
  | "Globe"
  | "Link2";

export interface LinksSectionContent {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

export interface LinksProfile {
  initials: string;
  nameBn: string;
  nameEn: string;
  taglineBn: string;
  taglineEn: string;
  avatar: string;
}

export interface LinkItem {
  id: string;
  labelBn: string;
  labelEn: string;
  url: string;
  icon: LinkIconName;
  color: string;
  bgColor: string;
  visible: boolean;
  /** Total click-through count. */
  clicks: number;
}

export interface ToolRecommendation {
  id: string;
  nameBn: string;
  nameEn: string;
  category: "development" | "design" | "productivity";
  descriptionBn: string;
  descriptionEn: string;
  url: string;
  visible: boolean;
}

export interface ResumeSettings {
  sectionBadgeBn: string;
  sectionBadgeEn: string;
  sectionTitleBn: string;
  sectionTitleEn: string;
  sectionSubtitleBn: string;
  sectionSubtitleEn: string;
  /** Bangla CV. */
  cvBnUrl: string;
  /** English CV. */
  cvEnUrl: string;
  /** If true, opens in-browser preview; else triggers download. */
  previewInBrowser: boolean;
  downloadLabelBn: string;
  downloadLabelEn: string;
  comingSoonBn: string;
  comingSoonEn: string;
}

export interface LinksConfig {
  visible: boolean;
  section: LinksSectionContent;
  profile: LinksProfile;
  links: LinkItem[];
  toolsSectionTitleBn: string;
  toolsSectionTitleEn: string;
  toolsSectionSubtitleBn: string;
  toolsSectionSubtitleEn: string;
  tools: ToolRecommendation[];
  resume: ResumeSettings;
}
