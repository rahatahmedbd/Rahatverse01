import { createClient } from "@/lib/supabase/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { optionalText, validEmail } from "@/lib/api/validation";
import { NextResponse } from "next/server";
import { generateConfirmationToken, generateUnsubscribeToken } from "@/lib/newsletter/tokens";
import { confirmationEmail, sendEmailMock } from "@/lib/email/templates";

// In-memory rate limiting (per IP/email) — resets on server restart; sufficient for Phase 27.
// Phase 29 will replace with Upstash/Redis if needed.
const lastSubscribeByIp = new Map<string, number>();
const lastSubscribeByEmail = new Map<string, number>();
const RATE_LIMIT_MS = 60_000; // 1 subscribe per minute per IP/email

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function isRateLimited(key: string, map: Map<string, number>): boolean {
  const last = map.get(key);
  if (!last) return false;
  return Date.now() - last < RATE_LIMIT_MS;
}

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

// ── GET — Admin list + stats ─────────────────────────
export async function GET(request: Request) {
  const { supabase, isAdmin } = await getCurrentUserContext();
  if (!isAdmin || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));
  const search = searchParams.get("search")?.trim().slice(0, 100) || "";
  const status = searchParams.get("status"); // all | confirmed | pending | unsubscribed

  const offset = (page - 1) * limit;

  let query = supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact" })
    .order("subscribed_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    // case-insensitive search on email/name
    query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
  }

  if (status === "confirmed") {
    query = query.eq("is_confirmed", true).eq("is_active", true);
  } else if (status === "pending") {
    query = query.eq("is_confirmed", false).eq("is_active", false);
  } else if (status === "unsubscribed") {
    query = query.eq("is_active", false).not("unsubscribed_at", "is", null);
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }

  // Stats (single extra queries)
  const { count: total } = await supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true });
  const { count: confirmed } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true })
    .eq("is_confirmed", true)
    .eq("is_active", true);
  const { count: pending } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true })
    .eq("is_confirmed", false)
    .eq("is_active", false);
  const { count: unsub } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true })
    .not("unsubscribed_at", "is", null);

  // Recent subscribers (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const { count: last7 } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true })
    .gte("subscribed_at", sevenDaysAgo.toISOString());

  return NextResponse.json({
    data: data || [],
    pagination: { page, limit, total: count ?? 0, totalAll: total ?? 0 },
    stats: {
      total: total ?? 0,
      confirmed: confirmed ?? 0,
      pending: pending ?? 0,
      unsubscribed: unsub ?? 0,
      last7Days: last7 ?? 0,
    },
  });
}

// ── POST — Subscribe (double opt-in) ─────────────────
export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip, lastSubscribeByIp)) {
      return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const input = body as Record<string, unknown>;
    const email = validEmail(input.email);
    const name = optionalText(input.name, 100);
    const source = optionalText(input.source, 50) || "website";
    const locale = typeof input.locale === "string" && ["bn", "en"].includes(input.locale) ? input.locale : "bn";
    const preferences =
      input.preferences && typeof input.preferences === "object" && !Array.isArray(input.preferences)
        ? (input.preferences as Record<string, unknown>)
        : {};

    if (!email) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }

    if (isRateLimited(email, lastSubscribeByEmail)) {
      return NextResponse.json({ error: "Too many requests for this email. Try again in a minute." }, { status: 429 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    // Check existing
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, is_active, is_confirmed, unsubscribed_at, confirmation_token")
      .eq("email", email)
      .maybeSingle();

    const siteUrl = getSiteUrl(request);
    const confirmationToken = generateConfirmationToken();
    const unsubscribeToken = generateUnsubscribeToken();

    if (existing) {
      // Already active & confirmed
      if (existing.is_active && existing.is_confirmed) {
        return NextResponse.json({ error: "Already subscribed", code: "ALREADY_SUBSCRIBED" }, { status: 409 });
      }

      // Pending confirmation => resend confirmation with new token
      if (!existing.is_confirmed) {
        const { error: updErr } = await supabase
          .from("newsletter_subscribers")
          .update({
            name: name ?? undefined,
            confirmation_token: confirmationToken,
            confirmation_sent_at: new Date().toISOString(),
            unsubscribe_token: unsubscribeToken,
            preferences,
            source,
          })
          .eq("id", existing.id);

        if (updErr) {
          console.error("Newsletter resend update failed", updErr);
          return NextResponse.json({ error: "Unable to subscribe" }, { status: 500 });
        }

        const confirmUrl = `${siteUrl}/bn/newsletter/confirm?token=${confirmationToken}`;
        const unsubscribeUrl = `${siteUrl}/bn/newsletter/unsubscribe?token=${unsubscribeToken}`;
        const template = confirmationEmail({ name, confirmUrl, unsubscribeUrl, locale });
        await sendEmailMock({ to: email, template, tag: "newsletter-confirm-resend" });

        // Also mark last_email_sent
        await supabase.from("newsletter_subscribers").update({ last_email_sent_at: new Date().toISOString() }).eq("id", existing.id);

        lastSubscribeByIp.set(ip, Date.now());
        lastSubscribeByEmail.set(email, Date.now());

        return NextResponse.json(
          { success: true, message: "Confirmation email resent. Please check your inbox.", pending: true },
          { status: 200 }
        );
      }

      // Previously unsubscribed => reactivate as pending confirmation
      if (!existing.is_active && existing.unsubscribed_at) {
        const { error: reactErr } = await supabase
          .from("newsletter_subscribers")
          .update({
            name: name ?? undefined,
            is_active: false,
            is_confirmed: false,
            confirmation_token: confirmationToken,
            confirmation_sent_at: new Date().toISOString(),
            unsubscribed_at: null,
            unsubscribe_token: unsubscribeToken,
            preferences,
            source,
          })
          .eq("id", existing.id);

        if (reactErr) {
          return NextResponse.json({ error: "Unable to subscribe" }, { status: 500 });
        }

        const confirmUrl = `${siteUrl}/bn/newsletter/confirm?token=${confirmationToken}`;
        const unsubscribeUrl = `${siteUrl}/bn/newsletter/unsubscribe?token=${unsubscribeToken}`;
        const template = confirmationEmail({ name, confirmUrl, unsubscribeUrl, locale });
        await sendEmailMock({ to: email, template, tag: "newsletter-confirm-reactivate" });
        await supabase.from("newsletter_subscribers").update({ last_email_sent_at: new Date().toISOString() }).eq("id", existing.id);

        lastSubscribeByIp.set(ip, Date.now());
        lastSubscribeByEmail.set(email, Date.now());

        return NextResponse.json(
          { success: true, message: "Please confirm your email to resubscribe.", pending: true },
          { status: 200 }
        );
      }
    }

    // New subscriber — create pending record (is_active false, is_confirmed false)
    const { data: inserted, error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email,
        name,
        is_active: false,
        is_confirmed: false,
        confirmation_token: confirmationToken,
        confirmation_sent_at: new Date().toISOString(),
        unsubscribe_token: unsubscribeToken,
        preferences,
        source,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Already subscribed", code: "ALREADY_SUBSCRIBED" }, { status: 409 });
      }
      console.error("Newsletter subscription failed", error);
      return NextResponse.json({ error: "Unable to subscribe", details: error.message }, { status: 500 });
    }

    const confirmUrl = `${siteUrl}/bn/newsletter/confirm?token=${confirmationToken}`;
    const unsubscribeUrl = `${siteUrl}/bn/newsletter/unsubscribe?token=${unsubscribeToken}`;
    const enConfirmUrl = `${siteUrl}/en/newsletter/confirm?token=${confirmationToken}`;
    // Use locale-specific confirm link but email contains both? Use locale one
    const template = confirmationEmail({ name, confirmUrl: locale === "en" ? enConfirmUrl : confirmUrl, unsubscribeUrl, locale });
    await sendEmailMock({ to: email, template, tag: "newsletter-confirm" });

    if (inserted?.id) {
      await supabase.from("newsletter_subscribers").update({ last_email_sent_at: new Date().toISOString() }).eq("id", inserted.id);
    }

    lastSubscribeByIp.set(ip, Date.now());
    lastSubscribeByEmail.set(email, Date.now());

    return NextResponse.json(
      {
        success: true,
        message: locale === "bn" ? "নিশ্চিতকরণ ইমেইল পাঠানো হয়েছে। ইনবক্স চেক করুন।" : "Confirmation email sent. Please check your inbox.",
        pending: true,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("Newsletter POST error", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// ── PATCH — Admin update (optional) ──────────────────
export async function PATCH(request: Request) {
  const { supabase, isAdmin } = await getCurrentUserContext();
  if (!isAdmin || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : null;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = optionalText(body.name, 100);
    if (body.is_active !== undefined) updates.is_active = Boolean(body.is_active);
    if (body.preferences !== undefined && typeof body.preferences === "object") updates.preferences = body.preferences;

    const { data, error } = await supabase.from("newsletter_subscribers").update(updates).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// ── DELETE — Admin delete ────────────────────────────
export async function DELETE(request: Request) {
  const { supabase, isAdmin } = await getCurrentUserContext();
  if (!isAdmin || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
