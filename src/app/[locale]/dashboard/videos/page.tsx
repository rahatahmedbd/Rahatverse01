import { VideoControlPanel } from "@/components/admin/VideoControlPanel";

interface VideosAdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function VideosAdminPage({ params }: VideosAdminPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <VideoControlPanel locale={locale} />
    </div>
  );
}
