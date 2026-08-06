import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";

export const dynamic = "force-dynamic";

// ── System Logs Viewer ─────────────────────────────────
// Lists application log entries (server actions + client error reports) with
// level filtering and pagination. Admin-only.

const ALLOWED_LEVELS = ["debug", "info", "warn", "error"] as const;

export async function GET(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 30));
  const level = searchParams.get("level"); // all | debug | info | warn | error
  const source = searchParams.get("source")?.trim().slice(0, 50) || "";

  let query = supabase
    .from("system_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, (page - 1) * limit + limit - 1);

  if (level && (ALLOWED_LEVELS as readonly string[]).includes(level)) query = query.eq("level", level);
  if (source) query = query.ilike("source", `%${source}%`);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });

  return NextResponse.json({ data: data ?? [], pagination: { page, limit, total: count ?? 0 } });
}
