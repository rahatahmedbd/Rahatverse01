import { ContactSection } from "@/components/sections/ContactSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { AuroraDivider } from "@/components/ui/aurora-divider";

// ── Contact Page ───────────────────────────────────────
interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <ContactSection locale={locale} />
      <AuroraDivider />
      <TestimonialsSection locale={locale} />
      <AuroraDivider />
      <FAQSection locale={locale} />
    </div>
  );
}
