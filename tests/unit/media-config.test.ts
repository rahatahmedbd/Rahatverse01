import { describe, it, expect } from "vitest";
import {
  validateGalleryConfig,
  validateVideoConfig,
  DEFAULT_GALLERY_CONFIG,
  DEFAULT_VIDEO_CONFIG,
} from "@/lib/media/config";
import type { GalleryConfig, VideoConfig } from "@/types/media";

function cloneGallery(value: GalleryConfig): GalleryConfig {
  return JSON.parse(JSON.stringify(value)) as GalleryConfig;
}
function cloneVideo(value: VideoConfig): VideoConfig {
  return JSON.parse(JSON.stringify(value)) as VideoConfig;
}

describe("gallery config validation", () => {
  it("accepts default config", () => {
    expect(validateGalleryConfig(DEFAULT_GALLERY_CONFIG)).not.toBeNull();
  });

  it("rejects missing visible flag", () => {
    const bad = cloneGallery(DEFAULT_GALLERY_CONFIG);
    delete (bad as unknown as Record<string, unknown>).visible;
    expect(validateGalleryConfig(bad)).toBeNull();
  });

  it("rejects an invalid layout mode", () => {
    const bad = cloneGallery(DEFAULT_GALLERY_CONFIG);
    bad.defaultLayout = "carousel" as never;
    expect(validateGalleryConfig(bad)).toBeNull();
  });

  it("accepts hiding an album", () => {
    const cfg = cloneGallery(DEFAULT_GALLERY_CONFIG);
    cfg.albums[0].visible = false;
    expect(validateGalleryConfig(cfg)?.albums[0].visible).toBe(false);
  });

  it("rejects an invalid album slug", () => {
    const bad = cloneGallery(DEFAULT_GALLERY_CONFIG);
    bad.albums[0].value = "has space";
    expect(validateGalleryConfig(bad)).toBeNull();
  });

  it("rejects an empty album name", () => {
    const bad = cloneGallery(DEFAULT_GALLERY_CONFIG);
    bad.albums[0].nameEn = "   ";
    expect(validateGalleryConfig(bad)).toBeNull();
  });
});

describe("video config validation", () => {
  it("accepts default config", () => {
    expect(validateVideoConfig(DEFAULT_VIDEO_CONFIG)).not.toBeNull();
  });

  it("rejects missing visible flag", () => {
    const bad = cloneVideo(DEFAULT_VIDEO_CONFIG);
    delete (bad as unknown as Record<string, unknown>).visible;
    expect(validateVideoConfig(bad)).toBeNull();
  });

  it("accepts a vimeo video with videoId", () => {
    const cfg = cloneVideo(DEFAULT_VIDEO_CONFIG);
    cfg.videos[0] = {
      ...cfg.videos[0],
      platform: "vimeo",
      videoId: "76979871",
      url: "https://vimeo.com/76979871",
    };
    expect(validateVideoConfig(cfg)?.videos[0].platform).toBe("vimeo");
  });

  it("rejects an invalid platform", () => {
    const bad = cloneVideo(DEFAULT_VIDEO_CONFIG);
    bad.videos[0].platform = "dailymotion" as never;
    expect(validateVideoConfig(bad)).toBeNull();
  });

  it("rejects an empty video title", () => {
    const bad = cloneVideo(DEFAULT_VIDEO_CONFIG);
    bad.videos[0].titleEn = "";
    expect(validateVideoConfig(bad)).toBeNull();
  });

  it("rejects an invalid social link URL", () => {
    const bad = cloneVideo(DEFAULT_VIDEO_CONFIG);
    bad.socialLinks[0].url = "javascript:alert(1)";
    expect(validateVideoConfig(bad)).toBeNull();
  });
});
