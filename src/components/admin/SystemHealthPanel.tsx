"use client";

import { useEffect, useState, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeInUp } from "@/components/animations/FadeIn";
import {
  Database,
  Activity,
  Cpu,
  Cloud,
  ShieldCheck,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  HardDriveDownload,
  Clock,
} from "lucide-react";

// ── System Health Monitoring Panel ─────────────────────
// Shows DB connectivity/latency, environment checks, row counts, uptime and
// the latest database backup record.

interface HealthData {
  ok: boolean;
  database: { connected: boolean; latencyMs: number; error: string | null };
  counts: Record<string, number>;
  countsWarning: string[];
  lastBackup: { status: string; scope: string; note: string | null; created_at: string } | null;
  env: {
    checks: Record<string, boolean>;
    configured: number;
    total: number;
    nodeVersion: string | null;
    uptimeSeconds: number;
    memoryMB: number;
    environment: string;
  };
  serverTime: string;
}

interface SystemHealthPanelProps {
  locale?: string;
  compact?: boolean;
}

export function SystemHealthPanel({ locale = "bn", compact = false }: SystemHealthPanelProps) {
  const isBn = locale === "bn";
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/health", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setHealth(await res.json());
    } catch {
      setError(isBn ? "সিস্টেম হেলথ লোড করা যায়নি" : "Failed to load system health");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHealth();
  }, [fetchHealth]);

  if (loading) {
    return (
      <GlassCard className="flex items-center justify-center gap-3 p-8 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="bn">{isBn ? "হেলথ চেক চলছে..." : "Running health check..."}</span>
      </GlassCard>
    );
  }

  if (error || !health) {
    return (
      <GlassCard className="flex items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-3">
          <XCircle className="h-6 w-6 text-red-400" />
          <span className="bn">{error ?? "Unknown error"}</span>
        </div>
        <Button variant="outline" size="sm" onClick={fetchHealth}>
          <RefreshCw className="h-4 w-4" />
          <span className="bn">{isBn ? "আবার চেষ্টা" : "Retry"}</span>
        </Button>
      </GlassCard>
    );
  }

  const dbOk = health.database.connected;

  return (
    <div className="space-y-4">
      <FadeInUp>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${dbOk ? "bg-green-500/10" : "bg-red-500/10"}`}>
                <Database className={`h-6 w-6 ${dbOk ? "text-green-400" : "text-red-400"}`} />
              </div>
              <div>
                <p className="font-bold bn">{isBn ? "ডেটাবেস" : "Database"}</p>
                <p className="text-xs text-muted-foreground bn">
                  {dbOk
                    ? isBn ? "সংযুক্ত" : "Connected"
                    : isBn ? "সংযোগ ব্যর্থ" : "Connection failed"}
                  {dbOk && ` · ${health.database.latencyMs}ms`}
                </p>
              </div>
            </div>
            <Badge variant={dbOk ? "success" : "destructive"} className="gap-1">
              {dbOk ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {dbOk ? (isBn ? "সচল" : "Healthy") : (isBn ? "সমস্যা" : "Down")}
            </Badge>
          </div>
        </GlassCard>
      </FadeInUp>

      <FadeInUp delay={0.05}>
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold bn">{isBn ? "পরিবেশ চেক" : "Environment Checks"}</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(health.env.checks).map(([key, ok]) => (
              <div key={key} className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm">
                <span className="font-mono text-xs">{key}</span>
                {ok ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground/50" />
                )}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground bn">
            {isBn
              ? `${health.env.configured}/${health.env.total} কনফিগার হয়েছে`
              : `${health.env.configured}/${health.env.total} configured`}
          </p>
        </GlassCard>
      </FadeInUp>

      {!compact && (
        <>
          <FadeInUp delay={0.1}>
            <GlassCard className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-400" />
                <h3 className="font-bold bn">{isBn ? "ডেটা কাউন্ট" : "Data Counts"}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {Object.entries(health.counts).map(([table, count]) => (
                  <div key={table} className="rounded-lg border border-border/50 p-3">
                    <p className="text-xl font-bold">{count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{table}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <GlassCard className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <HardDriveDownload className="h-5 w-5 text-purple-400" />
                <h3 className="font-bold bn">{isBn ? "ডেটাবেস ব্যাকআপ" : "Database Backup"}</h3>
              </div>
              {health.lastBackup ? (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        health.lastBackup.status === "completed"
                          ? "success"
                          : health.lastBackup.status === "failed"
                            ? "destructive"
                            : "warning"
                      }
                    >
                      {health.lastBackup.status}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">{health.lastBackup.scope}</span>
                  </div>
                  {health.lastBackup.note && <p className="text-muted-foreground">{health.lastBackup.note}</p>}
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(health.lastBackup.created_at).toLocaleString(isBn ? "bn-BD" : "en-US")}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground bn">
                  {isBn ? "কোনো ব্যাকআপ রেকর্ড নেই" : "No backup records yet"}
                </p>
              )}
            </GlassCard>
          </FadeInUp>

          <FadeInUp delay={0.2}>
            <GlassCard className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Cpu className="h-4 w-4" />
                  Node {health.env.nodeVersion ?? "?"} · {health.env.memoryMB}MB ·{" "}
                  {Math.floor(health.env.uptimeSeconds / 60)}min uptime
                </span>
                <Button variant="outline" size="sm" onClick={fetchHealth}>
                  <RefreshCw className="h-4 w-4" />
                  <span className="bn">{isBn ? "রিফ্রেশ" : "Refresh"}</span>
                </Button>
              </div>
            </GlassCard>
          </FadeInUp>
        </>
      )}

      {compact && (
        <GlassCard className="flex items-center justify-between gap-3 p-4 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Cloud className="h-4 w-4" />
            Node {health.env.nodeVersion ?? "?"} · {health.env.memoryMB}MB
          </span>
          <Button variant="ghost" size="sm" onClick={fetchHealth}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </GlassCard>
      )}
    </div>
  );
}
