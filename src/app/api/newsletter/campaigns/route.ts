import { getCurrentUserContext } from "@/lib/supabase/guards";
import { NextResponse } from "next/server";
import { optionalText, requiredText } from "@/lib/api/validation";
import { sendNewsletterCampaign } from "@/lib/newsletter/sendCampaign";

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

// GET — list campaigns (admin)
export async function GET() {
  const { supabase, isAdmin } = await getCurrentUserContext();
  if (!isAdmin || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [] });
}

// POST — create campaign (admin)
export async function POST(request: Request) {
  const { supabase, isAdmin } = await getCurrentUserContext();
  if (!isAdmin || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const subject = requiredText(body.subject, 200);
    const subjectBn = optionalText(body.subject_bn, 200);
    const content = requiredText(body.content, 50000);
    const contentBn = optionalText(body.content_bn, 50000);
    const scheduledAt = typeof body.scheduled_at === "string" ? body.scheduled_at : null;

    if (!subject || !content) return NextResponse.json({ error: "subject and content required" }, { status: 400 });

    const { data, error } = await supabase
      .from("newsletter_campaigns")
      .insert({
        subject,
        subject_bn: subjectBn,
        content,
        content_bn: contentBn,
        status: scheduledAt ? "scheduled" : "draft",
        scheduled_at: scheduledAt,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

// PATCH — update campaign or send
export async function PATCH(request: Request) {
  const { supabase, isAdmin } = await getCurrentUserContext();
  if (!isAdmin || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : null;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    // Manual delivery is admin-only; scheduled delivery uses the protected cron route.
    if (body.action === "send") {
      try {
        const result = await sendNewsletterCampaign(supabase, id, getSiteUrl(request));
        return NextResponse.json({ success: true, ...result });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Campaign delivery failed";
        return NextResponse.json({ error: message }, { status: message.includes("not found") ? 404 : 409 });
      }
    }

    // Otherwise normal update
    const updates: Record<string, unknown> = {};
    if (body.subject !== undefined) updates.subject = requiredText(body.subject, 200) || undefined;
    if (body.subject_bn !== undefined) updates.subject_bn = optionalText(body.subject_bn, 200);
    if (body.content !== undefined) updates.content = requiredText(body.content, 50000) || undefined;
    if (body.content_bn !== undefined) updates.content_bn = optionalText(body.content_bn, 50000);
    if (body.status !== undefined) {
      const allowed = ["draft", "scheduled", "sending", "sent", "cancelled"] as const;
      if (allowed.includes(body.status)) updates.status = body.status;
    }

    const { data, error } = await supabase.from("newsletter_campaigns").update(updates).eq("id", id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { supabase, isAdmin } = await getCurrentUserContext();
  if (!isAdmin || !supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase.from("newsletter_campaigns").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
