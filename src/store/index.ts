// ── Zustand Store ──────────────────────────────────────
// Global state management

import { create } from "zustand";
import type { Locale, AccentColor } from "@/types";

// ── Accent Theme Config Map ────────────────────────────
export const ACCENT_THEMES: Record<
  AccentColor,
  {
    nameEn: string;
    nameBn: string;
    primary: string;
    primaryForeground: string;
    ring: string;
    gradientStart: string;
    gradientMiddle: string;
    gradientEnd: string;
    selectionBg: string;
    previewGradient: string;
  }
> = {
  emerald: {
    nameEn: "Emerald Green",
    nameBn: "পান্না সবুজ",
    primary: "#10b981",
    primaryForeground: "#020817",
    ring: "#10b981",
    gradientStart: "#10b981",
    gradientMiddle: "#059669",
    gradientEnd: "#f59e0b",
    selectionBg: "rgba(16, 185, 129, 0.35)",
    previewGradient: "from-emerald-500 to-amber-500",
  },
  sapphire: {
    nameEn: "Sapphire Blue",
    nameBn: "নীল আকাশ",
    primary: "#3b82f6",
    primaryForeground: "#ffffff",
    ring: "#3b82f6",
    gradientStart: "#3b82f6",
    gradientMiddle: "#06b6d4",
    gradientEnd: "#8b5cf6",
    selectionBg: "rgba(59, 130, 246, 0.35)",
    previewGradient: "from-blue-500 to-cyan-400",
  },
  amethyst: {
    nameEn: "Amethyst Violet",
    nameBn: "বেগুনি রাজকীয়",
    primary: "#8b5cf6",
    primaryForeground: "#ffffff",
    ring: "#8b5cf6",
    gradientStart: "#8b5cf6",
    gradientMiddle: "#ec4899",
    gradientEnd: "#3b82f6",
    selectionBg: "rgba(139, 92, 246, 0.35)",
    previewGradient: "from-purple-500 to-pink-500",
  },
  amber: {
    nameEn: "Amber Gold",
    nameBn: "সোনালী সূর্যাস্ত",
    primary: "#f59e0b",
    primaryForeground: "#020817",
    ring: "#f59e0b",
    gradientStart: "#f59e0b",
    gradientMiddle: "#f97316",
    gradientEnd: "#ef4444",
    selectionBg: "rgba(245, 158, 11, 0.35)",
    previewGradient: "from-amber-500 to-red-500",
  },
  crimson: {
    nameEn: "Crimson Red",
    nameBn: "রক্তদান লাল",
    primary: "#ef4444",
    primaryForeground: "#ffffff",
    ring: "#ef4444",
    gradientStart: "#ef4444",
    gradientMiddle: "#f97316",
    gradientEnd: "#f59e0b",
    selectionBg: "rgba(239, 68, 68, 0.35)",
    previewGradient: "from-red-500 to-orange-500",
  },
  teal: {
    nameEn: "Ocean Teal",
    nameBn: "সাগর নীল",
    primary: "#14b8a6",
    primaryForeground: "#020817",
    ring: "#14b8a6",
    gradientStart: "#14b8a6",
    gradientMiddle: "#06b6d4",
    gradientEnd: "#3b82f6",
    selectionBg: "rgba(20, 184, 166, 0.35)",
    previewGradient: "from-teal-500 to-blue-500",
  },
};

export function applyAccentToDOM(accent: AccentColor) {
  if (typeof document === "undefined") return;
  const config = ACCENT_THEMES[accent];
  if (!config) return;

  const root = document.documentElement;
  root.style.setProperty("--primary", config.primary);
  root.style.setProperty("--primary-foreground", config.primaryForeground);
  root.style.setProperty("--ring", config.ring);
  root.style.setProperty("--gradient-start", config.gradientStart);
  root.style.setProperty("--gradient-middle", config.gradientMiddle);
  root.style.setProperty("--gradient-end", config.gradientEnd);
  root.style.setProperty("--selection-bg", config.selectionBg);

  try {
    localStorage.setItem("rahatverse_accent", accent);
  } catch {
    // Ignore localStorage access errors in private/sandboxed contexts
  }
}

// ── App Store ──────────────────────────────────────────
interface AppState {
  // Theme
  theme: "dark" | "light";
  toggleTheme: () => void;
  setTheme: (theme: "dark" | "light") => void;

  // Accent color customization
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;

  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Navigation
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Loading
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Theme
  theme: "dark",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  setTheme: (theme) => set({ theme }),

  // Accent color customization (Phase H)
  accent: "emerald",
  setAccent: (accent) => {
    applyAccentToDOM(accent);
    set({ accent });
  },

  // Locale
  locale: "bn",
  setLocale: (locale) => set({ locale }),

  // Navigation
  isMobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  // Loading
  isLoading: true,
  setLoading: (isLoading) => set({ isLoading }),
}));
