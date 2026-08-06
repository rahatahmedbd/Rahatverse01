import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendNewsletterCampaign } from "@/lib/newsletter/sendCampaign";

export const runtime = "nodejs";
/** Vercel Cron target. Secure it with CRON_SECRET; schedule it in vercel.json. */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = createServiceClient();
  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  const { data, error } = await supabase.from("newsletter_campaigns").select("id").eq("status", "scheduled").lte("scheduled_at", new Date().toISOString()).limit(5);
  if (error) return NextResponse.json({ error: "Unable to find scheduled campaigns" }, { status: 500 });
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
  const results = await Promise.allSettled((data || []).map((campaign) => sendNewsletterCampaign(supabase, campaign.id, siteUrl)));
  return NextResponse.json({ success: true, processed: results.filter(r => r.status === "fulfilled").length, failed: results.filter(r => r.status === "rejected").length });
}
