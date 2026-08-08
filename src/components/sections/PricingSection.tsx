"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { Check, ArrowRight, Sparkles, Star, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { DEFAULT_SERVICES_CONFIG, validateServicesConfig } from "@/lib/services/config";
import type { ServicesConfig } from "@/types/services";

interface PricingSectionProps {
  locale?: string;
}

export function PricingSection({ locale = "bn" }: PricingSectionProps) {
  const isBn = locale === "bn";
  // Render safe defaults immediately; network latency must never blank pricing.
  const [config, setConfig] = useState<ServicesConfig>(DEFAULT_SERVICES_CONFIG);
  const [excludedPackageIds, setExcludedPackageIds] = useState<string[]>([]);
  const [differencesOnly, setDifferencesOnly] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 8_000);

    fetch("/api/services-config", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (controller.signal.aborted) return;
        const validated = validateServicesConfig((json as { data?: unknown } | null)?.data);
        if (validated) setConfig(validated);
      })
      .catch(() => {
        // Defaults remain visible on timeout or network failure.
      })
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!config.visible) return null;

  const packages = config.packages.filter((pkg) => pkg.visible);
  const comparedPackages = packages.filter((pkg) => !excludedPackageIds.includes(pkg.id));
  const comparisonRows = differencesOnly
    ? config.comparisonRows.filter((row) => {
        const values = comparedPackages.map((pkg) => row.values?.[pkg.id] ?? "—");
        return new Set(values).size > 1;
      })
    : config.comparisonRows;

  const togglePackageComparison = (packageId: string) => {
    setExcludedPackageIds((previous) => {
      if (previous.includes(packageId)) {
        return previous.filter((id) => id !== packageId);
      }
      // Keep at least two columns whenever two or more packages exist.
      if (comparedPackages.length <= 2) return previous;
      return [...previous, packageId];
    });
  };

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
                className={`relative flex h-full flex-col ${
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
                            {pkg.priceBdt.toLocaleString(locale === "bn" ? "bn-BD" : "en-US")}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {isBn ? "প্রায়" : "~"} ${pkg.priceUsd.toLocaleString("en-US")} USD
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
                  <Link href={`/${locale}/order?package=${encodeURIComponent(pkg.orderValue)}#order-checkout`}>
                    {isBn ? pkg.ctaBn : pkg.ctaEn}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

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

              {packages.length > 1 && (
                <div className="mb-5 rounded-2xl border border-border/60 bg-card/40 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <SlidersHorizontal className="h-4 w-4 text-primary" />
                      <span className="bn">{isBn ? "তুলনার প্যাকেজ বাছাই করুন" : "Choose packages to compare"}</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={differencesOnly ? "default" : "outline"}
                      aria-pressed={differencesOnly}
                      onClick={() => setDifferencesOnly((value) => !value)}
                    >
                      {isBn ? "শুধু পার্থক্য" : "Differences only"}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2" aria-live="polite">
                    {packages.map((pkg) => {
                      const selected = !excludedPackageIds.includes(pkg.id);
                      const cannotRemove = selected && comparedPackages.length <= 2;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          aria-pressed={selected}
                          disabled={cannotRemove}
                          onClick={() => togglePackageComparison(pkg.id)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70 ${
                            selected
                              ? "border-primary/50 bg-primary/10 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          {selected && <Check className="mr-1 inline h-3 w-3" />}
                          {isBn ? pkg.nameBn : pkg.nameEn}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {comparisonRows.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-border/60">
                  <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead className="bg-card/80">
                      <tr>
                        <th className="sticky left-0 z-10 bg-card p-3 text-left text-muted-foreground">
                          {isBn ? "বৈশিষ্ট্য" : "Feature"}
                        </th>
                        {comparedPackages.map((pkg) => (
                          <th
                            key={pkg.id}
                            className={`min-w-36 p-3 text-center font-semibold ${
                              pkg.popular ? "text-primary" : ""
                            }`}
                          >
                            {isBn ? pkg.nameBn : pkg.nameEn}
                            {pkg.popular && <span className="ml-1 text-[10px] text-primary">★</span>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-t border-border/50 transition-colors hover:bg-accent/10"
                        >
                          <td className="sticky left-0 z-10 bg-background p-3 font-medium">
                            {isBn ? row.featureBn : row.featureEn}
                          </td>
                          {comparedPackages.map((pkg) => (
                            <td key={pkg.id} className="p-3 text-center">
                              {row.values?.[pkg.id] ?? "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-border/60 bg-card/40">
                      <tr>
                        <td className="sticky left-0 z-10 bg-card p-3 font-medium">
                          {isBn ? "শুরু করুন" : "Get started"}
                        </td>
                        {comparedPackages.map((pkg) => (
                          <td key={pkg.id} className="p-3 text-center">
                            <Button size="sm" variant={pkg.popular ? "default" : "outline"} asChild>
                              <Link href={`/${locale}/order?package=${encodeURIComponent(pkg.orderValue)}#order-checkout`}>
                                {isBn ? "বাছাই" : "Choose"}
                              </Link>
                            </Button>
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground bn">
                  {isBn ? "নির্বাচিত প্যাকেজগুলোর মধ্যে কোনো পার্থক্য নেই।" : "No differences found between the selected packages."}
                </p>
              )}
            </div>
          </FadeInUp>
        )}

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
