// ── Interactive Themes, Gamification (XP) & Audio admin config ──
// Stored as JSON in `site_settings` under the `theme_config` key.

export interface ThemeSectionContent {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

export interface ThemePreset {
  id: string;
  nameBn: string;
  nameEn: string;
  /** CSS color values applied to the accent CSS variables. */
  primary: string;
  primaryForeground: string;
  ring: string;
  gradientStart: string;
  gradientMiddle: string;
  gradientEnd: string;
  selectionBg: string;
  visible: boolean;
}

export interface ThemeDefaults {
  /** Preset id to use as the default accent. */
  defaultAccent: string;
  /** "dark" | "light" | "system". */
  defaultTheme: string;
  /** Enables the visitor accent customizer on the site. */
  allowCustomAccent: boolean;
}

export interface XpRule {
  id: string;
  action: string;
  points: number;
  labelBn: string;
  labelEn: string;
  enabled: boolean;
}

export interface XpLevel {
  id: string;
  minXp: number;
  nameBn: string;
  nameEn: string;
  rewardMessageBn: string;
  rewardMessageEn: string;
}

export interface AudioTrack {
  id: string;
  titleBn: string;
  titleEn: string;
  url: string;
  visible: boolean;
}

export interface AudioSettings {
  enabled: boolean;
  defaultVolume: number;
  tracks: AudioTrack[];
}

export interface EffectsSettings {
  particleField: boolean;
  particleIntensity: number;
  auroraMesh: boolean;
  customCursor: boolean;
  sparkleTrail: boolean;
  /** 0–1 intensity for the enabled effects. */
  intensity: number;
}

export interface ThemeConfig {
  visible: boolean;
  section: ThemeSectionContent;
  presets: ThemePreset[];
  defaults: ThemeDefaults;
  xp: {
    rules: XpRule[];
    levels: XpLevel[];
  };
  audio: AudioSettings;
  effects: EffectsSettings;
}
