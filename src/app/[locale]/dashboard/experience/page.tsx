import { ExperienceControlPanel } from "@/components/admin/ExperienceControlPanel";

interface ExperienceAdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ExperienceAdminPage({ params }: ExperienceAdminPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <ExperienceControlPanel locale={locale} />
    </div>
  );
}
