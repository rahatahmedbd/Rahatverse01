"use client";

import { useCallback, useEffect, useState } from "react";
import type { DragEvent } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Loader2,
  ShoppingCart,
  Save,
  Plus,
  Trash2,
  Link2,
  CreditCard,
  MessageSquare,
  GripVertical,
  Package,
  Mail,
  Phone,
} from "lucide-react";
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

// ── Kanban Order Pipeline + Payment Tracking (admin) ──

interface OrderKanbanBoardProps {
  locale?: string;
}

interface OrderRow {
  id: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  client_company?: string;
  package_type?: string;
  website_type?: string;
  description?: string;
  budget_range?: string;
  timeline?: string;
  status?: string | null;
  admin_notes?: string | null;
  project_links?: OrderProjectLinks | null;
  payment?: OrderPayment | null;
  communication_log?: OrderCommunicationEntry[] | null;
  created_at?: string;
  [key: string]: unknown;
}

const STAGE_LABELS: Record<OrderKanbanStage, { bn: string; en: string; color: string }> = {
  new_lead: { bn: "নতুন লিড", en: "New Lead", color: "border-blue-500/40" },
  under_review: { bn: "রিভিউ চলছে", en: "Under Review", color: "border-amber-500/40" },
  in_progress: { bn: "চলমান", en: "In Progress", color: "border-cyan-500/40" },
  client_feedback: { bn: "ক্লায়েন্ট ফিডব্যাক", en: "Client Feedback", color: "border-purple-500/40" },
  completed: { bn: "সম্পন্ন", en: "Completed", color: "border-green-500/40" },
  archived: { bn: "আর্কাইভ", en: "Archived", color: "border-slate-500/40" },
};

const PAYMENT_LABELS: Record<OrderPaymentStatus, { bn: string; en: string; variant: "outline" | "secondary" | "glow" | "default" }> = {
  unpaid: { bn: "অপরিশোধিত", en: "Unpaid", variant: "outline" },
  pending_advance: { bn: "অগ্রিম অপেক্ষমান", en: "Pending Advance", variant: "secondary" },
  fifty_percent: { bn: "৫০% পরিশোধিত", en: "50% Paid", variant: "glow" },
  fully_settled: { bn: "সম্পূর্ণ পরিশোধিত", en: "Fully Settled", variant: "default" },
  refunded: { bn: "রিফান্ডকৃত", en: "Refunded", variant: "outline" },
};

const METHOD_LABELS: Record<OrderPaymentMethod, { bn: string; en: string }> = {
  bkash: { bn: "বিকাশ", en: "bKash" },
  nagad: { bn: "নগদ", en: "Nagad" },
  bank_transfer: { bn: "ব্যাংক ট্রান্সফার", en: "Bank Transfer" },
  sslcommerz: { bn: "SSLCommerz", en: "SSLCommerz" },
  other: { bn: "অন্যান্য", en: "Other" },
};

function newEntryId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatDate(value?: string, isBn = false) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(isBn ? "bn-BD" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function OrderKanbanBoard({ locale = "bn" }: OrderKanbanBoardProps) {
  const isBn = locale === "bn";
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<OrderRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<OrderRow | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/orders", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: OrderRow[] };
      setOrders(json.data ?? []);
    } catch {
      setError(isBn ? "অর্ডার লোড করা যায়নি" : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadOrders();
  }, [loadOrders]);

  const grouped = (stage: OrderKanbanStage) =>
    orders.filter((o) => normalizeStage(o.status) === stage);

  const openOrder = (order: OrderRow) => {
    setDraft(JSON.parse(JSON.stringify(order)));
    setSelected(order);
    setSaveMsg(null);
  };

  const persistUpdate = async (id: string, patch: Record<string, unknown>) => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const json = (await response.json()) as { error?: string; data?: OrderRow };
      if (!response.ok) throw new Error(json.error || "Save failed");
      if (json.data) {
        setOrders((prev) => prev.map((o) => (o.id === id ? json.data as OrderRow : o)));
        setDraft(json.data as OrderRow);
        setSelected(json.data as OrderRow);
      }
      setSaveMsg(isBn ? "সংরক্ষিত হয়েছে" : "Saved");
    } catch (saveError) {
      setSaveMsg(saveError instanceof Error ? saveError.message : isBn ? "সংরক্ষণ ব্যর্থ" : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const moveStage = (id: string, stage: OrderKanbanStage) => {
    void persistUpdate(id, { status: stage });
  };

  const onDragStart = (e: DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(id);
  };
  const onDragOver = (e: DragEvent) => e.preventDefault();
  const onDrop = (e: DragEvent, stage: OrderKanbanStage) => {
    e.preventDefault();
    if (draggingId) moveStage(draggingId, stage);
    setDraggingId(null);
  };

  const updateDraft = <K extends keyof OrderRow>(key: K, value: OrderRow[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateProjectLink = (key: keyof OrderProjectLinks, value: string) => {
    setDraft((prev) =>
      prev
        ? { ...prev, project_links: { ...(prev.project_links ?? {}), [key]: value } }
        : prev
    );
  };

  const updatePayment = (patch: Partial<OrderPayment>) => {
    setDraft((prev) =>
      prev
        ? { ...prev, payment: { ...(prev.payment ?? { status: "unpaid" }), ...patch } }
        : prev
    );
  };

  const updateMilestone = (index: number, patch: Partial<OrderPaymentMilestone>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const milestones = prev.payment?.milestones ?? [];
      const next = milestones.map((m, i) => (i === index ? { ...m, ...patch } : m));
      return { ...prev, payment: { ...(prev.payment ?? { status: "unpaid" }), milestones: next } };
    });
  };

  const addMilestone = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      const milestones = prev.payment?.milestones ?? [];
      const entry: OrderPaymentMilestone = {
        id: newEntryId("ms"),
        labelBn: "নতুন মাইলস্টোন",
        labelEn: "New milestone",
        amount: 0,
        paid: false,
      };
      return { ...prev, payment: { ...(prev.payment ?? { status: "unpaid" }), milestones: [...milestones, entry] } };
    });
  };

  const removeMilestone = (index: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const milestones = prev.payment?.milestones ?? [];
      const next = milestones.filter((_, i) => i !== index);
      return { ...prev, payment: { ...(prev.payment ?? { status: "unpaid" }), milestones: next } };
    });
  };

  const addLogEntry = () => {
    setDraft((prev) => {
      if (!prev) return prev;
      const log = prev.communication_log ?? [];
      const entry: OrderCommunicationEntry = {
        id: newEntryId("log"),
        date: new Date().toISOString().slice(0, 10),
        authorBn: "অ্যাডমিন",
        authorEn: "Admin",
        messageBn: "",
        messageEn: "",
      };
      return { ...prev, communication_log: [...log, entry] };
    });
  };

  const updateLogEntry = (index: number, patch: Partial<OrderCommunicationEntry>) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const log = prev.communication_log ?? [];
      const next = log.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
      return { ...prev, communication_log: next };
    });
  };

  const removeLogEntry = (index: number) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const log = prev.communication_log ?? [];
      const next = log.filter((_, i) => i !== index);
      return { ...prev, communication_log: next };
    });
  };

  const saveDraft = () => {
    if (!draft) return;
    void persistUpdate(draft.id, {
      status: draft.status,
      admin_notes: draft.admin_notes ?? "",
      project_links: draft.project_links ?? {},
      payment: draft.payment ?? { status: "unpaid" },
      communication_log: draft.communication_log ?? [],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {isBn ? "অর্ডার লোড হচ্ছে..." : "Loading orders..."}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>
    );
  }

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="🗂️"
        title="Order Pipeline (Kanban)"
        titleBn="অর্ডার পাইপলাইন (কানবান)"
        subtitle={
          isBn
            ? "কার্ড টেনে আনুন বা ▶ বোতামে ক্লিক করে অর্ডার এক ধাপ এগিয়ে নিন"
            : "Drag cards between columns or use the arrows to move orders through the pipeline"
        }
        locale={locale}
      />

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title={isBn ? "এখনো কোনো অর্ডার নেই" : "No orders yet"}
          description={
            isBn
              ? "ওয়েবসাইট ফর্ম থেকে নতুন অর্ডার জমা দিলে এখানে দেখা যাবে।"
              : "Orders submitted through the website form will appear here."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ORDER_KANBAN_STAGES.map((stage) => {
            const items = grouped(stage);
            const label = STAGE_LABELS[stage];
            return (
              <div
                key={stage}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, stage)}
                className={`flex flex-col rounded-2xl border bg-card/40 p-3 ${label.color}`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold bn">{isBn ? label.bn : label.en}</span>
                  <Badge variant="outline">{items.length}</Badge>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  {items.map((order) => (
                    <button
                      key={order.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, order.id)}
                      onClick={() => openOrder(order)}
                      className="group w-full rounded-xl border border-border/60 bg-background p-3 text-left transition-all hover:border-primary/40 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-semibold">
                          {order.client_name || "—"}
                        </span>
                        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground opacity-50 group-hover:opacity-100" />
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Package className="h-3 w-3" />
                        <span>{(order.package_type || "—").charAt(0).toUpperCase() + (order.package_type || "").slice(1)}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary">
                          {order.budget_range || "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(order.created_at, isBn)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5">
                        {(() => {
                          const paymentStatus = (order.payment?.status ?? "unpaid") as OrderPaymentStatus;
                          const pl = PAYMENT_LABELS[paymentStatus];
                          return (
                            <Badge variant={pl?.variant ?? "outline"} className="text-[10px]">
                              {isBn ? pl?.bn : pl?.en}
                            </Badge>
                          );
                        })()}
                      </div>
                    </button>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border/50 p-4 text-center text-xs text-muted-foreground">
                      {isBn ? "খালি" : "Empty"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order detail / edit dialog */}
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          {draft && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {draft.client_name || "—"} {draft.client_company ? `· ${draft.client_company}` : ""}
                </DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{draft.client_email || "—"}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{draft.client_phone || "—"}</span>
                    <span>{formatDate(draft.created_at, isBn)}</span>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Stage */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {isBn ? "পাইপলাইন স্টেজ" : "Pipeline stage"}
                  </label>
                  <select
                    value={normalizeStage(draft.status)}
                    onChange={(e) => updateDraft("status", e.target.value as OrderKanbanStage)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {ORDER_KANBAN_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {isBn ? STAGE_LABELS[stage].bn : STAGE_LABELS[stage].en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment status */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {isBn ? "পেমেন্ট স্ট্যাটাস" : "Payment status"}
                  </label>
                  <select
                    value={draft.payment?.status ?? "unpaid"}
                    onChange={(e) => updatePayment({ status: e.target.value as OrderPaymentStatus })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {ORDER_PAYMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {isBn ? PAYMENT_LABELS[status].bn : PAYMENT_LABELS[status].en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment method */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    {isBn ? "পেমেন্ট মাধ্যম" : "Payment method"}
                  </label>
                  <select
                    value={draft.payment?.method ?? ""}
                    onChange={(e) =>
                      updatePayment({ method: (e.target.value || undefined) as OrderPaymentMethod | undefined })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">—</option>
                    {ORDER_PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>
                        {isBn ? METHOD_LABELS[method].bn : METHOD_LABELS[method].en}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      {isBn ? "মোট দাম (৳)" : "Total (৳)"}
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={draft.payment?.totalAmount ?? ""}
                      onChange={(e) => updatePayment({ totalAmount: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      {isBn ? "অগ্রিম (৳)" : "Advance (৳)"}
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={draft.payment?.advanceAmount ?? ""}
                      onChange={(e) => updatePayment({ advanceAmount: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Project links */}
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">{isBn ? "প্রজেক্ট লিংক ও ফাইল" : "Project links & files"}</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input value={draft.project_links?.repo ?? ""} onChange={(e) => updateProjectLink("repo", e.target.value)} placeholder={isBn ? "রিপোজিটরি URL" : "Repository URL"} />
                  <Input value={draft.project_links?.staging ?? ""} onChange={(e) => updateProjectLink("staging", e.target.value)} placeholder={isBn ? "স্টেজিং URL" : "Staging URL"} />
                  <Input value={draft.project_links?.figma ?? ""} onChange={(e) => updateProjectLink("figma", e.target.value)} placeholder={isBn ? "Figma লিংক" : "Figma link"} />
                  <Input value={draft.project_links?.live ?? ""} onChange={(e) => updateProjectLink("live", e.target.value)} placeholder={isBn ? "লাইভ URL" : "Live URL"} />
                </div>
              </div>

              {/* Admin notes */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  {isBn ? "ব্যক্তিগত অ্যাডমিন নোট" : "Private admin notes"}
                </label>
                <Textarea
                  rows={2}
                  value={draft.admin_notes ?? ""}
                  onChange={(e) => updateDraft("admin_notes", e.target.value)}
                  placeholder={isBn ? "অ্যাডমিন নোট লিখুন..." : "Write private admin notes..."}
                />
              </div>

              {/* Payment milestones */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">{isBn ? "পেমেন্ট মাইলস্টোন" : "Payment milestones"}</h3>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={addMilestone}>
                    <Plus className="h-4 w-4" /> {isBn ? "মাইলস্টোন" : "Milestone"}
                  </Button>
                </div>
                <div className="space-y-2">
                  {(draft.payment?.milestones ?? []).map((ms, index) => (
                    <div key={ms.id} className="grid grid-cols-2 gap-2 rounded-lg border border-border/50 p-2 sm:grid-cols-5">
                      <Input value={ms.labelBn} onChange={(e) => updateMilestone(index, { labelBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
                      <Input value={ms.labelEn} onChange={(e) => updateMilestone(index, { labelEn: e.target.value })} placeholder="English" className="text-xs" />
                      <Input type="number" min={0} value={ms.amount} onChange={(e) => updateMilestone(index, { amount: Number(e.target.value) || 0 })} placeholder="৳" className="text-xs" />
                      <label className="flex items-center gap-1 text-xs text-muted-foreground">
                        <input type="checkbox" checked={ms.paid} onChange={(e) => updateMilestone(index, { paid: e.target.checked })} />
                        {isBn ? "পরিশোধিত" : "Paid"}
                      </label>
                      <Button type="button" size="icon-sm" variant="ghost" onClick={() => removeMilestone(index)} aria-label="Remove">
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  ))}
                  {(draft.payment?.milestones ?? []).length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      {isBn ? "কোনো মাইলস্টোন নেই" : "No milestones yet"}
                    </p>
                  )}
                </div>
              </div>

              {/* Communication log */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">{isBn ? "ক্লায়েন্ট কমিউনিকেশন লগ" : "Client communication log"}</h3>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={addLogEntry}>
                    <Plus className="h-4 w-4" /> {isBn ? "এন্ট্রি" : "Entry"}
                  </Button>
                </div>
                <div className="space-y-2">
                  {(draft.communication_log ?? []).map((entry, index) => (
                    <div key={entry.id} className="space-y-2 rounded-lg border border-border/50 p-2">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <Input value={entry.date} onChange={(e) => updateLogEntry(index, { date: e.target.value })} placeholder="তারিখ" className="text-xs" />
                        <Input value={entry.authorBn} onChange={(e) => updateLogEntry(index, { authorBn: e.target.value })} placeholder="লেখক (বাংলা)" className="text-xs" />
                        <Input value={entry.authorEn} onChange={(e) => updateLogEntry(index, { authorEn: e.target.value })} placeholder="Author" className="text-xs" />
                        <Button type="button" size="icon-sm" variant="ghost" onClick={() => removeLogEntry(index)} aria-label="Remove">
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                      <Input value={entry.messageBn} onChange={(e) => updateLogEntry(index, { messageBn: e.target.value })} placeholder={isBn ? "বার্তা (বাংলা)" : "Message (Bangla)"} className="text-xs" />
                      <Input value={entry.messageEn} onChange={(e) => updateLogEntry(index, { messageEn: e.target.value })} placeholder="Message (English)" className="text-xs" />
                    </div>
                  ))}
                  {(draft.communication_log ?? []).length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      {isBn ? "কোনো এন্ট্রি নেই" : "No communication entries yet"}
                    </p>
                  )}
                </div>
              </div>

              {saveMsg && (
                <div className={`rounded-lg p-3 text-sm ${saveMsg.includes(isBn ? "সফল" : "Saved") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {saveMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setSelected(null)}>
                  {isBn ? "বন্ধ করুন" : "Close"}
                </Button>
                <Button type="button" variant="gradient" onClick={saveDraft} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isBn ? "সংরক্ষণ করুন" : "Save"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
