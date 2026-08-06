import { NewsletterDashboard } from "@/components/newsletter/admin/NewsletterDashboard";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewsletterAdminPage({ params }: PageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <NewsletterDashboard locale={locale} />
    </div>
  );
}
