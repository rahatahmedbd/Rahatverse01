import { createClient } from "@/lib/supabase/server";
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
    const supabase = await createClient();
    if (!supabase) return DEFAULT_GALLERY_CONFIG;
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "gallery_config")
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_GALLERY_CONFIG;
    return validateGalleryConfig(data.value) ?? DEFAULT_GALLERY_CONFIG;
  } catch {
    return DEFAULT_GALLERY_CONFIG;
  }
}

/** Fetches the public video portfolio payload with a safe fallback. */
export async function getVideoConfig(): Promise<VideoConfig> {
  try {
    const supabase = await createClient();
    if (!supabase) return DEFAULT_VIDEO_CONFIG;
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "video_config")
      .maybeSingle();
    if (error || !data?.value) return DEFAULT_VIDEO_CONFIG;
    return validateVideoConfig(data.value) ?? DEFAULT_VIDEO_CONFIG;
  } catch {
    return DEFAULT_VIDEO_CONFIG;
  }
}
