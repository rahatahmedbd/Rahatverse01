import { getCurrentUserContext } from "@/lib/supabase/guards";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { supabase, isAdmin } = await getCurrentUserContext();
  if (!isAdmin || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // all | confirmed | pending | unsubscribed
  const format = searchParams.get("format") || "csv";

  let query = supabase.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false });

  if (status === "confirmed") query = query.eq("is_confirmed", true).eq("is_active", true);
  else if (status === "pending") query = query.eq("is_confirmed", false);
  else if (status === "unsubscribed") query = query.eq("is_active", false);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (format === "json") {
    return NextResponse.json({ data });
  }

  // CSV export — UTF-8 BOM for Excel/Bengali
  const headers = ["email", "name", "is_active", "is_confirmed", "subscribed_at", "confirmed_at", "unsubscribed_at", "source"];
  const rows = (data || []).map((r) =>
    [
      r.email,
      r.name || "",
      String(r.is_active),
      String(r.is_confirmed ?? false),
      r.subscribed_at || "",
      r.confirmed_at || "",
      r.unsubscribed_at || "",
      r.source || "",
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );

  const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-${status || "all"}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
