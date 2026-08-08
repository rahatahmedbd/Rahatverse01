"use client";

import { useEffect, useState } from "react";
import { FadeInUp, FadeInLeft, FadeInRight } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { DEFAULT_SERVICES_CONFIG, validateServicesConfig } from "@/lib/services/config";
import { ServicesIcon } from "@/lib/services/icons";
import type { ServicesConfig } from "@/types/services";
import TestimonialsSection from "@/components/sections/TestimonialsSection";

export default function ServicesPage() {
  const locale = useLocale();
  const isBn = locale === "bn";
  // Initialize with rich defaults so the page renders immediately even if the
  // config API is slow or unreachable (never blocks the UI on "Loading...").
  const [config, setConfig] = useState<ServicesConfig>(DEFAULT_SERVICES_CONFIG);

  useEffect(() => {
    const controller = new AbortController();
    // Hard timeout so a slow/hung config endpoint can never leave this page
    // in a perpetual loading state — content always renders from defaults.
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    fetch("/api/services-config", { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        const validated = validateServicesConfig((json as { data?: unknown } | null)?.data);
        if (validated) setConfig(validated);
      })
      .catch(() => {
        /* fall back to defaults */
      })
      .finally(() => clearTimeout(timeoutId));
    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  // If the stored config ends up with no visible packages (e.g. an empty DB
  // row), fall back to the rich defaults so the page is never blank.
  const services = (config.services.filter((service) => service.visible).length > 0
    ? config.services
    : DEFAULT_SERVICES_CONFIG.services
  ).filter((service) => service.visible);
  const featuredPackages = (
    config.featuredPackages.filter((pkg) => pkg.visible).length > 0
      ? config.featuredPackages
      : DEFAULT_SERVICES_CONFIG.featuredPackages
  ).filter((pkg) => pkg.visible);
  const features = config.features.filter((feature) => feature.visible);
  const process = config.processSteps;
  const section = config.section;
  const cta = config.cta;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInUp>
          <div className="text-center mb-16">
            <p className="mb-2 text-sm font-medium text-primary bn">{isBn ? section.badgeBn : section.badgeEn}</p>
            <h1 className="text-gradient text-display-lg mb-4 font-bold">
              {isBn ? section.titleBn : section.titleEn}
            </h1>
            <p className="text-xl text-muted-foreground">
              {isBn ? section.subtitleBn : section.subtitleEn}
            </p>
          </div>
        </FadeInUp>

        {/* Featured Packages — the three headline packages with a price placeholder */}
        {featuredPackages.length > 0 && (
          <FadeInUp>
            <div className="mb-16">
              <h2 className="text-heading-lg font-bold text-center mb-8">
                {isBn ? "ওয়েবসাইট প্যাকেজ" : "Website Packages"}
              </h2>
              <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredPackages.slice(0, 3).map((pkg) => (
                  <StaggerItem key={pkg.id}>
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-3">
                            <ServicesIcon name={pkg.icon} className="h-8 w-8 text-primary" />
                            <CardTitle className="text-xl">{isBn ? pkg.titleBn : pkg.titleEn}</CardTitle>
                          </div>
                          {pkg.badgeEn && (
                            <Badge variant="outline" className="shrink-0 text-xs">
                              {isBn ? pkg.badgeBn : pkg.badgeEn}
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{isBn ? pkg.subtitleBn : pkg.subtitleEn}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <ul className="space-y-2">
                            {(isBn ? pkg.featuresBn : pkg.featuresEn).map((feature) => (
                              <li key={feature} className="flex items-start gap-2">
                                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm bn">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="pt-4 border-t flex items-center justify-between gap-3">
                            <div className="text-2xl font-bold text-primary">
                              {isBn ? "শুরু ৳X থেকে" : "Starting from ৳X"}
                            </div>
                            <Button asChild>
                              <Link href={`/${locale}/order#order-checkout`}>
                                {isBn ? "অর্ডার করুন" : "Order Now"}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeInUp>
        )}

        {/* Services Grid */}
        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <ServicesIcon name={service.icon} className="h-8 w-8 text-primary" />
                    <CardTitle className="text-xl">{isBn ? service.titleBn : service.titleEn}</CardTitle>
                  </div>
                  <CardDescription>{isBn ? service.descriptionBn : service.descriptionEn}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">{isBn ? "ফিচারসমূহ:" : "Features:"}</h4>
                      <ul className="space-y-2">
                        {(isBn ? service.featuresBn : service.featuresEn).map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm bn">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-left">
                          <div className="text-2xl font-bold text-primary">
                            {isBn ? service.priceBn : service.priceEn}
                          </div>
                          {service.deliveryBn && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Clock className="h-3 w-3" />
                              <span className="bn">{isBn ? service.deliveryBn : service.deliveryEn}</span>
                            </div>
                          )}
                        </div>
                        <Button asChild>
                          <Link href={`/${locale}/order#order-checkout`}>
                            {isBn ? "অর্ডার করুন" : "Order Now"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Why Choose Us */}
        <FadeInUp>
          <div className="mb-20">
            <h2 className="text-heading-lg font-bold text-center mb-12">
              {isBn ? "কেন আমাদের বেছে নেবেন?" : "Why Choose Us?"}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <FadeInLeft key={feature.id}>
                  <Card className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <ServicesIcon name={feature.icon} className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        {isBn ? feature.titleBn : feature.titleEn}
                      </h3>
                      <p className="text-muted-foreground">
                        {isBn ? feature.descriptionBn : feature.descriptionEn}
                      </p>
                    </CardContent>
                  </Card>
                </FadeInLeft>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Process */}
        <FadeInUp>
          <div className="mb-20">
            <p className="mb-2 text-center text-sm font-medium text-primary bn">{isBn ? config.processSection.badgeBn : config.processSection.badgeEn}</p>
            <h2 className="text-heading-lg font-bold text-center mb-2">
              {isBn ? config.processSection.titleBn : config.processSection.titleEn}
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              {isBn ? config.processSection.subtitleBn : config.processSection.subtitleEn}
            </p>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block"></div>
              <div className="space-y-8">
                {process.map((step, index) => (
                  <FadeInRight key={step.id} delay={index * 0.1}>
                    <div className={`flex items-center gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className="flex-1">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary bn">
                                  {isBn ? step.stepBn : step.stepEn}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold mb-1">
                                  {isBn ? step.titleBn : step.titleEn}
                                </h3>
                                <p className="text-muted-foreground">
                                  {isBn ? step.descriptionBn : step.descriptionEn}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </FadeInRight>
                ))}
              </div>
            </div>
          </div>
        </FadeInUp>

        {/* Testimonials Trust Signal */}
        <FadeInUp>
          <div className="mb-16">
            <TestimonialsSection locale={locale} />
          </div>
        </FadeInUp>

        {/* CTA */}
        <FadeInUp>
          <Card className="bg-brand-gradient-soft gradient-border border-primary/20">
            <CardContent className="pt-6 text-center">
              <h2 className="text-heading-md font-bold mb-4">{isBn ? cta.titleBn : cta.titleEn}</h2>
              <p className="text-lg text-muted-foreground mb-6">
                {isBn ? cta.subtitleBn : cta.subtitleEn}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="gradient" asChild>
                  <Link href={`/${locale}/order#order-checkout`}>
                    {isBn ? cta.primaryLabelBn : cta.primaryLabelEn}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={`/${locale}/contact`}>
                    {isBn ? cta.secondaryLabelBn : cta.secondaryLabelEn}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>
    </div>
  );
}
