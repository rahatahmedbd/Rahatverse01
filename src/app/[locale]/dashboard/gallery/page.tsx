import { GalleryControlPanel } from "@/components/admin/GalleryControlPanel";

interface GalleryAdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GalleryAdminPage({ params }: GalleryAdminPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <GalleryControlPanel locale={locale} />
    </div>
  );
}
