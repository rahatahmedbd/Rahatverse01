import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/supabase/guards";
import { logAudit, getClientIp } from "@/lib/admin/audit";
import {
  ORDER_KANBAN_STAGES,
  ORDER_PAYMENT_METHODS,
  ORDER_PAYMENT_STATUSES,
  normalizeStage,
} from "@/types/orders";
import type {
  OrderCommunicationEntry,
  OrderKanbanStage,
  OrderPayment,
  OrderPaymentMethod,
  OrderPaymentMilestone,
  OrderPaymentStatus,
  OrderProjectLinks,
} from "@/types/orders";

export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isShortText(value: unknown): boolean {
  return typeof value === "string" && value.length <= 500;
}

function isOptionalUrl(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  return (
    typeof value === "string" &&
    value.length <= 1000 &&
    (value.startsWith("https://") || value.startsWith("/"))
  );
}

function validateProjectLinks(value: unknown): OrderProjectLinks | null {
  if (value === undefined || value === null) return {};
  if (!isRecord(value)) return null;
  const links: OrderProjectLinks = {};
  if (isOptionalUrl(value.repo)) links.repo = (value.repo as string) || undefined;
  if (isOptionalUrl(value.staging)) links.staging = (value.staging as string) || undefined;
  if (isOptionalUrl(value.figma)) links.figma = (value.figma as string) || undefined;
  if (isOptionalUrl(value.live)) links.live = (value.live as string) || undefined;
  return links;
}

function validateMilestones(value: unknown): OrderPaymentMilestone[] | null {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > 30) return null;
  const milestones: OrderPaymentMilestone[] = [];
  for (const item of value) {
    if (!isRecord(item)) return null;
    if (typeof item.id !== "string" || item.id.length > 80) return null;
    if (typeof item.labelBn !== "string" || item.labelBn.length > 200) return null;
    if (typeof item.labelEn !== "string" || item.labelEn.length > 200) return null;
    const amount = Number(item.amount);
    if (!Number.isFinite(amount) || amount < 0 || amount > 100_000_000) return null;
    if (typeof item.paid !== "boolean") return null;
    milestones.push({
      id: item.id,
      labelBn: item.labelBn,
      labelEn: item.labelEn,
      amount,
      paid: item.paid,
      paidAt: typeof item.paidAt === "string" ? item.paidAt.slice(0, 200) : undefined,
      method: ORDER_PAYMENT_METHODS.includes(item.method as OrderPaymentMethod)
        ? (item.method as OrderPaymentMethod)
        : undefined,
      reference: typeof item.reference === "string" ? item.reference.slice(0, 200) : undefined,
    });
  }
  return milestones;
}

function validatePayment(value: unknown): OrderPayment | null {
  if (value === undefined || value === null) {
    return { status: "unpaid" };
  }
  if (!isRecord(value)) return null;
  if (!ORDER_PAYMENT_STATUSES.includes(value.status as OrderPaymentStatus)) return null;

  const advanceAmount =
    value.advanceAmount === undefined || value.advanceAmount === null
      ? undefined
      : Number(value.advanceAmount);
  if (
    advanceAmount !== undefined &&
    (!Number.isFinite(advanceAmount) || advanceAmount < 0 || advanceAmount > 100_000_000)
  ) {
    return null;
  }

  const totalAmount =
    value.totalAmount === undefined || value.totalAmount === null
      ? undefined
      : Number(value.totalAmount);
  if (
    totalAmount !== undefined &&
    (!Number.isFinite(totalAmount) || totalAmount < 0 || totalAmount > 100_000_000)
  ) {
    return null;
  }

  const payment: OrderPayment = {
    status: value.status as OrderPaymentStatus,
    method: ORDER_PAYMENT_METHODS.includes(value.method as OrderPaymentMethod)
      ? (value.method as OrderPaymentMethod)
      : undefined,
    advanceAmount,
    totalAmount,
    currency: typeof value.currency === "string" ? value.currency.slice(0, 20) : undefined,
    milestones: validateMilestones(value.milestones) ?? undefined,
  };
  return payment;
}

function validateCommunicationLog(value: unknown): OrderCommunicationEntry[] | null {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > 200) return null;
  const entries: OrderCommunicationEntry[] = [];
  for (const item of value) {
    if (!isRecord(item)) return null;
    if (typeof item.id !== "string" || item.id.length > 80) return null;
    if (!isShortText(item.date)) return null;
    if (!isShortText(item.authorBn)) return null;
    if (!isShortText(item.authorEn)) return null;
    if (!isShortText(item.messageBn)) return null;
    if (!isShortText(item.messageEn)) return null;
    entries.push({
      id: String(item.id),
      date: String(item.date),
      authorBn: String(item.authorBn),
      authorEn: String(item.authorEn),
      messageBn: String(item.messageBn),
      messageEn: String(item.messageEn),
    });
  }
  return entries;
}

// PATCH /api/admin/orders — admin-only partial update of an order's pipeline,
// private notes, project links, payment status and communication log.
export async function PATCH(request: Request) {
  const { supabase, user, isAdmin } = await getCurrentUserContext();

  if (!supabase) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body: unknown = await request.json();
    if (!isRecord(body)) return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    if (typeof body.id !== "string" || !body.id) {
      return NextResponse.json({ error: "Order id is required" }, { status: 400 });
    }

    const update: Record<string, unknown> = {};

    if (body.status !== undefined) {
      const stage = normalizeStage(body.status as string);
      if (!ORDER_KANBAN_STAGES.includes(stage as OrderKanbanStage)) {
        return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
      }
      update.status = stage;
    }

    if (body.admin_notes !== undefined) {
      if (body.admin_notes !== null && !isShortText(body.admin_notes)) {
        return NextResponse.json({ error: "admin_notes too long" }, { status: 400 });
      }
      update.admin_notes = body.admin_notes || null;
    }

    if (body.project_links !== undefined) {
      const links = validateProjectLinks(body.project_links);
      if (!links) return NextResponse.json({ error: "Invalid project_links" }, { status: 400 });
      update.project_links = links;
    }

    if (body.payment !== undefined) {
      const payment = validatePayment(body.payment);
      if (!payment) return NextResponse.json({ error: "Invalid payment payload" }, { status: 400 });
      update.payment = payment;
      // Mirror the primary status onto the legacy scalar column when provided.
      if (payment.status) update.payment_status = payment.status;
      if (payment.totalAmount !== undefined) update.payment_amount = payment.totalAmount;
    }

    if (body.communication_log !== undefined) {
      const log = validateCommunicationLog(body.communication_log);
      if (!log) return NextResponse.json({ error: "Invalid communication_log" }, { status: 400 });
      update.communication_log = log;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }
    update.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("orders")
      .update(update)
      .eq("id", body.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    await logAudit({
      action: "orders.update",
      entity: "orders",
      entityId: body.id,
      metadata: { fields: Object.keys(update).filter((k) => k !== "updated_at") },
      ip: getClientIp(request),
    });

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
