"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Loader2, Plus, Trash2, Save } from "lucide-react";
import { SectionTitle } from "@/components/sections/SectionTitle";

// ── Settings Management Panel ──────────────────────────
// Key/value editor for the site_settings table (no secrets!).

interface SettingRow {
  id: string;
  key: string;
  value: unknown;
  updated_at: string;
}

interface SettingsPanelProps {
  locale?: string;
}

export function SettingsPanel({ locale = "bn" }: SettingsPanelProps) {
  const isBn = locale === "bn";
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSettings(json.data || []);
      const initial: Record<string, string> = {};
      for (const row of json.data || []) initial[row.id] = JSON.stringify(row.value);
      setEdits(initial);
    } catch {
      setError(isBn ? "সেটিংস লোড করা যায়নি" : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettings();
  }, [fetchSettings]);

  const saveSetting = async (key: string, value: string) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error || "Failed");
      } else {
        fetchSettings();
      }
    } finally {
      setSaving(false);
    }
  };

  const addSetting = async () => {
    if (!newKey.trim()) return;
    await saveSetting(newKey.trim(), newValue || "{}");
    setNewKey("");
    setNewValue("");
  };

  const deleteSetting = async (id: string) => {
    if (!confirm(isBn ? "এই সেটিং মুছবেন?" : "Delete this setting?")) return;
    const res = await fetch(`/api/admin/settings?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchSettings();
  };

  return (
    <section className="py-4">
      <SectionTitle
        badge="⚙️"
        title="Settings Management"
        titleBn="সেটিংস ম্যানেজমেন্ট"
        locale={locale}
      />

      <GlassCard className="mb-6 p-5">
        <h3 className="mb-3 font-bold bn">{isBn ? "নতুন সেটিং" : "New Setting"}</h3>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder={isBn ? "কী (যেমন: site_tagline)" : "Key (e.g. site_tagline)"}
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
          <Textarea
            className="flex-1"
            placeholder={isBn ? "JSON মান" : "JSON value"}
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            rows={2}
          />
          <Button onClick={addSetting} disabled={saving || !newKey.trim()}>
            <Plus className="h-4 w-4" />
            {isBn ? "যোগ করুন" : "Add"}
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground bn">
          {isBn
            ? "⚠️ সিক্রেট (API কী, পাসওয়ার্ড) এখানে রাখবেন না"
            : "⚠️ Never store secrets (API keys, passwords) here"}
        </p>
      </GlassCard>

      {error && (
        <GlassCard className="mb-4 p-4 text-center text-sm text-red-400">{error}</GlassCard>
      )}

      <GlassCard>
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : settings.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            {isBn ? "কোনো সেটিং নেই" : "No settings yet"}
          </p>
        ) : (
          <div className="divide-y divide-border/40">
            {settings.map((setting) => (
              <div key={setting.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
                <div className="w-full sm:w-56">
                  <div className="flex items-center gap-2">
                    <SettingsIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <code className="text-xs font-semibold">{setting.key}</code>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {new Date(setting.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <Textarea
                    className="font-mono text-xs"
                    value={edits[setting.id] ?? ""}
                    onChange={(e) => setEdits((prev) => ({ ...prev, [setting.id]: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    JSON
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={saving}
                    onClick={() => saveSetting(setting.key, edits[setting.id] ?? "")}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => deleteSetting(setting.id)}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </section>
  );
}
