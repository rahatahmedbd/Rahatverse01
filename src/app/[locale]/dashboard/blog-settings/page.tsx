import { BlogControlPanel } from "@/components/admin/BlogControlPanel";

interface BlogSettingsAdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogSettingsAdminPage({ params }: BlogSettingsAdminPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <BlogControlPanel locale={locale} />
    </div>
  );
}
