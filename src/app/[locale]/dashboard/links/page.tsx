import { LinksControlPanel } from "@/components/admin/LinksControlPanel";

interface LinksAdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LinksAdminPage({ params }: LinksAdminPageProps) {
  const { locale } = await params;
  return <LinksControlPanel locale={locale} />;
}
