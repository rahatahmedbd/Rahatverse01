import { HeroControlPanel } from "@/components/admin/HeroControlPanel";

interface HeroPageProps {
  params: Promise<{ locale: string }>;
}

export default async function HeroAdminPage({ params }: HeroPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <HeroControlPanel locale={locale} />
    </div>
  );
}
