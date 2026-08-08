"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { Camera, Loader2, Images } from "lucide-react";
import { DEFAULT_GALLERY_CONFIG, validateGalleryConfig } from "@/lib/media/config";
import type { GalleryConfig } from "@/types/media";
import Link from "next/link";

// ── Gallery Section (home — DB-driven album browser) ──
interface GallerySectionProps {
  locale?: string;
}

export function GallerySection({ locale = "bn" }: GallerySectionProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<GalleryConfig>(DEFAULT_GALLERY_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/gallery-config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (cancelled) return;
        const validated = validateGalleryConfig((json as { data?: unknown } | null)?.data);
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
        {isBn ? "গ্যালারি লোড হচ্ছে..." : "Loading gallery..."}
      </div>
    );
  }

  const { section, albums } = config;
  const visibleAlbums = albums.filter((album) => album.visible);

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleAlbums.map((album, index) => (
            <FadeInUp key={album.id} delay={index * 0.05}>
              <Link href={`/${locale}/gallery?album=${album.value}`} className="block h-full">
                <GlassCard className="group relative h-full overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                  <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary/10 to-primary/5">
                    {album.featuredPublicId ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "kbc3dfnj"}/image/upload/q_auto/${album.featuredPublicId}`}
                        alt={isBn ? album.nameBn : album.nameEn}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <Camera className="mb-2 h-10 w-10 text-primary/40" />
                        <Images className="h-6 w-6 text-primary/20" />
                      </div>
                    )}
                    <div className="glass-interactive absolute inset-x-2 bottom-2 rounded-xl p-3 opacity-0 translate-y-2 backdrop-blur-md bg-black/60 border border-white/20 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <p className="text-white text-sm font-semibold bn">
                        {isBn ? album.nameBn : album.nameEn}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold bn">{isBn ? album.nameBn : album.nameEn}</h3>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {album.value}
                      </Badge>
                    </div>
                    {(isBn ? album.descriptionBn : album.descriptionEn) && (
                      <p className="mt-1 text-xs text-muted-foreground bn">
                        {isBn ? album.descriptionBn : album.descriptionEn}
                      </p>
                    )}
                  </div>
                </GlassCard>
              </Link>
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay={0.3}>
          <GlassCard className="mt-8 text-center">
            <p className="text-sm text-muted-foreground bn">
              {isBn ? config.note.bn : config.note.en}
            </p>
            <Button variant="outline" className="mt-3" asChild>
              <Link href={`/${locale}/gallery`}>
                {isBn ? "সম্পূর্ণ গ্যালারি দেখুন" : "View Full Gallery"}
                <Images className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </GlassCard>
        </FadeInUp>
      </div>
    </section>
  );
}
