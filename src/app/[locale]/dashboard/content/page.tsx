import { ContentControlPanel } from "@/components/admin/ContentControlPanel";

interface ContentAdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContentAdminPage({ params }: ContentAdminPageProps) {
  const { locale } = await params;
  return <ContentControlPanel locale={locale} />;
}
