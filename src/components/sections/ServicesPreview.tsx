import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { StaggerItem, StaggerGrid } from "@/components/animations/Stagger";
import { ArrowRight, CheckCircle2, Clock3, Wallet, Layers3 } from "lucide-react";
import Link from "next/link";
import { SpotlightCard } from "@/components/interactive/SpotlightCard";
import { getServicesConfig } from "@/lib/services/server";
import { DEFAULT_SERVICES_CONFIG } from "@/lib/services/config";
import { ServicesIcon } from "@/lib/services/icons";

interface ServicesPreviewProps {
  locale?: string;
}

// ── Services preview (homepage) ────────────────────────
// Four clear, client-facing services — Business Website, Landing Page,
// E-commerce and Web Application — each with features, starting price and
// delivery time. Rich detail (packages, comparison, FAQ) lives on /services.
export async function ServicesPreview({ locale = "bn" }: ServicesPreviewProps) {
  const isBn = locale === "bn";
  const config = await getServicesConfig();

  // Prefer the CMS services; fall back to the defaults if the stored row is
  // blank so the section never disappears.
  const services = (
    config.services.filter((s) => s.visible).length > 0
      ? config.services
      : DEFAULT_SERVICES_CONFIG.services
  )
    .filter((s) => s.visible)
    .slice(0, 4);

  if (services.length === 0) return null;

  const section = config.section;

  return (
    <section className="section-atmosphere py-6 sm:py-8 lg:py-10" id="services-preview">
      <Layers3 className="section-watermark -left-6 bottom-12 sm:left-[5%]" aria-hidden="true" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge={isBn ? section.badgeBn : section.badgeEn}
          title={isBn ? section.titleBn : section.titleEn}
          titleBn={isBn ? section.titleBn : section.titleEn}
          subtitle={isBn ? section.subtitleBn : section.subtitleEn}
          locale={locale}
        />

        {/* Service cards — 1 col on mobile, 2 from 640px up */}
        <StaggerGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <SpotlightCard className="h-full rounded-xl">
              <GlassCard className="group flex h-full flex-col p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="icon-frame h-12 w-12 shrink-0 rounded-xl transition-transform duration-300 group-hover:scale-110">
                    <ServicesIcon name={service.icon} className="h-5.5 w-5.5" />
                  </span>
                  <div className="flex flex-col items-end gap-1.5 text-right">
                    <Badge variant="outline" className="gap-1 border-primary/25 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      <Wallet className="h-3 w-3" aria-hidden="true" />
                      {isBn ? service.priceBn : service.priceEn}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock3 className="h-3 w-3" aria-hidden="true" />
                      {isBn ? service.deliveryBn : service.deliveryEn}
                    </span>
                  </div>
                </div>

                <h3 className="mt-3 text-base font-bold leading-snug bn sm:text-lg">
                  {isBn ? service.titleBn : service.titleEn}
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground bn sm:text-sm">
                  {isBn ? service.descriptionBn : service.descriptionEn}
                </p>

                <ul className="mt-3 flex-1 space-y-2">
                  {(isBn ? service.featuresBn : service.featuresEn).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] leading-snug text-foreground/90 bn sm:text-sm">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 border-t border-border/50 pt-3">
                  <Link
                    href={`/${locale}/contact`}
                    className="group/link inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    {isBn ? "এই সার্ভিসের জন্য যোগাযোগ করুন" : "Enquire about this service"}
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </GlassCard>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* CTA — full detail lives on the services page */}
        <div className="mt-5 flex flex-col items-center justify-center gap-3 text-center sm:mt-6 sm:flex-row sm:gap-4">
          <Button variant="gradient" size="lg" asChild className="w-full sm:w-auto">
            <Link href={`/${locale}/contact`} className="inline-flex items-center justify-center gap-2">
              {isBn ? "প্রজেক্ট শুরু করুন" : "Start a Project"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            {isBn ? "সব প্যাকেজ ও প্রাইসিং দেখুন" : "See all packages & pricing"}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
