import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requiredText, validEmail } from "@/lib/api/validation";

export const dynamic = "force-dynamic";

// ── Public Blog Comments ───────────────────────────────
// POST — submit a comment (goes to pending moderation).
// GET  — list approved comments for a post.
// Anonymous visitors may comment; rate limiting is light (per-IP, in-memory).

const MAX_COMMENT_LENGTH = 2000;
const lastPostByIp = new Map<string, number>();
const RATE_LIMIT_MS = 30_000; // 1 comment per 30s per IP

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const last = lastPostByIp.get(ip);
    if (last && Date.now() - last < RATE_LIMIT_MS) {
      return NextResponse.json({ error: "Please wait a moment before commenting again." }, { status: 429 });
    }

    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

    const body = await request.json();
    const postId = typeof body.post_id === "string" ? body.post_id : null;
    const authorName = requiredText(body.author_name, 100);
    const authorEmail = validEmail(body.author_email);
    const content = requiredText(body.content, MAX_COMMENT_LENGTH);

    if (!postId || !authorName || !authorEmail || !content) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Ensure the post exists and is published.
    const { data: post } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("id", postId)
      .eq("is_published", true)
      .maybeSingle();
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const { error } = await supabase.from("blog_comments").insert({
      post_id: postId,
      author_name: authorName,
      author_email: authorEmail,
      content,
      is_approved: false,
    });

    if (error) {
      console.error("Comment insert failed", error);
      return NextResponse.json({ error: "Unable to submit comment" }, { status: 500 });
    }

    lastPostByIp.set(ip, Date.now());
    return NextResponse.json({ success: true, message: "Comment submitted for approval" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ data: [] });

  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("post_id");

  if (!postId) return NextResponse.json({ data: [] });

  const { data, error } = await supabase
    .from("blog_comments")
    .select("id, author_name, content, created_at")
    .eq("post_id", postId)
    .eq("is_approved", true)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) return NextResponse.json({ data: [] });
  return NextResponse.json({ data: data ?? [] });
}
