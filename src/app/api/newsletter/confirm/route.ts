import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { welcomeEmail, sendEmailMock } from "@/lib/email/templates";
import { isTokenExpired } from "@/lib/newsletter/tokens";

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

  if (!token || token.length < 8) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const { data: subscriber, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, name, is_confirmed, is_active, confirmation_token, confirmation_sent_at, unsubscribe_token")
    .eq("confirmation_token", token)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Database error" }, { status: 500 });
  if (!subscriber) return NextResponse.json({ error: "Invalid or expired token", code: "INVALID_TOKEN" }, { status: 404 });

  if (subscriber.is_confirmed && subscriber.is_active) {
    return NextResponse.json({ success: true, message: "Already confirmed", already: true });
  }

  if (isTokenExpired(subscriber.confirmation_sent_at)) {
    return NextResponse.json({ error: "Token expired. Please request a new confirmation email.", code: "TOKEN_EXPIRED" }, { status: 410 });
  }

  const { error: updErr } = await supabase
    .from("newsletter_subscribers")
    .update({
      is_confirmed: true,
      is_active: true,
      confirmed_at: new Date().toISOString(),
      confirmation_token: null, // clear after use
      last_email_sent_at: new Date().toISOString(),
    })
    .eq("id", subscriber.id);

  if (updErr) return NextResponse.json({ error: "Failed to confirm" }, { status: 500 });

  // Send welcome email (mock)
  const siteUrl = getSiteUrl(request);
  const unsubscribeUrl = `${siteUrl}/${locale}/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`;
  const preferencesUrl = `${siteUrl}/${locale}/newsletter/preferences?token=${subscriber.unsubscribe_token}`;
  const template = welcomeEmail({ name: subscriber.name, unsubscribeUrl, preferencesUrl, locale });
  await sendEmailMock({ to: subscriber.email, template, tag: "newsletter-welcome" });

  return NextResponse.json({
    success: true,
    message: locale === "bn" ? "ইমেইল নিশ্চিত হয়েছে! স্বাগতম!" : "Email confirmed! Welcome aboard!",
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token.trim() : null;
    if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

    // Reuse GET logic via synthetic URL
    const url = new URL(request.url);
    url.searchParams.set("token", token);
    if (body.locale) url.searchParams.set("locale", body.locale);
    return GET(new Request(url.toString(), { headers: request.headers }));
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
