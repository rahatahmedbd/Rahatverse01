// ── API: Blog Posts ────────────────────────────────────
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET — List published blog posts with optional filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ posts: [], data: [] });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category")?.trim().slice(0, 40) || null;
    const search = searchParams.get("search")?.trim().slice(0, 100) || null;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 0, 1), 50) : null;

    let query = supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (search) {
      const sanitized = search.replace(/[%_]/g, " ").replace(/[(),]/g, " ").trim();
      if (sanitized) {
        query = query.or(
          `title.ilike.%${sanitized}%,title_bn.ilike.%${sanitized}%,excerpt.ilike.%${sanitized}%,excerpt_bn.ilike.%${sanitized}%,slug.ilike.%${sanitized}%`
        );
      }
    }

    if (limit) {
      query = query.limit(limit);
    } else {
      query = query.limit(50);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ posts: [], data: [] });
    }

    const posts = data || [];
    // Return both shapes for backward compat: {posts} for new client, {data} for legacy
    return NextResponse.json({ posts, data: posts });
  } catch {
    return NextResponse.json({ posts: [], data: [] });
  }
}
