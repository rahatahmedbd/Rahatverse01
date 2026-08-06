import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BottomNavBar } from "@/components/layout/bottom-nav";
import { AnimationProviders } from "@/components/animations/Providers";

// ── Locale-based Layout ────────────────────────────────
// Phase 09 will add i18n provider here

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <div lang={locale} className="flex min-h-screen flex-col">
      {/* Global Animation Effects (rendered alongside, not wrapping) */}
      <AnimationProviders />

      {/* Glass Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative flex-1 pt-24 pb-24 lg:pb-8">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
}
