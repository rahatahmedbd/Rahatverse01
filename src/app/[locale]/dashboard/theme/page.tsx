import { ThemeControlPanel } from "@/components/admin/ThemeControlPanel";

interface ThemeAdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ThemeAdminPage({ params }: ThemeAdminPageProps) {
  const { locale } = await params;
  return <ThemeControlPanel locale={locale} />;
}
