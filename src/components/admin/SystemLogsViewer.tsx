"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Terminal, ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { Input } from "@/components/ui/input";
import { EmptyState, TableSkeleton } from "@/components/ui";

// ── System Logs Viewer ─────────────────────────────────
// Level-filtered, paginated application log entries.

interface LogEntry {
  id: string;
  level: "debug" | "info" | "warn" | "error";
  source: string;
  message: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface SystemLogsViewerProps {
  locale?: string;
}

const LEVEL_BADGES: Record<
  LogEntry["level"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  debug: "outline",
  info: "secondary",
  warn: "default",
  error: "destructive",
};

export function SystemLogsViewer({ locale = "bn" }: SystemLogsViewerProps) {
  const isBn = locale === "bn";
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [levelFilter, setLevelFilter] = useState<string>("");
  const [sourceSearch, setSourceSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const p = new URLSearchParams();
      if (levelFilter) p.set("level", levelFilter);
      if (sourceSearch) p.set("source", sourceSearch);
      p.set("limit", String(pageSize));
      p.set("offset", String((page - 1) * pageSize));

      const res = await fetch(`/api/admin/logs?${p.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch {
      setError(
        isBn
          ? "সিস্টেম লগ লোড করা যায়নি। পরে চেষ্টা করুন।"
          : "Unable to load system logs."
      );
    } finally {
      setLoading(false);
    }
  }, [levelFilter, sourceSearch, page, isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      <SectionTitle
        badge={isBn ? "🖥️ সিস্টেম লগ" : "🖥️ System Logs"}
        title="Application Runtime Logs"
        titleBn="অ্যাপ্লিকেশন রানটাইম লগ"
        subtitle={
          isBn
            ? "সিস্টেম এরিওর, ওয়ার্নিং এবং বিভিন্ন ইভেন্ট ট্র্যাক করুন"
            : "Track system errors, warnings, and runtime events across services"
        }
        locale={locale}
      />

      <GlassCard className="p-6">
        {/* Filter bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: isBn ? "সব" : "All", val: "" },
              { label: "Error", val: "error" },
              { label: "Warn", val: "warn" },
              { label: "Info", val: "info" },
              { label: "Debug", val: "debug" },
            ].map((lvl) => (
              <Button
                key={lvl.val}
                variant={levelFilter === lvl.val ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setLevelFilter(lvl.val);
                  setPage(1);
                }}
              >
                {lvl.label}
              </Button>
            ))}

            <div className="relative w-40 sm:w-56">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={isBn ? "সোর্স ফিল্টার..." : "Source filter..."}
                value={sourceSearch}
                onChange={(e) => {
                  setSourceSearch(e.target.value);
                  setPage(1);
                }}
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={loading}
              className="h-8 text-xs"
            >
              <RefreshCw className="mr-1 h-3 w-3" />
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
          <TableSkeleton rows={6} columns={4} />
        ) : logs.length === 0 ? (
          <EmptyState
            size="sm"
            icon={Terminal}
            title={isBn ? "কোনো লগ এন্ট্রি নেই" : "No log entries"}
            description={
              levelFilter || sourceSearch
                ? isBn
                  ? "আপনার ফিল্টারের সাথে কোনো লগ রেকর্ড মিলছে না।"
                  : "No logs match your current filter criteria."
                : isBn
                  ? "সিস্টেমে এখনো কোনো লগ রেকর্ড করা হয়নি।"
                  : "No system log entries recorded yet."
            }
            action={
              levelFilter || sourceSearch
                ? {
                    label: isBn ? "ফিল্টার রিসেট করুন" : "Clear Filters",
                    onClick: () => {
                      setLevelFilter("");
                      setSourceSearch("");
                    },
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
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">{isBn ? "বার্তা" : "Message"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString(
                        isBn ? "bn-BD" : "en-US"
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge
                        variant={LEVEL_BADGES[log.level] || "secondary"}
                        className="font-mono text-xs uppercase"
                      >
                        {log.level}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs">
                      {log.source}
                    </td>
                    <td className="max-w-md px-4 py-2.5">
                      <span className="break-words font-mono text-xs text-foreground">
                        {log.message}
                      </span>
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
              disabled={logs.length < pageSize || loading}
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
