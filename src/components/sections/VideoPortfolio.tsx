"use client";

import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { Play, ExternalLink } from "lucide-react";

// ── Video Portfolio Section ────────────────────────────
interface VideoPortfolioProps {
  locale?: string;
}

interface VideoItem {
  id: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  platform: "youtube" | "tiktok";
  url: string;
  thumbnail?: string;
}

const videos: VideoItem[] = [
  {
    id: "1",
    title: "YouTube Channel",
    titleBn: "YouTube চ্যানেল",
    description: "Educational content and social awareness videos",
    descriptionBn: "শিক্ষামূলক কনটেন্ট ও সামাজিক সচেতনতা",
    platform: "youtube",
    url: "https://www.youtube.com/@RahatAhmedOfficial0",
  },
  {
    id: "2",
    title: "TikTok Content",
    titleBn: "TikTok কনটেন্ট",
    description: "Short educational and awareness videos",
    descriptionBn: "ছোট শিক্ষামূলক ও সচেতনতামূলক ভিডিও",
    platform: "tiktok",
    url: "https://www.tiktok.com/@rahatvives",
  },
];

export function VideoPortfolio({ locale = "bn" }: VideoPortfolioProps) {
  const isBn = locale === "bn";

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "🎬 ভিডিও পোর্টফোলিও" : "🎬 Video Portfolio"}
          title="Video Content"
          titleBn="ভিডিও কনটেন্ট"
          subtitle={
            isBn
              ? "শিক্ষা, প্রযুক্তি ও সামাজিক সচেতনতা নিয়ে তৈরি কনটেন্ট"
              : "Content on education, technology, and social awareness"
          }
          locale={locale}
        />

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <StaggerItem key={video.id}>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <GlassCard className="group h-full transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                  {/* Thumbnail placeholder */}
                  <div className="mb-4 flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-6 w-6 text-primary" fill="currentColor" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold bn">{isBn ? video.titleBn : video.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground bn">
                        {isBn ? video.descriptionBn : video.description}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                </GlassCard>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Social Links */}
        <FadeInUp delay={0.3}>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground bn">
              {isBn
                ? "আমার সোশ্যাল মিডিয়া অনুসরণ করুন:"
                : "Follow me on social media:"}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <a
                href="https://www.youtube.com/@RahatAhmedOfficial0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-all hover:border-red-500/30 hover:text-red-400"
              >
                <Play className="h-4 w-4" />
                YouTube
              </a>
              <a
                href="https://www.tiktok.com/@rahatvives"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-all hover:border-white/30 hover:text-white"
              >
                <Play className="h-4 w-4" />
                TikTok
              </a>
              <a
                href="https://www.facebook.com/rahat.ahmed.948943"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-all hover:border-blue-500/30 hover:text-blue-400"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/rahatahm6d/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm transition-all hover:border-pink-500/30 hover:text-pink-400"
              >
                Instagram
              </a>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
