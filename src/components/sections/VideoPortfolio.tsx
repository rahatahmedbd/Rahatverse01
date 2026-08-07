"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { Play, ExternalLink, Loader2, X } from "lucide-react";
import { DEFAULT_VIDEO_CONFIG, validateVideoConfig } from "@/lib/media/config";
import type { VideoConfig, VideoItem } from "@/types/media";

// ── Video Portfolio Section (DB-driven) ────────────────
interface VideoPortfolioProps {
  locale?: string;
}

function getEmbedUrl(video: VideoItem): string | null {
  if (video.platform === "youtube" && video.videoId) {
    return `https://www.youtube.com/embed/${video.videoId}`;
  }
  if (video.platform === "vimeo" && video.videoId) {
    return `https://player.vimeo.com/video/${video.videoId}`;
  }
  return null;
}

export function VideoPortfolio({ locale = "bn" }: VideoPortfolioProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<VideoConfig>(DEFAULT_VIDEO_CONFIG);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/video-config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (cancelled) return;
        const validated = validateVideoConfig((json as { data?: unknown } | null)?.data);
        if (validated) setConfig(validated);
      })
      .catch(() => {
        /* fall back to defaults */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {isBn ? "ভিডিও লোড হচ্ছে..." : "Loading videos..."}
      </div>
    );
  }

  const { section, videos, socialFollowBn, socialFollowEn, socialLinks } = config;
  const visibleVideos = videos.filter((video) => video.visible);
  const embedUrl = activeVideo ? getEmbedUrl(activeVideo) : null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? section.badgeBn : section.badgeEn}
          title={isBn ? section.titleBn : section.titleEn}
          titleBn={isBn ? section.titleBn : section.titleEn}
          subtitle={isBn ? section.subtitleBn : section.subtitleEn}
          locale={locale}
        />

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleVideos.map((video) => {
            const canPreview = getEmbedUrl(video) !== null;
            return (
              <StaggerItem key={video.id}>
                <GlassCard className="group flex h-full flex-col transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                  {/* Thumbnail */}
                  <button
                    type="button"
                    onClick={() => canPreview && setActiveVideo(video)}
                    className="mb-4 block aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-primary/10 to-primary/5"
                  >
                    {video.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={video.thumbnail}
                        alt={isBn ? video.titleBn : video.titleEn}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 transition-transform duration-300 group-hover:scale-110">
                          <Play className="h-6 w-6 text-primary" fill="currentColor" />
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Info */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold bn">{isBn ? video.titleBn : video.titleEn}</h3>
                        {(isBn ? video.categoryBn : video.categoryEn) && (
                          <Badge variant="outline" className="mt-1 text-[10px] uppercase">
                            {isBn ? video.categoryBn : video.categoryEn}
                          </Badge>
                        )}
                        <p className="mt-1 text-xs text-muted-foreground bn">
                          {isBn ? video.descriptionBn : video.descriptionEn}
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center gap-3 pt-3">
                      {canPreview ? (
                        <button
                          type="button"
                          onClick={() => setActiveVideo(video)}
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <Play className="h-3 w-3" fill="currentColor" />
                          {isBn ? "প্রিভিউ" : "Preview"}
                        </button>
                      ) : (
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          {isBn ? "খুলুন" : "Open"}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Social Links */}
        <FadeInUp delay={0.3}>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground bn">
              {isBn ? socialFollowBn : socialFollowEn}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-all hover:border-primary/30 hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </FadeInUp>
      </div>

      {/* Video Modal */}
      {activeVideo && embedUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-border/40 bg-background"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3">
              <span className="text-sm font-semibold bn">
                {isBn ? activeVideo.titleBn : activeVideo.titleEn}
              </span>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={embedUrl}
                title={isBn ? activeVideo.titleBn : activeVideo.titleEn}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
