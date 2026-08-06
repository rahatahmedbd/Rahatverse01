import { createClient } from "@/lib/supabase/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { enumValue, optionalText, requiredText, validPhone } from "@/lib/api/validation";
import { NextResponse } from "next/server";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
const urgencyLevels = ["normal", "urgent", "critical"] as const;

// POST — Create a blood request.
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const name = requiredText(input.name, 100);
    const phone = validPhone(input.phone);
    const blood_group = enumValue(input.blood_group, bloodGroups);
    const location = requiredText(input.location, 200);
    const urgency = enumValue(input.urgency ?? "normal", urgencyLevels);
    const message = optionalText(input.message, 2_000);

    if (!name || !phone || !blood_group || !location || !urgency) {
      return NextResponse.json({ error: "Invalid or missing fields" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const { error } = await supabase
      .from("blood_requests")
      .insert({ name, phone, blood_group, location, urgency, message });

    if (error) {
      console.error("Blood request creation failed", error);
      return NextResponse.json({ error: "Unable to submit request" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// Blood requests contain sensitive contact and location data and are admin-only.
export async function GET() {
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

  const { data, error } = await supabase
    .from("blood_requests")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Blood request retrieval failed", error);
    return NextResponse.json({ error: "Unable to retrieve requests" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
