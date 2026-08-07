import { AboutControlPanel } from "@/components/admin/AboutControlPanel";

interface AboutAdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutAdminPage({ params }: AboutAdminPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <AboutControlPanel locale={locale} />
    </div>
  );
}
