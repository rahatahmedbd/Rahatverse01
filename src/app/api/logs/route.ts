import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requiredText } from "@/lib/api/validation";

export const dynamic = "force-dynamic";

// ── Client Error Reporting ─────────────────────────────
// Lightweight, rate-limited endpoint used by the frontend to report runtime
// errors into `system_logs` (viewable in the admin System Logs viewer).

const MAX_MESSAGE = 2000;
const MAX_METADATA_KEYS = 8;
const MAX_BODY_BYTES = 8 * 1024;
const lastReportByIp = new Map<string, number>();
const RATE_LIMIT_MS = 10_000;

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const ip = getClientIp(request);
    const last = lastReportByIp.get(ip);
    if (last && Date.now() - last < RATE_LIMIT_MS) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const record = body as Record<string, unknown>;
    const level =
      record.level === "error" || record.level === "warn" || record.level === "debug"
        ? record.level
        : "info";
    const message = requiredText(record.message, MAX_MESSAGE);
    if (!message) return NextResponse.json({ error: "message is required" }, { status: 400 });

    const source = requiredText(record.source, 50) ?? "client";
    let metadata: Record<string, unknown> = {};
    if (record.metadata && typeof record.metadata === "object" && !Array.isArray(record.metadata)) {
      metadata = Object.fromEntries(
        Object.entries(record.metadata as Record<string, unknown>).slice(0, MAX_METADATA_KEYS)
      );
    }

    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.from("system_logs").insert({ level, source, message, metadata });
      if (error) {
        // Logging must never break the app; drop silently.
        return NextResponse.json({ success: true, stored: false });
      }
    }

    lastReportByIp.set(ip, Date.now());
    return NextResponse.json({ success: true, stored: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
