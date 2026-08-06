import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";

export const dynamic = "force-dynamic";

// ── System Health Monitoring ───────────────────────────
// Reports database connectivity + latency, configured services, environment
// checks and aggregate row counts. Admin-only.

function envStatus() {
  const checks = {
    supabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    supabaseAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    siteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    cloudinaryCloud: Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
    cloudinaryApiKey: Boolean(process.env.CLOUDINARY_API_KEY),
    cloudinaryApiSecret: Boolean(process.env.CLOUDINARY_API_SECRET),
    gaMeasurementId: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  };
  const configured = Object.values(checks).filter(Boolean).length;
  return {
    checks,
    configured,
    total: Object.keys(checks).length,
    nodeVersion: process.version ?? null,
    uptimeSeconds: Math.round(process.uptime()),
    memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    environment: process.env.NODE_ENV ?? "development",
  };
}

export async function GET() {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        error: "Supabase is not configured",
        env: envStatus(),
      },
      { status: 503 }
    );
  }
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const started = Date.now();
  // Lightweight connectivity probe.
  const { error: pingError } = await supabase.from("profiles").select("id", { count: "exact", head: true });
  const latencyMs = Date.now() - started;

  // Aggregate counts for the health overview.
  const tables = [
    "orders",
    "messages",
    "blood_requests",
    "testimonials",
    "blog_posts",
    "newsletter_subscribers",
    "images",
    "bookings",
    "blog_comments",
  ] as const;

  const counts: Record<string, number> = {};
  const countErrors: string[] = [];

  await Promise.all(
    tables.map(async (table) => {
      const { count, error } = await supabase
        .from(table)
        .select("id", { count: "exact", head: true });
      if (error) countErrors.push(table);
      else counts[table] = count ?? 0;
    })
  );

  // Latest backup record.
  const { data: backups } = await supabase
    .from("system_backups")
    .select("id, status, scope, note, created_at, created_by")
    .order("created_at", { ascending: false })
    .limit(1);

  return NextResponse.json({
    ok: !pingError,
    database: {
      connected: !pingError,
      latencyMs,
      error: pingError?.message ?? null,
    },
    counts,
    countsWarning: countErrors,
    lastBackup: backups?.[0] ?? null,
    env: envStatus(),
    serverTime: new Date().toISOString(),
  });
}
