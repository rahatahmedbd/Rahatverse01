import { getCachedSiteSetting } from "@/lib/site-settings";
import {
  DEFAULT_GALLERY_CONFIG,
  DEFAULT_VIDEO_CONFIG,
  validateGalleryConfig,
  validateVideoConfig,
} from "@/lib/media/config";
import type { GalleryConfig, VideoConfig } from "@/types/media";

/** Fetches the public gallery payload with a safe fallback for local/CI builds. */
export async function getGalleryConfig(): Promise<GalleryConfig> {
  try {
    const value = await getCachedSiteSetting("gallery_config");
    if (value == null) return DEFAULT_GALLERY_CONFIG;
    return validateGalleryConfig(value) ?? DEFAULT_GALLERY_CONFIG;
  } catch {
    return DEFAULT_GALLERY_CONFIG;
  }
}

/** Fetches the public video portfolio payload with a safe fallback. */
export async function getVideoConfig(): Promise<VideoConfig> {
  try {
    const value = await getCachedSiteSetting("video_config");
    if (value == null) return DEFAULT_VIDEO_CONFIG;
    return validateVideoConfig(value) ?? DEFAULT_VIDEO_CONFIG;
  } catch {
    return DEFAULT_VIDEO_CONFIG;
  }
}
