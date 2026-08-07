"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Loader2,
  Siren,
  Droplets,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

interface BloodRequestsManagerProps {
  locale?: string;
}

interface BloodRequestRow {
  id: string;
  name?: string;
  phone?: string;
  blood_group?: string;
  location?: string;
  urgency?: string;
  message?: string;
  status?: string;
  admin_notes?: string | null;
  created_at?: string;
}

const URGENCY_LABELS: Record<string, { bn: string; en: string; variant: "outline" | "warning" | "glow" }> = {
  normal: { bn: "সাধারণ", en: "Normal", variant: "outline" },
  urgent: { bn: "জরুরি", en: "Urgent", variant: "warning" },
  critical: { bn: "ক্রিটিক্যাল", en: "Critical", variant: "glow" },
};

function formatDate(value?: string, isBn = false) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(isBn ? "bn-BD" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function BloodRequestsManager({ locale = "bn" }: BloodRequestsManagerProps) {
  const isBn = locale === "bn";
  const [requests, setRequests] = useState<BloodRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/blood-requests", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: BloodRequestRow[] };
      setRequests(json.data ?? []);
    } catch {
      setError(isBn ? "রক্ত অনুরোধ লোড করা যায়নি" : "Failed to load blood requests");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const updateStatus = async (id: string, status: string, admin_notes?: string) => {
    setSavingId(id);
    setError(null);
    try {
      const response = await fetch("/api/admin/blood-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, admin_notes: admin_notes ?? "" }),
      });
      const json = (await response.json()) as { error?: string; data?: BloodRequestRow };
      if (!response.ok) throw new Error(json.error || "Save failed");
      if (json.data) {
        setRequests((prev) => prev.map((r) => (r.id === id ? json.data as BloodRequestRow : r)));
      }
      await load();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : isBn ? "সংরক্ষণ ব্যর্থ" : "Save failed");
    } finally {
      setSavingId(null);
    }
  };

  const filtered = filter === "all" ? requests : requests.filter((r) => (r.status ?? "open") === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {isBn ? "অনুরোধ লোড হচ্ছে..." : "Loading requests..."}
      </div>
    );
  }

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="🩸"
        title="Incoming Blood Requests"
        titleBn="আগত রক্ত অনুরোধ"
        subtitle={
          isBn
            ? "শান্তিচক্র ব্লাড সোসাইটিতে জরুরি রক্তের অনুরোধ দেখুন ও সাড়া দিন"
            : "View and respond to emergency blood requests for Shantichakra Blood Society"
        }
        locale={locale}
      />

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: isBn ? "সব" : "All" },
          { key: "open", label: isBn ? "খোলা" : "Open" },
          { key: "responded", label: isBn ? "সাড়া দেওয়া" : "Responded" },
          { key: "closed", label: isBn ? "বন্ধ" : "Closed" },
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={Droplets}
          title={isBn ? "কোনো অনুরোধ নেই" : "No requests"}
          description={
            isBn
              ? "এখনো কোনো রক্ত অনুরোধ আসেনি।"
              : "No blood requests have arrived yet."
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((request) => {
            const urgency = URGENCY_LABELS[request.urgency ?? "normal"];
            const notes = notesDraft[request.id] ?? request.admin_notes ?? "";
            return (
              <GlassCard key={request.id} className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{request.name || "—"}</span>
                      <Badge variant="glow" className="text-xs">
                        <Droplets className="mr-1 h-3 w-3" /> {request.blood_group || "—"}
                      </Badge>
                      <Badge variant={urgency?.variant ?? "outline"} className="text-xs">
                        <Siren className="mr-1 h-3 w-3" />
                        {isBn ? urgency?.bn : urgency?.en}
                      </Badge>
                      <Badge
                        variant={(request.status ?? "open") === "open" ? "warning" : "default"}
                        className="text-xs"
                      >
                        {isBn
                          ? (request.status ?? "open") === "open"
                            ? "খোলা"
                            : (request.status ?? "open") === "responded"
                              ? "সাড়া দেওয়া"
                              : "বন্ধ"
                          : request.status ?? "open"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {request.location || "—"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {request.phone || "—"}
                      </span>
                      <span>{formatDate(request.created_at, isBn)}</span>
                    </div>
                    {request.message && (
                      <p className="mt-2 rounded-lg bg-background p-3 text-sm bn">{request.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-border/40 pt-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        {isBn ? "অ্যাডমিন নোট" : "Admin notes"}
                      </div>
                      <Textarea
                        rows={1}
                        value={notes}
                        onChange={(e) => setNotesDraft((prev) => ({ ...prev, [request.id]: e.target.value }))}
                        placeholder={isBn ? "প্রাইভেট নোট লিখুন..." : "Write private notes..."}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {(request.status ?? "open") !== "responded" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={savingId === request.id}
                          onClick={() => updateStatus(request.id, "responded", notes)}
                        >
                          {isBn ? "সাড়া দিয়েছেন" : "Mark Responded"}
                        </Button>
                      )}
                      {(request.status ?? "open") !== "closed" && (
                        <Button
                          size="sm"
                          variant="gradient"
                          disabled={savingId === request.id}
                          onClick={() => updateStatus(request.id, "closed", notes)}
                        >
                          {savingId === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                          {isBn ? "বন্ধ করুন" : "Close"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </section>
  );
}
