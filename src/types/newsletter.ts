// ── Newsletter & Email Deliverability admin config ────
// Stored as JSON in `site_settings` under the `newsletter_config` key.

export interface NewsletterSectionContent {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

export interface NewsletterTopic {
  id: string;
  value: string;
  labelBn: string;
  labelEn: string;
  visible: boolean;
}

export interface CampaignDefaults {
  fromNameBn: string;
  fromNameEn: string;
  fromEmail: string;
  defaultSubjectBn: string;
  defaultSubjectEn: string;
  /** Personalization tag shown in preview, e.g. {{name}}. */
  personalizationHintBn: string;
  personalizationHintEn: string;
}

export interface NewsletterConfig {
  visible: boolean;
  section: NewsletterSectionContent;
  topics: NewsletterTopic[];
  campaignDefaults: CampaignDefaults;
}
