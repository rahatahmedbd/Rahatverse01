import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { logAudit } from "@/lib/admin/audit";
import { enumValue } from "@/lib/api/validation";

export const dynamic = "force-dynamic";

const ALLOWED_ROLES = ["admin", "client", "visitor"] as const;

// ── User Management + RBAC ─────────────────────────────
// Lists authenticated users (from the profiles mirror) and lets an admin
// change roles. Admin-only; an admin can never demote themselves to avoid
// locking the dashboard.

async function requireAdmin() {
  const ctx = await getCurrentUserContext();
  if (!ctx.supabase) return { error: NextResponse.json({ error: "Service unavailable" }, { status: 503 }) };
  if (!ctx.user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (!ctx.isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  return { ctx };
}

export async function GET(request: Request) {
  const { ctx, error } = await requireAdmin();
  if (error || !ctx?.supabase) return error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim().slice(0, 100) || "";
  const role = searchParams.get("role"); // all | admin | client | visitor

  let query = ctx.supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, phone, role, created_at, updated_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(200);

  if (search) query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
  if (role && role !== "all") query = query.eq("role", role);

  const { data, count, error: dbError } = await query;
  if (dbError) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [], total: count ?? 0 });
}

export async function PATCH(request: Request) {
  const { ctx, error } = await requireAdmin();
  if (error || !ctx?.supabase) return error;

  try {
    const body = await request.json();
    const userId = typeof body.id === "string" ? body.id : null;
    const role = enumValue(body.role, ALLOWED_ROLES);

    if (!userId) return NextResponse.json({ error: "User id is required" }, { status: 400 });
    if (!role) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

    // Prevent an admin from demoting themselves (locks the dashboard).
    if (userId === ctx.user!.id && role !== "admin") {
      return NextResponse.json({ error: "You cannot change your own role" }, { status: 400 });
    }

    const { data, error: dbError } = await ctx.supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId)
      .select("id, email, full_name, role")
      .maybeSingle();

    if (dbError) return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    if (!data) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await logAudit({
      action: "user.role_update",
      entity: "user",
      entityId: userId,
      metadata: { role, by: ctx.user!.email },
      ip: getClientIpSafe(request),
    });

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

function getClientIpSafe(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}
