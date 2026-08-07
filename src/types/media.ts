// ── Photo Gallery & Video Portfolio admin config ──────
// Stored as JSON in `site_settings` under `gallery_config` and `video_config`.
// The public site validates these payloads and falls back to defaults when the
// database is unavailable or an older/invalid value is encountered.

export interface MediaSectionContent {
  badgeBn: string;
  badgeEn: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
}

// ── Photo Gallery ──────────────────────────────────────
export type GalleryLayoutMode = "mosaic" | "grid";

export interface GalleryAlbum {
  id: string;
  /** Category slug — matches the `images.category` column used at upload. */
  value: string;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  /** Optional public_id of an image to use as the album's featured cover. */
  featuredPublicId: string;
  visible: boolean;
}

export interface GallerySocialNote {
  bn: string;
  en: string;
}

export interface GalleryConfig {
  visible: boolean;
  section: MediaSectionContent;
  defaultLayout: GalleryLayoutMode;
  albums: GalleryAlbum[];
  note: GallerySocialNote;
}

// ── Video Portfolio ────────────────────────────────────
export type VideoPlatform = "youtube" | "vimeo" | "direct";

export interface VideoItem {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  platform: VideoPlatform;
  /** Full URL (watch/share/direct video). */
  url: string;
  /** Extracted video id for YouTube/Vimeo embeds. */
  videoId: string;
  categoryBn: string;
  categoryEn: string;
  thumbnail: string;
  visible: boolean;
}

export interface VideoSocialLink {
  id: string;
  label: string;
  url: string;
}

export interface VideoConfig {
  visible: boolean;
  section: MediaSectionContent;
  videos: VideoItem[];
  socialFollowBn: string;
  socialFollowEn: string;
  socialLinks: VideoSocialLink[];
}
