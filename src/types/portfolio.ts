export interface PortfolioCategory {
  id: string;
  value: string;
  labelBn: string;
  labelEn: string;
  visible: boolean;
}

/**
 * Honest project lifecycle status. A "concept" is a design-stage personal
 * blueprint and must never be presented as a delivered client project.
 */
export type PortfolioProjectStatus = "live" | "in-development" | "concept";

export interface PortfolioProject {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  longDescription?: string;
  longDescriptionBn?: string;
  image: string;
  /**
   * When set, the card renders a live iframe preview of this URL instead of a
   * static image — used for real, deployed projects that permit framing. The
   * preview itself is non-interactive; the card's explicit Live Demo action
   * is the only control that opens `liveUrl`.
   */
  embedUrl?: string;
  tags: string[];
  tagsBn: string[];
  liveUrl: string;
  githubUrl: string;
  category: string;
  featured: boolean;
  visible: boolean;
  completedAt?: string;
  status?: PortfolioProjectStatus;
}

export interface PortfolioSectionContent {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

export interface PortfolioConfig {
  visible: boolean;
  section: PortfolioSectionContent;
  categories: PortfolioCategory[];
  projects: PortfolioProject[];
}
