import { ContactControlPanel } from "@/components/admin/ContactControlPanel";

interface ContactSettingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactSettingsPage({ params }: ContactSettingsPageProps) {
  const { locale } = await params;
  return <ContactControlPanel locale={locale} />;
}
