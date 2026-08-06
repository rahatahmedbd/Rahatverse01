import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { logAudit } from "@/lib/admin/audit";
import { requiredText } from "@/lib/api/validation";

export const dynamic = "force-dynamic";

// ── Settings Management Panel ──────────────────────────
// Reads and updates the key/value `site_settings` table. Secrets must never
// be stored here — only display/behaviour configuration. Admin-only.

const MAX_KEY_LENGTH = 100;
const MAX_VALUE_JSON_BYTES = 20_000;

export async function GET() {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await supabase
    .from("site_settings")
    .select("id, key, value, updated_at")
    .order("key", { ascending: true });

  if (error) return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function PATCH(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await request.json();
    const key = requiredText(body.key, MAX_KEY_LENGTH);
    if (!key) return NextResponse.json({ error: "A valid key is required" }, { status: 400 });

    // Validate the JSON value is an object/array/primitive and size-capped.
    let parsed: unknown = body.value;
    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch {
        return NextResponse.json({ error: "Value must be valid JSON" }, { status: 400 });
      }
    }
    const serialized = JSON.stringify(parsed ?? null);
    if (serialized.length > MAX_VALUE_JSON_BYTES) {
      return NextResponse.json({ error: "Value is too large" }, { status: 400 });
    }

    // Upsert by key.
    const { data, error } = await supabase
      .from("site_settings")
      .upsert({ key, value: parsed ?? null }, { onConflict: "key" })
      .select("id, key, value, updated_at")
      .single();

    if (error) return NextResponse.json({ error: "Failed to save setting" }, { status: 500 });

    await logAudit({
      action: "settings.update",
      entity: "settings",
      entityId: key,
      metadata: { key, by: user.email },
      ip: getClientIpSafe(request),
    });

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { error } = await supabase.from("site_settings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete setting" }, { status: 500 });

  await logAudit({
    action: "settings.delete",
    entity: "settings",
    entityId: id,
    metadata: { by: user.email },
    ip: getClientIpSafe(request),
  });

  return NextResponse.json({ success: true });
}

function getClientIpSafe(request: Request): string | null {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip");
}
