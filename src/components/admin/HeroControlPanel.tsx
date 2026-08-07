"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/sections/SectionTitle";
import {
  Loader2,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Sparkles,
  Type,
  BadgeCheck,
  BarChart3,
  MousePointerClick,
} from "lucide-react";
import type { HeroConfig, HeroCTA } from "@/types/hero";
import { DEFAULT_HERO_CONFIG, validateHeroConfig } from "@/lib/hero/config";

// ── Hero Control Panel (Phase 2 Admin) ─────────────────

interface HeroControlPanelProps {
  locale?: string;
}

export function HeroControlPanel({ locale = "bn" }: HeroControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<HeroConfig>(DEFAULT_HERO_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Raw editors for typewriter arrays
  const [typewriterBnRaw, setTypewriterBnRaw] = useState(DEFAULT_HERO_CONFIG.typewriter.bn.join(", "));
  const [typewriterEnRaw, setTypewriterEnRaw] = useState(DEFAULT_HERO_CONFIG.typewriter.en.join(", "));

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/hero-config", { cache: "no-store" });
      const json = await res.json();
      const data = json.data as HeroConfig;
      const validated = validateHeroConfig(data);
      const finalConfig = validated ?? DEFAULT_HERO_CONFIG;
      setConfig(finalConfig);
      setTypewriterBnRaw(finalConfig.typewriter.bn.join(", "));
      setTypewriterEnRaw(finalConfig.typewriter.en.join(", "));
    } catch {
      setError(isBn ? "হিরো কনফিগ লোড করা যায়নি" : "Failed to load hero config");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchConfig();
  }, [fetchConfig]);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    // Parse typewriter raw into arrays
    const bnArr = typewriterBnRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const enArr = typewriterEnRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const candidate: HeroConfig = {
      ...config,
      typewriter: { bn: bnArr, en: enArr },
    };

    const validated = validateHeroConfig(candidate);
    if (!validated) {
      setError(
        isBn
          ? "ভ্যালিডেশন ব্যর্থ — সব ফিল্ড সঠিকভাবে পূরণ করুন (duration 1000–15000, array ≤12)"
          : "Validation failed — check all fields (duration 1000–15000, arrays ≤12)"
      );
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero_config", value: validated }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to save");
      } else {
        setSuccess(isBn ? "সফলভাবে সংরক্ষিত!" : "Saved successfully!");
        setTimeout(() => setSuccess(null), 2500);
      }
    } catch {
      setError(isBn ? "সংরক্ষণ ব্যর্থ" : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {isBn ? "লোড হচ্ছে..." : "Loading..."}
      </div>
    );
  }

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="🎬"
        title="Hero Section Control"
        titleBn="হিরো সেকশন কন্ট্রোল"
        subtitle={isBn ? "প্রথম ইমপ্রেশন — প্রতি অক্ষর আপনার নিয়ন্ত্রণে" : "First impression — every pixel under your control"}
        locale={locale}
      />

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>}

      {/* Visibility Toggle */}
      <GlassCard className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {config.visible ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
          <span className="text-sm font-medium bn">
            {isBn ? "হিরো সেকশন দৃশ্যমান" : "Hero Section Visible"}
          </span>
          <Badge variant={config.visible ? "default" : "outline"} className="ml-2 text-[10px]">
            {config.visible ? (isBn ? "চালু" : "ON") : isBn ? "বন্ধ" : "OFF"}
          </Badge>
        </div>
        <Button
          size="sm"
          variant={config.visible ? "outline" : "gradient"}
          onClick={() => setConfig((p) => ({ ...p, visible: !p.visible }))}
        >
          {config.visible ? (isBn ? "লুকান" : "Hide") : isBn ? "দেখান" : "Show"}
        </Button>
      </GlassCard>

      {/* Intro / Greeting */}
      <GlassCard className="p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
          <Sparkles className="h-4 w-4 text-amber-500" />
          {isBn ? "সিনেম্যাটিক ইন্ট্রো ও অভিবাদন" : "Cinematic Intro & Greeting"}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Welcome BN</label>
            <Input value={config.intro.welcomeTextBn} onChange={(e) => setConfig((p) => ({ ...p, intro: { ...p.intro, welcomeTextBn: e.target.value } }))} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Welcome EN</label>
            <Input value={config.intro.welcomeTextEn} onChange={(e) => setConfig((p) => ({ ...p, intro: { ...p.intro, welcomeTextEn: e.target.value } }))} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Greeting BN (intro screen)</label>
            <Input value={config.intro.greetingBn} onChange={(e) => setConfig((p) => ({ ...p, intro: { ...p.intro, greetingBn: e.target.value } }))} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Greeting EN</label>
            <Input value={config.intro.greetingEn} onChange={(e) => setConfig((p) => ({ ...p, intro: { ...p.intro, greetingEn: e.target.value } }))} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-muted-foreground">Intro Duration (ms, 1000–15000)</label>
            <Input
              type="number"
              min={1000}
              max={15000}
              value={config.intro.durationMs}
              onChange={(e) => setConfig((p) => ({ ...p, intro: { ...p.intro, durationMs: Number(e.target.value) } }))}
            />
          </div>
        </div>
      </GlassCard>

      {/* Typewriter */}
      <GlassCard className="p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
          <Type className="h-4 w-4 text-blue-500" />
          {isBn ? "টাইপরাইটার ট্যাগলাইন (কমা দিয়ে আলাদা করুন)" : "Typewriter Taglines (comma separated)"}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Bangla</label>
            <Textarea value={typewriterBnRaw} onChange={(e) => setTypewriterBnRaw(e.target.value)} rows={3} placeholder="ওয়েব ডেভেলপার, শিক্ষার্থী, ..." />
            <p className="mt-1 text-[11px] text-muted-foreground">{typewriterBnRaw.split(",").filter((s) => s.trim()).length} items</p>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">English</label>
            <Textarea value={typewriterEnRaw} onChange={(e) => setTypewriterEnRaw(e.target.value)} rows={3} placeholder="Web Developer, Student, ..." />
            <p className="mt-1 text-[11px] text-muted-foreground">{typewriterEnRaw.split(",").filter((s) => s.trim()).length} items</p>
          </div>
        </div>
      </GlassCard>

      {/* Badges */}
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <BadgeCheck className="h-4 w-4 text-emerald-500" />
            {isBn ? "রোল ব্যাজ" : "Role Badges"}
            <Badge variant="outline" className="text-[10px]">{config.badges.length}</Badge>
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setConfig((p) => ({
                ...p,
                badges: [...p.badges, { id: `badge-${Date.now()}`, labelBn: "নতুন", labelEn: "New" }],
              }))
            }
          >
            <Plus className="h-3 w-3" /> {isBn ? "যোগ করুন" : "Add"}
          </Button>
        </div>
        <div className="space-y-3">
          {config.badges.map((badge, idx) => (
            <div key={badge.id} className="flex flex-col gap-2 rounded-lg border border-border/40 p-3 sm:flex-row sm:items-center">
              <GripVertical className="hidden h-4 w-4 text-muted-foreground sm:block" />
              <Input className="flex-1" placeholder="BN label" value={badge.labelBn} onChange={(e) => setConfig((p) => ({ ...p, badges: p.badges.map((b, i) => (i === idx ? { ...b, labelBn: e.target.value } : b)) }))} />
              <Input className="flex-1" placeholder="EN label" value={badge.labelEn} onChange={(e) => setConfig((p) => ({ ...p, badges: p.badges.map((b, i) => (i === idx ? { ...b, labelEn: e.target.value } : b)) }))} />
              <div className="flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={idx === 0}
                  onClick={() => setConfig((p) => {
                    const arr = [...p.badges];
                    const tmp = arr[idx - 1];
                    arr[idx - 1] = arr[idx];
                    arr[idx] = tmp;
                    return { ...p, badges: arr };
                  })}
                >
                  ↑
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={idx === config.badges.length - 1}
                  onClick={() => setConfig((p) => {
                    const arr = [...p.badges];
                    const tmp = arr[idx + 1];
                    arr[idx + 1] = arr[idx];
                    arr[idx] = tmp;
                    return { ...p, badges: arr };
                  })}
                >
                  ↓
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setConfig((p) => ({ ...p, badges: p.badges.filter((_, i) => i !== idx) }))}>
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </div>
          ))}
          {config.badges.length === 0 && <p className="text-center text-xs text-muted-foreground">{isBn ? "কোনো ব্যাজ নেই" : "No badges"}</p>}
        </div>
      </GlassCard>

      {/* Counters */}
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <BarChart3 className="h-4 w-4 text-purple-500" />
            {isBn ? "ফ্লোটিং কাউন্টার" : "Floating Counters"}
            <Badge variant="outline" className="text-[10px]">{config.counters.length}</Badge>
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setConfig((p) => ({
                ...p,
                counters: [...p.counters, { id: `c-${Date.now()}`, labelBn: "নতুন", labelEn: "New", value: 0, suffix: "" }],
              }))
            }
          >
            <Plus className="h-3 w-3" /> {isBn ? "যোগ করুন" : "Add"}
          </Button>
        </div>
        <div className="space-y-3">
          {config.counters.map((ctr, idx) => (
            <div key={ctr.id} className="grid grid-cols-1 gap-2 rounded-lg border border-border/40 p-3 sm:grid-cols-5">
              <Input placeholder="BN label" value={ctr.labelBn} onChange={(e) => setConfig((p) => ({ ...p, counters: p.counters.map((c, i) => (i === idx ? { ...c, labelBn: e.target.value } : c)) }))} />
              <Input placeholder="EN label" value={ctr.labelEn} onChange={(e) => setConfig((p) => ({ ...p, counters: p.counters.map((c, i) => (i === idx ? { ...c, labelEn: e.target.value } : c)) }))} />
              <Input type="number" placeholder="value" value={ctr.value} onChange={(e) => setConfig((p) => ({ ...p, counters: p.counters.map((c, i) => (i === idx ? { ...c, value: Number(e.target.value) } : c)) }))} />
              <Input placeholder="suffix (×,+,%)" value={ctr.suffix} onChange={(e) => setConfig((p) => ({ ...p, counters: p.counters.map((c, i) => (i === idx ? { ...c, suffix: e.target.value } : c)) }))} />
              <div className="flex justify-end gap-1 sm:justify-start">
                <Button size="icon" variant="ghost" disabled={idx === 0} onClick={() => setConfig((p) => { const arr=[...p.counters]; const t=arr[idx-1]; arr[idx-1]=arr[idx]; arr[idx]=t; return {...p, counters:arr}; })}>↑</Button>
                <Button size="icon" variant="ghost" disabled={idx === config.counters.length - 1} onClick={() => setConfig((p) => { const arr=[...p.counters]; const t=arr[idx+1]; arr[idx+1]=arr[idx]; arr[idx]=t; return {...p, counters:arr}; })}>↓</Button>
                <Button size="icon" variant="ghost" onClick={() => setConfig((p) => ({ ...p, counters: p.counters.filter((_, i) => i !== idx) }))}><Trash2 className="h-4 w-4 text-red-400" /></Button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* CTAs */}
      <GlassCard className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <MousePointerClick className="h-4 w-4 text-orange-500" />
            {isBn ? "কল-টু-অ্যাকশন বাটন" : "CTA Buttons"}
            <Badge variant="outline" className="text-[10px]">{config.ctas.length}</Badge>
          </h3>
          <Button
            size="sm"
            variant="outline"
            disabled={config.ctas.length >= 6}
            onClick={() =>
              setConfig((p) => ({
                ...p,
                ctas: [
                  ...p.ctas,
                  {
                    id: `cta-${Date.now()}`,
                    labelBn: "নতুন বাটন",
                    labelEn: "New Button",
                    href: "/contact",
                    variant: "outline",
                    icon: "Sparkles",
                    pulse: false,
                  },
                ],
              }))
            }
          >
            <Plus className="h-3 w-3" /> {isBn ? "যোগ করুন" : "Add"}
          </Button>
        </div>
        <div className="space-y-3">
          {config.ctas.map((cta, idx) => (
            <div key={cta.id} className="rounded-lg border border-border/40 p-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="BN label" value={cta.labelBn} onChange={(e) => setConfig((p) => ({ ...p, ctas: p.ctas.map((c, i) => (i === idx ? { ...c, labelBn: e.target.value } : c)) }))} />
                <Input placeholder="EN label" value={cta.labelEn} onChange={(e) => setConfig((p) => ({ ...p, ctas: p.ctas.map((c, i) => (i === idx ? { ...c, labelEn: e.target.value } : c)) }))} />
                <Input placeholder="href (/order, /portfolio...)" value={cta.href} onChange={(e) => setConfig((p) => ({ ...p, ctas: p.ctas.map((c, i) => (i === idx ? { ...c, href: e.target.value } : c)) }))} />
                <div className="flex gap-2">
                  <select
                    value={cta.variant}
                    onChange={(e) => setConfig((p) => ({ ...p, ctas: p.ctas.map((c, i) => (i === idx ? { ...c, variant: e.target.value as HeroCTA["variant"] } : c)) }))}
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="gradient">gradient</option>
                    <option value="glass">glass</option>
                    <option value="outline">outline</option>
                  </select>
                  <Input className="flex-1" placeholder="icon (Zap, Eye...)" value={cta.icon} onChange={(e) => setConfig((p) => ({ ...p, ctas: p.ctas.map((c, i) => (i === idx ? { ...c, icon: e.target.value } : c)) }))} />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={cta.pulse}
                    onChange={(e) => setConfig((p) => ({ ...p, ctas: p.ctas.map((c, i) => (i === idx ? { ...c, pulse: e.target.checked } : c)) }))}
                  />
                  {isBn ? "গ্লো পালস চালু" : "Glow pulse"}
                  {cta.pulse && <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />}
                </label>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" disabled={idx === 0} onClick={() => setConfig((p) => { const arr=[...p.ctas]; const t=arr[idx-1]; arr[idx-1]=arr[idx]; arr[idx]=t; return {...p, ctas:arr}; })}>↑</Button>
                  <Button size="sm" variant="ghost" disabled={idx === config.ctas.length - 1} onClick={() => setConfig((p) => { const arr=[...p.ctas]; const t=arr[idx+1]; arr[idx+1]=arr[idx]; arr[idx]=t; return {...p, ctas:arr}; })}>↓</Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfig((p) => ({ ...p, ctas: p.ctas.filter((_, i) => i !== idx) }))}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                </div>
              </div>
            </div>
          ))}
          {config.ctas.length === 0 && <p className="text-center text-xs text-muted-foreground">{isBn ? "কোনো CTA নেই" : "No CTAs"}</p>}
        </div>
      </GlassCard>

      {/* Save */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={fetchConfig} disabled={saving}>
          {isBn ? "রিসেট" : "Reset"}
        </Button>
        <Button onClick={save} disabled={saving} className="min-w-28">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? (isBn ? "সংরক্ষণ..." : "Saving...") : isBn ? "সংরক্ষণ করুন" : "Save Changes"}
        </Button>
      </div>

      <p className="text-center text-[11px] text-muted-foreground bn">
        {isBn ? "সংরক্ষণ করলে hero_config site_settings এ আপডেট হবে — audit log এ রেকর্ড হবে।" : "Saving updates hero_config in site_settings — audited."}
      </p>
    </section>
  );
}
