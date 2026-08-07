import { CinematicIntro } from "@/components/sections/CinematicIntro";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { OrderCtaBand } from "@/components/sections/OrderCtaBand";
import { QuickActions } from "@/components/interactive/QuickActions";
import FeaturedGallery from "@/components/gallery/FeaturedGallery";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import { getAboutConfig } from "@/lib/about/server";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const aboutConfig = await getAboutConfig();

  return (
    <>
      <CinematicIntro />
      <QuickActions />
      <HeroSection locale={locale} aboutConfig={aboutConfig} />

      <AuroraDivider spacing="md" />

      <AboutPreview locale={locale} config={aboutConfig} />

      <AuroraDivider spacing="md" />

      <ServicesPreview locale={locale} />

      <AuroraDivider spacing="md" />

      {/* Testimonials — container handled inside component */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <TestimonialsSection locale={locale} limit={6} />
      </div>

      <AuroraDivider spacing="md" />

      <OrderCtaBand locale={locale} />

      {/* Featured Gallery — balanced grid, pb accounts for bottom nav */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 lg:pb-12">
        <FeaturedGallery locale={locale} limit={8} />
      </section>

      <AuroraDivider spacing="md" />

      {/* Newsletter — compact, not giant */}
      <section id="newsletter" className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <NewsletterSignup locale={locale} source="homepage" />
      </section>
    </>
  );
}
