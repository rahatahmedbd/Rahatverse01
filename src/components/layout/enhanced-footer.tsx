"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { GlowEffect } from "@/components/animations/GlowEffect";

// ── Social Media Icons ─────────────────────────────────
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function EnhancedFooter() {
  const t = useTranslations("footer");

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/about", label: t("about") },
    { href: "/achievements", label: t("achievements") },
    { href: "/services", label: t("services") },
    { href: "/projects", label: t("projects") },
    { href: "/contact", label: t("contact") },
  ];

  const serviceLinks = [
    { href: "/order", label: t("orderWebsite") },
    { href: "/pricing", label: t("pricing") },
    { href: "/process", label: t("process") },
  ];

  return (
    <footer className="relative mt-20 border-t border-border/50 bg-gradient-to-b from-transparent to-background/50">
      {/* Glow Effect */}
      <GlowEffect color="amber" size="lg" className="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                RahatVerse
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t("tagline")}
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/rahatahmedbd"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border/50 p-2 transition-all hover:border-primary hover:text-primary hover:shadow-glow"
                aria-label="GitHub"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/rahatahmedbd"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border/50 p-2 transition-all hover:border-primary hover:text-primary hover:shadow-glow"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/rahatahmedbd"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border/50 p-2 transition-all hover:border-primary hover:text-primary hover:shadow-glow"
                aria-label="Twitter"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">{t("quickLinks")}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">{t("services")}</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">{t("contact")}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:rahat@example.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4" />
                  <span>rahat@example.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801234567890"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4" />
                  <span>+880 1234 567890</span>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Dhaka, Bangladesh</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border/50 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {currentYear} RahatVerse. {t("rights")}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              {t("madeWith")} <Heart className="h-4 w-4 fill-red-500 text-red-500" /> {t("by")} Rahat Ahmed
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
