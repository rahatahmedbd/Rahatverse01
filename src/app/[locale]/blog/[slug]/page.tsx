import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BlogPostContent from "@/components/blog/BlogPostContent";
import { FadeInUp } from "@/components/animations/FadeIn";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  const supabase = await createClient();
  const isBn = locale === "bn";

  if (!supabase) {
    notFound();
  }

  // Fetch the blog post by slug
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <FadeInUp>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {isBn ? "ব্লগে ফিরে যান" : "Back to Blog"}
          </Link>
        </FadeInUp>

        {/* Blog Post Content */}
        <BlogPostContent
          title={isBn && post.title_bn ? post.title_bn : post.title}
          content={isBn && post.content_bn ? post.content_bn : post.content}
          author={post.author}
          publishedAt={post.published_at}
          readingTime={post.reading_time}
          category={post.category}
          tags={post.tags}
          locale={locale}
        />
      </div>
    </div>
  );
}
