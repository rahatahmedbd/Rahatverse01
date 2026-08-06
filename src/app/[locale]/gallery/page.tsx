import { GallerySection } from "@/components/sections/GallerySection";
import { VideoPortfolio } from "@/components/sections/VideoPortfolio";

// ── Gallery Page ───────────────────────────────────────
interface GalleryPageProps {
  params: Promise<{ locale: string }>;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <GallerySection locale={locale} />
      <VideoPortfolio locale={locale} />
    </div>
  );
}
