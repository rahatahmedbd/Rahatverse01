// ── Global Site Settings, Security & Maintenance admin config ──
// Stored as JSON in `site_settings` under the `global_config` key.

export interface AnnouncementBanner {
  enabled: boolean;
  textBn: string;
  textEn: string;
  link: string;
}

export interface FooterSettings {
  copyrightBn: string;
  copyrightEn: string;
  madeWithBn: string;
  madeWithEn: string;
  businessPhone: string;
  businessEmail: string;
  businessWhatsapp: string;
  locationBn: string;
  locationEn: string;
}

export interface HeaderAnnouncement {
  enabled: boolean;
  textBn: string;
  textEn: string;
}

export interface MaintenanceSettings {
  enabled: boolean;
  messageBn: string;
  messageEn: string;
  /** Allow admins to access the site even during maintenance. */
  allowAdmins: boolean;
}

export interface GlobalConfig {
  visible: boolean;
  announcement: AnnouncementBanner;
  header: HeaderAnnouncement;
  footer: FooterSettings;
  maintenance: MaintenanceSettings;
}
