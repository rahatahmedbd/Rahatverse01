"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Terminal, Loader2, ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { Input } from "@/components/ui/input";

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

const levelBadge: Record<string, "secondary" | "info" | "warning" | "destructive"> = {
  debug: "secondary",
  info: "info",
  warn: "warning",
  error: "destructive",
};

export function SystemLogsViewer({ locale = "bn" }: SystemLogsViewerProps) {
  const isBn = locale === "bn";
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [level, setLevel] = useState("all");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 30;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(pageSize), level });
      if (source) params.set("source", source);
      const res = await fetch(`/api/admin/logs?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setLogs(json.data || []);
      setTotal(json.pagination?.total ?? 0);
    } catch {
      setError(isBn ? "লগ লোড করা যায়নি" : "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, [page, level, source, isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="py-4">
      <SectionTitle
        badge="🖥️"
        title="System Logs"
        titleBn="সিস্টেম লগ"
        locale={locale}
      />

      <GlassCard className="mb-6 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {["all", "debug", "info", "warn", "error"].map((l) => (
            <Button
              key={l}
              size="sm"
              variant={level === l ? "default" : "outline"}
              onClick={() => {
                setLevel(l);
                setPage(1);
              }}
            >
              {l}
            </Button>
          ))}
          <div className="relative ml-auto w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder={isBn ? "সোর্স..." : "Source..."}
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button variant="ghost" size="icon-sm" onClick={fetchLogs}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="mb-4 p-4 text-center text-sm text-red-400">{error}</GlassCard>
      )}

      <GlassCard className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            {isBn ? "কোনো লগ এন্ট্রি নেই" : "No log entries"}
          </p>
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">{isBn ? "সময়" : "Time"}</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">{isBn ? "বার্তা" : "Message"}</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border/30 last:border-0">
                  <td className="whitespace-nowrap px-4 py-2.5 text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString(isBn ? "bn-BD" : "en-US")}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant={levelBadge[log.level] ?? "secondary"}>{log.level}</Badge>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs">{log.source}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-start gap-2">
                      <Terminal className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="break-words font-mono text-xs">{log.message}</span>
                    </div>
                  </td>
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
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-muted-foreground">{page} / {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
