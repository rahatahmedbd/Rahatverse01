"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { Check, ArrowRight, Sparkles, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { DEFAULT_SERVICES_CONFIG, validateServicesConfig } from "@/lib/services/config";
import type { ServicesConfig } from "@/types/services";

// ── Pricing Section (DB-driven) ────────────────────────
interface PricingSectionProps {
  locale?: string;
}

export function PricingSection({ locale = "bn" }: PricingSectionProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<ServicesConfig>(DEFAULT_SERVICES_CONFIG);
  const [loading, setLoading] = useState(true);

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
        {isBn ? "প্যাকেজ লোড হচ্ছে..." : "Loading packages..."}
      </div>
    );
  }

  const packages = config.packages.filter((pkg) => pkg.visible);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? config.pricingSection.badgeBn : config.pricingSection.badgeEn}
          title={isBn ? config.pricingSection.titleBn : config.pricingSection.titleEn}
          titleBn={isBn ? config.pricingSection.titleBn : config.pricingSection.titleEn}
          subtitle={isBn ? config.pricingSection.subtitleBn : config.pricingSection.subtitleEn}
          locale={locale}
        />

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <StaggerItem key={pkg.id}>
              <GlassCard
                className={`relative h-full flex flex-col ${
                  pkg.popular ? "border-primary/50 shadow-lg shadow-primary/10" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="gradient" className="flex items-center gap-1">
                      <Star className="h-3 w-3" fill="currentColor" />
                      {isBn ? "জনপ্রিয়" : "Popular"}
                    </Badge>
                  </div>
                )}

                <div className="mb-4 text-center">
                  <h3 className="text-lg font-bold">{isBn ? pkg.nameBn : pkg.nameEn}</h3>
                  <div className="mt-3">
                    {pkg.priceBdt > 0 ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-sm text-muted-foreground">৳</span>
                          <span className="text-4xl font-bold text-primary">
                            {pkg.priceBdt.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {isBn ? "প্রায়" : "~"} ${pkg.priceUsd.toLocaleString()} USD
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {isBn ? "যোগাযোগ করুন" : "Contact Us"}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground bn">
                    {isBn ? pkg.descriptionBn : pkg.descriptionEn}
                  </p>
                </div>

                <div className="mb-6 flex-1 space-y-2">
                  {(isBn ? pkg.featuresBn : pkg.featuresEn).map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-green-400" />
                      <span className="bn">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={pkg.popular ? "gradient" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link href={`/${locale}/order?package=${pkg.id}#order-checkout`}>
                    {isBn ? pkg.ctaBn : pkg.ctaEn}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Side-by-side comparison matrix */}
        {config.comparisonRows.length > 0 && packages.length > 0 && (
          <FadeInUp delay={0.2}>
            <div className="mt-16">
              <SectionTitle
                badge={isBn ? config.comparisonSection.badgeBn : config.comparisonSection.badgeEn}
                title={isBn ? config.comparisonSection.titleBn : config.comparisonSection.titleEn}
                titleBn={isBn ? config.comparisonSection.titleBn : config.comparisonSection.titleEn}
                subtitle={isBn ? config.comparisonSection.subtitleBn : config.comparisonSection.subtitleEn}
                locale={locale}
              />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="p-3 text-left text-muted-foreground">
                        {isBn ? "বৈশিষ্ট্য" : "Feature"}
                      </th>
                      {packages.map((pkg) => (
                        <th
                          key={pkg.id}
                          className={`p-3 text-center font-semibold ${
                            pkg.popular ? "text-primary" : ""
                          }`}
                        >
                          {isBn ? pkg.nameBn : pkg.nameEn}
                          {pkg.popular && (
                            <span className="ml-1 align-middle text-[10px] text-primary">★</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {config.comparisonRows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t border-border/50 transition-colors hover:bg-accent/10"
                      >
                        <td className="p-3 font-medium">
                          {isBn ? row.featureBn : row.featureEn}
                        </td>
                        {packages.map((pkg) => (
                          <td key={pkg.id} className="p-3 text-center">
                            {row.values?.[pkg.id] ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeInUp>
        )}

        {/* Custom quote */}
        <FadeInUp delay={0.3}>
          <div className="mt-12 text-center">
            <GlassCard className="inline-block">
              <p className="text-sm text-muted-foreground bn">
                <Sparkles className="mr-1 inline h-4 w-4 text-primary" />
                {isBn
                  ? "আপনার প্রজেক্ট কি এর বাইরে? কাস্টম কোটের জন্য যোগাযোগ করুন!"
                  : "Your project is different? Contact us for a custom quote!"}
              </p>
            </GlassCard>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
