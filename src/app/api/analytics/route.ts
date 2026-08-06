import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { classifyReferrer } from "@/lib/analytics/referrer";
import { detectDeviceType } from "@/lib/analytics/device";

// ── Analytics API ──────────────────────────────────────
// POST /api/analytics  — public ingestion endpoint for the client tracker
// GET  /api/analytics  — admin-only aggregated dashboard statistics

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 64 * 1024;
const MAX_PAGE_VIEWS_PER_BATCH = 10;
const MAX_EVENTS_PER_BATCH = 25;
const MAX_METADATA_KEYS = 8;
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;
const EVENT_NAME_PATTERN = /^[a-z0-9_.-]{1,64}$/i;

const ALLOWED_RANGES = [7, 30, 90] as const;

interface PageViewInput {
  path: string;
  referrer: string | null;
  screenWidth: number | null;
  ts: number;
}

interface EventInput {
  name: string;
  category: string;
  label: string | null;
  path: string;
  value: number | null;
  metadata: Record<string, unknown>;
  ts: number;
}

function validPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const path = value.slice(0, 2048);
  return path.startsWith("/") ? path : null;
}

function validTimestamp(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    const now = Date.now();
    const min = now - 24 * 60 * 60 * 1000;
    const max = now + 5 * 60 * 1000;
    if (value >= min && value <= max) return new Date(value).toISOString();
  }
  return new Date().toISOString();
}

function parsePageViews(input: unknown): PageViewInput[] | null {
  if (!Array.isArray(input)) return input === undefined ? [] : null;
  if (input.length > MAX_PAGE_VIEWS_PER_BATCH) return null;

  const views: PageViewInput[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const record = item as Record<string, unknown>;

    const path = validPath(record.path);
    if (!path) return null;

    const referrer =
      typeof record.referrer === "string" ? record.referrer.slice(0, 2048) : null;

    const screenWidth =
      typeof record.screenWidth === "number" &&
      Number.isInteger(record.screenWidth) &&
      record.screenWidth > 0 &&
      record.screenWidth <= 10000
        ? record.screenWidth
        : null;

    views.push({
      path,
      referrer,
      screenWidth,
      ts: typeof record.ts === "number" ? record.ts : Date.now(),
    });
  }
  return views;
}

function parseEvents(input: unknown): EventInput[] | null {
  if (!Array.isArray(input)) return input === undefined ? [] : null;
  if (input.length > MAX_EVENTS_PER_BATCH) return null;

  const events: EventInput[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const record = item as Record<string, unknown>;

    const name =
      typeof record.name === "string" && EVENT_NAME_PATTERN.test(record.name)
        ? record.name.toLowerCase()
        : null;
    if (!name) return null;

    const category =
      typeof record.category === "string" && record.category.length <= 32
        ? record.category.toLowerCase()
        : "general";

    const label =
      typeof record.label === "string" && record.label.length > 0
        ? record.label.slice(0, 200)
        : null;

    const path = validPath(record.path) ?? "/";

    const value =
      typeof record.value === "number" &&
      Number.isFinite(record.value) &&
      Math.abs(record.value) <= 1_000_000_000
        ? record.value
        : null;

    let metadata: Record<string, unknown> = {};
    if (record.metadata !== undefined) {
      if (!record.metadata || typeof record.metadata !== "object" || Array.isArray(record.metadata)) {
        return null;
      }
      const entries = Object.entries(record.metadata as Record<string, unknown>).slice(0, MAX_METADATA_KEYS);
      if (JSON.stringify(entries).length > 2000) return null;
      metadata = Object.fromEntries(entries);
    }

    events.push({
      name,
      category,
      label,
      path,
      value,
      metadata,
      ts: typeof record.ts === "number" ? record.ts : Date.now(),
    });
  }
  return events;
}

// POST — ingest page views and custom events from the client tracker.
export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const record = body as Record<string, unknown>;
    const sessionId =
      typeof record.sessionId === "string" && SESSION_ID_PATTERN.test(record.sessionId)
        ? record.sessionId
        : null;
    if (!sessionId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    const pageViews = parsePageViews(record.pageViews);
    const events = parseEvents(record.events);
    if (pageViews === null || events === null) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    if (pageViews.length === 0 && events.length === 0) {
      return NextResponse.json({ success: true, stored: false });
    }

    const supabase = (await getCurrentUserContext()).supabase;
    if (!supabase) {
      // Supabase not configured — accept silently so the tracker never errors.
      return NextResponse.json({ success: true, stored: false });
    }

    const userAgent = request.headers.get("user-agent");
    const deviceType = detectDeviceType(userAgent);
    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      null;
    const siteHost = request.headers.get("host");

    if (pageViews.length > 0) {
      const rows = pageViews.map((view) => ({
        session_id: sessionId,
        path: view.path,
        referrer: view.referrer,
        referrer_source: classifyReferrer(view.referrer, siteHost),
        country,
        device_type: deviceType,
        screen_width: view.screenWidth,
        created_at: validTimestamp(view.ts),
      }));

      const { error } = await supabase.from("analytics_page_views").insert(rows);
      if (error) {
        console.error("Analytics page view insert failed", error);
        return NextResponse.json({ error: "Unable to record analytics" }, { status: 500 });
      }
    }

    if (events.length > 0) {
      const rows = events.map((event) => ({
        session_id: sessionId,
        event_name: event.name,
        event_category: event.category,
        event_label: event.label,
        path: event.path,
        value: event.value,
        metadata: event.metadata,
        created_at: validTimestamp(event.ts),
      }));

      const { error } = await supabase.from("analytics_events").insert(rows);
      if (error) {
        console.error("Analytics event insert failed", error);
        return NextResponse.json({ error: "Unable to record analytics" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, stored: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// ── GET aggregation helpers ────────────────────────────

function percentile(sortedValues: number[], pct: number): number | null {
  if (sortedValues.length === 0) return null;
  const index = Math.min(
    sortedValues.length - 1,
    Math.max(0, Math.ceil(pct * sortedValues.length) - 1)
  );
  return sortedValues[index];
}

interface RawPageView {
  created_at: string;
  path: string;
  session_id: string;
  device_type: string;
  country: string | null;
  referrer_source: string | null;
}

interface RawEvent {
  created_at: string;
  event_name: string;
  event_label: string | null;
  value: number | null;
  session_id: string;
}

// GET — aggregated analytics for the dashboard. Admin only.
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
  const rangeParam = Number(url.searchParams.get("range") ?? 30);
  const days = (ALLOWED_RANGES as readonly number[]).includes(rangeParam)
    ? rangeParam
    : 30;

  const to = new Date();
  const from = new Date(to.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  from.setUTCHours(0, 0, 0, 0);
  const fromIso = from.toISOString();

  const [viewsResult, eventsResult] = await Promise.all([
    supabase
      .from("analytics_page_views")
      .select("created_at,path,session_id,device_type,country,referrer_source")
      .gte("created_at", fromIso)
      .order("created_at", { ascending: true })
      .limit(20_000),
    supabase
      .from("analytics_events")
      .select("created_at,event_name,event_label,value,session_id")
      .gte("created_at", fromIso)
      .order("created_at", { ascending: true })
      .limit(20_000),
  ]);

  if (viewsResult.error || eventsResult.error) {
    console.error("Analytics retrieval failed", viewsResult.error ?? eventsResult.error);
    return NextResponse.json({ error: "Unable to retrieve analytics" }, { status: 500 });
  }

  const views = (viewsResult.data ?? []) as unknown as RawPageView[];
  const events = (eventsResult.data ?? []) as unknown as RawEvent[];

  // Daily series (UTC day buckets).
  const series: Array<{ date: string; pageViews: number; sessions: number }> = [];
  const dayIndex = new Map<string, { pageViews: number; sessions: Set<string> }>();
  for (let i = 0; i < days; i += 1) {
    const day = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
    const key = day.toISOString().slice(0, 10);
    dayIndex.set(key, { pageViews: 0, sessions: new Set() });
  }
  for (const view of views) {
    const bucket = dayIndex.get(view.created_at.slice(0, 10));
    if (bucket) {
      bucket.pageViews += 1;
      bucket.sessions.add(view.session_id);
    }
  }
  for (const [date, bucket] of dayIndex) {
    series.push({ date, pageViews: bucket.pageViews, sessions: bucket.sessions.size });
  }

  // Session-level metrics: bounce rate + session duration.
  const viewsPerSession = new Map<string, number>();
  const sessionsWithEvents = new Set<string>();
  const engagementSeconds = new Map<string, number>();

  for (const view of views) {
    viewsPerSession.set(view.session_id, (viewsPerSession.get(view.session_id) ?? 0) + 1);
  }
  for (const event of events) {
    sessionsWithEvents.add(event.session_id);
    if (event.event_name === "engagement" && typeof event.value === "number") {
      engagementSeconds.set(
        event.session_id,
        (engagementSeconds.get(event.session_id) ?? 0) + event.value
      );
    }
  }

  const totalSessions = viewsPerSession.size;
  let bouncedSessions = 0;
  let totalEngagement = 0;
  for (const [sessionId, count] of viewsPerSession) {
    if (count === 1 && !sessionsWithEvents.has(sessionId)) bouncedSessions += 1;
    totalEngagement += engagementSeconds.get(sessionId) ?? 0;
  }

  // Breakdowns.
  const countBy = (values: Array<string | null>) => {
    const counts = new Map<string, number>();
    for (const value of values) {
      const key = value ?? "unknown";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count);
  };

  const topPages = countBy(views.map((view) => view.path)).slice(0, 10);
  const devices = countBy(views.map((view) => view.device_type));
  const countries = countBy(views.map((view) => view.country)).slice(0, 15);
  const referrers = countBy(views.map((view) => view.referrer_source)).slice(0, 10);

  const topEvents = countBy(
    events
      .filter((event) => event.event_name !== "engagement" && event.event_name !== "web_vital")
      .map((event) => event.event_name)
  ).slice(0, 10);

  // Core Web Vitals: p75 + average per metric.
  const vitals: Array<{
    metric: string;
    count: number;
    p75: number | null;
    average: number | null;
  }> = [];
  const vitalValues = new Map<string, number[]>();
  for (const event of events) {
    if (event.event_name === "web_vital" && event.event_label && typeof event.value === "number") {
      const list = vitalValues.get(event.event_label) ?? [];
      list.push(event.value);
      vitalValues.set(event.event_label, list);
    }
  }
  for (const [metric, values] of vitalValues) {
    const sorted = [...values].sort((a, b) => a - b);
    vitals.push({
      metric,
      count: values.length,
      p75: percentile(sorted, 0.75),
      average: Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100,
    });
  }
  vitals.sort((a, b) => b.count - a.count);

  const todayKey = to.toISOString().slice(0, 10);
  const viewsToday = views.filter((view) => view.created_at.slice(0, 10) === todayKey).length;

  return NextResponse.json({
    range: { days, from: fromIso, to: to.toISOString() },
    totals: {
      pageViews: views.length,
      sessions: totalSessions,
      events: events.length,
      viewsToday,
      bounceRate: totalSessions > 0 ? Math.round((bouncedSessions / totalSessions) * 1000) / 1000 : null,
      avgSessionSeconds: totalSessions > 0 ? Math.round(totalEngagement / totalSessions) : 0,
    },
    series,
    topPages: topPages.map(({ key, count }) => ({ path: key, views: count })),
    devices: devices.map(({ key, count }) => ({ deviceType: key, views: count })),
    countries: countries.map(({ key, count }) => ({ country: key, views: count })),
    referrers: referrers.map(({ key, count }) => ({ source: key, views: count })),
    topEvents: topEvents.map(({ key, count }) => ({ name: key, count })),
    vitals,
  });
}
