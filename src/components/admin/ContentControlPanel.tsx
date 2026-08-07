"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_CONTENT_CONFIG, validateContentConfig } from "@/lib/content/config";
import type { ContentConfig, FaqCategory, FaqItem, LegalPage, SearchScopeItem } from "@/types/content";
import { ChevronDown, ChevronUp, Eye, EyeOff, Loader2, Plus, Save, Trash2 } from "lucide-react";

interface ContentControlPanelProps {
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

function createFaqCategory(): FaqCategory {
  return { id: newId("faqcat"), value: "", labelBn: "নতুন ক্যাটাগরি", labelEn: "New category", visible: true };
}
function createFaqItem(): FaqItem {
  return { id: newId("faq"), category: "", questionBn: "প্রশ্ন", questionEn: "Question", answerBn: "", answerEn: "", visible: true };
}
function createSearchScope(): SearchScopeItem {
  return { id: newId("search"), value: "", labelBn: "নতুন", labelEn: "New", weight: 5, enabled: true };
}

export function ContentControlPanel({ locale = "bn" }: ContentControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<ContentConfig>(DEFAULT_CONTENT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/content-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateContentConfig(json.data) ?? DEFAULT_CONTENT_CONFIG);
    } catch {
      setError(isBn ? "কনটেন্ট কনফিগ লোড করা যায়নি" : "Failed to load Content configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  const updateConfig = (updater: (p: ContentConfig) => ContentConfig) => setConfig((prev) => updater(prev));

  const patchFaqCat = (index: number, patch: Partial<FaqCategory>) => {
    updateConfig((p) => ({ ...p, faqCategories: p.faqCategories.map((x, i) => (i === index ? { ...x, ...patch } : x)) }));
  };
  const patchFaqItem = (index: number, patch: Partial<FaqItem>) => {
    updateConfig((p) => ({ ...p, faqItems: p.faqItems.map((x, i) => (i === index ? { ...x, ...patch } : x)) }));
  };
  const patchSearch = (index: number, patch: Partial<SearchScopeItem>) => {
    updateConfig((p) => ({ ...p, searchScope: p.searchScope.map((x, i) => (i === index ? { ...x, ...patch } : x)) }));
  };
  const patchLegal = (index: number, patch: Partial<LegalPage>) => {
    updateConfig((p) => ({ ...p, legalPages: p.legalPages.map((x, i) => (i === index ? { ...x, ...patch } : x)) }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const validated = validateContentConfig(config);
    if (!validated) {
      setError(isBn ? "ভ্যালিডেশন ব্যর্থ" : "Validation failed");
      setSaving(false);
      return;
    }
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "content_config", value: validated }),
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
        badge="🔍"
        title="Search, FAQ & Legal Policies Control"
        titleBn="সার্চ, FAQ ও লিগ্যাল পলিসি কন্ট্রোল"
        subtitle={isBn ? "FAQ, সার্চ স্কোপ এবং লিগ্যাল পেজ সম্পাদনা করুন" : "Edit FAQ, search scope and legal pages"}
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

      {/* Search scope */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "সার্চ স্কোপ ও ওয়েট" : "Search scope & weights"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((p) => ({ ...p, searchScope: [...p.searchScope, createSearchScope()] }))}><Plus className="h-4 w-4" /> {isBn ? "আইটেম" : "Item"}</Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "প্লেসহোল্ডার (বাংলা)" : "Placeholder (Bangla)"} className="sm:col-span-2"><Input value={config.searchPlaceholderBn} onChange={(e) => updateConfig((p) => ({ ...p, searchPlaceholderBn: e.target.value }))} /></Field>
          <Field label={isBn ? "প্লেসহোল্ডার (ইংরেজি)" : "Placeholder (English)"} className="sm:col-span-2"><Input value={config.searchPlaceholderEn} onChange={(e) => updateConfig((p) => ({ ...p, searchPlaceholderEn: e.target.value }))} /></Field>
          {config.searchScope.map((item, index) => (
            <div key={item.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 p-2">
              <Input value={item.value} onChange={(e) => patchSearch(index, { value: e.target.value })} placeholder="value" className="w-32 text-xs" />
              <Input value={item.labelBn} onChange={(e) => patchSearch(index, { labelBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
              <Input value={item.labelEn} onChange={(e) => patchSearch(index, { labelEn: e.target.value })} placeholder="English" className="text-xs" />
              <Input type="number" min={0} max={100} value={item.weight} onChange={(e) => patchSearch(index, { weight: Number(e.target.value) || 0 })} placeholder="weight" className="w-16 text-xs" />
              <label className="flex items-center gap-1 text-xs text-muted-foreground"><input type="checkbox" checked={item.enabled} onChange={(e) => patchSearch(index, { enabled: e.target.checked })} />{isBn ? "চালু" : "On"}</label>
              <Button type="button" size="icon-sm" variant="ghost" onClick={() => updateConfig((p) => ({ ...p, searchScope: p.searchScope.filter((_, i) => i !== index) }))} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-400" /></Button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* FAQ */}
      <GlassCard className="space-y-5 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "FAQ শিরোনাম (বাংলা)" : "FAQ title (Bangla)"}><Input value={config.faqSectionTitleBn} onChange={(e) => updateConfig((p) => ({ ...p, faqSectionTitleBn: e.target.value }))} /></Field>
          <Field label={isBn ? "FAQ শিরোনাম (ইংরেজি)" : "FAQ title (English)"}><Input value={config.faqSectionTitleEn} onChange={(e) => updateConfig((p) => ({ ...p, faqSectionTitleEn: e.target.value }))} /></Field>
        </div>
        <div className="border-t border-border/40 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">{isBn ? "FAQ ক্যাটাগরি" : "FAQ categories"}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((p) => ({ ...p, faqCategories: [...p.faqCategories, createFaqCategory()] }))}><Plus className="h-4 w-4" /> {isBn ? "ক্যাটাগরি" : "Category"}</Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {config.faqCategories.map((category, index) => (
              <div key={category.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 p-2">
                <Input value={category.value} onChange={(e) => patchFaqCat(index, { value: e.target.value })} placeholder="slug" className="w-24 text-xs" />
                <Input value={category.labelBn} onChange={(e) => patchFaqCat(index, { labelBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
                <Input value={category.labelEn} onChange={(e) => patchFaqCat(index, { labelEn: e.target.value })} placeholder="English" className="text-xs" />
                <label className="flex items-center gap-1 text-xs text-muted-foreground"><input type="checkbox" checked={category.visible} onChange={(e) => patchFaqCat(index, { visible: e.target.checked })} />{isBn ? "দৃশ্যমান" : "Visible"}</label>
                <Button type="button" size="icon-sm" variant="ghost" onClick={() => updateConfig((p) => ({ ...p, faqCategories: p.faqCategories.filter((_, i) => i !== index) }))} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-400" /></Button>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-border/40 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">{isBn ? "FAQ আইটেম" : "FAQ items"}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((p) => ({ ...p, faqItems: [...p.faqItems, createFaqItem()] }))}><Plus className="h-4 w-4" /> {isBn ? "আইটেম" : "Item"}</Button>
          </div>
          <div className="space-y-3">
            {config.faqItems.map((item, index) => (
              <div key={item.id} className="rounded-lg border border-border/50 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{isBn ? "FAQ" : "FAQ"} {index + 1}</span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-xs text-muted-foreground"><input type="checkbox" checked={item.visible} onChange={(e) => patchFaqItem(index, { visible: e.target.checked })} />{isBn ? "দৃশ্যমান" : "Visible"}</label>
                    <ReorderControls index={index} count={config.faqItems.length} onMove={(d) => updateConfig((p) => ({ ...p, faqItems: moveItem(p.faqItems, index, d) }))} onRemove={() => updateConfig((p) => ({ ...p, faqItems: p.faqItems.filter((_, i) => i !== index) }))} removeLabel="Delete FAQ" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    <Input value={item.category} onChange={(e) => patchFaqItem(index, { category: e.target.value })} placeholder="category" className="text-xs" />
                    <Input value={item.questionBn} onChange={(e) => patchFaqItem(index, { questionBn: e.target.value })} placeholder="প্রশ্ন (বাংলা)" className="text-xs" />
                    <Input value={item.questionEn} onChange={(e) => patchFaqItem(index, { questionEn: e.target.value })} placeholder="Question (EN)" className="text-xs" />
                  </div>
                  <Textarea rows={2} value={item.answerBn} onChange={(e) => patchFaqItem(index, { answerBn: e.target.value })} placeholder="উত্তর (বাংলা)" className="text-xs" />
                  <Textarea rows={2} value={item.answerEn} onChange={(e) => patchFaqItem(index, { answerEn: e.target.value })} placeholder="Answer (EN)" className="text-xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Legal pages */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "লিগ্যাল পলিসি পেজ" : "Legal policy pages"}</h3>
        <div className="space-y-4">
          {config.legalPages.map((page, index) => (
            <div key={page.key} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{page.key}</span>
                <label className="flex items-center gap-1 text-xs text-muted-foreground"><input type="checkbox" checked={page.visible} onChange={(e) => patchLegal(index, { visible: e.target.checked })} />{isBn ? "দৃশ্যমান" : "Visible"}</label>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input value={page.titleBn} onChange={(e) => patchLegal(index, { titleBn: e.target.value })} placeholder="শিরোনাম (বাংলা)" className="text-xs" />
                <Input value={page.titleEn} onChange={(e) => patchLegal(index, { titleEn: e.target.value })} placeholder="Title (EN)" className="text-xs" />
                <Input value={page.updatedAtBn} onChange={(e) => patchLegal(index, { updatedAtBn: e.target.value })} placeholder="আপডেট (বাংলা)" className="text-xs" />
                <Input value={page.updatedAtEn} onChange={(e) => patchLegal(index, { updatedAtEn: e.target.value })} placeholder="Updated (EN)" className="text-xs" />
                <Textarea rows={6} value={page.bodyBn} onChange={(e) => patchLegal(index, { bodyBn: e.target.value })} placeholder="বডি (বাংলা) — ## শিরোনাম" className="text-xs sm:col-span-2" />
                <Textarea rows={6} value={page.bodyEn} onChange={(e) => patchLegal(index, { bodyEn: e.target.value })} placeholder="Body (EN) — ## Heading" className="text-xs sm:col-span-2" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
