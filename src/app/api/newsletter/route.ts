import { createClient } from "@/lib/supabase/server";
import { optionalText, validEmail } from "@/lib/api/validation";
import { NextResponse } from "next/server";

// POST — Subscribe to the newsletter. Delivery and confirmation belong to Phase 27.
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const email = validEmail(input.email);
    const name = optionalText(input.name, 100);

    if (!email) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email, name });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
      }
      console.error("Newsletter subscription failed", error);
      return NextResponse.json({ error: "Unable to subscribe" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
