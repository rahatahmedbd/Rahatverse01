import { TestimonialManager } from "@/components/admin/TestimonialManager";

interface TestimonialsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TestimonialsPage({ params }: TestimonialsPageProps) {
  const { locale } = await params;
  return <TestimonialManager locale={locale} />;
}
