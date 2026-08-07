"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_NEWSLETTER_CONFIG, validateNewsletterConfig } from "@/lib/newsletter/config";
import type { NewsletterConfig, NewsletterTopic } from "@/types/newsletter";
import { ChevronDown, ChevronUp, Eye, EyeOff, Loader2, Plus, Save, Trash2 } from "lucide-react";

interface NewsletterControlPanelProps {
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

function createTopic(): NewsletterTopic {
  return { id: newId("topic"), value: "", labelBn: "নতুন বিষয়", labelEn: "New topic", visible: true };
}

export function NewsletterControlPanel({ locale = "bn" }: NewsletterControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<NewsletterConfig>(DEFAULT_NEWSLETTER_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/newsletter-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateNewsletterConfig(json.data) ?? DEFAULT_NEWSLETTER_CONFIG);
    } catch {
      setError(isBn ? "নিউজলেটার কনফিগ লোড করা যায়নি" : "Failed to load Newsletter configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  const updateConfig = (updater: (p: NewsletterConfig) => NewsletterConfig) => setConfig((prev) => updater(prev));
  const section = config.section;
  const camp = config.campaignDefaults;

  const patchTopic = (index: number, patch: Partial<NewsletterTopic>) => {
    updateConfig((p) => ({ ...p, topics: p.topics.map((t, i) => (i === index ? { ...t, ...patch } : t)) }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const validated = validateNewsletterConfig(config);
    if (!validated) {
      setError(isBn ? "ভ্যালিডেশন ব্যর্থ" : "Validation failed");
      setSaving(false);
      return;
    }
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "newsletter_config", value: validated }),
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
        badge="📰"
        title="Newsletter & Campaign Control"
        titleBn="নিউজলেটার ও ক্যাম্পেইন কন্ট্রোল"
        subtitle={isBn ? "নিউজলেটার সেকশন, টপিক প্রেফারেন্স এবং ক্যাম্পেইন ডিফল্ট নিয়ন্ত্রণ করুন" : "Control newsletter section, topic preferences and campaign defaults"}
        locale={locale}
      />
      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>}

      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.visible ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-semibold">{isBn ? "নিউজলেটার দৃশ্যমান" : "Newsletter visible"}</span>
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
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "টপিক প্রেফারেন্স" : "Topic preferences"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((p) => ({ ...p, topics: [...p.topics, createTopic()] }))}><Plus className="h-4 w-4" /> {isBn ? "বিষয়" : "Topic"}</Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {config.topics.map((topic, index) => (
            <div key={topic.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={topic.visible} onChange={(e) => patchTopic(index, { visible: e.target.checked })} />{isBn ? "দৃশ্যমান" : "Visible"}</label>
                <ReorderControls index={index} count={config.topics.length} onMove={(d) => updateConfig((p) => ({ ...p, topics: moveItem(p.topics, index, d) }))} onRemove={() => updateConfig((p) => ({ ...p, topics: p.topics.filter((_, i) => i !== index) }))} removeLabel="Delete topic" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input value={topic.value} onChange={(e) => patchTopic(index, { value: e.target.value })} placeholder="slug" className="text-xs" />
                <Input value={topic.labelBn} onChange={(e) => patchTopic(index, { labelBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
                <Input value={topic.labelEn} onChange={(e) => patchTopic(index, { labelEn: e.target.value })} placeholder="English" className="text-xs" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "ক্যাম্পেইন ডিফল্ট" : "Campaign defaults"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "প্রেরক নাম (বাংলা)" : "From name (Bangla)"}><Input value={camp.fromNameBn} onChange={(e) => updateConfig((p) => ({ ...p, campaignDefaults: { ...p.campaignDefaults, fromNameBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "প্রেরক নাম (ইংরেজি)" : "From name (English)"}><Input value={camp.fromNameEn} onChange={(e) => updateConfig((p) => ({ ...p, campaignDefaults: { ...p.campaignDefaults, fromNameEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "প্রেরক ইমেইল" : "From email"} className="sm:col-span-2"><Input value={camp.fromEmail} onChange={(e) => updateConfig((p) => ({ ...p, campaignDefaults: { ...p.campaignDefaults, fromEmail: e.target.value } }))} /></Field>
          <Field label={isBn ? "ডিফল্ট সাবজেক্ট (বাংলা)" : "Default subject (Bangla)"}><Input value={camp.defaultSubjectBn} onChange={(e) => updateConfig((p) => ({ ...p, campaignDefaults: { ...p.campaignDefaults, defaultSubjectBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ডিফল্ট সাবজেক্ট (ইংরেজি)" : "Default subject (English)"}><Input value={camp.defaultSubjectEn} onChange={(e) => updateConfig((p) => ({ ...p, campaignDefaults: { ...p.campaignDefaults, defaultSubjectEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "পার্সোনালাইজেশন টিপ (বাংলা)" : "Personalization tip (Bangla)"} className="sm:col-span-2"><Input value={camp.personalizationHintBn} onChange={(e) => updateConfig((p) => ({ ...p, campaignDefaults: { ...p.campaignDefaults, personalizationHintBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "পার্সোনালাইজেশন টিপ (ইংরেজি)" : "Personalization tip (English)"} className="sm:col-span-2"><Input value={camp.personalizationHintEn} onChange={(e) => updateConfig((p) => ({ ...p, campaignDefaults: { ...p.campaignDefaults, personalizationHintEn: e.target.value } }))} /></Field>
        </div>
      </GlassCard>
    </section>
  );
}
