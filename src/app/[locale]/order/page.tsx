import { Suspense } from "react";
import { PricingSection } from "@/components/sections/PricingSection";
import { OrderWizard } from "@/components/sections/OrderWizard";
import { AuroraDivider } from "@/components/ui/aurora-divider";
import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";

// ── Order Page ─────────────────────────────────────────
interface OrderPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: localeAlternates(locale, "/order"),
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Pricing Packages */}
      <PricingSection locale={locale} />

      <AuroraDivider />

      {/* Order Wizard */}
      <Suspense>
        <OrderWizard locale={locale} />
      </Suspense>
    </div>
  );
}
