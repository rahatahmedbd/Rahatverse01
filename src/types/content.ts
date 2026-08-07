// ── Search, FAQ & Legal Policies admin config ─────────
// Stored as JSON in `site_settings` under the `content_config` key.

export interface FaqCategory {
  id: string;
  value: string;
  labelBn: string;
  labelEn: string;
  visible: boolean;
}

export interface FaqItem {
  id: string;
  category: string;
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
  visible: boolean;
}

export interface SearchScopeItem {
  id: string;
  value: string;
  labelBn: string;
  labelEn: string;
  /** Relative search weight. */
  weight: number;
  enabled: boolean;
}

export interface LegalPage {
  /** key: privacy | terms | cookie | refund */
  key: string;
  titleBn: string;
  titleEn: string;
  /** Newline or ## -separated sections of rich text (bilingual). */
  bodyBn: string;
  bodyEn: string;
  updatedAtBn: string;
  updatedAtEn: string;
  visible: boolean;
}

export interface ContentConfig {
  visible: boolean;
  faqSectionTitleBn: string;
  faqSectionTitleEn: string;
  faqSectionSubtitleBn: string;
  faqSectionSubtitleEn: string;
  faqCategories: FaqCategory[];
  faqItems: FaqItem[];
  searchScope: SearchScopeItem[];
  searchPlaceholderBn: string;
  searchPlaceholderEn: string;
  legalPages: LegalPage[];
}
