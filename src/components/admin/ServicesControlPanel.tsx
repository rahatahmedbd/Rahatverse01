"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_SERVICES_CONFIG, validateServicesConfig } from "@/lib/services/config";
import { SERVICES_ICON_OPTIONS } from "@/lib/services/icons";
import type {
  ServiceBadgeVariant,
  ServicesCta,
  ServicesComparisonRow,
  ServicesConfig,
  ServicesFeaturedPackage,
  ServicesFeature,
  ServicesIconName,
  ServicesPackage,
  ServicesProcessStep,
  ServicesSectionContent,
  ServicesService,
  ServicesWebsiteType,
} from "@/types/services";
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

interface ServicesControlPanelProps {
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

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function SectionFields({
  section,
  onChange,
  isBn,
}: {
  section: ServicesSectionContent;
  onChange: (patch: Partial<ServicesSectionContent>) => void;
  isBn: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label={isBn ? "ব্যাজ (বাংলা)" : "Badge (Bangla)"}>
        <Input value={section.badgeBn} onChange={(event) => onChange({ badgeBn: event.target.value })} />
      </Field>
      <Field label={isBn ? "ব্যাজ (ইংরেজি)" : "Badge (English)"}>
        <Input value={section.badgeEn} onChange={(event) => onChange({ badgeEn: event.target.value })} />
      </Field>
      <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}>
        <Input value={section.titleBn} onChange={(event) => onChange({ titleBn: event.target.value })} />
      </Field>
      <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}>
        <Input value={section.titleEn} onChange={(event) => onChange({ titleEn: event.target.value })} />
      </Field>
      <Field label={isBn ? "সাবটাইটেল (বাংলা)" : "Subtitle (Bangla)"}>
        <Textarea rows={2} value={section.subtitleBn} onChange={(event) => onChange({ subtitleBn: event.target.value })} />
      </Field>
      <Field label={isBn ? "সাবটাইটেল (ইংরেজি)" : "Subtitle (English)"}>
        <Textarea rows={2} value={section.subtitleEn} onChange={(event) => onChange({ subtitleEn: event.target.value })} />
      </Field>
    </div>
  );
}

function CtaFields({
  cta,
  onChange,
  isBn,
}: {
  cta: ServicesCta;
  onChange: (patch: Partial<ServicesCta>) => void;
  isBn: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}>
        <Input value={cta.titleBn} onChange={(event) => onChange({ titleBn: event.target.value })} />
      </Field>
      <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}>
        <Input value={cta.titleEn} onChange={(event) => onChange({ titleEn: event.target.value })} />
      </Field>
      <Field label={isBn ? "সাবটাইটেল (বাংলা)" : "Subtitle (Bangla)"}>
        <Textarea rows={2} value={cta.subtitleBn} onChange={(event) => onChange({ subtitleBn: event.target.value })} />
      </Field>
      <Field label={isBn ? "সাবটাইটেল (ইংরেজি)" : "Subtitle (English)"}>
        <Textarea rows={2} value={cta.subtitleEn} onChange={(event) => onChange({ subtitleEn: event.target.value })} />
      </Field>
      <Field label={isBn ? "প্রাইমারি বাটন (বাংলা)" : "Primary button (Bangla)"}>
        <Input value={cta.primaryLabelBn} onChange={(event) => onChange({ primaryLabelBn: event.target.value })} />
      </Field>
      <Field label={isBn ? "প্রাইমারি বাটন (ইংরেজি)" : "Primary button (English)"}>
        <Input value={cta.primaryLabelEn} onChange={(event) => onChange({ primaryLabelEn: event.target.value })} />
      </Field>
      <Field label={isBn ? "সেকেন্ডারি বাটন (বাংলা)" : "Secondary button (Bangla)"}>
        <Input value={cta.secondaryLabelBn} onChange={(event) => onChange({ secondaryLabelBn: event.target.value })} />
      </Field>
      <Field label={isBn ? "সেকেন্ডারি বাটন (ইংরেজি)" : "Secondary button (English)"}>
        <Input value={cta.secondaryLabelEn} onChange={(event) => onChange({ secondaryLabelEn: event.target.value })} />
      </Field>
    </div>
  );
}

// ── Item factories ─────────────────────────────────────
function createService(): ServicesService {
  return {
    id: newId("service"),
    visible: true,
    icon: "Code",
    titleBn: "নতুন সেবা",
    titleEn: "New service",
    descriptionBn: "সেবার বিবরণ",
    descriptionEn: "Service description",
    featuresBn: ["ফিচার ১"],
    featuresEn: ["Feature 1"],
    priceBn: "",
    priceEn: "",
    deliveryBn: "",
    deliveryEn: "",
  };
}

function createWebsiteType(): ServicesWebsiteType {
  return { id: newId("type"), visible: true, icon: "Globe", labelBn: "নতুন ধরন", labelEn: "New type" };
}

function createFeature(): ServicesFeature {
  return {
    id: newId("feat"),
    visible: true,
    icon: "Zap",
    titleBn: "নতুন ফিচার",
    titleEn: "New feature",
    descriptionBn: "বিবরণ",
    descriptionEn: "Description",
  };
}

function createFeaturedPackage(): ServicesFeaturedPackage {
  return {
    id: newId("featured"),
    visible: true,
    icon: "Globe",
    titleBn: "নতুন প্যাকেজ",
    titleEn: "New featured package",
    subtitleBn: "সাবটাইটেল",
    subtitleEn: "Subtitle",
    badgeBn: "জনপ্রিয়",
    badgeEn: "Popular",
    badgeVariant: "glow",
    featuresBn: ["ফিচার ১"],
    featuresEn: ["Feature 1"],
  };
}

function createPackage(): ServicesPackage {
  return {
    id: newId("pkg"),
    visible: true,
    nameBn: "নতুন প্যাকেজ",
    nameEn: "New package",
    priceBdt: 5000,
    priceUsd: 60,
    descriptionBn: "বিবরণ",
    descriptionEn: "Description",
    featuresBn: ["ফিচার ১"],
    featuresEn: ["Feature 1"],
    popular: false,
    ctaBn: "অর্ডার করুন",
    ctaEn: "Order Now",
  };
}

function createComparisonRow(packageIds: string[]): ServicesComparisonRow {
  const values: Record<string, string> = {};
  for (const id of packageIds) values[id] = "—";
  return { id: newId("cmp"), featureBn: "নতুন বৈশিষ্ট্য", featureEn: "New feature", values };
}

function createProcessStep(): ServicesProcessStep {
  return {
    id: newId("step"),
    stepBn: "০৬",
    stepEn: "06",
    titleBn: "নতুন ধাপ",
    titleEn: "New step",
    descriptionBn: "বিবরণ",
    descriptionEn: "Description",
  };
}

// ── Main Panel ─────────────────────────────────────────
export function ServicesControlPanel({ locale = "bn" }: ServicesControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<ServicesConfig>(DEFAULT_SERVICES_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/services-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateServicesConfig(json.data) ?? DEFAULT_SERVICES_CONFIG);
    } catch {
      setError(isBn ? "সার্ভিস কনফিগ লোড করা যায়নি" : "Failed to load Services configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  const updateConfig = (updater: (previous: ServicesConfig) => ServicesConfig) => {
    setConfig((previous) => updater(previous));
  };

  const patchService = (index: number, patch: Partial<ServicesService>) => {
    updateConfig((previous) => ({
      ...previous,
      services: previous.services.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };
  const patchType = (index: number, patch: Partial<ServicesWebsiteType>) => {
    updateConfig((previous) => ({
      ...previous,
      websiteTypes: previous.websiteTypes.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };
  const patchFeature = (index: number, patch: Partial<ServicesFeature>) => {
    updateConfig((previous) => ({
      ...previous,
      features: previous.features.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };
  const patchFeatured = (index: number, patch: Partial<ServicesFeaturedPackage>) => {
    updateConfig((previous) => ({
      ...previous,
      featuredPackages: previous.featuredPackages.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };
  const patchPackage = (index: number, patch: Partial<ServicesPackage>) => {
    updateConfig((previous) => ({
      ...previous,
      packages: previous.packages.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };
  const patchComparisonRow = (index: number, patch: Partial<ServicesComparisonRow>) => {
    updateConfig((previous) => ({
      ...previous,
      comparisonRows: previous.comparisonRows.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };
  const patchComparisonValue = (rowIndex: number, packageId: string, value: string) => {
    updateConfig((previous) => ({
      ...previous,
      comparisonRows: previous.comparisonRows.map((item, i) =>
        i === rowIndex
          ? { ...item, values: { ...item.values, [packageId]: value } }
          : item
      ),
    }));
  };
  const patchStep = (index: number, patch: Partial<ServicesProcessStep>) => {
    updateConfig((previous) => ({
      ...previous,
      processSteps: previous.processSteps.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const validated = validateServicesConfig(config);
    if (!validated) {
      setError(
        isBn
          ? "ভ্যালিডেশন ব্যর্থ — খালি প্রয়োজনীয় ফিল্ড পূরণ করুন এবং আইটেমের সীমা মেনে চলুন"
          : "Validation failed — complete required fields and respect the item limits"
      );
      setSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "services_config", value: validated }),
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

  const packageIds = config.packages.map((p) => p.id);
  const badgeVariantOptions: ServiceBadgeVariant[] = ["gradient", "glow", "outline", "secondary", "default"];

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="💼"
        title="Services, Pricing & Process Control"
        titleBn="সেবা, প্যাকেজ ও প্রক্রিয়া কন্ট্রোল"
        subtitle={isBn ? "সেবা কার্ড, প্যাকেজ, তুলনা টেবিল এবং ওয়ার্কফ্লো — এক জায়গা থেকে নিয়ন্ত্রণ করুন" : "Service cards, packages, comparison matrix, and workflow — all from one place"}
        locale={locale}
      />

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>}

      {/* Visibility + Save */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.visible ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-semibold">{isBn ? "সেবা কনটেন্ট দৃশ্যমান" : "Services content visible"}</span>
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
        <h3 className="text-sm font-semibold">{isBn ? "সেকশন হেডিং" : "Section headings"}</h3>
        <div>
          <h4 className="mb-2 text-xs font-medium text-muted-foreground">{isBn ? "প্রধান সেবা সেকশন" : "Main services section"}</h4>
          <SectionFields section={config.section} onChange={(patch) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, ...patch } }))} isBn={isBn} />
        </div>
      </GlassCard>

      {/* Services */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "সেবা অফারিং" : "Service offerings"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, services: [...previous.services, createService()] }))}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন সেবা" : "Add service"}
          </Button>
        </div>
        <div className="space-y-4">
          {config.services.map((service, index) => (
            <div key={service.id} className="rounded-lg border border-border/50 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={service.visible} onChange={(event) => patchService(index, { visible: event.target.checked })} />
                  <span className="text-xs text-muted-foreground">
                    {isBn ? "দৃশ্যমান" : "Visible"} {index + 1}
                  </span>
                </div>
                <ReorderControls index={index} count={config.services.length} onMove={(d) => updateConfig((previous) => ({ ...previous, services: moveItem(previous.services, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, services: previous.services.filter((_, i) => i !== index) }))} removeLabel="Delete service" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField label={isBn ? "আইকন" : "Icon"} value={service.icon} options={SERVICES_ICON_OPTIONS} onChange={(value) => patchService(index, { icon: value as ServicesIconName })} />
                <Field label="ID">
                  <Input value={service.id} onChange={(event) => patchService(index, { id: event.target.value })} />
                </Field>
                <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}>
                  <Input value={service.titleBn} onChange={(event) => patchService(index, { titleBn: event.target.value })} />
                </Field>
                <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}>
                  <Input value={service.titleEn} onChange={(event) => patchService(index, { titleEn: event.target.value })} />
                </Field>
                <Field label={isBn ? "বিবরণ (বাংলা)" : "Description (Bangla)"} className="sm:col-span-2">
                  <Textarea rows={2} value={service.descriptionBn} onChange={(event) => patchService(index, { descriptionBn: event.target.value })} />
                </Field>
                <Field label={isBn ? "বিবরণ (ইংরেজি)" : "Description (English)"} className="sm:col-span-2">
                  <Textarea rows={2} value={service.descriptionEn} onChange={(event) => patchService(index, { descriptionEn: event.target.value })} />
                </Field>
                <Field label={isBn ? "দাম (বাংলা)" : "Price (Bangla)"} className="sm:col-span-1">
                  <Input value={service.priceBn} onChange={(event) => patchService(index, { priceBn: event.target.value })} placeholder="৳5,000 - ৳30,000" />
                </Field>
                <Field label={isBn ? "দাম (ইংরেজি)" : "Price (English)"}>
                  <Input value={service.priceEn} onChange={(event) => patchService(index, { priceEn: event.target.value })} placeholder="৳5,000 - ৳30,000" />
                </Field>
                <Field label={isBn ? "ডেলিভারি সময় (বাংলা)" : "Delivery (Bangla)"}>
                  <Input value={service.deliveryBn} onChange={(event) => patchService(index, { deliveryBn: event.target.value })} placeholder="১-৩ সপ্তাহ ডেলিভারি" />
                </Field>
                <Field label={isBn ? "ডেলিভারি সময় (ইংরেজি)" : "Delivery (English)"}>
                  <Input value={service.deliveryEn} onChange={(event) => patchService(index, { deliveryEn: event.target.value })} placeholder="1-3 week delivery" />
                </Field>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label={isBn ? "ফিচার পয়েন্ট (বাংলা — প্রতি লাইনে একটি)" : "Feature points (Bangla — one per line)"}>
                  <Textarea rows={3} value={service.featuresBn.join("\n")} onChange={(event) => patchService(index, { featuresBn: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean) })} />
                </Field>
                <Field label={isBn ? "ফিচার পয়েন্ট (ইংরেজি)" : "Feature points (English)"}>
                  <Textarea rows={3} value={service.featuresEn.join("\n")} onChange={(event) => patchService(index, { featuresEn: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean) })} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Website Types */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "ওয়েবসাইটের ধরন" : "Website types"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, websiteTypes: [...previous.websiteTypes, createWebsiteType()] }))}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন ধরন" : "Add type"}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {config.websiteTypes.map((type, index) => (
            <div key={type.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={type.visible} onChange={(event) => patchType(index, { visible: event.target.checked })} />
                  <span className="text-xs text-muted-foreground">{isBn ? "দৃশ্যমান" : "Visible"}</span>
                </div>
                <ReorderControls index={index} count={config.websiteTypes.length} onMove={(d) => updateConfig((previous) => ({ ...previous, websiteTypes: moveItem(previous.websiteTypes, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, websiteTypes: previous.websiteTypes.filter((_, i) => i !== index) }))} removeLabel="Delete type" />
              </div>
              <div className="grid gap-2">
                <SelectField label="Icon" value={type.icon} options={SERVICES_ICON_OPTIONS} onChange={(value) => patchType(index, { icon: value as ServicesIconName })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input value={type.labelBn} onChange={(event) => patchType(index, { labelBn: event.target.value })} placeholder="বাংলা" />
                  <Input value={type.labelEn} onChange={(event) => patchType(index, { labelEn: event.target.value })} placeholder="English" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Features (why choose us) */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "কেন আমরা (ফিচার গ্রিড)" : "Why-choose-us features"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, features: [...previous.features, createFeature()] }))}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন ফিচার" : "Add feature"}
          </Button>
        </div>
        <div className="space-y-3">
          {config.features.map((feature, index) => (
            <div key={feature.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={feature.visible} onChange={(event) => patchFeature(index, { visible: event.target.checked })} />
                  <span className="text-xs text-muted-foreground">{isBn ? "দৃশ্যমান" : "Visible"} {index + 1}</span>
                </div>
                <ReorderControls index={index} count={config.features.length} onMove={(d) => updateConfig((previous) => ({ ...previous, features: moveItem(previous.features, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, features: previous.features.filter((_, i) => i !== index) }))} removeLabel="Delete feature" />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <SelectField label="Icon" value={feature.icon} options={SERVICES_ICON_OPTIONS} onChange={(value) => patchFeature(index, { icon: value as ServicesIconName })} />
                <div className="grid grid-cols-2 gap-2">
                  <Input value={feature.titleBn} onChange={(event) => patchFeature(index, { titleBn: event.target.value })} placeholder="শিরোনাম (বাংলা)" />
                  <Input value={feature.titleEn} onChange={(event) => patchFeature(index, { titleEn: event.target.value })} placeholder="Title (English)" />
                </div>
                <Input value={feature.descriptionBn} onChange={(event) => patchFeature(index, { descriptionBn: event.target.value })} placeholder="বিবরণ (বাংলা)" className="sm:col-span-2" />
                <Input value={feature.descriptionEn} onChange={(event) => patchFeature(index, { descriptionEn: event.target.value })} placeholder="Description (English)" className="sm:col-span-2" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Featured packages (home flip cards) */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "ফিচারড প্যাকেজ (হোম ফ্লিপ কার্ড)" : "Featured packages (home flip cards)"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, featuredPackages: [...previous.featuredPackages, createFeaturedPackage()] }))}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন প্যাকেজ" : "Add package"}
          </Button>
        </div>
        <div className="space-y-4">
          {config.featuredPackages.map((pkg, index) => (
            <div key={pkg.id} className="rounded-lg border border-border/50 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={pkg.visible} onChange={(event) => patchFeatured(index, { visible: event.target.checked })} />
                  <span className="text-xs text-muted-foreground">{isBn ? "দৃশ্যমান" : "Visible"} {index + 1}</span>
                </div>
                <ReorderControls index={index} count={config.featuredPackages.length} onMove={(d) => updateConfig((previous) => ({ ...previous, featuredPackages: moveItem(previous.featuredPackages, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, featuredPackages: previous.featuredPackages.filter((_, i) => i !== index) }))} removeLabel="Delete featured package" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField label="Icon" value={pkg.icon} options={SERVICES_ICON_OPTIONS} onChange={(value) => patchFeatured(index, { icon: value as ServicesIconName })} />
                <SelectField label={isBn ? "ব্যাজ স্টাইল" : "Badge variant"} value={pkg.badgeVariant} options={badgeVariantOptions} onChange={(value) => patchFeatured(index, { badgeVariant: value as ServiceBadgeVariant })} />
                <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}>
                  <Input value={pkg.titleBn} onChange={(event) => patchFeatured(index, { titleBn: event.target.value })} />
                </Field>
                <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}>
                  <Input value={pkg.titleEn} onChange={(event) => patchFeatured(index, { titleEn: event.target.value })} />
                </Field>
                <Field label={isBn ? "সাবটাইটেল (বাংলা)" : "Subtitle (Bangla)"} className="sm:col-span-2">
                  <Textarea rows={2} value={pkg.subtitleBn} onChange={(event) => patchFeatured(index, { subtitleBn: event.target.value })} />
                </Field>
                <Field label={isBn ? "সাবটাইটেল (ইংরেজি)" : "Subtitle (English)"} className="sm:col-span-2">
                  <Textarea rows={2} value={pkg.subtitleEn} onChange={(event) => patchFeatured(index, { subtitleEn: event.target.value })} />
                </Field>
                <Field label={isBn ? "ব্যাজ (বাংলা)" : "Badge (Bangla)"}>
                  <Input value={pkg.badgeBn} onChange={(event) => patchFeatured(index, { badgeBn: event.target.value })} />
                </Field>
                <Field label={isBn ? "ব্যাজ (ইংরেজি)" : "Badge (English)"}>
                  <Input value={pkg.badgeEn} onChange={(event) => patchFeatured(index, { badgeEn: event.target.value })} />
                </Field>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label={isBn ? "ফিচার (বাংলা — প্রতি লাইনে একটি)" : "Features (Bangla — one per line)"}>
                  <Textarea rows={3} value={pkg.featuresBn.join("\n")} onChange={(event) => patchFeatured(index, { featuresBn: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean) })} />
                </Field>
                <Field label={isBn ? "ফিচার (ইংরেজি)" : "Features (English)"}>
                  <Textarea rows={3} value={pkg.featuresEn.join("\n")} onChange={(event) => patchFeatured(index, { featuresEn: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean) })} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Pricing packages */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "প্রাইসিং প্যাকেজ" : "Pricing packages"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, packages: [...previous.packages, createPackage()] }))}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন প্যাকেজ" : "Add package"}
          </Button>
        </div>
        <div>
          <h4 className="mb-2 text-xs font-medium text-muted-foreground">{isBn ? "প্রাইসিং সেকশন হেডিং" : "Pricing section heading"}</h4>
          <SectionFields section={config.pricingSection} onChange={(patch) => updateConfig((previous) => ({ ...previous, pricingSection: { ...previous.pricingSection, ...patch } }))} isBn={isBn} />
        </div>
        <div className="space-y-4">
          {config.packages.map((pkg, index) => (
            <div key={pkg.id} className="rounded-lg border border-border/50 p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={pkg.visible} onChange={(event) => patchPackage(index, { visible: event.target.checked })} />
                  <span className="text-xs text-muted-foreground">{isBn ? "দৃশ্যমান" : "Visible"}</span>
                  <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <input type="checkbox" checked={pkg.popular} onChange={(event) => patchPackage(index, { popular: event.target.checked })} />
                    {isBn ? "জনপ্রিয়" : "Popular"}
                  </label>
                </div>
                <ReorderControls index={index} count={config.packages.length} onMove={(d) => updateConfig((previous) => ({ ...previous, packages: moveItem(previous.packages, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, packages: previous.packages.filter((_, i) => i !== index) }))} removeLabel="Delete package" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={isBn ? "নাম (বাংলা)" : "Name (Bangla)"}>
                  <Input value={pkg.nameBn} onChange={(event) => patchPackage(index, { nameBn: event.target.value })} />
                </Field>
                <Field label={isBn ? "নাম (ইংরেজি)" : "Name (English)"}>
                  <Input value={pkg.nameEn} onChange={(event) => patchPackage(index, { nameEn: event.target.value })} />
                </Field>
                <Field label={isBn ? "দাম (BDT ৳) — 0 মানে যোগাযোগ" : "Price (BDT ৳) — 0 means contact"}>
                  <Input type="number" min={0} value={pkg.priceBdt} onChange={(event) => patchPackage(index, { priceBdt: Number(event.target.value) || 0 })} />
                </Field>
                <Field label={isBn ? "দাম (USD $)" : "Price (USD $)"}>
                  <Input type="number" min={0} value={pkg.priceUsd} onChange={(event) => patchPackage(index, { priceUsd: Number(event.target.value) || 0 })} />
                </Field>
                <Field label={isBn ? "বিবরণ (বাংলা)" : "Description (Bangla)"} className="sm:col-span-2">
                  <Input value={pkg.descriptionBn} onChange={(event) => patchPackage(index, { descriptionBn: event.target.value })} />
                </Field>
                <Field label={isBn ? "বিবরণ (ইংরেজি)" : "Description (English)"} className="sm:col-span-2">
                  <Input value={pkg.descriptionEn} onChange={(event) => patchPackage(index, { descriptionEn: event.target.value })} />
                </Field>
                <Field label={isBn ? "CTA (বাংলা)" : "CTA (Bangla)"}>
                  <Input value={pkg.ctaBn} onChange={(event) => patchPackage(index, { ctaBn: event.target.value })} />
                </Field>
                <Field label={isBn ? "CTA (ইংরেজি)" : "CTA (English)"}>
                  <Input value={pkg.ctaEn} onChange={(event) => patchPackage(index, { ctaEn: event.target.value })} />
                </Field>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label={isBn ? "ফিচার (বাংলা — প্রতি লাইনে একটি)" : "Features (Bangla — one per line)"}>
                  <Textarea rows={3} value={pkg.featuresBn.join("\n")} onChange={(event) => patchPackage(index, { featuresBn: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean) })} />
                </Field>
                <Field label={isBn ? "ফিচার (ইংরেজি)" : "Features (English)"}>
                  <Textarea rows={3} value={pkg.featuresEn.join("\n")} onChange={(event) => patchPackage(index, { featuresEn: event.target.value.split("\n").map((line) => line.trim()).filter(Boolean) })} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Comparison matrix */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "তুলনা টেবিল" : "Comparison matrix"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, comparisonRows: [...previous.comparisonRows, createComparisonRow(packageIds)] }))}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন সারি" : "Add row"}
          </Button>
        </div>
        <div>
          <h4 className="mb-2 text-xs font-medium text-muted-foreground">{isBn ? "তুলনা সেকশন হেডিং" : "Comparison section heading"}</h4>
          <SectionFields section={config.comparisonSection} onChange={(patch) => updateConfig((previous) => ({ ...previous, comparisonSection: { ...previous.comparisonSection, ...patch } }))} isBn={isBn} />
        </div>
        <div className="space-y-3">
          {config.comparisonRows.map((row, index) => (
            <div key={row.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">{isBn ? "সারি" : "Row"} {index + 1}</span>
                <ReorderControls index={index} count={config.comparisonRows.length} onMove={(d) => updateConfig((previous) => ({ ...previous, comparisonRows: moveItem(previous.comparisonRows, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, comparisonRows: previous.comparisonRows.filter((_, i) => i !== index) }))} removeLabel="Delete comparison row" />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input value={row.featureBn} onChange={(event) => patchComparisonRow(index, { featureBn: event.target.value })} placeholder="বৈশিষ্ট্য (বাংলা)" />
                <Input value={row.featureEn} onChange={(event) => patchComparisonRow(index, { featureEn: event.target.value })} placeholder="Feature (English)" />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {packageIds.map((packageId) => (
                  <Field key={packageId} label={isBn ? "প্যাকেজ:" : "Package:"} className="text-[10px]">
                    <Input value={row.values?.[packageId] ?? "—"} onChange={(event) => patchComparisonValue(index, packageId, event.target.value)} placeholder={packageId} />
                  </Field>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Process timeline */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "ওয়ার্কফ্লো প্রক্রিয়া" : "Workflow process"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, processSteps: [...previous.processSteps, createProcessStep()] }))}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন ধাপ" : "Add step"}
          </Button>
        </div>
        <div>
          <h4 className="mb-2 text-xs font-medium text-muted-foreground">{isBn ? "প্রক্রিয়া সেকশন হেডিং" : "Process section heading"}</h4>
          <SectionFields section={config.processSection} onChange={(patch) => updateConfig((previous) => ({ ...previous, processSection: { ...previous.processSection, ...patch } }))} isBn={isBn} />
        </div>
        <div className="space-y-3">
          {config.processSteps.map((step, index) => (
            <div key={step.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">{isBn ? "ধাপ" : "Step"} {index + 1}</span>
                <ReorderControls index={index} count={config.processSteps.length} onMove={(d) => updateConfig((previous) => ({ ...previous, processSteps: moveItem(previous.processSteps, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, processSteps: previous.processSteps.filter((_, i) => i !== index) }))} removeLabel="Delete step" />
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Field label={isBn ? "ধাপ নম্বর (বাংলা)" : "Step number (Bangla)"}>
                  <Input value={step.stepBn} onChange={(event) => patchStep(index, { stepBn: event.target.value })} />
                </Field>
                <Field label={isBn ? "ধাপ নম্বর (ইংরেজি)" : "Step number (English)"}>
                  <Input value={step.stepEn} onChange={(event) => patchStep(index, { stepEn: event.target.value })} />
                </Field>
                <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}>
                  <Input value={step.titleBn} onChange={(event) => patchStep(index, { titleBn: event.target.value })} />
                </Field>
                <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}>
                  <Input value={step.titleEn} onChange={(event) => patchStep(index, { titleEn: event.target.value })} />
                </Field>
                <Field label={isBn ? "বিবরণ (বাংলা)" : "Description (Bangla)"} className="sm:col-span-2">
                  <Input value={step.descriptionBn} onChange={(event) => patchStep(index, { descriptionBn: event.target.value })} />
                </Field>
                <Field label={isBn ? "বিবরণ (ইংরেজি)" : "Description (English)"} className="sm:col-span-2">
                  <Input value={step.descriptionEn} onChange={(event) => patchStep(index, { descriptionEn: event.target.value })} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* CTA */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "সার্ভিস CTA ব্লক" : "Services CTA block"}</h3>
        <CtaFields cta={config.cta} onChange={(patch) => updateConfig((previous) => ({ ...previous, cta: { ...previous.cta, ...patch } }))} isBn={isBn} />
      </GlassCard>
    </section>
  );
}
