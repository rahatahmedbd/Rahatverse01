import { BlogManager } from "@/components/admin/BlogManager";

interface BlogAdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogAdminPage({ params }: BlogAdminPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <BlogManager locale={locale} />
    </div>
  );
}
