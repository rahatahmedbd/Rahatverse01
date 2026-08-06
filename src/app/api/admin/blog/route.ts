import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { logAudit } from "@/lib/admin/audit";
import { enumValue, optionalText, requiredText, stringArray } from "@/lib/api/validation";

export const dynamic = "force-dynamic";

// ── Content Management System (CMS) ────────────────────
// Full CRUD for blog posts, including drafts and publish/unpublish.
// Admin-only.

const categories = ["General", "Technology", "Education", "Life", "Projects", "Other"] as const;

async function requireAdmin() {
  const ctx = await getCurrentUserContext();
  if (!ctx.supabase) return { error: NextResponse.json({ error: "Service unavailable" }, { status: 503 }) };
  if (!ctx.user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!ctx.isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { ctx };
}

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || `post-${Date.now()}`;
}

// GET — list all posts (published + drafts), with optional status filter.
export async function GET(request: Request) {
  const { ctx, error } = await requireAdmin();
  if (error || !ctx?.supabase) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // all | published | draft
  const search = searchParams.get("search")?.trim().slice(0, 100) || "";

  let query = ctx.supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(100);

  if (status === "published") query = query.eq("is_published", true);
  else if (status === "draft") query = query.eq("is_published", false);

  if (search) query = query.or(`title.ilike.%${search}%,title_bn.ilike.%${search}%,slug.ilike.%${search}%`);

  const { data, count, error: dbError } = await query;
  if (dbError) return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  return NextResponse.json({ data: data ?? [], total: count ?? 0 });
}

// POST — create a new blog post (draft by default).
export async function POST(request: Request) {
  const { ctx, error } = await requireAdmin();
  if (error || !ctx?.supabase) return error;

  try {
    const body = await request.json();
    const title = requiredText(body.title, 200);
    const content = requiredText(body.content, 200_000);
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const slug = requiredText(body.slug, 120) ?? slugify(title);
    const { data, error: dbError } = await ctx.supabase
      .from("blog_posts")
      .insert({
        title,
        title_bn: optionalText(body.title_bn, 200),
        slug,
        content,
        content_bn: optionalText(body.content_bn, 200_000),
        excerpt: optionalText(body.excerpt, 500),
        excerpt_bn: optionalText(body.excerpt_bn, 500),
        cover_image: optionalText(body.cover_image, 2000),
        category: enumValue(body.category, categories) ?? "General",
        tags: stringArray(body.tags, 12, 60) ?? [],
        author: optionalText(body.author, 100),
        reading_time: typeof body.reading_time === "number" && body.reading_time > 0 && body.reading_time <= 120
          ? Math.round(body.reading_time)
          : 5,
        is_published: body.is_published === true,
        published_at: body.is_published === true ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (dbError) {
      if (dbError.code === "23505") {
        return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
      }
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }

    await logAudit({
      action: "blog.create",
      entity: "blog",
      entityId: data.id,
      metadata: { title, by: ctx.user!.email },
      ip: getClientIpSafe(request),
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// PATCH — update a post, including publish/unpublish toggling.
export async function PATCH(request: Request) {
  const { ctx, error } = await requireAdmin();
  if (error || !ctx?.supabase) return error;

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : null;
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const patch: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const title = requiredText(body.title, 200);
      if (!title) return NextResponse.json({ error: "Invalid title" }, { status: 400 });
      patch.title = title;
    }
    if (body.content !== undefined) {
      const content = requiredText(body.content, 200_000);
      if (!content) return NextResponse.json({ error: "Invalid content" }, { status: 400 });
      patch.content = content;
    }
    if (body.title_bn !== undefined) patch.title_bn = optionalText(body.title_bn, 200);
    if (body.content_bn !== undefined) patch.content_bn = optionalText(body.content_bn, 200_000);
    if (body.excerpt !== undefined) patch.excerpt = optionalText(body.excerpt, 500);
    if (body.excerpt_bn !== undefined) patch.excerpt_bn = optionalText(body.excerpt_bn, 500);
    if (body.cover_image !== undefined) patch.cover_image = optionalText(body.cover_image, 2000);
    if (body.category !== undefined) {
      const category = enumValue(body.category, categories);
      if (!category) return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      patch.category = category;
    }
    if (body.tags !== undefined) {
      const tags = stringArray(body.tags, 12, 60);
      if (!tags) return NextResponse.json({ error: "Invalid tags" }, { status: 400 });
      patch.tags = tags;
    }
    if (body.author !== undefined) patch.author = optionalText(body.author, 100);
    if (body.slug !== undefined) {
      const slug = requiredText(body.slug, 120);
      if (!slug) return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
      patch.slug = slug;
    }

    // Publish toggle — sets published_at the first time.
    if (typeof body.is_published === "boolean") {
      patch.is_published = body.is_published;
      if (body.is_published) {
        patch.published_at = new Date().toISOString();
      }
    }

    const { data, error: dbError } = await ctx.supabase
      .from("blog_posts")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (dbError) {
      if (dbError.code === "23505") {
        return NextResponse.json({ error: "A post with this slug already exists" }, { status: 409 });
      }
      return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
    if (!data) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    await logAudit({
      action: "blog.update",
      entity: "blog",
      entityId: id,
      metadata: { title: data.title, is_published: data.is_published, by: ctx.user!.email },
      ip: getClientIpSafe(request),
    });

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE — remove a post (and its comments via cascade).
export async function DELETE(request: Request) {
  const { ctx, error } = await requireAdmin();
  if (error || !ctx?.supabase) return error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error: dbError } = await ctx.supabase.from("blog_posts").delete().eq("id", id);
  if (dbError) return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });

  await logAudit({
    action: "blog.delete",
    entity: "blog",
    entityId: id,
    metadata: { by: ctx.user!.email },
    ip: getClientIpSafe(request),
  });

  return NextResponse.json({ success: true });
}

function getClientIpSafe(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}
