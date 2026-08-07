import { NewsletterControlPanel } from "@/components/admin/NewsletterControlPanel";

interface NewsletterSettingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewsletterSettingsPage({ params }: NewsletterSettingsPageProps) {
  const { locale } = await params;
  return <NewsletterControlPanel locale={locale} />;
}
