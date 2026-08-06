import { BlogListSection } from "@/components/sections/BlogListSection";

// ── Blog Page ──────────────────────────────────────────
interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <BlogListSection locale={locale} />
    </div>
  );
}
