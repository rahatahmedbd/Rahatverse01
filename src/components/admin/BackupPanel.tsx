"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  HardDriveDownload,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
} from "lucide-react";
import { SectionTitle } from "@/components/sections/SectionTitle";

// ── Database Backup Status ─────────────────────────────
// Lists recorded backups and lets an admin add a new record (e.g. after a
// snapshot in the Supabase dashboard).

interface BackupRow {
  id: string;
  status: "completed" | "failed" | "in_progress";
  scope: "full" | "schema" | "partial";
  note: string | null;
  created_at: string;
}

interface BackupPanelProps {
  locale?: string;
}

export function BackupPanel({ locale = "bn" }: BackupPanelProps) {
  const isBn = locale === "bn";
  const [backups, setBackups] = useState<BackupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [scope, setScope] = useState<"full" | "schema" | "partial">("full");
  const [creating, setCreating] = useState(false);

  const fetchBackups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/backup", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setBackups(json.data || []);
    } catch {
      setError(isBn ? "ব্যাকআপ তথ্য লোড করা যায়নি" : "Failed to load backup records");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBackups();
  }, [fetchBackups]);

  const recordBackup = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/admin/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, status: "completed", note }),
      });
      if (res.ok) {
        setNote("");
        fetchBackups();
      }
    } finally {
      setCreating(false);
    }
  };

  const statusBadge: Record<string, "success" | "destructive" | "warning"> = {
    completed: "success",
    failed: "destructive",
    in_progress: "warning",
  };

  return (
    <section className="py-4">
      <SectionTitle
        badge="💾"
        title="Database Backup"
        titleBn="ডেটাবেস ব্যাকআপ"
        locale={locale}
      />

      <GlassCard className="mb-6 p-6">
        <h3 className="mb-1 font-bold bn">{isBn ? "ব্যাকআপ রেকর্ড করুন" : "Record a Backup"}</h3>
        <p className="mb-4 text-sm text-muted-foreground bn">
          {isBn
            ? "Supabase ড্যাশবোর্ডে স্ন্যাপশট নেওয়ার পর এখানে রেকর্ড যোগ করুন।"
            : "Record a snapshot taken in the Supabase dashboard here."}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={scope}
            onChange={(e) => setScope(e.target.value as "full" | "schema" | "partial")}
          >
            <option value="full">Full</option>
            <option value="schema">Schema</option>
            <option value="partial">Partial</option>
          </select>
          <Input
            className="flex-1"
            placeholder={isBn ? "নোট (ঐচ্ছিক)" : "Note (optional)"}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button onClick={recordBackup} disabled={creating}>
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {isBn ? "রেকর্ড করুন" : "Record"}
          </Button>
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="mb-4 p-4 text-center text-sm text-red-400">{error}</GlassCard>
      )}

      <div className="space-y-3">
        {loading ? (
          <GlassCard className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </GlassCard>
        ) : backups.length === 0 ? (
          <GlassCard className="p-10 text-center text-sm text-muted-foreground">
            <HardDriveDownload className="mx-auto mb-2 h-8 w-8 opacity-40" />
            {isBn ? "কোনো ব্যাকআপ রেকর্ড নেই" : "No backup records yet"}
          </GlassCard>
        ) : (
          backups.map((backup) => (
            <GlassCard key={backup.id} className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                {backup.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                ) : backup.status === "failed" ? (
                  <XCircle className="h-5 w-5 text-red-400" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusBadge[backup.status]}>{backup.status}</Badge>
                    <span className="font-mono text-xs text-muted-foreground">{backup.scope}</span>
                  </div>
                  {backup.note && <p className="mt-1 text-sm text-muted-foreground">{backup.note}</p>}
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {new Date(backup.created_at).toLocaleString(isBn ? "bn-BD" : "en-US")}
              </span>
            </GlassCard>
          ))
        )}
      </div>
    </section>
  );
}
