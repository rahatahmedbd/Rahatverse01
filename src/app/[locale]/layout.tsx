import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { EnhancedFooter } from "@/components/layout/enhanced-footer";
import { BottomNavBar } from "@/components/layout/bottom-nav";
import { AnimationProviders } from "@/components/animations/Providers";
import { ScientificBackdrop } from "@/components/animations/ScientificBackdrop";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { PageTransition } from "@/components/animations/PageTransition";
import { WebVitalsReporter } from "@/components/seo/web-vitals-reporter";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { ErrorReporter } from "@/components/analytics/ErrorReporter";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getGlobalConfig } from "@/lib/global/server";
import { getAnalyticsConfig } from "@/lib/analytics/configServer";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { MaintenanceScreen } from "@/components/layout/MaintenanceScreen";
import { AIChatWidgetLoader } from "@/components/ai/AIChatWidgetLoader";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";
import { brandLogoCircleUrl, brandLogoSquareUrl } from "@/lib/brand";

// ── Locale-based Layout ────────────────────────────────
// Wraps app with next-intl provider for translations

// All site_settings reads are served from the shared 60s cache
// (src/lib/site-settings.ts), but maintenance mode / admin bypass is
// user-specific, so pages stay request-time rendered — now with zero
// database latency in the navigation hot path.
export const dynamic = "force-dynamic";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  return {
    title: {
      default: isBn
        ? "রাহাত আহমেদ — ওয়েব ডেভেলপার, শিক্ষার্থী ও শিক্ষক"
        : "Rahat Ahmed — Web Developer, Student & Teacher",
      template: "%s | RahatVerse",
    },
    description: isBn
      ? "রাহাত আহমেদ — শিক্ষার্থী, শিক্ষক, রক্তদাতা, BNCC ক্যাডেট ও ওয়েব ডেভেলপার। শিক্ষা, সমাজসেবা ও প্রযুক্তির মাধ্যমে মানুষের পাশে দাঁড়ানোর লক্ষ্যে আধুনিক ডিজিটাল অভিজ্ঞতা তৈরি করি।"
      : "Rahat Ahmed is a student, teacher and web developer building modern digital experiences with AI and technology.",
    alternates: localeAlternates(locale, ""),
    openGraph: {
      locale: isBn ? "bn_BD" : "en_US",
      alternateLocale: isBn ? "en_US" : "bn_BD",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Ensure locale is valid
  if (!routing.locales.includes(locale as "bn" | "en")) {
    notFound();
  }

  // Set locale for next-intl
  setRequestLocale(locale);

  // Enforce maintenance mode (admin users may bypass when allowAdmins is on).
  const [globalConfig, analyticsConfig] = await Promise.all([
    getGlobalConfig(),
    getAnalyticsConfig(),
  ]);
  let maintenanceBlocked = false;
  if (globalConfig.maintenance.enabled) {
    if (globalConfig.maintenance.allowAdmins) {
      const { isAdmin } = await getCurrentUserContext();
      maintenanceBlocked = !isAdmin;
    } else {
      maintenanceBlocked = true;
    }
  }
  if (maintenanceBlocked) {
    return (
      <html lang={locale} suppressHydrationWarning>
        <body className="antialiased">
          <MaintenanceScreen
            locale={locale}
            messageBn={globalConfig.maintenance.messageBn}
            messageEn={globalConfig.maintenance.messageEn}
          />
        </body>
      </html>
    );
  }

  // Get messages for this locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Hind+Siliguri:wght@400;600;700&family=JetBrains+Mono:wght@400&display=swap"
          media="print"
          // @ts-expect-error onLoad switch for non-blocking CSS
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Hind+Siliguri:wght@400;600;700&family=JetBrains+Mono:wght@400&display=swap"
          />
        </noscript>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href={brandLogoCircleUrl(512)} type="image/png" />
        <link rel="apple-touch-icon" href={brandLogoSquareUrl(180)} />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RahatVerse" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <WebVitalsReporter />
        <AnalyticsProvider initialTelemetryEnabled={analyticsConfig.settings.telemetryEnabled} />
        <ErrorReporter />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MotionProvider>
            <div className="site-gradient-canvas flex min-h-screen flex-col">
              {/* Ambient science background — faint motifs behind all content */}
              <ScientificBackdrop />

              {/* Global Animation Effects */}
              <AnimationProviders />

              {/* Admin-controlled announcement banner */}
              <AnnouncementBanner
                locale={locale}
                announcement={globalConfig.announcement}
                header={globalConfig.header}
              />

              {/* Glass Navigation Bar */}
              <Navbar />

              {/* Main Content — id for skip link, extra bottom padding ensures floating nav never covers last section */}
              <main
                id="main-content"
                tabIndex={-1}
                className="relative flex-1 pt-24 pb-28 lg:pb-8 focus:outline-none"
                aria-label={locale === "bn" ? "মূল বিষয়বস্তু" : "Main content"}
              >
                <PageTransition>{children}</PageTransition>
              </main>

              {/* Enhanced Footer */}
              <EnhancedFooter locale={locale} />

              {/* Mobile Bottom Navigation */}
              <BottomNavBar />

              {/* Nuva — AI chat assistant (bottom nav on mobile, floating bubble on desktop) */}
              <AIChatWidgetLoader />
            </div>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
