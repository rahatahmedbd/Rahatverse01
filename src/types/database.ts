// ── Database Types ─────────────────────────────────────
// TypeScript types matching the Supabase schema

// ── Profile ────────────────────────────────────────────
export interface DbProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: "admin" | "client" | "visitor";
  created_at: string;
  updated_at: string;
}

// ── Message ────────────────────────────────────────────
export interface DbMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ── Order ──────────────────────────────────────────────
export type OrderStatus = "pending" | "confirmed" | "in_progress" | "review" | "delivered" | "cancelled";
export type PackageType = "basic" | "standard" | "premium" | "enterprise";
export type WebsiteType = "portfolio" | "business" | "ecommerce" | "education" | "blood_org" | "ngo" | "news_portal" | "landing_page" | "event" | "custom";
export type PaymentStatus = "unpaid" | "partial" | "paid";

export interface DbOrder {
  id: string;
  user_id: string | null;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_whatsapp: string | null;
  client_company: string | null;
  package_type: PackageType;
  website_type: WebsiteType;
  description: string | null;
  num_pages: number;
  features: string[];
  color_preference: string | null;
  reference_sites: string[];
  budget_range: string | null;
  timeline: string | null;
  status: OrderStatus;
  admin_notes: string | null;
  payment_status: PaymentStatus;
  payment_amount: number | null;
  created_at: string;
  updated_at: string;
}

// ── Blood Request ──────────────────────────────────────
export type BloodGroup = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
export type BloodRequestStatus = "open" | "fulfilled" | "expired";
export type Urgency = "normal" | "urgent" | "critical";

export interface DbBloodRequest {
  id: string;
  name: string;
  phone: string;
  blood_group: BloodGroup;
  location: string;
  urgency: Urgency;
  message: string | null;
  status: BloodRequestStatus;
  created_at: string;
  updated_at: string;
}

// ── Testimonial ────────────────────────────────────────
export interface DbTestimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

// ── Blog Post ──────────────────────────────────────────
export interface DbBlogPost {
  id: string;
  author_id: string | null;
  author: string | null;
  title: string;
  title_bn: string | null;
  slug: string;
  content: string;
  content_bn: string | null;
  excerpt: string | null;
  excerpt_bn: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  reading_time: number;
  views: number;
  created_at: string;
  updated_at: string;
}

// ── Newsletter Subscriber ──────────────────────────────
export interface DbNewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

// ── Booking ────────────────────────────────────────────
export type BookingStatus = "pending" | "approved" | "rejected" | "completed";

export interface DbBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time_slot: string;
  purpose: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

// ── Site Settings ──────────────────────────────────────
export interface DbSiteSetting {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
}
