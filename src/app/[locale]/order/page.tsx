import { Suspense } from "react";
import { PricingSection } from "@/components/sections/PricingSection";
import { OrderWizard } from "@/components/sections/OrderWizard";

// ── Order Page ─────────────────────────────────────────
interface OrderPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Pricing Packages */}
      <PricingSection locale={locale} />

      {/* Order Wizard */}
      <Suspense>
        <OrderWizard locale={locale} />
      </Suspense>
    </div>
  );
}
