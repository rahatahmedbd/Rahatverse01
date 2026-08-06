import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  if (!supabase) {
    return NextResponse.json({ results: [] });
  }
  
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ results: [] });
  }

  try {
    // Search blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from("blog_posts")
      .select("id, title, title_bn, slug, excerpt, excerpt_bn, category, is_published, published_at")
      .eq("is_published", true)
      .or(`title.ilike.%${query}%,title_bn.ilike.%${query}%,excerpt.ilike.%${query}%,excerpt_bn.ilike.%${query}%`)
      .order("published_at", { ascending: false })
      .limit(10);

    if (blogError) {
      console.error("Blog search error:", blogError);
    }

    // Format results
    const results = (blogPosts || []).map((post) => ({
      id: post.id,
      type: "blog" as const,
      title: post.title,
      titleBn: post.title_bn,
      excerpt: post.excerpt,
      excerptBn: post.excerpt_bn,
      slug: post.slug,
      category: post.category,
      url: `/blog/${post.slug}`,
      publishedAt: post.published_at,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed", results: [] },
      { status: 500 }
    );
  }
}
