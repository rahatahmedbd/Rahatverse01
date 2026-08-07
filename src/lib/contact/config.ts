import type {
  BookingSettings,
  ContactConfig,
  ContactQuickLinks,
  ContactSectionContent,
  TestimonialSettings,
} from "@/types/contact";

const MAX_SHORT = 260;

const DEFAULT_SECTION: ContactSectionContent = {
  badgeBn: "📬 যোগাযোগ",
  badgeEn: "📬 Contact",
  titleBn: "আমার সাথে যোগাযোগ করুন",
  titleEn: "Get in Touch",
  subtitleBn: "প্রজেক্ট, সহযোগিতা বা যেকোনো প্রশ্নের জন্য আমাকে বার্তা পাঠান",
  subtitleEn: "Send me a message for projects, collaboration, or any questions",
};

const DEFAULT_QUICK_LINKS: ContactQuickLinks = {
  whatsappBn: "হোয়াটসঅ্যাপ",
  whatsappEn: "WhatsApp",
  whatsappUrl: "https://wa.me/8801XXXXXXXXX",
  emailBn: "ইমেইল",
  emailEn: "Email",
  emailAddress: "hello@rahatverse.dev",
  phoneBn: "ফোন",
  phoneEn: "Phone",
  phoneNumber: "+880 1XXX-XXXXXX",
  responseTimeBn: "সাধারণত ২৪ ঘণ্টার মধ্যে উত্তর দিই",
  responseTimeEn: "I usually reply within 24 hours",
};

const DEFAULT_BOOKING: BookingSettings = {
  headingBn: "অ্যাপয়েন্টমেন্ট বুকিং",
  headingEn: "Appointment Booking",
  timeSlots: ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
  bufferMinutes: 15,
  maxPerWeek: 10,
  purposes: [
    { id: "purpose-consult", value: "consultation", labelBn: "কনসালটেশন", labelEn: "Consultation", visible: true },
    { id: "purpose-project", value: "project", labelBn: "প্রজেক্ট আলোচনা", labelEn: "Project Discussion", visible: true },
    { id: "purpose-blood", value: "blood", labelBn: "রক্তদান", labelEn: "Blood Donation", visible: true },
  ],
  confirmationMessageBn: "আপনার অ্যাপয়েন্টমেন্ট নিশ্চিত হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।",
  confirmationMessageEn: "Your appointment is confirmed. We will contact you shortly.",
};

const DEFAULT_TESTIMONIALS: TestimonialSettings = {
  headingBn: "মানুষ যা বলছে",
  headingEn: "What People Say",
  subtitleBn: "আমার সাথে কাজ করেছেন এমন ক্লায়েন্ট ও সহযোগীদের অভিজ্ঞতা",
  subtitleEn: "Experiences of clients and collaborators I've worked with",
  carouselCount: 5,
  autoPlaySeconds: 5,
};

export const DEFAULT_CONTACT_CONFIG: ContactConfig = {
  visible: true,
  section: DEFAULT_SECTION,
  quickLinks: DEFAULT_QUICK_LINKS,
  booking: DEFAULT_BOOKING,
  testimonials: DEFAULT_TESTIMONIALS,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isText(value: unknown, max = MAX_SHORT, allowEmpty = false): value is string {
  return typeof value === "string" && value.length <= max && (allowEmpty || value.trim().length > 0);
}
function isSafeUrl(value: unknown, allowEmpty = false): boolean {
  return typeof value === "string" && value.length <= 1000 && (value === "" || /^(https?|whatsapp):\/\//i.test(value) || value.startsWith("/")) && (allowEmpty || value.length > 0);
}
function validateSection(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isText(value.badgeBn) && isText(value.badgeEn) && isText(value.titleBn) && isText(value.titleEn) && isText(value.subtitleBn) && isText(value.subtitleEn);
}
function validateQuickLinks(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return isText(value.whatsappBn) && isText(value.whatsappEn) && isSafeUrl(value.whatsappUrl) &&
    isText(value.emailBn) && isText(value.emailEn) && isText(value.emailAddress) &&
    isText(value.phoneBn) && isText(value.phoneEn) && isText(value.phoneNumber, 40) &&
    isText(value.responseTimeBn, 200, true) && isText(value.responseTimeEn, 200, true);
}
function validateBooking(value: unknown): boolean {
  if (!isRecord(value)) return false;
  if (!isText(value.headingBn) || !isText(value.headingEn)) return false;
  if (!Array.isArray(value.timeSlots) || value.timeSlots.length > 30) return false;
  if (!value.timeSlots.every((t) => typeof t === "string" && t.length <= 10)) return false;
  const buffer = Number(value.bufferMinutes);
  const max = Number(value.maxPerWeek);
  if (!Number.isFinite(buffer) || buffer < 0 || buffer > 240) return false;
  if (!Number.isFinite(max) || max < 1 || max > 100) return false;
  if (!Array.isArray(value.purposes) || value.purposes.length > 20) return false;
  if (!value.purposes.every((p) => isRecord(p) && isText(p.id, 80) && isText(p.value, 80) && isText(p.labelBn) && isText(p.labelEn) && typeof p.visible === "boolean")) return false;
  return isText(value.confirmationMessageBn, MAX_SHORT, true) && isText(value.confirmationMessageEn, MAX_SHORT, true);
}
function validateTestimonials(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const count = Number(value.carouselCount);
  const secs = Number(value.autoPlaySeconds);
  if (!Number.isFinite(count) || count < 1 || count > 20) return false;
  if (!Number.isFinite(secs) || secs < 2 || secs > 30) return false;
  return isText(value.headingBn) && isText(value.headingEn) && isText(value.subtitleBn, MAX_SHORT, true) && isText(value.subtitleEn, MAX_SHORT, true);
}

export function validateContactConfig(input: unknown): ContactConfig | null {
  if (!isRecord(input)) return null;
  if (typeof input.visible !== "boolean") return null;
  if (!validateSection(input.section)) return null;
  if (!validateQuickLinks(input.quickLinks)) return null;
  if (!validateBooking(input.booking)) return null;
  if (!validateTestimonials(input.testimonials)) return null;
  return input as unknown as ContactConfig;
}
