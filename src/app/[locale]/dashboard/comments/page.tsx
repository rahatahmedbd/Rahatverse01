import { CommentModeration } from "@/components/admin/CommentModeration";

interface CommentsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CommentsPage({ params }: CommentsPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <CommentModeration locale={locale} />
    </div>
  );
}
