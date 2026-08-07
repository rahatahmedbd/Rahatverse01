import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { EnhancedFooter } from "@/components/layout/enhanced-footer";
import { BottomNavBar } from "@/components/layout/bottom-nav";
import { ThemeApplier } from "@/components/layout/theme-applier";
import { Toaster } from "@/components/ui/toast";
import { AnimationProviders } from "@/components/animations/Providers";
import { MotionProvider } from "@/components/animations/MotionProvider";
import { PageTransition } from "@/components/animations/PageTransition";
import { WebVitalsReporter } from "@/components/seo/web-vitals-reporter";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { ErrorReporter } from "@/components/analytics/ErrorReporter";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getGlobalConfig } from "@/lib/global/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { MaintenanceScreen } from "@/components/layout/MaintenanceScreen";

// ── Locale-based Layout ────────────────────────────────
// Wraps app with next-intl provider for translations

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
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
  const globalConfig = await getGlobalConfig();
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Hind+Siliguri:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RahatVerse" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased">
        <GoogleAnalytics />
        <WebVitalsReporter />
        <AnalyticsProvider />
        <ErrorReporter />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex min-h-screen flex-col">
            {/* Apply persisted theme + accent */}
            <ThemeApplier />

            {/* Global Animation Effects */}
            <AnimationProviders />

              {/* Glass Navigation Bar */}
              <Navbar />

              {/* Main Content */}
              <main className="relative flex-1 pt-24 pb-24 lg:pb-8">
                <PageTransition>{children}</PageTransition>
              </main>

              {/* Enhanced Footer */}
              <EnhancedFooter />

            {/* Mobile Bottom Navigation */}
            <BottomNavBar />
          </div>

          {/* Global Toasts (Phase G) */}
          <Toaster />
              {/* Mobile Bottom Navigation */}
              <BottomNavBar />
            </div>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
