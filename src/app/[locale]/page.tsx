import { CinematicIntro } from "@/components/sections/CinematicIntro";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { QuickActions } from "@/components/interactive/QuickActions";

// ── Home Page ──────────────────────────────────────────
// Phase 04: Cinematic Hero + App-like Navigation

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <>
      {/* Cinematic Intro (plays once on first visit) */}
      <CinematicIntro />

      {/* Quick Floating Actions */}
      <QuickActions />

      {/* Hero Section */}
      <HeroSection locale={locale} />

      {/* About Preview */}
      <AboutPreview locale={locale} />

      {/* Services Preview */}
      <ServicesPreview locale={locale} />

      {/* More sections will be added in future phases */}
    </>
  );
}
