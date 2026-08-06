"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionTitle } from "@/components/sections/SectionTitle";

// ── Audit Log Viewer ───────────────────────────────────
// Paginated, filterable table of admin actions.

interface AuditEntry {
  id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  actor_email: string | null;
  metadata: Record<string, unknown>;
  ip: string | null;
  created_at: string;
}

interface AuditLogViewerProps {
  locale?: string;
}

export function AuditLogViewer({ locale = "bn" }: AuditLogViewerProps) {
  const isBn = locale === "bn";
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [action, setAction] = useState("");
  const [entity, setEntity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 30;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
      if (action) params.set("action", action);
      if (entity) params.set("entity", entity);
      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setEntries(json.data || []);
      setTotal(json.pagination?.total ?? 0);
    } catch {
      setError(isBn ? "অডিট লগ লোড করা যায়নি" : "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, [page, action, entity, isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="py-4">
      <SectionTitle
        badge="📜"
        title="Audit Log Viewer"
        titleBn="অডিট লগ ভিউয়ার"
        locale={locale}
      />

      <GlassCard className="mb-6 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            className="flex-1"
            placeholder={isBn ? "অ্যাকশন দিয়ে খুঁজুন (যেমন: user.role_update)..." : "Search by action..."}
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
            }}
          />
          <Input
            className="flex-1"
            placeholder={isBn ? "এনটিটি (যেমন: user, blog)..." : "Entity (e.g. user, blog)..."}
            value={entity}
            onChange={(e) => {
              setEntity(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="mb-4 p-4 text-center text-sm text-red-400">{error}</GlassCard>
      )}

      <GlassCard className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="bn">{isBn ? "লোড হচ্ছে..." : "Loading..."}</span>
          </div>
        ) : entries.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            {isBn ? "কোনো অডিট এন্ট্রি নেই" : "No audit entries"}
          </p>
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">{isBn ? "সময়" : "Time"}</th>
                <th className="px-4 py-3">{isBn ? "অ্যাকশন" : "Action"}</th>
                <th className="px-4 py-3">{isBn ? "এনটিটি" : "Entity"}</th>
                <th className="px-4 py-3">{isBn ? "অভিনেতা" : "Actor"}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-border/30 last:border-0">
                  <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleString(isBn ? "bn-BD" : "en-US")}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs">{entry.action}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{entry.entity}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{entry.actor_email ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex items-center justify-between border-t border-border/40 px-4 py-3 text-sm">
          <span className="text-xs text-muted-foreground">
            {isBn ? `মোট ${total}টি` : `${total} total`}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
