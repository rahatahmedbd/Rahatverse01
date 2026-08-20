// ── Constants ──────────────────────────────────────────

export const APP_NAME = "RahatVerse";
export const APP_DESCRIPTION =
  "রাহাত আহমেদ — ওয়েব ডেভেলপার | আধুনিক ওয়েবসাইট ও ওয়েব অ্যাপ্লিকেশন";

// ── Freelance marketplace profiles ─────────────────────
// TODO: replace with the real Fiverr / Upwork profile URLs — these placeholders
// keep the UI wired while the exact slugs are confirmed.
export const FREELANCE_LINKS = {
  github: "https://github.com/rahatahmedbd",
  fiverr: "https://www.fiverr.com/rahatahmed",
  upwork: "https://www.upwork.com/freelancers/rahatahmed",
} as const;

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/rahat.ahmed.948943",
  tiktok: "https://www.tiktok.com/@rahatvives",
  youtube: "https://www.youtube.com/@RahatAhmedOfficial0",
  instagram: "https://www.instagram.com/rahatahm6d/",
  whatsapp: "https://wa.me/8801626224878",
  email: "mailto:rahatbd20505@gmail.com",
  phone: "tel:+8801626224878",
  github: FREELANCE_LINKS.github,
  fiverr: FREELANCE_LINKS.fiverr,
  upwork: FREELANCE_LINKS.upwork,
} as const;

export const PERSONAL_INFO = {
  name: "রাহাত আহমেদ",
  nameEn: "Rahat Ahmed",
  birthDate: "2006-06-21",
  location: "সুনামগঞ্জ, বাংলাদেশ",
  locationEn: "Sunamganj, Bangladesh",
  bloodGroup: "A+",
  education: "HSC ২য় বর্ষ (বিজ্ঞান)",
  institution: "সুনামগঞ্জ সরকারি কলেজ",
  bnccCadetNo: "25071152",
} as const;

export interface NavItemConfig {
  key: string;
  path: string;
  icon: string;
}

export const NAVIGATION_ITEMS: NavItemConfig[] = [
  { key: "home", path: "/", icon: "Home" },
  { key: "about", path: "/about", icon: "User" },
  { key: "portfolio", path: "/portfolio", icon: "FolderOpen" },
  { key: "services", path: "/services", icon: "Briefcase" },
  { key: "experience", path: "/experience", icon: "Building2" },
  { key: "achievements", path: "/achievements", icon: "Trophy" },
  { key: "gallery", path: "/gallery", icon: "Image" },
  { key: "order", path: "/order", icon: "ShoppingCart" },
  { key: "blog", path: "/blog", icon: "BookOpen" },
  { key: "contact", path: "/contact", icon: "Phone" },
];
