import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";

export const dynamic = "force-dynamic";

// ── Recent Activities Feed ─────────────────────────────
// Merges audit log entries with the newest orders, messages and newsletter
// subscribers into a single reverse-chronological feed for the dashboard.
// Admin-only.

const ACTIVITY_LIMIT = 20;

export async function GET() {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [auditResult, ordersResult, messagesResult, subsResult] = await Promise.all([
    supabase
      .from("audit_logs")
      .select("id, action, entity, entity_id, metadata, actor_email, created_at")
      .order("created_at", { ascending: false })
      .limit(ACTIVITY_LIMIT),
    supabase
      .from("orders")
      .select("id, client_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(ACTIVITY_LIMIT),
    supabase
      .from("messages")
      .select("id, name, subject, created_at")
      .order("created_at", { ascending: false })
      .limit(ACTIVITY_LIMIT),
    supabase
      .from("newsletter_subscribers")
      .select("id, email, name, is_confirmed, subscribed_at")
      .order("subscribed_at", { ascending: false })
      .limit(ACTIVITY_LIMIT),
  ]);

  const items: Array<{
    id: string;
    type: "audit" | "order" | "message" | "subscriber";
    title: string;
    detail: string;
    createdAt: string;
  }> = [];

  for (const log of auditResult.data ?? []) {
    items.push({
      id: `audit-${log.id}`,
      type: "audit",
      title: log.action,
      detail: log.actor_email ?? "admin",
      createdAt: log.created_at,
    });
  }
  for (const order of ordersResult.data ?? []) {
    items.push({
      id: `order-${order.id}`,
      type: "order",
      title: order.client_name,
      detail: `${order.status} order`,
      createdAt: order.created_at,
    });
  }
  for (const message of messagesResult.data ?? []) {
    items.push({
      id: `message-${message.id}`,
      type: "message",
      title: message.name,
      detail: message.subject,
      createdAt: message.created_at,
    });
  }
  for (const sub of subsResult.data ?? []) {
    items.push({
      id: `sub-${sub.id}`,
      type: "subscriber",
      title: sub.email,
      detail: sub.is_confirmed ? "confirmed" : "pending",
      createdAt: sub.subscribed_at,
    });
  }

  items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  items.splice(ACTIVITY_LIMIT);

  return NextResponse.json({ data: items });
}
