// ── Experience, Shantichakra Blood Society & Memorial admin config ──
// Stored as JSON in `site_settings` under the `experience_config` key.
// The public site validates this payload and falls back to defaults when the
// database is unavailable or an older/invalid value is encountered.

export type ExperienceIconName =
  | "Building2"
  | "Users"
  | "GraduationCap"
  | "Shield"
  | "Video"
  | "Code"
  | "Heart"
  | "BookOpen"
  | "Award"
  | "Briefcase"
  | "Star"
  | "Globe";

export type ExperienceStatus = "active" | "paused" | "completed";

export type BloodActivityIconName =
  | "Users"
  | "MessageCircle"
  | "Heart"
  | "Siren"
  | "Droplets"
  | "Database"
  | "MapPin"
  | "Phone"
  | "Clock";

export type MemorialRoleIconName =
  | "Building"
  | "GraduationCap"
  | "BookOpen"
  | "Pen"
  | "Scale"
  | "Star"
  | "Landmark"
  | "Users";

export interface ExperienceSectionContent {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

export interface ExperienceTextPair {
  bn: string;
  en: string;
}

/** A single entry in the professional experience timeline. */
export interface ExperienceItem {
  id: string;
  icon: ExperienceIconName;
  titleBn: string;
  titleEn: string;
  roleBn: string;
  roleEn: string;
  periodBn: string;
  periodEn: string;
  status: ExperienceStatus;
  descriptionBn: string;
  descriptionEn: string;
  details: ExperienceDetail[];
  link: string;
}

export interface ExperienceDetail {
  id: string;
  labelBn: string;
  labelEn: string;
  valueBn: string;
  valueEn: string;
}

/** A statistic shown on the blood society command hub. */
export interface BloodStat {
  id: string;
  value: number | null;
  /** Non-numeric values (e.g. "A+") use this string form. */
  text: string;
  suffix: string;
  labelBn: string;
  labelEn: string;
}

export interface BloodActivity {
  id: string;
  icon: BloodActivityIconName;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
}

export interface BloodCta {
  headingBn: string;
  headingEn: string;
  bodyBn: string;
  bodyEn: string;
  buttonLabelBn: string;
  buttonLabelEn: string;
  buttonHref: string;
  duaBn: string;
  duaEn: string;
  duaArabic: string;
}

export interface BloodCoverageArea {
  id: string;
  nameBn: string;
  nameEn: string;
}

export interface BloodSocietyConfig {
  section: ExperienceSectionContent;
  roleBadgeBn: string;
  roleBadgeEn: string;
  roleTitleBn: string;
  roleTitleEn: string;
  roleBodyBn: string;
  roleBodyEn: string;
  stats: BloodStat[];
  activitiesSectionTitleBn: string;
  activitiesSectionTitleEn: string;
  activities: BloodActivity[];
  cta: BloodCta;
  emergency: {
    hotlineBn: string;
    hotlineEn: string;
    hotlineNumber: string;
    whatsappLink: string;
    whatsappLabelBn: string;
    whatsappLabelEn: string;
    coverageTitleBn: string;
    coverageTitleEn: string;
    coverageAreas: BloodCoverageArea[];
  };
}

/** A role card on the memorial tribute page. */
export interface MemorialRole {
  id: string;
  icon: MemorialRoleIconName;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  periodBn: string;
  periodEn: string;
}

export interface MemorialConfig {
  section: ExperienceSectionContent;
  epigraphBn: string;
  epigraphEn: string;
  imagePublicId: string;
  imageUrl: string;
  nameBn: string;
  nameEn: string;
  relationBn: string;
  relationEn: string;
  deathBadgeBn: string;
  deathBadgeEn: string;
  tributeBn: string;
  tributeEn: string;
  rolesTitleBn: string;
  rolesTitleEn: string;
  roles: MemorialRole[];
  developmentsTitleBn: string;
  developmentsTitleEn: string;
  developmentsBn: string[];
  developmentsEn: string[];
  developmentsMoreBn: string;
  developmentsMoreEn: string;
  duaBn: string;
  duaEn: string;
  signedByBn: string;
  signedByEn: string;
}

export interface ExperienceConfig {
  visible: boolean;
  experience: {
    section: ExperienceSectionContent;
    items: ExperienceItem[];
  };
  blood: BloodSocietyConfig;
  memorial: MemorialConfig;
}
