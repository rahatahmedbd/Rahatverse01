import { getCurrentUserContext } from "@/lib/supabase/guards";
import { NextResponse } from "next/server";
import { optionalText, requiredText } from "@/lib/api/validation";
import { newsletterCampaignEmail, sendEmailMock } from "@/lib/email/templates";

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

    // If action === "send", perform bulk send to all confirmed subscribers (mock)
    if (body.action === "send") {
      const { data: campaign, error: campErr } = await supabase.from("newsletter_campaigns").select("*").eq("id", id).single();
      if (campErr || !campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
      if (campaign.status === "sent") return NextResponse.json({ error: "Already sent" }, { status: 409 });

      const { data: subscribers, error: subErr } = await supabase
        .from("newsletter_subscribers")
        .select("id, email, name, unsubscribe_token, preferences")
        .eq("is_active", true)
        .eq("is_confirmed", true)
        .limit(2000);

      if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });

      const siteUrl = getSiteUrl(request);
      let sentCount = 0;
      for (const sub of subscribers || []) {
        const unsubscribeUrl = `${siteUrl}/bn/newsletter/unsubscribe?token=${sub.unsubscribe_token}`;
        const preferencesUrl = `${siteUrl}/bn/newsletter/preferences?token=${sub.unsubscribe_token}`;
        const template = newsletterCampaignEmail({
          subject: campaign.subject,
          htmlContent: campaign.content,
          name: sub.name,
          unsubscribeUrl,
          preferencesUrl,
        });
        await sendEmailMock({ to: sub.email, template, tag: `campaign-${campaign.id}` });

        // Record send
        await supabase.from("newsletter_sends").insert({
          campaign_id: campaign.id,
          subscriber_id: sub.id,
          email: sub.email,
          status: "sent",
          sent_at: new Date().toISOString(),
        });
        sentCount++;
      }

      await supabase
        .from("newsletter_campaigns")
        .update({ status: "sent", sent_at: new Date().toISOString(), sent_count: sentCount, recipient_count: subscribers?.length || 0 })
        .eq("id", id);

      await supabase.from("newsletter_subscribers").update({ last_email_sent_at: new Date().toISOString() }).eq("is_active", true).eq("is_confirmed", true);

      return NextResponse.json({ success: true, sent: sentCount });
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
