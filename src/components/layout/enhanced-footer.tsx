"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { GlowEffect } from "@/components/animations/GlowEffect";

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
    <footer className="relative mt-20 border-t border-border/50 bg-gradient-to-b from-transparent to-background/50">
      <GlowEffect color="amber" size="lg" className="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href={`/${locale}`} className="inline-block">
              <h3 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-2xl font-bold text-transparent">
                RahatVerse
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 text-sm font-bold transition-all hover:border-primary hover:text-primary hover:shadow-glow"
                  aria-label={link.label}
                  title={link.label}
                >
                  <span aria-hidden="true">{link.symbol}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">{t("quickLinks")}</h4>
            <ul className="space-y-2">
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
            <h4 className="mb-4 font-semibold text-foreground">{t("services")}</h4>
            <ul className="space-y-2">
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
            <h4 className="mb-4 font-semibold text-foreground">{t("contact")}</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:rahatbd20505@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                  <Mail className="h-4 w-4" />
                  <span>rahatbd20505@gmail.com</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/8801626224878" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
                  <Phone className="h-4 w-4" />
                  <span>+880 1626-224878</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>সুনামগঞ্জ, বাংলাদেশ</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/50 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">© {currentYear} RahatVerse. {t("rights")}</p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              {t("madeWith")} <Heart className="h-4 w-4 fill-red-500 text-red-500" /> {t("by")} Rahat Ahmed
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
