"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { StaggerItem, StaggerGrid } from "@/components/animations/Stagger";
import { HoverCard3D } from "@/components/interactive/HoverCard3D";
import { FlipCard3D } from "@/components/interactive/FlipCard3D";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DEFAULT_SERVICES_CONFIG, validateServicesConfig } from "@/lib/services/config";
import { ServicesIcon } from "@/lib/services/icons";
import type { ServicesConfig } from "@/types/services";

// ── Services Preview Section (DB-driven) ───────────────
interface ServicesPreviewProps {
  locale?: string;
}

const BADGE_VARIANT_MAP: Record<string, "default" | "secondary" | "outline" | "glow" | "gradient"> = {
  gradient: "gradient",
  glow: "glow",
  outline: "outline",
  secondary: "secondary",
  default: "default",
};

export function ServicesPreview({ locale = "bn" }: ServicesPreviewProps) {
  const isBn = locale === "bn";
  const router = useRouter();
  const [config, setConfig] = useState<ServicesConfig>(DEFAULT_SERVICES_CONFIG);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/services-config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (cancelled) return;
        const validated = validateServicesConfig((json as { data?: unknown } | null)?.data);
        if (validated) setConfig(validated);
      })
      .catch(() => {
        /* fall back to defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const featuredPackages = config.featuredPackages.filter((pkg) => pkg.visible);
  const websiteTypes = config.websiteTypes.filter((type) => type.visible);
  const features = config.features.filter((feature) => feature.visible);
  const section = config.section;

  if (featuredPackages.length === 0) return null;

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

        {/* Featured packages — 3D Flip / Interactive Glow Cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {featuredPackages.slice(0, 3).map((pkg) => (
            <div key={pkg.id} className="h-full">
              <FlipCard3D
                locale={locale}
                frontIcon={<ServicesIcon name={pkg.icon} className="h-6 w-6" />}
                frontBadge={
                  pkg.badgeEn ? (
                    <Badge variant={BADGE_VARIANT_MAP[pkg.badgeVariant] ?? "glow"} className="text-xs">
                      {isBn ? pkg.badgeBn : pkg.badgeEn}
                    </Badge>
                  ) : undefined
                }
                frontTitle={isBn ? pkg.titleBn : pkg.titleEn}
                frontSubtitle={isBn ? pkg.subtitleBn : pkg.subtitleEn}
                backTitle={isBn ? pkg.titleBn : pkg.titleEn}
                backContent={
                  <ul className="space-y-2 text-left">
                    {(isBn ? pkg.featuresBn : pkg.featuresEn).map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs sm:text-sm text-foreground/90"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                }
                backActionLabel={
                  isBn ? "অর্ডার করতে ক্লিক করুন" : "Order This Package"
                }
                onBackAction={() => router.push(`/${locale}/order`)}
                className="hover:glow-amber transition-shadow"
              />
            </div>
          ))}
        </div>

        {/* Website Types Grid */}
        {websiteTypes.length > 0 && (
          <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {websiteTypes.map((type) => (
              <StaggerItem key={type.id}>
                <HoverCard3D className="h-full">
                  <GlassCard className="h-full text-center transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
                    <ServicesIcon name={type.icon} className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <p className="text-sm font-medium bn">{isBn ? type.labelBn : type.labelEn}</p>
                  </GlassCard>
                </HoverCard3D>
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {features.map((feature) => (
              <StaggerItem key={feature.id}>
                <div className="flex items-center gap-3 rounded-xl border border-border/50 p-4 transition-all hover:border-primary/20 hover:bg-accent/10">
                  <ServicesIcon name={feature.icon} className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-sm font-medium bn">{isBn ? feature.titleBn : feature.titleEn}</span>
                </div>
              </StaggerItem>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button variant="gradient" size="lg" asChild>
            <Link href={`/${locale}/order`}>
              {isBn ? "প্রজেক্টের জন্য যোগাযোগ করুন" : "Start Your Project"}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
