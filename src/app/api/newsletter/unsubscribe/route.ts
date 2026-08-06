import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { unsubscribeEmail } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/service";

function getSiteUrl(request: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const host = request.headers.get("host");
  if (host) {
    const proto = request.headers.get("x-forwarded-proto") || "https";
    return `${proto}://${host}`;
  }
  return "http://localhost:3000";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")?.trim();
  const locale = searchParams.get("locale") === "en" ? "en" : "bn";

  if (!token || token.length < 24) {
    return NextResponse.json({ error: "A valid unsubscribe token is required" }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  let subscriber: { id: string; email: string; is_active: boolean; unsubscribed_at: string | null } | null = null;

  {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, is_active, unsubscribed_at")
      .eq("unsubscribe_token", token)
      .maybeSingle();
    if (error) return NextResponse.json({ error: "Database error" }, { status: 500 });
    subscriber = data;
  }

  if (!subscriber) return NextResponse.json({ error: "Subscriber not found", code: "NOT_FOUND" }, { status: 404 });

  if (!subscriber.is_active && subscriber.unsubscribed_at) {
    return NextResponse.json({ success: true, message: "Already unsubscribed", already: true });
  }

  const { error: updErr } = await supabase
    .from("newsletter_subscribers")
    .update({ is_active: false, unsubscribed_at: new Date().toISOString(), is_confirmed: false })
    .eq("id", subscriber.id);

  if (updErr) return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 });

  // Send goodbye email (mock)
  const siteUrl = getSiteUrl(request);
  const resubscribeUrl = `${siteUrl}/${locale}/#newsletter`;
  const template = unsubscribeEmail({ resubscribeUrl, locale });
  await sendEmail({ to: subscriber.email, template, tag: "newsletter-unsubscribe" });

  return NextResponse.json({
    success: true,
    message: locale === "bn" ? "আপনি আনসাবস্ক্রাইব করেছেন।" : "You have been unsubscribed.",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token.trim() : null;
    const locale = body?.locale === "en" ? "en" : "bn";

    if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

    const url = new URL(request.url);
    if (token) url.searchParams.set("token", token);
    url.searchParams.set("locale", locale);

    return GET(new Request(url.toString(), { headers: request.headers }));
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
