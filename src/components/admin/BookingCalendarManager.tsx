"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { EmptyState } from "@/components/ui/empty-state";
import { Loader2, Calendar, Check, X, CheckCircle2 } from "lucide-react";

interface BookingCalendarManagerProps {
  locale?: string;
}

interface BookingRow {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time_slot?: string;
  purpose?: string;
  status?: string;
  created_at?: string;
}

const STATUS_LABELS: Record<string, { bn: string; en: string; variant: "outline" | "warning" | "glow" | "default" }> = {
  pending: { bn: "অপেক্ষমান", en: "Pending", variant: "warning" },
  approved: { bn: "অনুমোদিত", en: "Approved", variant: "glow" },
  cancelled: { bn: "বাতিল", en: "Cancelled", variant: "outline" },
  completed: { bn: "সম্পন্ন", en: "Completed", variant: "default" },
};

function formatDate(value?: string) {
  if (!value) return "—";
  return value;
}

export function BookingCalendarManager({ locale = "bn" }: BookingCalendarManagerProps) {
  const isBn = locale === "bn";
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filter === "all" ? "/api/admin/bookings" : `/api/admin/bookings?status=${filter}`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: BookingRow[] };
      setBookings(json.data ?? []);
    } catch {
      setError(isBn ? "বুকিং লোড করা যায়নি" : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [filter, isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const update = async (id: string, status: string) => {
    setActingId(id);
    try {
      await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      await load();
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {isBn ? "বুকিং লোড হচ্ছে..." : "Loading bookings..."}
      </div>
    );
  }

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="📅"
        title="Appointment Booking Calendar"
        titleBn="অ্যাপয়েন্টমেন্ট বুকিং ক্যালেন্ডার"
        subtitle={isBn ? "ক্লায়েন্ট বুকিং অনুমোদন, পুনঃনির্ধারণ ও বাতিল করুন" : "Approve, reschedule and cancel client bookings"}
        locale={locale}
      />

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: isBn ? "সব" : "All" },
          { key: "pending", label: isBn ? "অপেক্ষমান" : "Pending" },
          { key: "approved", label: isBn ? "অনুমোদিত" : "Approved" },
          { key: "completed", label: isBn ? "সম্পন্ন" : "Completed" },
          { key: "cancelled", label: isBn ? "বাতিল" : "Cancelled" },
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

      {bookings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={isBn ? "কোনো বুকিং নেই" : "No bookings"}
          description={isBn ? "নতুন বুকিং এখানে দেখা যাবে।" : "New bookings will appear here."}
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => {
            const label = STATUS_LABELS[booking.status ?? "pending"];
            return (
              <GlassCard key={booking.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{booking.name || "—"}</span>
                      <Badge variant={label?.variant ?? "outline"}>
                        {isBn ? label?.bn : label?.en}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(booking.date)} · {booking.time_slot || "—"}
                      </span>
                      <span>{booking.email}</span>
                      <span>{booking.phone}</span>
                      {booking.purpose && <span>{booking.purpose}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(booking.status ?? "pending") === "pending" && (
                      <Button size="sm" variant="gradient" disabled={actingId === booking.id} onClick={() => update(booking.id, "approved")}>
                        <Check className="h-4 w-4" />
                        {isBn ? "অনুমোদন" : "Approve"}
                      </Button>
                    )}
                    {(booking.status ?? "pending") === "approved" && (
                      <Button size="sm" variant="outline" disabled={actingId === booking.id} onClick={() => update(booking.id, "completed")}>
                        <CheckCircle2 className="h-4 w-4" />
                        {isBn ? "সম্পন্ন" : "Complete"}
                      </Button>
                    )}
                    {(booking.status ?? "pending") !== "cancelled" && (
                      <Button size="sm" variant="ghost" disabled={actingId === booking.id} onClick={() => update(booking.id, "cancelled")}>
                        <X className="h-4 w-4 text-red-400" />
                        {isBn ? "বাতিল" : "Cancel"}
                      </Button>
                    )}
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
