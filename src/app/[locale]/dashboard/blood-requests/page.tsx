import { BloodRequestsManager } from "@/components/admin/BloodRequestsManager";

interface BloodRequestsAdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BloodRequestsAdminPage({ params }: BloodRequestsAdminPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <BloodRequestsManager locale={locale} />
    </div>
  );
}
