// ── Contact, Booking & Testimonials admin config ──────
// Stored as JSON in `site_settings` under the `contact_config` key.

export interface ContactSectionContent {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

export interface ContactQuickLinks {
  whatsappBn: string;
  whatsappEn: string;
  whatsappUrl: string;
  emailBn: string;
  emailEn: string;
  emailAddress: string;
  phoneBn: string;
  phoneEn: string;
  phoneNumber: string;
  responseTimeBn: string;
  responseTimeEn: string;
}

export interface BookingSettings {
  headingBn: string;
  headingEn: string;
  /** Daily time slots (e.g. "10:00"). */
  timeSlots: string[];
  /** Buffer minutes between meetings. */
  bufferMinutes: number;
  /** Max meetings allowed per week. */
  maxPerWeek: number;
  purposes: { id: string; value: string; labelBn: string; labelEn: string; visible: boolean }[];
  confirmationMessageBn: string;
  confirmationMessageEn: string;
}

export interface TestimonialSettings {
  headingBn: string;
  headingEn: string;
  subtitleBn: string;
  subtitleEn: string;
  /** How many testimonials appear on the homepage carousel. */
  carouselCount: number;
  autoPlaySeconds: number;
}

export interface ContactConfig {
  visible: boolean;
  section: ContactSectionContent;
  quickLinks: ContactQuickLinks;
  booking: BookingSettings;
  testimonials: TestimonialSettings;
}
