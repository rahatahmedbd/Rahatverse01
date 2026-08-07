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
  | "nonprofit"
  | "custom";

export interface OrderFeature {
  id: string;
  name: string;
  nameBn: string;
  price: number;
}

export interface WebsitePackage {
  id: string;
  name: string;
  nameBn: string;
  basePrice: number;
  features: string[];
  featuresBn: string[];
}

// ── Blog Types ─────────────────────────────────────────
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_bn: string | null;
  content: string;
  content_bn: string | null;
  excerpt: string | null;
  excerpt_bn: string | null;
  category: string;
  tags: string[];
  cover_image: string | null;
  reading_time: number;
  author_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// ── Gallery Types ──────────────────────────────────────
export interface GalleryImage {
  id: string;
  public_id: string;
  url: string;
  category: string;
  title: string | null;
  title_bn: string | null;
  description: string | null;
  description_bn: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

// ── Newsletter Types ───────────────────────────────────
export interface NewsletterSubscriber {
  id: string;
  email: string;
  active: boolean;
  confirmed: boolean;
  locale: string;
  subscribed_at: string;
  preferences: string[];
}

// ── Contact Types ──────────────────────────────────────
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

// ── Locale Types ───────────────────────────────────────
export type Locale = "bn" | "en";

export const SUPPORTED_LOCALES: Locale[] = ["bn", "en"];
export const DEFAULT_LOCALE: Locale = "bn";

// ── Theme & Accent Customization Types (Phase H) ───────
export type AccentColor =
  | "emerald"
  | "sapphire"
  | "amethyst"
  | "amber"
  | "crimson"
  | "teal";

export const SUPPORTED_ACCENTS: AccentColor[] = [
  "emerald",
  "sapphire",
  "amethyst",
  "amber",
  "crimson",
  "teal",
];

// ── Navigation Types ───────────────────────────────────
export interface NavItemConfig {
  key: string;
  path: string;
  icon: string;
}

export const NAVIGATION_ITEMS: NavItemConfig[] = [
  { key: "home", path: "/", icon: "Home" },
  { key: "about", path: "/about", icon: "User" },
  { key: "achievements", path: "/achievements", icon: "Trophy" },
  { key: "services", path: "/services", icon: "Briefcase" },
  { key: "gallery", path: "/gallery", icon: "Image" },
  { key: "order", path: "/order", icon: "ShoppingCart" },
  { key: "blog", path: "/blog", icon: "BookOpen" },
  { key: "contact", path: "/contact", icon: "Phone" },
];

// ── Database Types ─────────────────────────────────────
export * from "./database";
