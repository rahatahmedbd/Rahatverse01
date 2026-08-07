import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { logAudit, getClientIp } from "@/lib/admin/audit";

export const dynamic = "force-dynamic";

const STATUSES = new Set(["pending", "approved", "cancelled", "completed"]);

// GET /api/admin/bookings — list consultation bookings (admin-only).
export async function GET(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();
  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  let query = supabase.from("bookings").select("*").order("date", { ascending: true }).order("time_slot", { ascending: true });
  if (status && STATUSES.has(status)) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

// PATCH /api/admin/bookings — approve, cancel, complete, or update a booking.
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
    if (body.status !== undefined) {
      if (typeof body.status !== "string" || !STATUSES.has(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      update.status = body.status;
    }
    if (body.date !== undefined) update.date = body.date;
    if (body.time_slot !== undefined) update.time_slot = body.time_slot;
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }
    update.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from("bookings").update(update).eq("id", body.id).select().single();
    if (error) return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });

    await logAudit({
      action: "bookings.update",
      entity: "bookings",
      entityId: body.id,
      metadata: { fields: Object.keys(update).filter((k) => k !== "updated_at") },
      ip: getClientIp(request),
    });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
