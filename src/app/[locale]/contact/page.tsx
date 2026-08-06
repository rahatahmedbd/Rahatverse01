import { ContactSection } from "@/components/sections/ContactSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";

// ── Contact Page ───────────────────────────────────────
interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <ContactSection locale={locale} />
      <TestimonialsSection locale={locale} />
      <FAQSection locale={locale} />
    </div>
  );
}
