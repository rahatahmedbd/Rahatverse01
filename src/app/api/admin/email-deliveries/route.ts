import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";

/** Admin-only paginated audit of transactional and campaign email delivery. */
export async function GET(request: Request) {
  const { supabase, isAdmin } = await getCurrentUserContext();
  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 30));
  const status = searchParams.get("status");
  let query = supabase.from("email_deliveries").select("*", { count: "exact" }).order("created_at", { ascending: false }).range((page - 1) * limit, page * limit - 1);
  if (status && ["sent", "delivered", "bounced", "complained", "failed"].includes(status)) query = query.eq("status", status);
  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: "Unable to load email deliveries" }, { status: 500 });
  return NextResponse.json({ data: data || [], pagination: { page, limit, total: count || 0 } });
}
