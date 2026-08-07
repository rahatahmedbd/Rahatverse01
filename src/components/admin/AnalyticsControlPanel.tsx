"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_ANALYTICS_CONFIG, validateAnalyticsConfig } from "@/lib/analytics/config";
import { setTelemetryEnabled } from "@/lib/analytics/tracker";
import type { AnalyticsConfig } from "@/types/analytics";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";

interface AnalyticsControlPanelProps {
  locale?: string;
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function AnalyticsControlPanel({ locale = "bn" }: AnalyticsControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<AnalyticsConfig>(DEFAULT_ANALYTICS_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analytics-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateAnalyticsConfig(json.data) ?? DEFAULT_ANALYTICS_CONFIG);
    } catch {
      setError(isBn ? "অ্যানালিটিক্স কনফিগ লোড করা যায়নি" : "Failed to load Analytics configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    setTelemetryEnabled(config.settings.telemetryEnabled);
  }, [config.settings.telemetryEnabled]);

  const updateConfig = (updater: (p: AnalyticsConfig) => AnalyticsConfig) => setConfig((prev) => updater(prev));
  const section = config.section;
  const settings = config.settings;
  const vitals = settings.vitals;

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const validated = validateAnalyticsConfig(config);
    if (!validated) {
      setError(isBn ? "ভ্যালিডেশন ব্যর্থ" : "Validation failed");
      setSaving(false);
      return;
    }
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "analytics_config", value: validated }),
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
        badge="📊"
        title="Analytics & Vitals Control"
        titleBn="অ্যানালিটিক্স ও ভাইটাল কন্ট্রোল"
        subtitle={isBn ? "টেলিমেট্রি, ড্যাশবোর্ড প্যানেল এবং কোর ওয়েব ভাইটাল থ্রেশহোল্ড নিয়ন্ত্রণ করুন" : "Control telemetry, dashboard panels and Core Web Vitals thresholds"}
        locale={locale}
      />
      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>}

      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.visible ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-semibold">{isBn ? "দৃশ্যমান" : "Visible"}</span>
            <Badge variant={config.visible ? "default" : "outline"} className="text-[10px]">{config.visible ? "ON" : "OFF"}</Badge>
          </div>
          <Button type="button" size="sm" variant="gradient" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{isBn ? "সংরক্ষণ করুন" : "Save"}</Button>
        </div>
      </GlassCard>

      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "সেকশন হেডিং" : "Section heading"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "ব্যাজ (বাংলা)" : "Badge (Bangla)"}><Input value={section.badgeBn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, badgeBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ব্যাজ (ইংরেজি)" : "Badge (English)"}><Input value={section.badgeEn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, badgeEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}><Input value={section.titleBn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, titleBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}><Input value={section.titleEn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, titleEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "সাবটাইটেল (বাংলা)" : "Subtitle (Bangla)"} className="sm:col-span-2"><Textarea rows={2} value={section.subtitleBn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, subtitleBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "সাবটাইটেল (ইংরেজি)" : "Subtitle (English)"} className="sm:col-span-2"><Textarea rows={2} value={section.subtitleEn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, subtitleEn: e.target.value } }))} /></Field>
        </div>
      </GlassCard>

      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "ড্যাশবোর্ড সেটিংস" : "Dashboard settings"}</h3>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.telemetryEnabled} onChange={(e) => updateConfig((p) => ({ ...p, settings: { ...p.settings, telemetryEnabled: e.target.checked } }))} />{isBn ? "ফার্স্ট-পার্টি টেলিমেট্রি চালু" : "First-party telemetry enabled"}</label>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.showDemographics} onChange={(e) => updateConfig((p) => ({ ...p, settings: { ...p.settings, showDemographics: e.target.checked } }))} />{isBn ? "ডেমোগ্রাফিকস" : "Demographics"}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.showDevices} onChange={(e) => updateConfig((p) => ({ ...p, settings: { ...p.settings, showDevices: e.target.checked } }))} />{isBn ? "ডিভাইস ব্রেকডাউন" : "Device breakdown"}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.showGeo} onChange={(e) => updateConfig((p) => ({ ...p, settings: { ...p.settings, showGeo: e.target.checked } }))} />{isBn ? "জিওগ্রাফি" : "Geography"}</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.showVitals} onChange={(e) => updateConfig((p) => ({ ...p, settings: { ...p.settings, showVitals: e.target.checked } }))} />{isBn ? "কোর ওয়েব ভাইটাল" : "Core Web Vitals"}</label>
          <Field label={isBn ? "কনভার্সন গোল (বাংলা)" : "Conversion goal (Bangla)"}><Input value={settings.conversionGoalBn} onChange={(e) => updateConfig((p) => ({ ...p, settings: { ...p.settings, conversionGoalBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "কনভার্সন গোল (ইংরেজি)" : "Conversion goal (English)"}><Input value={settings.conversionGoalEn} onChange={(e) => updateConfig((p) => ({ ...p, settings: { ...p.settings, conversionGoalEn: e.target.value } }))} /></Field>
        </div>
      </GlassCard>

      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "কোর ওয়েব ভাইটাল থ্রেশহোল্ড" : "Core Web Vitals thresholds"}</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="LCP (ms)"><Input type="number" min={500} max={10000} value={vitals.lcpTargetMs} onChange={(e) => updateConfig((p) => ({ ...p, settings: { ...p.settings, vitals: { ...p.settings.vitals, lcpTargetMs: Number(e.target.value) || 2500 } } }))} /></Field>
          <Field label="INP (ms)"><Input type="number" min={50} max={1000} value={vitals.inpTargetMs} onChange={(e) => updateConfig((p) => ({ ...p, settings: { ...p.settings, vitals: { ...p.settings.vitals, inpTargetMs: Number(e.target.value) || 200 } } }))} /></Field>
          <Field label="CLS"><Input type="number" step={0.01} min={0} max={1} value={vitals.clsTarget} onChange={(e) => updateConfig((p) => ({ ...p, settings: { ...p.settings, vitals: { ...p.settings.vitals, clsTarget: Number(e.target.value) || 0.1 } } }))} /></Field>
        </div>
      </GlassCard>
    </section>
  );
}
