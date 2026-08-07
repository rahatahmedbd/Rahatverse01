import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { logAudit, getClientIp } from "@/lib/admin/audit";

export const dynamic = "force-dynamic";

// PATCH /api/admin/blood-requests — admin-only update to respond to / close a
// blood donation request. Also supports filtering the open-request list view.
export async function PATCH(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const input = body as Record<string, unknown>;
    if (typeof input.id !== "string" || !input.id) {
      return NextResponse.json({ error: "Request id is required" }, { status: 400 });
    }

    const update: Record<string, unknown> = {};
    const status = input.status;
    if (status !== undefined) {
      if (status !== "open" && status !== "responded" && status !== "closed") {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      update.status = status;
    }
    if (input.admin_notes !== undefined) {
      if (input.admin_notes !== null && typeof input.admin_notes !== "string") {
        return NextResponse.json({ error: "Invalid admin_notes" }, { status: 400 });
      }
      update.admin_notes = (input.admin_notes as string) || null;
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }
    update.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("blood_requests")
      .update(update)
      .eq("id", input.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
    }

    await logAudit({
      action: "blood_requests.update",
      entity: "blood_requests",
      entityId: input.id,
      metadata: { fields: Object.keys(update).filter((k) => k !== "updated_at") },
      ip: getClientIp(request),
    });

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
