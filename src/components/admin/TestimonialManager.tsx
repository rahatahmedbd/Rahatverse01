"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { EmptyState } from "@/components/ui/empty-state";
import { Loader2, Star, Check, Trash2 } from "lucide-react";

interface TestimonialManagerProps {
  locale?: string;
}

interface TestimonialRow {
  id: string;
  name?: string;
  role?: string;
  company?: string;
  content?: string;
  rating?: number;
  is_approved?: boolean;
  featured?: boolean;
  created_at?: string;
}

export function TestimonialManager({ locale = "bn" }: TestimonialManagerProps) {
  const isBn = locale === "bn";
  const [items, setItems] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [actingId, setActingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<TestimonialRow>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filter === "all" ? "/api/admin/testimonials" : `/api/admin/testimonials?status=${filter}`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: TestimonialRow[] };
      setItems(json.data ?? []);
    } catch {
      setError(isBn ? "রিভিউ লোড করা যায়নি" : "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, [filter, isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const patch = async (id: string, body: Record<string, unknown>) => {
    setActingId(id);
    try {
      await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...body }),
      });
      await load();
    } finally {
      setActingId(null);
    }
  };

  const remove = async (id: string) => {
    setActingId(id);
    try {
      await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      await load();
    } finally {
      setActingId(null);
    }
  };

  const startEdit = (item: TestimonialRow) => {
    setEditingId(item.id);
    setDraft({ name: item.name, role: item.role, company: item.company, content: item.content, rating: item.rating });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    await patch(editingId, draft);
    setEditingId(null);
    setDraft({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {isBn ? "রিভিউ লোড হচ্ছে..." : "Loading testimonials..."}
      </div>
    );
  }

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="⭐"
        title="Testimonials & Reviews Manager"
        titleBn="টেস্টিমোনিয়াল ও রিভিউ ম্যানেজার"
        subtitle={isBn ? "ক্লায়েন্ট রিভিউ যোগ, অনুমোদন ও সম্পাদনা করুন" : "Add, approve and edit client reviews"}
        locale={locale}
      />

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: isBn ? "সব" : "All" },
          { key: "pending", label: isBn ? "অনুমোদন pending" : "Pending" },
          { key: "approved", label: isBn ? "অনুমোদিত" : "Approved" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Star}
          title={isBn ? "কোনো রিভিউ নেই" : "No testimonials"}
          description={isBn ? "জমা পড়া রিভিউ এখানে দেখা যাবে।" : "Submitted reviews will appear here."}
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <GlassCard key={item.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.name || "—"}</span>
                  <span className="text-xs text-muted-foreground">{item.role} {item.company ? `· ${item.company}` : ""}</span>
                  <Badge variant={item.is_approved ? "success" : "warning"}>
                    {item.is_approved ? (isBn ? "অনুমোদিত" : "Approved") : isBn ? "Pending" : "Pending"}
                  </Badge>
                  {item.featured && (
                    <Badge variant="glow" className="text-[10px]">{isBn ? "ফিচার্ড" : "Featured"}</Badge>
                  )}
                  <span className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: item.rating ?? 0 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3" fill="currentColor" />
                    ))}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {!item.is_approved && (
                    <Button size="sm" variant="gradient" disabled={actingId === item.id} onClick={() => patch(item.id, { is_approved: true })}>
                      <Check className="h-4 w-4" />
                      {isBn ? "অনুমোদন" : "Approve"}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" disabled={actingId === item.id} onClick={() => startEdit(item)}>
                    {isBn ? "সম্পাদনা" : "Edit"}
                  </Button>
                  <Button size="sm" variant="ghost" disabled={actingId === item.id} onClick={() => remove(item.id)}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{item.content}</p>

              {editingId === item.id && (
                <div className="mt-4 space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input value={draft.name ?? ""} onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))} placeholder={isBn ? "নাম" : "Name"} />
                    <Input value={draft.role ?? ""} onChange={(e) => setDraft((prev) => ({ ...prev, role: e.target.value }))} placeholder={isBn ? "পদবি" : "Role"} />
                    <Input value={draft.company ?? ""} onChange={(e) => setDraft((prev) => ({ ...prev, company: e.target.value }))} placeholder={isBn ? "কোম্পানি" : "Company"} />
                    <Input type="number" min={1} max={5} value={draft.rating ?? 5} onChange={(e) => setDraft((prev) => ({ ...prev, rating: Number(e.target.value) || 5 }))} placeholder="Rating" />
                  </div>
                  <Textarea rows={2} value={draft.content ?? ""} onChange={(e) => setDraft((prev) => ({ ...prev, content: e.target.value }))} placeholder={isBn ? "রিভিউ টেক্সট" : "Review text"} />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditingId(null); setDraft({}); }}>{isBn ? "বাতিল" : "Cancel"}</Button>
                    <Button size="sm" variant="gradient" onClick={saveEdit}>{isBn ? "সংরক্ষণ" : "Save"}</Button>
                  </div>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </section>
  );
}
