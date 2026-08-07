"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShieldAlert } from "lucide-react";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { EmptyState, TableSkeleton } from "@/components/ui";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters + pagination
  const [entityFilter, setEntityFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const p = new URLSearchParams();
      if (entityFilter) p.set("entity", entityFilter);
      p.set("limit", String(pageSize));
      p.set("offset", String((page - 1) * pageSize));

      const res = await fetch(`/api/admin/audit-logs?${p.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      setError(
        isBn
          ? "অডিট লগ লোড করা যায়নি। পরে চেষ্টা করুন।"
          : "Unable to load audit logs."
      );
    } finally {
      setLoading(false);
    }
  }, [entityFilter, page, isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      <SectionTitle
        badge={isBn ? "🛡️ অডিট লগ" : "🛡️ Audit Trail"}
        title="Admin Activity Log"
        titleBn="অ্যাডমিন অ্যাক্টিভিটি লগ"
        subtitle={
          isBn
            ? "সিস্টেমে অ্যাডমিনদের সকল কাজের রেকর্ড ও বিস্তারিত ট্রেইল"
            : "Detailed trail of administrative actions across the application"
        }
        locale={locale}
      />

      <GlassCard className="p-6">
        {/* Filter bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: isBn ? "সব" : "All", val: "" },
              { label: "Blog", val: "blog" },
              { label: "Comment", val: "comment" },
              { label: "Settings", val: "settings" },
              { label: "RBAC", val: "rbac" },
            ].map((cat) => (
              <Button
                key={cat.val}
                variant={entityFilter === cat.val ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setEntityFilter(cat.val);
                  setPage(1);
                }}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={loading}
              className="h-8 text-xs"
            >
              {isBn ? "রিফ্রেশ" : "Refresh"}
            </Button>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {/* Content */}
        {loading ? (
          <TableSkeleton rows={5} columns={4} />
        ) : entries.length === 0 ? (
          <EmptyState
            size="sm"
            icon={ShieldAlert}
            title={isBn ? "কোনো অডিট এন্ট্রি নেই" : "No audit entries"}
            description={
              entityFilter
                ? isBn
                  ? "এই ক্যাটাগরিতে কোনো অডিট রেকর্ড পাওয়া যায়নি।"
                  : "No audit records found for this entity filter."
                : isBn
                  ? "এখনো কোনো অডিট রেকর্ড তৈরি হয়নি।"
                  : "No administrative actions have been logged yet."
            }
            action={
              entityFilter
                ? {
                    label: isBn ? "সব লগ দেখুন" : "View All Logs",
                    onClick: () => setEntityFilter(""),
                  }
                : undefined
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">{isBn ? "সময়" : "Time"}</th>
                  <th className="px-4 py-3">{isBn ? "অ্যাকশন" : "Action"}</th>
                  <th className="px-4 py-3">{isBn ? "এনটিটি" : "Entity"}</th>
                  <th className="px-4 py-3">{isBn ? "অভিনেতা" : "Actor"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {new Date(entry.created_at).toLocaleString(
                        isBn ? "bn-BD" : "en-US"
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold">
                      {entry.action}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
                        {entry.entity}
                      </span>
                      {entry.entity_id && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          #{entry.entity_id.slice(0, 6)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      {entry.actor_email || (isBn ? "সিস্টেম" : "System")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3 text-xs text-muted-foreground">
          <span>
            {isBn ? `পৃষ্ঠা ${page}` : `Page ${page}`}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-7 px-2 text-xs"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={entries.length < pageSize || loading}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 px-2 text-xs"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
