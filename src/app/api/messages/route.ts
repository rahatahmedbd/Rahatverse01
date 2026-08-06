import { createClient } from "@/lib/supabase/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { enumValue, optionalText, requiredText, validEmail, validPhone } from "@/lib/api/validation";
import { NextResponse } from "next/server";
import { contactNotificationEmail } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/service";

const subjects = ["web_dev", "tutoring", "blood", "collaboration", "general", "other"] as const;

// POST — Create a new contact message. Public submission is allowed; reading is admin-only.
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const name = requiredText(input.name, 100);
    const email = validEmail(input.email);
    const phone = optionalText(input.phone, 25);
    const subject = enumValue(input.subject, subjects);
    const message = requiredText(input.message, 5_000);

    if (!name || !email || (input.phone && !validPhone(input.phone)) || !subject || !message) {
      return NextResponse.json({ error: "Invalid or missing fields" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const { error } = await supabase
      .from("messages")
      .insert({ name, email, phone, subject, message });

    if (error) {
      console.error("Message creation failed", error);
      return NextResponse.json({ error: "Unable to send message" }, { status: 500 });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const delivery = await sendEmail({
        to: adminEmail,
        replyTo: email,
        tag: "contact-notification",
        template: contactNotificationEmail({ name, email, subject, message }),
      });
      if (delivery.status === "failed") console.error("Contact notification email failed", delivery.error);
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// GET — List messages for administrators only.
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
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Message retrieval failed", error);
    return NextResponse.json({ error: "Unable to retrieve messages" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
