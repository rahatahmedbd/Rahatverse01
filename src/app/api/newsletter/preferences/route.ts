import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { optionalText } from "@/lib/api/validation";

// GET ?token=xyz -> fetch preferences
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")?.trim();
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, name, preferences, is_active, is_confirmed")
    .eq("unsubscribe_token", token)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Database error" }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Invalid token" }, { status: 404 });

  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token.trim() : null;
    if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

    const supabase = await createClient();
    if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

    const { data: existing, error: fetchErr } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("unsubscribe_token", token)
      .maybeSingle();
    if (fetchErr) return NextResponse.json({ error: "Database error" }, { status: 500 });
    if (!existing) return NextResponse.json({ error: "Invalid token" }, { status: 404 });

    const name = optionalText(body.name, 100);
    const preferences =
      body.preferences && typeof body.preferences === "object" && !Array.isArray(body.preferences)
        ? (body.preferences as Record<string, unknown>)
        : null;

    const updates: Record<string, unknown> = {};
    if (name !== null && name !== undefined) updates.name = name;
    if (preferences) updates.preferences = preferences;
    if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active);
    if (body.locale !== undefined) {
      // store locale preference
      const currentPrefs = (body.preferences as Record<string, unknown>) || {};
      updates.preferences = { ...(currentPrefs as object), locale: body.locale };
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .update(updates)
      .eq("id", existing.id)
      .select("id, email, name, preferences, is_active")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
