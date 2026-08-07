// ── Constants ──────────────────────────────────────────

export const APP_NAME = "RahatVerse";
export const APP_DESCRIPTION =
  "রাহাত আহমেদ — শিক্ষার্থী, শিক্ষক, রক্তদাতা, BNCC ক্যাডেট ও ওয়েব ডেভেলপার";

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/rahat.ahmed.948943",
  tiktok: "https://www.tiktok.com/@rahatvives",
  youtube: "https://www.youtube.com/@RahatAhmedOfficial0",
  instagram: "https://www.instagram.com/rahatahm6d/",
  whatsapp: "https://wa.me/8801626224878",
  email: "mailto:rahatbd20505@gmail.com",
  phone: "tel:+8801626224878",
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
