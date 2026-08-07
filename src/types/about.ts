// ── About, education & achievements admin config ───────
// Stored as JSON in `site_settings` under the `about_config` key.
// The public site validates this payload and falls back to defaults when the
// database is unavailable or an older/invalid value is encountered.

export type AboutIconName =
  | "Calendar"
  | "MapPin"
  | "Droplets"
  | "GraduationCap"
  | "BookOpen"
  | "Award"
  | "Code"
  | "Users"
  | "Heart"
  | "Trophy"
  | "Medal"
  | "Star";

export type AboutFrameStyle = "amber" | "blue" | "emerald" | "purple" | "rose";

export type AboutBadgeType =
  | "default"
  | "glow"
  | "outline"
  | "secondary"
  | "gradient"
  | "success"
  | "warning"
  | "info";

export type AchievementIconName = "Trophy" | "Medal" | "Award" | "Star";
export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface AboutSectionContent {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

export interface AboutTextPair {
  bn: string;
  en: string;
}

export interface AboutPersonalInfo {
  id: string;
  icon: AboutIconName;
  labelBn: string;
  labelEn: string;
  valueBn: string;
  valueEn: string;
}

export interface AboutInterest {
  id: string;
  icon: AboutIconName;
  labelBn: string;
  labelEn: string;
}

export interface AboutProfileImage {
  url: string;
  publicId: string;
  altBn: string;
  altEn: string;
  frame: AboutFrameStyle;
  showStatus: boolean;
  statusLabelBn: string;
  statusLabelEn: string;
}

export interface AboutBiography {
  paragraphs: AboutTextPair[];
  quote: AboutTextPair;
  quoteBy: AboutTextPair;
  interestsTitleBn: string;
  interestsTitleEn: string;
}

export interface AboutEducationItem {
  id: string;
  yearBn: string;
  yearEn: string;
  titleBn: string;
  titleEn: string;
  institutionBn: string;
  institutionEn: string;
  locationBn: string;
  locationEn: string;
  descriptionBn: string;
  descriptionEn: string;
  badgeBn: string;
  badgeEn: string;
  badgeType: AboutBadgeType;
  gpa: string;
}

export interface AboutAchievement {
  id: string;
  yearBn: string;
  yearEn: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  icon: AchievementIconName;
  rarity: AchievementRarity;
  unlockCriteriaBn: string;
  unlockCriteriaEn: string;
  completedAt: string;
  sparkle: boolean;
  sound: boolean;
  certificateUrl: string;
  certificatePublicId: string;
}

export interface AboutAchievementStat {
  id: string;
  labelBn: string;
  labelEn: string;
  value: number;
  suffix: string;
}

export interface AboutConfig {
  visible: boolean;
  profileImage: AboutProfileImage;
  section: AboutSectionContent;
  biography: AboutBiography;
  personalInfo: AboutPersonalInfo[];
  interests: AboutInterest[];
  educationSection: AboutSectionContent;
  education: AboutEducationItem[];
  achievementsSection: AboutSectionContent;
  achievements: AboutAchievement[];
  achievementStats: AboutAchievementStat[];
}
