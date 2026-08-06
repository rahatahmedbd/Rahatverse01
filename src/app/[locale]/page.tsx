import { CinematicIntro } from "@/components/sections/CinematicIntro";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { QuickActions } from "@/components/interactive/QuickActions";
import FeaturedGallery from "@/components/gallery/FeaturedGallery";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

// ── Home Page ──────────────────────────────────────────
// Phase 22: Enhanced with Featured Gallery and Testimonials

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

      {/* Featured Gallery */}
      <div className="container mx-auto px-4 py-12">
        <FeaturedGallery locale={locale} limit={8} />
      </div>

      {/* Services Preview */}
      <ServicesPreview locale={locale} />

      {/* Testimonials */}
      <div className="container mx-auto px-4">
        <TestimonialsSection locale={locale} limit={6} />
      </div>

      {/* More sections will be added in future phases */}
    </>
  );
}
