import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { logAudit } from "@/lib/admin/audit";

export const dynamic = "force-dynamic";

// ── Export Data Functionality ──────────────────────────
// Exports admin data as CSV (UTF-8 BOM) or JSON. Admin-only.
//   /api/admin/export?entity=orders&format=csv

const ENTITIES = ["orders", "messages", "users", "subscribers", "comments", "testimonials", "images"] as const;

const COLUMNS: Record<(typeof ENTITIES)[number], string[]> = {
  orders: ["id", "client_name", "client_email", "client_phone", "package_type", "website_type", "status", "created_at"],
  messages: ["id", "name", "email", "phone", "subject", "message", "is_read", "created_at"],
  users: ["id", "email", "full_name", "phone", "role", "created_at"],
  subscribers: ["id", "email", "name", "is_active", "is_confirmed", "source", "subscribed_at"],
  comments: ["id", "post_id", "author_name", "author_email", "content", "is_approved", "created_at"],
  testimonials: ["id", "name", "role", "content", "is_approved", "created_at"],
  images: ["id", "public_id", "url", "category", "title", "created_at"],
};

function csvEscape(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const entity = searchParams.get("entity");
  const format = searchParams.get("format") === "json" ? "json" : "csv";

  if (!entity || !(ENTITIES as readonly string[]).includes(entity)) {
    return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
  }

  const tableMap: Record<(typeof ENTITIES)[number], string> = {
    orders: "orders",
    messages: "messages",
    users: "profiles",
    subscribers: "newsletter_subscribers",
    comments: "blog_comments",
    testimonials: "testimonials",
    images: "images",
  };

  const entityKey = entity as (typeof ENTITIES)[number];
  const columns = COLUMNS[entityKey];
  const { data, error } = await supabase
    .from(tableMap[entityKey])
    .select(columns.join(", "))
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) return NextResponse.json({ error: "Export failed" }, { status: 500 });

  const rows = data ?? [];

  await logAudit({
    action: `export.${entity}`,
    entity: "export",
    entityId: entity,
    metadata: { format, count: rows.length, by: user.email },
    ip: getClientIpSafe(request),
  });

  const filename = `${entity}-${new Date().toISOString().slice(0, 10)}.${format}`;

  if (format === "json") {
    return NextResponse.json({ data: rows });
  }

  const csv =
    "\uFEFF" +
    [
      columns.join(","),
      ...rows.map((row) =>
        columns.map((col) => csvEscape((row as unknown as Record<string, unknown>)[col])).join(",")
      ),
    ].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

function getClientIpSafe(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}
