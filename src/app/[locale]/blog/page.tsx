import BlogListSection from "@/components/blog/BlogListSection";
import { FadeInUp } from "@/components/animations/FadeIn";

// ── Blog Page ──────────────────────────────────────────
interface BlogPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeInUp>
          <div className="text-center mb-12">
            <h1 className="text-gradient text-display-lg mb-4 font-bold">
              {isBn ? "ব্লগ" : "Blog"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {isBn 
                ? "আমার চিন্তাভাবনা ও অভিজ্ঞতা শেয়ার করি" 
                : "Sharing my thoughts and experiences"}
            </p>
          </div>
        </FadeInUp>

        {/* Blog List */}
        <FadeInUp delay={0.2}>
          <BlogListSection locale={locale} />
        </FadeInUp>
      </div>
    </div>
  );
}
