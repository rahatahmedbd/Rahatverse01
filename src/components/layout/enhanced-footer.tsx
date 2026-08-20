import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Heart, Mail, MapPin } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";
import { FooterWhatsAppLink } from "./footer-whatsapp-link";
import { GlowEffect } from "@/components/animations/GlowEffect";
import { NewsletterSignup } from "@/components/newsletter/NewsletterSignup";
import { LighthouseScoreBadge } from "@/components/seo/LighthouseScoreBadge";
import { getGlobalConfig } from "@/lib/global/server";
import { getNewsletterConfig } from "@/lib/newsletter/server";
import { RahatPortrait } from "@/components/sections/RahatPortrait";

// Brand icons rendered as inline SVG paths (lucide has no brand set).
function GithubMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
function FiverrMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.15 9.07h-.96v-.15c0-1.05-.85-1.9-1.9-1.9h-.15V5.05c1.5-.25 2.6-.9 2.6-1.95h-4.05c-.15 0-.25.1-.25.25v3.65h-6.1v-.15c0-1.05-.85-1.9-1.9-1.9h-.15V5.05c1.5-.25 2.6-.9 2.6-1.95H5.2v5.97h-.96c-.3 0-.55.25-.55.55v1.53c0 .3.25.55.55.55h.96v1.34c0 3.53 2.13 5.36 5.42 5.36.9 0 1.63-.1 2.25-.3v-2.9c-.4.15-.86.23-1.38.23-1.5 0-2.5-.83-2.5-2.4v-1.34h3.9v.15c0 1.05.85 1.9 1.9 1.9h.15v.44c0 1.57-.86 2.4-2.35 2.4-.55 0-1.04-.08-1.45-.24v2.9c.65.2 1.43.3 2.35.3 3.3 0 5.4-1.83 5.4-5.36v-1.34h.96c.3 0 .55-.25.55-.55V9.62c0-.3-.25-.55-.55-.55z" />
    </svg>
  );
}
function UpworkMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.4 6.6c-2.7 0-4.1 1.9-4.9 3.9-.4-.9-.8-2.1-1.1-3l-3.2-.014v6.114c-.6 1.1-1.4 1.8-2.4 1.8-1.4 0-2.1-1-2.1-2.9V7.5H1.6v5c0 3.4 1.7 5.6 4.6 5.6 2 0 3.4-1.1 4.4-2.6.4 1.4 1.5 2.6 3.3 2.6 2.6 0 4.5-2.9 5.4-6.5h-1.9c-.5 1.9-1.4 3.2-2.4 3.2-.9 0-1.3-.6-1.3-2V6.6h-.7z" />
    </svg>
  );
}

interface FooterSocialLink {
  href: string;
  label: string;
  symbol?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const socialLinks: FooterSocialLink[] = [
  { href: SOCIAL_LINKS.facebook, label: "Facebook", symbol: "f" },
  { href: SOCIAL_LINKS.youtube, label: "YouTube", symbol: "▶" },
  { href: SOCIAL_LINKS.instagram, label: "Instagram", symbol: "◎" },
  { href: SOCIAL_LINKS.tiktok, label: "TikTok", symbol: "♪" },
  { href: SOCIAL_LINKS.github, label: "GitHub", icon: GithubMark },
  { href: SOCIAL_LINKS.fiverr, label: "Fiverr", icon: FiverrMark },
  { href: SOCIAL_LINKS.upwork, label: "Upwork", icon: UpworkMark },
];

interface EnhancedFooterProps {
  locale?: string;
}

export async function EnhancedFooter({ locale }: EnhancedFooterProps) {
  const currentLocale = locale ?? (await getLocale());
  const t = await getTranslations({ locale: currentLocale, namespace: "footer" });
  const currentYear = new Date().getFullYear();
  const isBn = currentLocale === "bn";
  const [globalConfig, newsletterConfig] = await Promise.all([
    getGlobalConfig(),
    getNewsletterConfig(),
  ]);
  const footer = globalConfig.footer;
  const copyrightText = (isBn ? footer.copyrightBn : footer.copyrightEn).replace("{year}", String(currentYear));
  const madeWithText = isBn ? footer.madeWithBn : footer.madeWithEn;

  const quickLinks = [
    { href: `/${currentLocale}/about`, label: t("about") },
    { href: `/${currentLocale}/portfolio`, label: isBn ? "পোর্টফোলিও" : "Portfolio" },
    { href: `/${currentLocale}/services`, label: t("services") },
    { href: `/${currentLocale}/experience`, label: isBn ? "অভিজ্ঞতা" : "Experience" },
    { href: `/${currentLocale}/achievements`, label: t("achievements") },
    { href: `/${currentLocale}/gallery`, label: t("gallery") },
    { href: `/${currentLocale}/blog`, label: isBn ? "ব্লগ" : "Blog" },
    { href: `/${currentLocale}/contact`, label: t("contact") },
    { href: `/${currentLocale}/links`, label: isBn ? "সংযুক্ত হোন" : "Links" },
  ];

  const serviceLinks = [
    { href: `/${currentLocale}/order#order-checkout`, label: t("orderWebsite") },
    { href: `/${currentLocale}/services`, label: t("services") },
    { href: `/${currentLocale}/privacy-policy`, label: isBn ? "প্রাইভেসি পলিসি" : "Privacy Policy" },
    { href: `/${currentLocale}/terms-of-service`, label: isBn ? "সেবা শর্তাবলি" : "Terms of Service" },
    { href: `/${currentLocale}/contact`, label: t("contact") },
  ];

  return (
    <footer className="relative mt-12 border-t border-border/50 bg-gradient-to-b from-transparent to-card/30 pb-20 sm:pb-0 lg:mt-16">
      <GlowEffect color="amber" size="lg" className="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3 sm:space-y-4 lg:col-span-1">
            <Link href={`/${currentLocale}`} className="inline-flex items-center gap-2.5">
              <RahatPortrait
                locale={currentLocale}
                className="h-10 w-10 shrink-0 ring-2 ring-primary/30 shadow-md shadow-primary/20"
                sizes="40px"
              />
              <h3 className="text-gradient text-xl font-bold sm:text-2xl">
                RahatVerse
              </h3>
            </Link>
            <p className="max-w-[32ch] text-sm leading-relaxed text-muted-foreground">{t("tagline")}</p>
            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-card/50 text-xs font-bold transition-all hover:border-primary hover:text-primary hover:shadow-sm sm:h-9 sm:w-9 sm:text-sm"
                    aria-label={link.label}
                    title={link.label}
                  >
                    {Icon ? (
                      <Icon className="h-4 w-4" />
                    ) : (
                      <span aria-hidden="true">{link.symbol}</span>
                    )}
                  </a>
                );
              })}
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
            <h4 className="mb-3 text-sm font-semibold text-foreground sm:mb-4">{t("company")}</h4>
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
                <FooterWhatsAppLink href={footer.businessWhatsapp} phone={footer.businessPhone} locale={currentLocale} />
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
            <NewsletterSignup locale={currentLocale} variant="footer" source="footer" initialConfig={newsletterConfig} />
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
