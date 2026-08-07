// ── Analytics & Performance Vitals admin config ────────
// Stored as JSON in `site_settings` under the `analytics_config` key.

export interface AnalyticsSectionContent {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

export interface VitalsThresholds {
  /** Target LCP in ms. */
  lcpTargetMs: number;
  /** Target INP in ms. */
  inpTargetMs: number;
  /** Target CLS (unitless, e.g. 0.1). */
  clsTarget: number;
}

export interface AnalyticsSettings {
  /** Enable/disable first-party telemetry collection. */
  telemetryEnabled: boolean;
  /** Show demographics panel. */
  showDemographics: boolean;
  /** Show device breakdown panel. */
  showDevices: boolean;
  /** Show geographical breakdown panel. */
  showGeo: boolean;
  /** Show Core Web Vitals panel. */
  showVitals: boolean;
  /** Label for the conversion goal (e.g. 'Completed Orders'). */
  conversionGoalBn: string;
  conversionGoalEn: string;
  vitals: VitalsThresholds;
}

export interface AnalyticsConfig {
  visible: boolean;
  section: AnalyticsSectionContent;
  settings: AnalyticsSettings;
}
