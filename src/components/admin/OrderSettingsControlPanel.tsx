"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_ORDERS_CONFIG, validateOrdersConfig } from "@/lib/orders/config";
import type {
  OrdersConfig,
  OrdersCta,
  OrdersDesignStyle,
  OrdersFeatureAddon,
  OrdersOption,
  OrdersStepLabels,
} from "@/types/orders";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

interface OrderSettingsControlPanelProps {
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
  index,
  count,
  onMove,
  onRemove,
  removeLabel,
}: {
  index: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  removeLabel: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button type="button" size="icon-sm" variant="ghost" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Move up">
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button type="button" size="icon-sm" variant="ghost" disabled={index === count - 1} onClick={() => onMove(1)} aria-label="Move down">
        <ChevronDown className="h-4 w-4" />
      </Button>
      <Button type="button" size="icon-sm" variant="ghost" onClick={onRemove} aria-label={removeLabel}>
        <Trash2 className="h-4 w-4 text-red-400" />
      </Button>
    </div>
  );
}

function OptionEditor({
  option,
  onChange,
  onRemove,
}: {
  option: OrdersOption;
  onChange: (patch: Partial<OrdersOption>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-lg border border-border/50 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={option.visible} onChange={(e) => onChange({ visible: e.target.checked })} />
          {option.value}
        </label>
        <div className="flex items-center gap-1">
          <Button type="button" size="icon-sm" variant="ghost" onClick={onRemove} aria-label="Delete">
            <Trash2 className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Input value={option.value} onChange={(e) => onChange({ value: e.target.value })} placeholder="value" className="text-xs" />
        <Input value={option.labelBn} onChange={(e) => onChange({ labelBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
        <Input value={option.labelEn} onChange={(e) => onChange({ labelEn: e.target.value })} placeholder="English" className="text-xs" />
      </div>
    </div>
  );
}

export function OrderSettingsControlPanel({ locale = "bn" }: OrderSettingsControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<OrdersConfig>(DEFAULT_ORDERS_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/orders-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateOrdersConfig(json.data) ?? DEFAULT_ORDERS_CONFIG);
    } catch {
      setError(isBn ? "অর্ডার কনফিগ লোড করা যায়নি" : "Failed to load Order configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  const updateConfig = (updater: (previous: OrdersConfig) => OrdersConfig) => {
    setConfig((previous) => updater(previous));
  };

  const patchList = <K extends keyof OrdersConfig>(
    key: K,
    index: number,
    patch: Record<string, unknown>
  ) => {
    updateConfig((previous) => {
      const list = previous[key];
      if (!Array.isArray(list)) return previous;
      const next = list.map((item, i) => (i === index ? { ...(item as object), ...patch } : item));
      return { ...previous, [key]: next } as OrdersConfig;
    });
  };

  const addOption = (key: "packages" | "websiteTypes" | "timelineOptions") => {
    updateConfig((previous) => {
      const entry: OrdersOption = {
        id: newId(key),
        value: "",
        labelBn: "নতুন অপশন",
        labelEn: "New option",
        visible: true,
      };
      return { ...previous, [key]: [...(previous[key] as OrdersOption[]), entry] };
    });
  };

  const addAddon = () => {
    updateConfig((previous) => {
      const entry: OrdersFeatureAddon = {
        id: newId("feat"),
        value: "",
        labelBn: "নতুন ফিচার",
        labelEn: "New feature",
        visible: true,
        priceBdt: 0,
        priceUsd: 0,
      };
      return { ...previous, featureAddons: [...previous.featureAddons, entry] };
    });
  };

  const addDesignStyle = () => {
    updateConfig((previous) => {
      const entry: OrdersDesignStyle = {
        id: newId("style"),
        value: "",
        labelBn: "নতুন স্টাইল",
        labelEn: "New style",
        descriptionBn: "",
        descriptionEn: "",
        visible: true,
      };
      return { ...previous, designStyles: [...previous.designStyles, entry] };
    });
  };

  const addIncrement = () => {
    updateConfig((previous) => ({ ...previous, pageIncrements: [...previous.pageIncrements, 1] }));
  };

  const removeIncrement = (index: number) => {
    updateConfig((previous) => ({
      ...previous,
      pageIncrements: previous.pageIncrements.filter((_, i) => i !== index),
    }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const validated = validateOrdersConfig(config);
    if (!validated) {
      setError(
        isBn
          ? "ভ্যালিডেশন ব্যর্থ — খালি প্রয়োজনীয় ফিল্ড পূরণ করুন"
          : "Validation failed — complete required fields"
      );
      setSaving(false);
      return;
    }
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "orders_config", value: validated }),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(json.error || (isBn ? "সংরক্ষণ ব্যর্থ" : "Save failed"));
      } else {
        setSuccess(isBn ? "সফলভাবে সংরক্ষিত হয়েছে" : "Saved successfully");
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

  const section = config.section;
  const steps = config.steps;
  const cta = config.cta;

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="🛒"
        title="Order Intake Wizard Configuration"
        titleBn="অর্ডার উইজার্ড কনফিগারেশন"
        subtitle={isBn ? "অর্ডার ফর্মের অপশন, ধাপ ও বোতাম — এক জায়গা থেকে নিয়ন্ত্রণ করুন" : "Control order form options, steps and buttons from one place"}
        locale={locale}
      />

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>}

      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.visible ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-semibold">{isBn ? "অর্ডার ফর্ম দৃশ্যমান" : "Order form visible"}</span>
            <Badge variant={config.visible ? "default" : "outline"} className="text-[10px]">
              {config.visible ? "ON" : "OFF"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" variant={config.visible ? "outline" : "gradient"} onClick={() => updateConfig((previous) => ({ ...previous, visible: !previous.visible }))}>
              {config.visible ? (isBn ? "লুকান" : "Hide") : isBn ? "দেখান" : "Show"}
            </Button>
            <Button type="button" size="sm" variant="gradient" onClick={save} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isBn ? "সংরক্ষণ করুন" : "Save"}
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Section headings */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "সেকশন হেডিং" : "Section heading"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "ব্যাজ (বাংলা)" : "Badge (Bangla)"}>
            <Input value={section.badgeBn} onChange={(e) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, badgeBn: e.target.value } }))} />
          </Field>
          <Field label={isBn ? "ব্যাজ (ইংরেজি)" : "Badge (English)"}>
            <Input value={section.badgeEn} onChange={(e) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, badgeEn: e.target.value } }))} />
          </Field>
          <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}>
            <Input value={section.titleBn} onChange={(e) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, titleBn: e.target.value } }))} />
          </Field>
          <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}>
            <Input value={section.titleEn} onChange={(e) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, titleEn: e.target.value } }))} />
          </Field>
          <Field label={isBn ? "সাবটাইটেল (বাংলা)" : "Subtitle (Bangla)"} className="sm:col-span-2">
            <Textarea rows={2} value={section.subtitleBn} onChange={(e) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, subtitleBn: e.target.value } }))} />
          </Field>
          <Field label={isBn ? "সাবটাইটেল (ইংরেজি)" : "Subtitle (English)"} className="sm:col-span-2">
            <Textarea rows={2} value={section.subtitleEn} onChange={(e) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, subtitleEn: e.target.value } }))} />
          </Field>
        </div>
      </GlassCard>

      {/* Step labels */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "স্টেপ লেবেল" : "Step labels"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["package", "design", "details", "contact", "review"] as const).map((stepKey) => {
            const bnKey = `${stepKey}Bn` as const;
            const enKey = `${stepKey}En` as const;
            return (
              <div key={stepKey} className="grid grid-cols-2 gap-2">
                <Input value={steps[bnKey]} onChange={(e) => updateConfig((previous) => ({ ...previous, steps: { ...previous.steps, [bnKey]: e.target.value } as OrdersStepLabels }))} placeholder={`${stepKey} (বাংলা)`} className="text-xs" />
                <Input value={steps[enKey]} onChange={(e) => updateConfig((previous) => ({ ...previous, steps: { ...previous.steps, [enKey]: e.target.value } as OrdersStepLabels }))} placeholder={`${stepKey} (English)`} className="text-xs" />
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Packages */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "প্যাকেজ অপশন" : "Package options"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => addOption("packages")}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন প্যাকেজ" : "Add package"}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {config.packages.map((pkg, index) => (
            <div key={pkg.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{isBn ? "প্যাকেজ" : "Package"} {index + 1}</span>
                <ReorderControls index={index} count={config.packages.length} onMove={(d) => updateConfig((previous) => ({ ...previous, packages: moveItem(previous.packages, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, packages: previous.packages.filter((_, i) => i !== index) }))} removeLabel="Delete package" />
              </div>
              <OptionEditor option={pkg} onChange={(patch) => patchList("packages", index, patch)} onRemove={() => updateConfig((previous) => ({ ...previous, packages: previous.packages.filter((_, i) => i !== index) }))} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Website types */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "ওয়েবসাইট টাইপ" : "Website types"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => addOption("websiteTypes")}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন টাইপ" : "Add type"}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {config.websiteTypes.map((type, index) => (
            <div key={type.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{isBn ? "টাইপ" : "Type"} {index + 1}</span>
                <ReorderControls index={index} count={config.websiteTypes.length} onMove={(d) => updateConfig((previous) => ({ ...previous, websiteTypes: moveItem(previous.websiteTypes, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, websiteTypes: previous.websiteTypes.filter((_, i) => i !== index) }))} removeLabel="Delete type" />
              </div>
              <OptionEditor option={type} onChange={(patch) => patchList("websiteTypes", index, patch)} onRemove={() => updateConfig((previous) => ({ ...previous, websiteTypes: previous.websiteTypes.filter((_, i) => i !== index) }))} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Feature add-ons */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "ফিচার অ্যাড-অন" : "Feature add-ons"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={addAddon}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন ফিচার" : "Add feature"}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {config.featureAddons.map((addon, index) => (
            <div key={addon.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{isBn ? "ফিচার" : "Feature"} {index + 1}</span>
                <ReorderControls index={index} count={config.featureAddons.length} onMove={(d) => updateConfig((previous) => ({ ...previous, featureAddons: moveItem(previous.featureAddons, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, featureAddons: previous.featureAddons.filter((_, i) => i !== index) }))} removeLabel="Delete feature" />
              </div>
              <div className="rounded-lg border border-border/50 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input type="checkbox" checked={addon.visible} onChange={(e) => patchList("featureAddons", index, { visible: e.target.checked })} />
                    {addon.value || "—"}
                  </label>
                  <Button type="button" size="icon-sm" variant="ghost" onClick={() => updateConfig((previous) => ({ ...previous, featureAddons: previous.featureAddons.filter((_, i) => i !== index) }))} aria-label="Delete">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <Input value={addon.value} onChange={(e) => patchList("featureAddons", index, { value: e.target.value })} placeholder="value" className="text-xs" />
                  <Input value={addon.labelBn} onChange={(e) => patchList("featureAddons", index, { labelBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
                  <Input value={addon.labelEn} onChange={(e) => patchList("featureAddons", index, { labelEn: e.target.value })} placeholder="English" className="text-xs" />
                  <Field label={isBn ? "অ্যাড-অন মূল্য (৳)" : "Add-on price (BDT)"}>
                    <Input type="number" min={0} value={addon.priceBdt} onChange={(e) => patchList("featureAddons", index, { priceBdt: Math.max(0, Number(e.target.value) || 0) })} className="text-xs" />
                  </Field>
                  <Field label={isBn ? "অ্যাড-অন মূল্য ($)" : "Add-on price (USD)"}>
                    <Input type="number" min={0} value={addon.priceUsd} onChange={(e) => patchList("featureAddons", index, { priceUsd: Math.max(0, Number(e.target.value) || 0) })} className="text-xs" />
                  </Field>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Design styles */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "ডিজাইন স্টাইল অপশন" : "Design style options"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={addDesignStyle}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন স্টাইল" : "Add style"}
          </Button>
        </div>
        <div className="space-y-3">
          {config.designStyles.map((style, index) => (
            <div key={style.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{isBn ? "স্টাইল" : "Style"} {index + 1}</span>
                <ReorderControls index={index} count={config.designStyles.length} onMove={(d) => updateConfig((previous) => ({ ...previous, designStyles: moveItem(previous.designStyles, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, designStyles: previous.designStyles.filter((_, i) => i !== index) }))} removeLabel="Delete style" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input value={style.value} onChange={(e) => patchList("designStyles", index, { value: e.target.value })} placeholder="value" className="text-xs" />
                <Input value={style.labelBn} onChange={(e) => patchList("designStyles", index, { labelBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
                <Input value={style.labelEn} onChange={(e) => patchList("designStyles", index, { labelEn: e.target.value })} placeholder="English" className="text-xs" />
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Input value={style.descriptionBn} onChange={(e) => patchList("designStyles", index, { descriptionBn: e.target.value })} placeholder={isBn ? "বিবরণ (বাংলা)" : "Description (Bangla)"} className="text-xs" />
                <Input value={style.descriptionEn} onChange={(e) => patchList("designStyles", index, { descriptionEn: e.target.value })} placeholder="Description (English)" className="text-xs" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Page increments */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "পেজ সংখ্যা বৃদ্ধির অপশন" : "Page-count increments"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={addIncrement}>
            <Plus className="h-4 w-4" /> {isBn ? "বৃদ্ধি" : "Increment"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {config.pageIncrements.map((value, index) => (
            <div key={index} className="flex items-center gap-1 rounded-lg border border-border/60 px-2 py-1">
              <Input
                type="number"
                min={1}
                value={value}
                onChange={(e) =>
                  updateConfig((previous) => ({
                    ...previous,
                    pageIncrements: previous.pageIncrements.map((v, i) =>
                      i === index ? (Number(e.target.value) || 1) : v
                    ),
                  }))
                }
                className="w-20 text-xs"
              />
              <span className="text-xs text-muted-foreground">{isBn ? "পেজ" : "pg"}</span>
              <Button type="button" size="icon-sm" variant="ghost" onClick={() => removeIncrement(index)} aria-label="Remove">
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Live quote pricing */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">{isBn ? "লাইভ কোট সেটিংস" : "Live quote settings"}</h3>
            <p className="mt-1 text-xs text-muted-foreground bn">
              {isBn
                ? "প্যাকেজের বেস মূল্যের সাথে অতিরিক্ত পেজ ও ফিচারের মূল্য যোগ হবে"
                : "Extra pages and feature prices are added to the package base price"}
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={config.quote.enabled}
              onChange={(e) => updateConfig((previous) => ({ ...previous, quote: { ...previous.quote, enabled: e.target.checked } }))}
            />
            {isBn ? "লাইভ কোট চালু" : "Enable live quote"}
          </label>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label={isBn ? "প্রতি অতিরিক্ত পেজ (৳)" : "Per extra page (BDT)"}>
            <Input
              type="number"
              min={0}
              value={config.quote.pagePriceBdt}
              onChange={(e) => updateConfig((previous) => ({ ...previous, quote: { ...previous.quote, pagePriceBdt: Math.max(0, Number(e.target.value) || 0) } }))}
            />
          </Field>
          <Field label={isBn ? "প্রতি অতিরিক্ত পেজ ($)" : "Per extra page (USD)"}>
            <Input
              type="number"
              min={0}
              value={config.quote.pagePriceUsd}
              onChange={(e) => updateConfig((previous) => ({ ...previous, quote: { ...previous.quote, pagePriceUsd: Math.max(0, Number(e.target.value) || 0) } }))}
            />
          </Field>
          <Field label={isBn ? "রেঞ্জ মার্জিন (%)" : "Range margin (%)"}>
            <Input
              type="number"
              min={0}
              max={100}
              value={config.quote.rangePercent}
              onChange={(e) => updateConfig((previous) => ({ ...previous, quote: { ...previous.quote, rangePercent: Math.min(100, Math.max(0, Number(e.target.value) || 0)) } }))}
            />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "কোট শিরোনাম (বাংলা)" : "Quote title (Bangla)"}>
            <Input value={config.quote.titleBn} onChange={(e) => updateConfig((previous) => ({ ...previous, quote: { ...previous.quote, titleBn: e.target.value } }))} />
          </Field>
          <Field label={isBn ? "কোট শিরোনাম (ইংরেজি)" : "Quote title (English)"}>
            <Input value={config.quote.titleEn} onChange={(e) => updateConfig((previous) => ({ ...previous, quote: { ...previous.quote, titleEn: e.target.value } }))} />
          </Field>
          <Field label={isBn ? "দাবিত্যাগ (বাংলা)" : "Disclaimer (Bangla)"}>
            <Textarea rows={2} value={config.quote.disclaimerBn} onChange={(e) => updateConfig((previous) => ({ ...previous, quote: { ...previous.quote, disclaimerBn: e.target.value } }))} />
          </Field>
          <Field label={isBn ? "দাবিত্যাগ (ইংরেজি)" : "Disclaimer (English)"}>
            <Textarea rows={2} value={config.quote.disclaimerEn} onChange={(e) => updateConfig((previous) => ({ ...previous, quote: { ...previous.quote, disclaimerEn: e.target.value } }))} />
          </Field>
        </div>
      </GlassCard>

      {/* Budget ranges */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "বাজেট রেঞ্জ" : "Budget ranges"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, budgetRanges: [...previous.budgetRanges, { id: newId("budget"), value: "", label: "", visible: true }] }))}>
            <Plus className="h-4 w-4" /> {isBn ? "রেঞ্জ" : "Range"}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {config.budgetRanges.map((range, index) => (
            <div key={range.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={range.visible} onChange={(e) => patchList("budgetRanges", index, { visible: e.target.checked })} />
                  {isBn ? "রেঞ্জ" : "Range"} {index + 1}
                </label>
                <Button type="button" size="icon-sm" variant="ghost" onClick={() => updateConfig((previous) => ({ ...previous, budgetRanges: previous.budgetRanges.filter((_, i) => i !== index) }))} aria-label="Delete">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input value={range.value} onChange={(e) => patchList("budgetRanges", index, { value: e.target.value })} placeholder="value" className="text-xs" />
                <Input value={range.label} onChange={(e) => patchList("budgetRanges", index, { label: e.target.value })} placeholder="৳5,000 - ৳10,000" className="text-xs" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Timeline options */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "টাইমলাইন অপশন" : "Timeline options"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => addOption("timelineOptions")}>
            <Plus className="h-4 w-4" /> {isBn ? "টাইমলাইন" : "Timeline"}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {config.timelineOptions.map((time, index) => (
            <div key={time.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{isBn ? "টাইমলাইন" : "Timeline"} {index + 1}</span>
                <ReorderControls index={index} count={config.timelineOptions.length} onMove={(d) => updateConfig((previous) => ({ ...previous, timelineOptions: moveItem(previous.timelineOptions, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, timelineOptions: previous.timelineOptions.filter((_, i) => i !== index) }))} removeLabel="Delete timeline" />
              </div>
              <OptionEditor option={time} onChange={(patch) => patchList("timelineOptions", index, patch)} onRemove={() => updateConfig((previous) => ({ ...previous, timelineOptions: previous.timelineOptions.filter((_, i) => i !== index) }))} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* CTA labels */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "CTA বোতাম ও সাফল্য বার্তা" : "CTA buttons & success message"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["next", "back", "submit", "submitting", "successTitle", "successMessage"] as const).map((key) => {
            const bnKey = `${key}Bn` as const;
            const enKey = `${key}En` as const;
            const isLong = key === "successMessage";
            return (
              <div key={key} className={isLong ? "sm:col-span-2 grid grid-cols-2 gap-2" : "grid grid-cols-2 gap-2"}>
                {isLong ? (
                  <>
                    <Textarea rows={2} value={cta[bnKey]} onChange={(e) => updateConfig((previous) => ({ ...previous, cta: { ...previous.cta, [bnKey]: e.target.value } as OrdersCta }))} placeholder={`${key} (বাংলা)`} className="text-xs" />
                    <Textarea rows={2} value={cta[enKey]} onChange={(e) => updateConfig((previous) => ({ ...previous, cta: { ...previous.cta, [enKey]: e.target.value } as OrdersCta }))} placeholder={`${key} (English)`} className="text-xs" />
                  </>
                ) : (
                  <>
                    <Input value={cta[bnKey]} onChange={(e) => updateConfig((previous) => ({ ...previous, cta: { ...previous.cta, [bnKey]: e.target.value } as OrdersCta }))} placeholder={`${key} (বাংলা)`} className="text-xs" />
                    <Input value={cta[enKey]} onChange={(e) => updateConfig((previous) => ({ ...previous, cta: { ...previous.cta, [enKey]: e.target.value } as OrdersCta }))} placeholder={`${key} (English)`} className="text-xs" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>
    </section>
  );
}
