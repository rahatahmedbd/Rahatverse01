import { NewsletterDashboard } from "@/components/newsletter/admin/NewsletterDashboard";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewsletterAdminPage({ params }: PageProps) {
  const { locale } = await params;
  return <NewsletterDashboard locale={locale} />;
}
