import "server-only";
import { Resend } from "resend";
import type { EmailTemplate } from "./templates";

export type EmailDeliveryResult = {
  id: string;
  provider: "resend" | "mock";
  status: "sent" | "failed";
  error?: string;
};

/** Sends a transactional email through Resend. A safe mock is used locally when
 * credentials are absent, so development and preview deployments never fail. */
export async function sendEmail(params: {
  to: string;
  template: EmailTemplate;
  tag?: string;
  replyTo?: string;
}): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    const id = `mock_${crypto.randomUUID()}`;
    if (process.env.NODE_ENV !== "production" || process.env.ENABLE_EMAIL_LOG === "true") {
      console.info(`[Email:${params.tag ?? "general"}] mock to=${params.to} subject="${params.template.subject}" id=${id}`);
    }
    void recordEmailDelivery({ providerId: id, recipient: params.to, category: params.tag, status: "sent" });
    return { id, provider: "mock", status: "sent" };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: [params.to],
      subject: params.template.subject,
      html: params.template.html,
      text: params.template.text,
      replyTo: params.replyTo,
      tags: params.tag ? [{ name: "category", value: params.tag.slice(0, 255) }] : undefined,
    });
    if (error || !data?.id) {
      console.error("Resend email failure", error);
      void recordEmailDelivery({ recipient: params.to, category: params.tag, status: "failed", error: error?.message });
      return { id: "", provider: "resend", status: "failed", error: error?.message || "Email provider rejected the message" };
    }
    void recordEmailDelivery({ providerId: data.id, recipient: params.to, category: params.tag, status: "sent" });
    return { id: data.id, provider: "resend", status: "sent" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown email provider failure";
    console.error("Resend email exception", error);
    void recordEmailDelivery({ recipient: params.to, category: params.tag, status: "failed", error: message });
    return { id: "", provider: "resend", status: "failed", error: message };
  }
}

export async function recordEmailDelivery(input: {
  providerId?: string;
  recipient: string;
  category?: string;
  status: "sent" | "delivered" | "bounced" | "complained" | "failed";
  error?: string;
}) {
  const { createServiceClient } = await import("@/lib/supabase/server");
  const supabase = createServiceClient();
  if (!supabase) return;
  const { error } = await supabase.from("email_deliveries").insert({
    provider: "resend",
    provider_id: input.providerId || null,
    recipient: input.recipient,
    category: input.category || "general",
    status: input.status,
    error: input.error || null,
    sent_at: input.status === "sent" ? new Date().toISOString() : null,
  });
  if (error) console.error("Email delivery record failed", error.message);
}
