"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { GlowEffect } from "@/components/animations/GlowEffect";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { LighthouseScoreBadge } from "@/components/seo/LighthouseScoreBadge";
import { useGlobalConfig } from "@/hooks/useGlobalConfig";

const socialLinks = [
  { href: "https://www.facebook.com/rahat.ahmed.948943", label: "Facebook", symbol: "f" },
  { href: "https://www.tiktok.com/@rahatvives", label: "TikTok", symbol: "♪" },
  { href: "https://www.youtube.com/@RahatAhmedOfficial0", label: "YouTube", symbol: "▶" },
  { href: "https://www.instagram.com/rahatahm6d/", label: "Instagram", symbol: "◎" },
];

export function EnhancedFooter() {
  const locale = useLocale();
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();
  const isBn = locale === "bn";
  const globalConfig = useGlobalConfig();
  const footer = globalConfig.footer;
  const copyrightText = (isBn ? footer.copyrightBn : footer.copyrightEn).replace("{year}", String(currentYear));
  const madeWithText = isBn ? footer.madeWithBn : footer.madeWithEn;

  const quickLinks = [
    { href: `/${locale}/about`, label: t("about") },
    { href: `/${locale}/achievements`, label: t("achievements") },
    { href: `/${locale}/experience`, label: t("services") },
    { href: `/${locale}/gallery`, label: t("gallery") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  const serviceLinks = [
    { href: `/${locale}/order`, label: t("orderWebsite") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  return (
    <footer className="relative mt-12 border-t border-border/50 bg-gradient-to-b from-transparent to-card/30 pb-20 sm:pb-0 lg:mt-16">
      <GlowEffect color="amber" size="lg" className="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3 sm:space-y-4 lg:col-span-1">
            <Link href={`/${locale}`} className="inline-block">
              <h3 className="text-gradient text-xl font-bold sm:text-2xl">
                RahatVerse
              </h3>
            </Link>
            <p className="max-w-[32ch] text-sm leading-relaxed text-muted-foreground">{t("tagline")}</p>
            <div className="flex gap-2.5">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-card/50 text-xs font-bold transition-all hover:border-primary hover:text-primary hover:shadow-sm sm:h-9 sm:w-9 sm:text-sm"
                  aria-label={link.label}
                  title={link.label}
                >
                  <span aria-hidden="true">{link.symbol}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground sm:mb-4">{t("quickLinks")}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground sm:mb-4">{t("services")}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground sm:mb-4">{t("contact")}</h4>
            <ul className="space-y-2.5">
              <li>
                <a href={`mailto:${footer.businessEmail}`} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{footer.businessEmail}</span>
                </a>
              </li>
              <li>
                <a href={footer.businessWhatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{footer.businessPhone}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="leading-tight">{isBn ? footer.locationBn : footer.locationEn}</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 lg:col-span-1">
            <NewsletterSignup locale={locale} variant="footer" source="footer" />
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-6 sm:mt-10">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:gap-4 md:flex-row md:text-left">
            <p className="text-xs text-muted-foreground sm:text-sm">{copyrightText}</p>
            <div className="flex items-center gap-3">
              <LighthouseScoreBadge compact locale={locale} />
            </div>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
              {madeWithText} <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" /> {t("by")} Rahat Ahmed
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
