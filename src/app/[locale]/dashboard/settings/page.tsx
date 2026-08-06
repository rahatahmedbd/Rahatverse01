import { SettingsPanel } from "@/components/admin/SettingsPanel";

interface SettingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <SettingsPanel locale={locale} />
    </div>
  );
}
