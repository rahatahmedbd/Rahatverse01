import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { logAudit, getClientIp } from "@/lib/admin/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/testimonials — list all testimonials incl. pending (admin-only).
export async function GET(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();
  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // pending | approved | all
  let query = supabase.from("testimonials").select("*").order("created_at", { ascending: false });
  if (status === "pending") query = query.eq("is_approved", false);
  else if (status === "approved") query = query.eq("is_approved", true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

// PATCH /api/admin/testimonials — approve, edit, or toggle featured status.
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
    if (typeof body.is_approved === "boolean") update.is_approved = body.is_approved;
    if (typeof body.featured === "boolean") update.featured = body.featured;
    for (const key of ["name", "role", "company", "content", "logo"]) {
      if (body[key] !== undefined) {
        if (typeof body[key] !== "string" || body[key].length > 2000) {
          return NextResponse.json({ error: `Invalid ${key}` }, { status: 400 });
        }
        update[key] = body[key];
      }
    }
    if (body.rating !== undefined) {
      const rating = Number(body.rating);
      if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
        return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
      }
      update.rating = rating;
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const { data, error } = await supabase.from("testimonials").update(update).eq("id", body.id).select().single();
    if (error) return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });

    await logAudit({
      action: "testimonials.update",
      entity: "testimonials",
      entityId: body.id,
      metadata: { fields: Object.keys(update) },
      ip: getClientIp(request),
    });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// DELETE /api/admin/testimonials?id=... — remove a testimonial.
export async function DELETE(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();
  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });

  await logAudit({ action: "testimonials.delete", entity: "testimonials", entityId: id, ip: getClientIp(request) });
  return NextResponse.json({ success: true });
}
