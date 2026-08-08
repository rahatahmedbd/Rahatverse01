export interface PortfolioCategory {
  id: string;
  value: string;
  labelBn: string;
  labelEn: string;
  visible: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  longDescription?: string;
  longDescriptionBn?: string;
  image: string;
  tags: string[];
  tagsBn: string[];
  liveUrl: string;
  githubUrl: string;
  category: string;
  featured: boolean;
  visible: boolean;
  completedAt?: string;
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
