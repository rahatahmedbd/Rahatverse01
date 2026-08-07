// ── Hero Admin Config Types ──────────────────────────
// Stored as JSON in `site_settings` under key `hero_config`.
// Public read (site_settings_select_public), admin write only.

export interface HeroBadge {
  id: string;
  labelBn: string;
  labelEn: string;
  icon?: string; // lucide icon name, optional
}

export interface HeroCounter {
  id: string;
  labelBn: string;
  labelEn: string;
  value: number;
  suffix: string;
}

export interface HeroCTA {
  id: string;
  labelBn: string;
  labelEn: string;
  href: string;
  variant: "gradient" | "glass" | "outline";
  icon: string; // lucide icon name
  pulse: boolean;
}

export interface HeroConfig {
  intro: {
    welcomeTextBn: string;
    welcomeTextEn: string;
    greetingBn: string; // e.g. "বিসমিল্লাহ..." shown in cinematic intro
    greetingEn: string;
    durationMs: number; // cinematic intro duration
  };
  typewriter: {
    bn: string[];
    en: string[];
  };
  badges: HeroBadge[];
  // Floating stats shown in hero — previously hardcoded 4 counters
  counters: HeroCounter[];
  ctas: HeroCTA[];
  // Global visibility
  visible: boolean;
}
