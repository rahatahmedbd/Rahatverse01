import type { SupabaseClient } from "@supabase/supabase-js";
import { newsletterCampaignEmail } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/service";

type DbClient = Pick<SupabaseClient, "from">;

/** Sends one newsletter campaign and records every recipient result. Server-only. */
export async function sendNewsletterCampaign(supabase: DbClient, campaignId: string, siteUrl: string) {
  const { data: campaign, error: campaignError } = await supabase.from("newsletter_campaigns").select("*").eq("id", campaignId).single();
  if (campaignError || !campaign) throw new Error("Campaign not found");
  if (campaign.status === "sent") throw new Error("Campaign already sent");

  await supabase.from("newsletter_campaigns").update({ status: "sending" }).eq("id", campaignId);
  const { data: subscribers, error: subscribersError } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, name, unsubscribe_token")
    .eq("is_active", true).eq("is_confirmed", true).limit(2000);
  if (subscribersError) throw new Error(subscribersError.message);

  let sent = 0; let failed = 0;
  for (const subscriber of subscribers || []) {
    const template = newsletterCampaignEmail({
      subject: campaign.subject,
      htmlContent: campaign.content,
      name: subscriber.name,
      unsubscribeUrl: `${siteUrl}/bn/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`,
      preferencesUrl: `${siteUrl}/bn/newsletter/preferences?token=${subscriber.unsubscribe_token}`,
    });
    const delivery = await sendEmail({ to: subscriber.email, template, tag: `campaign-${campaign.id}` });
    const succeeded = delivery.status === "sent";
    const { error } = await supabase.from("newsletter_sends").insert({
      campaign_id: campaign.id, subscriber_id: subscriber.id, email: subscriber.email,
      status: succeeded ? "sent" : "failed", sent_at: succeeded ? new Date().toISOString() : null,
      error: succeeded ? null : delivery.error || "Email provider rejected the message",
    });
    if (error) console.error("Newsletter send record failed", error);
    if (succeeded) sent++; else failed++;
  }
  const now = new Date().toISOString();
  await supabase.from("newsletter_campaigns").update({ status: "sent", sent_at: now, sent_count: sent, recipient_count: subscribers?.length || 0 }).eq("id", campaign.id);
  if (sent) await supabase.from("newsletter_subscribers").update({ last_email_sent_at: now }).eq("is_active", true).eq("is_confirmed", true);
  return { sent, failed, recipients: subscribers?.length || 0 };
}
