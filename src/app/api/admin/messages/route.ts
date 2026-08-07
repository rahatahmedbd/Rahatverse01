import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { logAudit, getClientIp } from "@/lib/admin/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/messages — list contact form submissions (admin-only).
export async function GET(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();
  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const unread = searchParams.get("unread"); // true/false
  let query = supabase.from("messages").select("*").order("created_at", { ascending: false });
  if (unread === "true") query = query.eq("is_read", false);
  else if (unread === "false") query = query.eq("is_read", true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

// PATCH /api/admin/messages — mark read / archive / restore.
export async function PATCH(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();
  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    if (typeof body.id !== "string" || !body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const update: Record<string, unknown> = {};
    if (typeof body.is_read === "boolean") update.is_read = body.is_read;
    if (typeof body.archived === "boolean") update.archived = body.archived;
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const { data, error } = await supabase.from("messages").update(update).eq("id", body.id).select().single();
    if (error) return NextResponse.json({ error: "Failed to update message" }, { status: 500 });

    await logAudit({
      action: "messages.update",
      entity: "messages",
      entityId: body.id,
      metadata: { fields: Object.keys(update) },
      ip: getClientIp(request),
    });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
