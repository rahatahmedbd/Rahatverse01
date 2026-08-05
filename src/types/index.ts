// ── Core Type Definitions ──────────────────────────────

// ── User Types ─────────────────────────────────────────
export type UserRole = "admin" | "client" | "visitor";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

// ── Order Types ────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "review"
  | "delivered"
  | "cancelled";

export type WebsiteType =
  | "portfolio"
  | "business"
  | "ecommerce"
  | "education"
  | "blood_org"
  | "ngo"
  | "news_portal"
  | "landing_page"
  | "event"
  | "custom";

export type PackageType = "basic" | "standard" | "premium" | "enterprise";

export interface Order {
  id: string;
  user_id: string;
  package_type: PackageType;
  website_type: WebsiteType;
  status: OrderStatus;
  requirements: OrderRequirements;
  contact_info: ContactInfo;
  payment_status: "unpaid" | "partial" | "paid";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderRequirements {
  description: string;
  num_pages: number;
  features: string[];
  color_preference: string | null;
  reference_sites: string[];
  budget_range: string | null;
  timeline: string | null;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  company: string | null;
}

// ── Blog Types ─────────────────────────────────────────
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  reading_time: number;
  created_at: string;
  updated_at: string;
}

// ── Message Types ──────────────────────────────────────
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

// ── Blood Request Types ────────────────────────────────
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface BloodRequest {
  id: string;
  name: string;
  phone: string;
  blood_group: BloodGroup;
  location: string;
  urgency: "normal" | "urgent" | "critical";
  message: string | null;
  status: "open" | "fulfilled" | "expired";
  created_at: string;
}

// ── Testimonial Types ──────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  approved: boolean;
  created_at: string;
}

// ── Locale Types ───────────────────────────────────────
export type Locale = "bn" | "en";

export const SUPPORTED_LOCALES: Locale[] = ["bn", "en"];
export const DEFAULT_LOCALE: Locale = "bn";

// ── Navigation Types ───────────────────────────────────
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}
