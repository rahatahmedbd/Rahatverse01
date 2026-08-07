import { CinematicIntro } from "@/components/sections/CinematicIntro";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { QuickActions } from "@/components/interactive/QuickActions";
import FeaturedGallery from "@/components/gallery/FeaturedGallery";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import { getAboutConfig } from "@/lib/about/server";

// ── Home Page ──────────────────────────────────────────
// Phase 22: Enhanced with Featured Gallery and Testimonials

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const aboutConfig = await getAboutConfig();

  return (
    <>
      {/* Cinematic Intro (plays once on first visit) */}
      <CinematicIntro />

      {/* Quick Floating Actions */}
      <QuickActions />

      {/* Hero Section */}
      <HeroSection locale={locale} aboutConfig={aboutConfig} />

      <AuroraDivider />

      {/* About Preview */}
      <AboutPreview locale={locale} config={aboutConfig} />

      <AuroraDivider />

      {/* Featured Gallery */}
      <div className="container mx-auto px-4 py-12">
        <FeaturedGallery locale={locale} limit={8} />
      </div>

      <AuroraDivider />

      {/* Services Preview */}
      <ServicesPreview locale={locale} />

      <AuroraDivider />

      {/* Testimonials */}
      <div className="container mx-auto px-4">
        <TestimonialsSection locale={locale} limit={6} />
      </div>

      <AuroraDivider />

      {/* Newsletter — Phase 27 */}
      <div id="newsletter" className="container mx-auto px-4 py-12">
        <NewsletterSignup locale={locale} source="homepage" />
      </div>
    </>
  );
}
