import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { logAudit } from "@/lib/admin/audit";
import { enumValue, optionalText } from "@/lib/api/validation";

export const dynamic = "force-dynamic";

// ── Database Backup Status ─────────────────────────────
// Records and lists backup events. Supabase-managed snapshots are taken in
// the Supabase dashboard; this endpoint keeps the audit trail and powers the
// "Database backup status" widget on the dashboard. Admin-only.

const scopes = ["full", "schema", "partial"] as const;
const statuses = ["completed", "failed", "in_progress"] as const;

export async function GET() {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("system_backups")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return NextResponse.json({ error: "Failed to fetch backups" }, { status: 500 });

  const latest = data?.[0] ?? null;
  return NextResponse.json({ data: data ?? [], latest });
}

export async function POST(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const scope = enumValue(body.scope, scopes) ?? "full";
    const status = enumValue(body.status, statuses) ?? "completed";
    const note = optionalText(body.note, 500);

    const { data, error } = await supabase
      .from("system_backups")
      .insert({ scope, status, note, created_by: user.id })
      .select()
      .single();

    if (error) return NextResponse.json({ error: "Failed to record backup" }, { status: 500 });

    await logAudit({
      action: `backup.${status}`,
      entity: "backup",
      entityId: data.id,
      metadata: { scope, note: note ?? null, by: user.email },
      ip: getClientIpSafe(request),
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

function getClientIpSafe(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}
