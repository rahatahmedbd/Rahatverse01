import { LegalContent } from "@/components/sections/LegalContent";

interface RefundPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RefundPage({ params }: RefundPageProps) {
  const { locale } = await params;
  return <LegalContent locale={locale} pageKey="refund" />;
}
