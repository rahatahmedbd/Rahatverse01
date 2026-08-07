import { GlobalControlPanel } from "@/components/admin/GlobalControlPanel";

interface GlobalSettingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GlobalSettingsPage({ params }: GlobalSettingsPageProps) {
  const { locale } = await params;
  return <GlobalControlPanel locale={locale} />;
}
