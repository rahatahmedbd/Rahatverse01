import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { logAudit } from "@/lib/admin/audit";

export const dynamic = "force-dynamic";

// ── Comment Moderation ─────────────────────────────────
// Lists all blog comments (pending + approved), and lets an admin approve,
// reject (soft-delete via delete) or delete. Admin-only.

export async function GET(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // all | pending | approved
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 30));

  let query = supabase
    .from("blog_comments")
    .select("id, post_id, author_name, author_email, content, is_approved, created_at, blog_posts(title, slug)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, (page - 1) * limit + limit - 1);

  if (status === "pending") query = query.eq("is_approved", false);
  else if (status === "approved") query = query.eq("is_approved", true);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });

  return NextResponse.json({ data: data ?? [], pagination: { page, limit, total: count ?? 0 } });
}

// PATCH — approve / reject a comment. `approved: true` → publish; `approved: false` → hide.
export async function PATCH(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : null;
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    if (typeof body.approved !== "boolean") {
      return NextResponse.json({ error: "approved must be a boolean" }, { status: 400 });
    }

    const { data, error: dbError } = await supabase
      .from("blog_comments")
      .update({ is_approved: body.approved })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (dbError) return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Comment not found" }, { status: 404 });

    await logAudit({
      action: body.approved ? "comments.approve" : "comments.reject",
      entity: "comment",
      entityId: id,
      metadata: { by: user.email },
      ip: getClientIpSafe(request),
    });

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE — remove a comment permanently.
export async function DELETE(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("blog_comments").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });

  await logAudit({
    action: "comments.delete",
    entity: "comment",
    entityId: id,
    metadata: { by: user.email },
    ip: getClientIpSafe(request),
  });

  return NextResponse.json({ success: true });
}

function getClientIpSafe(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}
