import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";

export const dynamic = "force-dynamic";

// ── Audit Log Viewer ───────────────────────────────────
// Paginated, filterable view of admin actions. Admin-only.

export async function GET(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 30));
  const action = searchParams.get("action")?.trim().slice(0, 120) || "";
  const entity = searchParams.get("entity")?.trim().slice(0, 50) || "";
  const actor = searchParams.get("actor")?.trim().slice(0, 254) || "";

  const offset = (page - 1) * limit;

  let query = supabase
    .from("audit_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (action) query = query.ilike("action", `%${action}%`);
  if (entity) query = query.eq("entity", entity);
  if (actor) query = query.or(`actor_email.ilike.%${actor}%,actor_id.eq.${actor}`);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });

  return NextResponse.json({
    data: data ?? [],
    pagination: { page, limit, total: count ?? 0 },
  });
}
