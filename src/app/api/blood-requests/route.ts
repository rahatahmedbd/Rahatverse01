// ── API: Blood Requests ────────────────────────────────
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST — Create a blood request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, blood_group, location, urgency, message } = body;

    if (!name || !phone || !blood_group || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from("blood_requests")
      .insert({ name, phone, blood_group, location, urgency: urgency || "normal", message })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET — List open blood requests
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from("blood_requests")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
