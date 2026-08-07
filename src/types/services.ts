// ── Services, website types, pricing & process admin config ──
// Stored as JSON in `site_settings` under the `services_config` key.
// The public site validates this payload and falls back to defaults when the
// database is unavailable or an older/invalid value is encountered.

export type ServicesIconName =
  | "Code"
  | "Palette"
  | "ShoppingBag"
  | "GraduationCap"
  | "Droplets"
  | "Building2"
  | "Globe"
  | "Briefcase"
  | "Newspaper"
  | "Zap"
  | "Shield"
  | "Smartphone"
  | "Search"
  | "Clock"
  | "Users"
  | "Code2"
  | "Sparkles"
  | "Rocket"
  | "PenTool"
  | "BarChart3"
  | "Layers"
  | "Wallet"
  | "Database"
  | "Server"
  | "Gauge"
  | "CheckCircle2";

export type ServiceBadgeVariant = "gradient" | "glow" | "outline" | "secondary" | "default";

export interface ServicesTextPair {
  bn: string;
  en: string;
}

export interface ServicesSectionContent {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

/** A service offering card (e.g. Web Development, UI/UX, E-commerce). */
export interface ServicesService {
  id: string;
  visible: boolean;
  icon: ServicesIconName;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  featuresBn: string[];
  featuresEn: string[];
  priceBn: string;
  priceEn: string;
  deliveryBn: string;
  deliveryEn: string;
}

/** A "website type" chip shown on the home services preview. */
export interface ServicesWebsiteType {
  id: string;
  visible: boolean;
  icon: ServicesIconName;
  labelBn: string;
  labelEn: string;
}

/** A "why choose us" feature (grid on the services page + home). */
export interface ServicesFeature {
  id: string;
  visible: boolean;
  icon: ServicesIconName;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
}

/** A featured package shown as a 3D flip card on the home services preview. */
export interface ServicesFeaturedPackage {
  id: string;
  visible: boolean;
  icon: ServicesIconName;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  badgeBn: string;
  badgeEn: string;
  badgeVariant: ServiceBadgeVariant;
  featuresBn: string[];
  featuresEn: string[];
}

/** A pricing tier with both BDT and USD amounts. */
export interface ServicesPackage {
  id: string;
  visible: boolean;
  nameBn: string;
  nameEn: string;
  priceBdt: number;
  priceUsd: number;
  descriptionBn: string;
  descriptionEn: string;
  featuresBn: string[];
  featuresEn: string[];
  popular: boolean;
  ctaBn: string;
  ctaEn: string;
}

/** A single row in the side-by-side feature comparison matrix. */
export interface ServicesComparisonRow {
  id: string;
  featureBn: string;
  featureEn: string;
  /** Per-package cell text, keyed by package id (e.g. "✓", "৳5,000", "—"). */
  values: Record<string, string>;
}

/** A step in the client workflow / process timeline. */
export interface ServicesProcessStep {
  id: string;
  stepBn: string;
  stepEn: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
}

export interface ServicesCta {
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  primaryLabelBn: string;
  primaryLabelEn: string;
  secondaryLabelBn: string;
  secondaryLabelEn: string;
}

export interface ServicesConfig {
  visible: boolean;
  section: ServicesSectionContent;
  services: ServicesService[];
  websiteTypes: ServicesWebsiteType[];
  features: ServicesFeature[];
  featuredPackages: ServicesFeaturedPackage[];
  pricingSection: ServicesSectionContent;
  packages: ServicesPackage[];
  comparisonSection: ServicesSectionContent;
  comparisonRows: ServicesComparisonRow[];
  processSection: ServicesSectionContent;
  processSteps: ServicesProcessStep[];
  cta: ServicesCta;
}
