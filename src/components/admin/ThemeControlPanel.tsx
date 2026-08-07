"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_THEME_CONFIG, validateThemeConfig } from "@/lib/theme/config";
import type { AudioTrack, ThemeConfig, ThemePreset, XpLevel, XpRule } from "@/types/theme";
import { ChevronDown, ChevronUp, Eye, EyeOff, Loader2, Plus, Save, Trash2 } from "lucide-react";

interface ThemeControlPanelProps {
  locale?: string;
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}
function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function ReorderControls({
  index, count, onMove, onRemove, removeLabel,
}: { index: number; count: number; onMove: (d: -1 | 1) => void; onRemove: () => void; removeLabel: string }) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button type="button" size="icon-sm" variant="ghost" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move up"><ChevronUp className="h-4 w-4" /></Button>
      <Button type="button" size="icon-sm" variant="ghost" disabled={index === count - 1} onClick={() => onMove(1)} aria-label="Move down"><ChevronDown className="h-4 w-4" /></Button>
      <Button type="button" size="icon-sm" variant="ghost" onClick={onRemove} aria-label={removeLabel}><Trash2 className="h-4 w-4 text-red-400" /></Button>
    </div>
  );
}

function createPreset(): ThemePreset {
  return { id: newId("preset"), nameBn: "নতুন প্রিসেট", nameEn: "New preset", primary: "#10b981", primaryForeground: "#020817", ring: "#10b981", gradientStart: "#10b981", gradientMiddle: "#06b6d4", gradientEnd: "#3b82f6", selectionBg: "rgba(16,185,129,0.35)", visible: true };
}
function createXpRule(): XpRule {
  return { id: newId("xp"), action: "custom_action", points: 10, labelBn: "নতুন অ্যাকশন", labelEn: "New action", enabled: true };
}
function createXpLevel(): XpLevel {
  return { id: newId("lvl"), minXp: 100, nameBn: "নতুন লেভেল", nameEn: "New level", rewardMessageBn: "", rewardMessageEn: "" };
}
function createTrack(): AudioTrack {
  return { id: newId("track"), titleBn: "নতুন ট্র্যাক", titleEn: "New track", url: "", visible: true };
}

export function ThemeControlPanel({ locale = "bn" }: ThemeControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/theme-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateThemeConfig(json.data) ?? DEFAULT_THEME_CONFIG);
    } catch {
      setError(isBn ? "থিম কনফিগ লোড করা যায়নি" : "Failed to load Theme configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  const updateConfig = (updater: (p: ThemeConfig) => ThemeConfig) => setConfig((prev) => updater(prev));

  const defaults = config.defaults;
  const audio = config.audio;
  const effects = config.effects;

  const patchPreset = (index: number, patch: Partial<ThemePreset>) => {
    updateConfig((p) => ({ ...p, presets: p.presets.map((x, i) => (i === index ? { ...x, ...patch } : x)) }));
  };
  const patchXpRule = (index: number, patch: Partial<XpRule>) => {
    updateConfig((p) => ({ ...p, xp: { ...p.xp, rules: p.xp.rules.map((x, i) => (i === index ? { ...x, ...patch } : x)) } }));
  };
  const patchXpLevel = (index: number, patch: Partial<XpLevel>) => {
    updateConfig((p) => ({ ...p, xp: { ...p.xp, levels: p.xp.levels.map((x, i) => (i === index ? { ...x, ...patch } : x)) } }));
  };
  const patchTrack = (index: number, patch: Partial<AudioTrack>) => {
    updateConfig((p) => ({ ...p, audio: { ...p.audio, tracks: p.audio.tracks.map((x, i) => (i === index ? { ...x, ...patch } : x)) } }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const validated = validateThemeConfig(config);
    if (!validated) {
      setError(isBn ? "ভ্যালিডেশন ব্যর্থ — প্রিসেট রং সম্পূর্ণ করুন" : "Validation failed");
      setSaving(false);
      return;
    }
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "theme_config", value: validated }),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) setError(json.error || (isBn ? "সংরক্ষণ ব্যর্থ" : "Save failed"));
      else setSuccess(isBn ? "সফলভাবে সংরক্ষিত হয়েছে" : "Saved successfully");
    } catch {
      setError(isBn ? "সংরক্ষণ ব্যর্থ" : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" />{isBn ? "লোড হচ্ছে..." : "Loading..."}</div>;
  }

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="🎨"
        title="Theme, XP & Audio Control"
        titleBn="থিম, XP ও অডিও কন্ট্রোল"
        subtitle={isBn ? "থিম প্রিসেট, XP রুল, অডিও প্লেলিস্ট ও ইফেক্ট টগল নিয়ন্ত্রণ করুন" : "Control theme presets, XP rules, audio playlist and effect toggles"}
        locale={locale}
      />
      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>}

      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.visible ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-semibold">{isBn ? "থিম দৃশ্যমান" : "Theme visible"}</span>
            <Badge variant={config.visible ? "default" : "outline"} className="text-[10px]">{config.visible ? "ON" : "OFF"}</Badge>
          </div>
          <Button type="button" size="sm" variant="gradient" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{isBn ? "সংরক্ষণ করুন" : "Save"}</Button>
        </div>
      </GlassCard>

      {/* Defaults */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "ডিফল্ট সেটিংস" : "Default settings"}</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label={isBn ? "ডিফল্ট অ্যাকসেন্ট" : "Default accent"}>
            <select value={defaults.defaultAccent} onChange={(e) => updateConfig((p) => ({ ...p, defaults: { ...p.defaults, defaultAccent: e.target.value } }))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {config.presets.map((preset) => <option key={preset.id} value={preset.id}>{isBn ? preset.nameBn : preset.nameEn}</option>)}
            </select>
          </Field>
          <Field label={isBn ? "ডিফল্ট থিম" : "Default theme"}>
            <select value={defaults.defaultTheme} onChange={(e) => updateConfig((p) => ({ ...p, defaults: { ...p.defaults, defaultTheme: e.target.value } }))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={defaults.allowCustomAccent} onChange={(e) => updateConfig((p) => ({ ...p, defaults: { ...p.defaults, allowCustomAccent: e.target.checked } }))} />{isBn ? "ভিজিটর অ্যাকসেন্ট কাস্টমাইজার" : "Visitor accent customizer"}</label>
        </div>
      </GlassCard>

      {/* Presets */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "থিম প্রিসেট" : "Theme presets"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((p) => ({ ...p, presets: [...p.presets, createPreset()] }))}><Plus className="h-4 w-4" /> {isBn ? "প্রিসেট" : "Preset"}</Button>
        </div>
        <div className="space-y-3">
          {config.presets.map((preset, index) => (
            <div key={preset.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="h-5 w-5 rounded-full" style={{ background: `linear-gradient(135deg, ${preset.gradientStart}, ${preset.gradientEnd})` }} />
                  {isBn ? preset.nameBn : preset.nameEn}
                </span>
                <ReorderControls index={index} count={config.presets.length} onMove={(d) => updateConfig((p) => ({ ...p, presets: moveItem(p.presets, index, d) }))} onRemove={() => updateConfig((p) => ({ ...p, presets: p.presets.filter((_, i) => i !== index) }))} removeLabel="Delete preset" />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Input value={preset.id} onChange={(e) => patchPreset(index, { id: e.target.value })} placeholder="id" className="text-xs" />
                <Input value={preset.nameBn} onChange={(e) => patchPreset(index, { nameBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
                <Input value={preset.nameEn} onChange={(e) => patchPreset(index, { nameEn: e.target.value })} placeholder="English" className="text-xs" />
                <label className="flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={preset.visible} onChange={(e) => patchPreset(index, { visible: e.target.checked })} />{isBn ? "দৃশ্যমান" : "Visible"}</label>
                <Input value={preset.primary} onChange={(e) => patchPreset(index, { primary: e.target.value })} placeholder="primary" className="text-xs" />
                <Input value={preset.ring} onChange={(e) => patchPreset(index, { ring: e.target.value })} placeholder="ring" className="text-xs" />
                <Input value={preset.gradientStart} onChange={(e) => patchPreset(index, { gradientStart: e.target.value })} placeholder="grad start" className="text-xs" />
                <Input value={preset.gradientEnd} onChange={(e) => patchPreset(index, { gradientEnd: e.target.value })} placeholder="grad end" className="text-xs" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* XP rules */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "XP রুল" : "XP rules"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((p) => ({ ...p, xp: { ...p.xp, rules: [...p.xp.rules, createXpRule()] } }))}><Plus className="h-4 w-4" /> {isBn ? "রুল" : "Rule"}</Button>
        </div>
        <div className="space-y-2">
          {config.xp.rules.map((rule, index) => (
            <div key={rule.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 p-2">
              <Input value={rule.action} onChange={(e) => patchXpRule(index, { action: e.target.value })} placeholder="action" className="w-40 text-xs" />
              <Input type="number" min={0} value={rule.points} onChange={(e) => patchXpRule(index, { points: Number(e.target.value) || 0 })} placeholder="points" className="w-20 text-xs" />
              <Input value={rule.labelBn} onChange={(e) => patchXpRule(index, { labelBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
              <Input value={rule.labelEn} onChange={(e) => patchXpRule(index, { labelEn: e.target.value })} placeholder="English" className="text-xs" />
              <label className="flex items-center gap-1 text-xs text-muted-foreground"><input type="checkbox" checked={rule.enabled} onChange={(e) => patchXpRule(index, { enabled: e.target.checked })} />{isBn ? "চালু" : "On"}</label>
              <Button type="button" size="icon-sm" variant="ghost" onClick={() => updateConfig((p) => ({ ...p, xp: { ...p.xp, rules: p.xp.rules.filter((_, i) => i !== index) } }))} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-400" /></Button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* XP levels */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "XP লেভেল" : "XP levels"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((p) => ({ ...p, xp: { ...p.xp, levels: [...p.xp.levels, createXpLevel()] } }))}><Plus className="h-4 w-4" /> {isBn ? "লেভেল" : "Level"}</Button>
        </div>
        <div className="space-y-2">
          {config.xp.levels.map((level, index) => (
            <div key={level.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 p-2">
              <Input type="number" min={0} value={level.minXp} onChange={(e) => patchXpLevel(index, { minXp: Number(e.target.value) || 0 })} placeholder="minXp" className="w-24 text-xs" />
              <Input value={level.nameBn} onChange={(e) => patchXpLevel(index, { nameBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
              <Input value={level.nameEn} onChange={(e) => patchXpLevel(index, { nameEn: e.target.value })} placeholder="English" className="text-xs" />
              <Input value={level.rewardMessageBn} onChange={(e) => patchXpLevel(index, { rewardMessageBn: e.target.value })} placeholder="Reward (বাংলা)" className="text-xs" />
              <Input value={level.rewardMessageEn} onChange={(e) => patchXpLevel(index, { rewardMessageEn: e.target.value })} placeholder="Reward (EN)" className="text-xs" />
              <Button type="button" size="icon-sm" variant="ghost" onClick={() => updateConfig((p) => ({ ...p, xp: { ...p.xp, levels: p.xp.levels.filter((_, i) => i !== index) } }))} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-400" /></Button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Audio */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">{isBn ? "অ্যাম্বিয়েন্ট অডিও" : "Ambient audio"}</h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={audio.enabled} onChange={(e) => updateConfig((p) => ({ ...p, audio: { ...p.audio, enabled: e.target.checked } }))} />{isBn ? "চালু" : "Enabled"}</label>
            <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((p) => ({ ...p, audio: { ...p.audio, tracks: [...p.audio.tracks, createTrack()] } }))}><Plus className="h-4 w-4" /> {isBn ? "ট্র্যাক" : "Track"}</Button>
          </div>
        </div>
        <Field label={isBn ? "ডিফল্ট ভলিউম (%)" : "Default volume (%)"}>
          <Input type="number" min={0} max={100} value={audio.defaultVolume} onChange={(e) => updateConfig((p) => ({ ...p, audio: { ...p.audio, defaultVolume: Number(e.target.value) || 0 } }))} />
        </Field>
        <div className="space-y-2">
          {audio.tracks.map((track, index) => (
            <div key={track.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 p-2">
              <Input value={track.titleBn} onChange={(e) => patchTrack(index, { titleBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
              <Input value={track.titleEn} onChange={(e) => patchTrack(index, { titleEn: e.target.value })} placeholder="English" className="text-xs" />
              <Input value={track.url} onChange={(e) => patchTrack(index, { url: e.target.value })} placeholder="https://...mp3" className="min-w-[200px] flex-1 text-xs" />
              <label className="flex items-center gap-1 text-xs text-muted-foreground"><input type="checkbox" checked={track.visible} onChange={(e) => patchTrack(index, { visible: e.target.checked })} />{isBn ? "দৃশ্যমান" : "Visible"}</label>
              <Button type="button" size="icon-sm" variant="ghost" onClick={() => updateConfig((p) => ({ ...p, audio: { ...p.audio, tracks: p.audio.tracks.filter((_, i) => i !== index) } }))} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-400" /></Button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Effects */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "ব্যাকগ্রাউন্ড ইফেক্ট" : "Background effects"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={effects.particleField} onChange={(e) => updateConfig((p) => ({ ...p, effects: { ...p.effects, particleField: e.target.checked } }))} />{isBn ? "3D পার্টিকেল ফিল্ড" : "3D particle field"}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={effects.auroraMesh} onChange={(e) => updateConfig((p) => ({ ...p, effects: { ...p.effects, auroraMesh: e.target.checked } }))} />{isBn ? "অরোরা মেশ" : "Aurora mesh"}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={effects.customCursor} onChange={(e) => updateConfig((p) => ({ ...p, effects: { ...p.effects, customCursor: e.target.checked } }))} />{isBn ? "কাস্টম কার্সর" : "Custom cursor"}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={effects.sparkleTrail} onChange={(e) => updateConfig((p) => ({ ...p, effects: { ...p.effects, sparkleTrail: e.target.checked } }))} />{isBn ? "স্পার্কল ট্রেইল" : "Sparkle trail"}</label>
          <Field label={isBn ? "পার্টিকেল ইনটেনসিটি (%)" : "Particle intensity (%)"}>
            <Input type="number" min={0} max={100} value={effects.particleIntensity} onChange={(e) => updateConfig((p) => ({ ...p, effects: { ...p.effects, particleIntensity: Number(e.target.value) || 0 } }))} />
          </Field>
          <Field label={isBn ? "ইফেক্ট ইনটেনসিটি (%)" : "Effect intensity (%)"}>
            <Input type="number" min={0} max={100} value={effects.intensity} onChange={(e) => updateConfig((p) => ({ ...p, effects: { ...p.effects, intensity: Number(e.target.value) || 0 } }))} />
          </Field>
        </div>
      </GlassCard>
    </section>
  );
}
