import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";

// ── Analytics Export ───────────────────────────────────
// GET /api/analytics/export?dataset=page_views|events&range=7|30|90
// Streams a CSV download of raw analytics rows. Admin only.

export const dynamic = "force-dynamic";

const ALLOWED_RANGES = [7, 30, 90] as const;
const EXPORT_LIMIT = 20_000;

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(csvEscape).join(",")];
  for (const row of rows) {
    lines.push(row.map(csvEscape).join(","));
  }
  // BOM keeps UTF-8 (Bengali) text readable in Excel.
  return `\uFEFF${lines.join("\r\n")}`;
}

export async function GET(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const dataset = url.searchParams.get("dataset") ?? "page_views";
  const rangeParam = Number(url.searchParams.get("range") ?? 30);
  const days = (ALLOWED_RANGES as readonly number[]).includes(rangeParam)
    ? rangeParam
    : 30;

  const from = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000);
  from.setUTCHours(0, 0, 0, 0);
  const fromIso = from.toISOString();

  let csv: string;
  let filename: string;

  if (dataset === "events") {
    const { data, error } = await supabase
      .from("analytics_events")
      .select("id,created_at,session_id,event_name,event_category,event_label,path,value")
      .gte("created_at", fromIso)
      .order("created_at", { ascending: false })
      .limit(EXPORT_LIMIT);

    if (error) {
      console.error("Analytics events export failed", error);
      return NextResponse.json({ error: "Unable to export analytics" }, { status: 500 });
    }

    csv = toCsv(
      ["id", "created_at", "session_id", "event_name", "event_category", "event_label", "path", "value"],
      (data ?? []).map((row) => [
        row.id,
        row.created_at,
        row.session_id,
        row.event_name,
        row.event_category,
        row.event_label,
        row.path,
        row.value,
      ])
    );
    filename = `rahatverse-analytics-events-${days}d.csv`;
  } else {
    const { data, error } = await supabase
      .from("analytics_page_views")
      .select("id,created_at,session_id,path,referrer,referrer_source,country,device_type,screen_width")
      .gte("created_at", fromIso)
      .order("created_at", { ascending: false })
      .limit(EXPORT_LIMIT);

    if (error) {
      console.error("Analytics page views export failed", error);
      return NextResponse.json({ error: "Unable to export analytics" }, { status: 500 });
    }

    csv = toCsv(
      ["id", "created_at", "session_id", "path", "referrer", "referrer_source", "country", "device_type", "screen_width"],
      (data ?? []).map((row) => [
        row.id,
        row.created_at,
        row.session_id,
        row.path,
        row.referrer,
        row.referrer_source,
        row.country,
        row.device_type,
        row.screen_width,
      ])
    );
    filename = `rahatverse-analytics-page-views-${days}d.csv`;
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
