import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { logAudit } from "@/lib/admin/audit";
import { enumValue, optionalText, requiredText } from "@/lib/api/validation";

export const dynamic = "force-dynamic";

// ── Notification Center ────────────────────────────────
// Create, list, mark-as-read and delete in-app admin notifications.
// Admin-only.

const types = ["info", "success", "warning", "error"] as const;

export async function GET() {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [listResult, unreadResult] = await Promise.all([
    supabase.from("admin_notifications").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("admin_notifications").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);

  if (listResult.error) return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });

  return NextResponse.json({
    data: listResult.data ?? [],
    unread: unreadResult.count ?? 0,
  });
}

export async function POST(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const title = requiredText(body.title, 200);
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const { data, error } = await supabase
      .from("admin_notifications")
      .insert({
        title,
        title_bn: optionalText(body.title_bn, 200),
        message: optionalText(body.message, 2000),
        message_bn: optionalText(body.message_bn, 2000),
        type: enumValue(body.type, types) ?? "info",
        link: optionalText(body.link, 500),
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });

    await logAudit({
      action: "notifications.create",
      entity: "notification",
      entityId: data.id,
      metadata: { title, by: user.email },
      ip: getClientIpSafe(request),
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : null;
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const patch: Record<string, unknown> = {};
    if (typeof body.is_read === "boolean") patch.is_read = body.is_read;

    const { data, error } = await supabase.from("admin_notifications").update(patch).eq("id", id).select().maybeSingle();
    if (error) return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
    if (!data) return NextResponse.json({ error: "Notification not found" }, { status: 404 });

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("admin_notifications").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 });

  await logAudit({
    action: "notifications.delete",
    entity: "notification",
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
