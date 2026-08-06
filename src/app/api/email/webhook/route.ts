import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Resend event webhook. Configure this route and RESEND_WEBHOOK_SECRET in production. */
export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  const payload = await request.text();
  try {
    const event = new Webhook(secret).verify(payload, {
      "svix-id": request.headers.get("svix-id") || "",
      "svix-timestamp": request.headers.get("svix-timestamp") || "",
      "svix-signature": request.headers.get("svix-signature") || "",
    }) as { type?: string; data?: { email_id?: string; id?: string } };
    const type = event.type || "";
    const providerId = event.data?.email_id || event.data?.id;
    if (!providerId) return NextResponse.json({ ok: true });
    const status = type === "email.delivered" ? "delivered" : type === "email.bounced" ? "bounced" : type === "email.complained" ? "complained" : null;
    if (!status) return NextResponse.json({ ok: true });
    const supabase = createServiceClient();
    if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    const timestampField = status === "delivered" ? "delivered_at" : status === "bounced" ? "bounced_at" : "complained_at";
    const { error } = await supabase.from("email_deliveries").update({ status, [timestampField]: new Date().toISOString() }).eq("provider_id", providerId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Invalid Resend webhook", error);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }
}
