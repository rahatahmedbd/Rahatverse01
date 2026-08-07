"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_EXPERIENCE_CONFIG, validateExperienceConfig } from "@/lib/experience/config";
import { BLOOD_ICON_OPTIONS, EXPERIENCE_ICON_OPTIONS, MEMORIAL_ICON_OPTIONS } from "@/lib/experience/icons";
import type {
  BloodActivity,
  BloodCoverageArea,
  BloodStat,
  ExperienceConfig,
  ExperienceDetail,
  ExperienceIconName,
  ExperienceItem,
  ExperienceStatus,
  MemorialRole,
  MemorialRoleIconName,
} from "@/types/experience";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Save,
  Trash2,
  FileImage,
} from "lucide-react";

interface ExperienceControlPanelProps {
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

const STATUS_OPTIONS: ExperienceStatus[] = ["active", "paused", "completed"];

function createExperienceItem(): ExperienceItem {
  return {
    id: newId("exp"),
    icon: "Briefcase",
    titleBn: "নতুন অভিজ্ঞতা",
    titleEn: "New experience",
    roleBn: "ভূমিকা",
    roleEn: "Role",
    periodBn: "",
    periodEn: "",
    status: "active",
    descriptionBn: "",
    descriptionEn: "",
    details: [],
    link: "",
  };
}

function createDetail(): ExperienceDetail {
  return { id: newId("det"), labelBn: "লেবেল", labelEn: "Label", valueBn: "মান", valueEn: "Value" };
}

function createStat(): BloodStat {
  return { id: newId("stat"), value: 0, text: "", suffix: "", labelBn: "নতুন", labelEn: "New" };
}

function createActivity(): BloodActivity {
  return {
    id: newId("act"),
    icon: "Heart",
    titleBn: "নতুন কার্যক্রম",
    titleEn: "New activity",
    descriptionBn: "",
    descriptionEn: "",
  };
}

function createCoverage(): BloodCoverageArea {
  return { id: newId("cov"), nameBn: "নতুন এলাকা", nameEn: "New area" };
}

function createMemorialRole(): MemorialRole {
  return {
    id: newId("role"),
    icon: "Star",
    titleBn: "নতুন পরিচয়",
    titleEn: "New role",
    descriptionBn: "",
    descriptionEn: "",
    periodBn: "",
    periodEn: "",
  };
}

export function ExperienceControlPanel({ locale = "bn" }: ExperienceControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<ExperienceConfig>(DEFAULT_EXPERIENCE_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/experience-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateExperienceConfig(json.data) ?? DEFAULT_EXPERIENCE_CONFIG);
    } catch {
      setError(isBn ? "এক্সপেরিয়েন্স কনফিগ লোড করা যায়নি" : "Failed to load Experience configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  const updateConfig = (updater: (previous: ExperienceConfig) => ExperienceConfig) => {
    setConfig((previous) => updater(previous));
  };

  const patchItem = (index: number, patch: Partial<ExperienceItem>) => {
    updateConfig((previous) => ({
      ...previous,
      experience: {
        ...previous.experience,
        items: previous.experience.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      },
    }));
  };

  const patchDetail = (itemIndex: number, detailIndex: number, patch: Partial<ExperienceDetail>) => {
    updateConfig((previous) => ({
      ...previous,
      experience: {
        ...previous.experience,
        items: previous.experience.items.map((item, i) =>
          i === itemIndex
            ? { ...item, details: item.details.map((d, di) => (di === detailIndex ? { ...d, ...patch } : d)) }
            : item
        ),
      },
    }));
  };

  const patchStat = (index: number, patch: Partial<BloodStat>) => {
    updateConfig((previous) => ({
      ...previous,
      blood: { ...previous.blood, stats: previous.blood.stats.map((s, i) => (i === index ? { ...s, ...patch } : s)) },
    }));
  };

  const patchActivity = (index: number, patch: Partial<BloodActivity>) => {
    updateConfig((previous) => ({
      ...previous,
      blood: { ...previous.blood, activities: previous.blood.activities.map((a, i) => (i === index ? { ...a, ...patch } : a)) },
    }));
  };

  const patchCoverage = (index: number, patch: Partial<BloodCoverageArea>) => {
    updateConfig((previous) => ({
      ...previous,
      blood: {
        ...previous.blood,
        emergency: {
          ...previous.blood.emergency,
          coverageAreas: previous.blood.emergency.coverageAreas.map((c, i) => (i === index ? { ...c, ...patch } : c)),
        },
      },
    }));
  };

  const patchMemorialRole = (index: number, patch: Partial<MemorialRole>) => {
    updateConfig((previous) => ({
      ...previous,
      memorial: {
        ...previous.memorial,
        roles: previous.memorial.roles.map((r, i) => (i === index ? { ...r, ...patch } : r)),
      },
    }));
  };

  const uploadMemorialImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "memorial");
      formData.append("title", "Memorial photo");
      formData.append("title_bn", "স্মৃতিচিত্র");
      formData.append("description", "RahatVerse Memorial CMS asset");
      formData.append("description_bn", "রাহাতভার্স স্মৃতিচিত্র CMS মিডিয়া");
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const json = (await response.json()) as { success?: boolean; error?: string; image?: { url?: string; public_id?: string } };
      if (!response.ok || !json.success || !json.image?.url) throw new Error(json.error || "Upload failed");
      updateConfig((previous) => ({
        ...previous,
        memorial: { ...previous.memorial, imageUrl: json.image?.url as string, imagePublicId: json.image?.public_id ?? previous.memorial.imagePublicId },
      }));
      setSuccess(isBn ? "স্মৃতিচিত্র আপলোড হয়েছে" : "Memorial photo uploaded");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : isBn ? "আপলোড ব্যর্থ" : "Upload failed");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const validated = validateExperienceConfig(config);
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
        body: JSON.stringify({ key: "experience_config", value: validated }),
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

  const expSection = config.experience.section;
  const blood = config.blood;
  const memorial = config.memorial;

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="🏛️"
        title="Experience, Blood Society & Memorial Control"
        titleBn="অভিজ্ঞতা, রক্ত সোসাইটি ও স্মৃতিচারণ কন্ট্রোল"
        subtitle={isBn ? "কর্মজীবন, শান্তিচক্র ব্লাড সোসাইটি এবং স্মৃতিচারণ — এক জায়গা থেকে নিয়ন্ত্রণ করুন" : "Career, Shantichakra Blood Society and Memorial — all from one place"}
        locale={locale}
      />

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>}

      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.visible ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-semibold">{isBn ? "কনটেন্ট দৃশ্যমান" : "Content visible"}</span>
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

      {/* Experience section heading */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "অভিজ্ঞতা — সেকশন হেডিং" : "Experience — section heading"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "ব্যাজ (বাংলা)" : "Badge (Bangla)"}><Input value={expSection.badgeBn} onChange={(e) => updateConfig((previous) => ({ ...previous, experience: { ...previous.experience, section: { ...previous.experience.section, badgeBn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "ব্যাজ (ইংরেজি)" : "Badge (English)"}><Input value={expSection.badgeEn} onChange={(e) => updateConfig((previous) => ({ ...previous, experience: { ...previous.experience, section: { ...previous.experience.section, badgeEn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}><Input value={expSection.titleBn} onChange={(e) => updateConfig((previous) => ({ ...previous, experience: { ...previous.experience, section: { ...previous.experience.section, titleBn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}><Input value={expSection.titleEn} onChange={(e) => updateConfig((previous) => ({ ...previous, experience: { ...previous.experience, section: { ...previous.experience.section, titleEn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "সাবটাইটেল (বাংলা)" : "Subtitle (Bangla)"} className="sm:col-span-2"><Textarea rows={2} value={expSection.subtitleBn} onChange={(e) => updateConfig((previous) => ({ ...previous, experience: { ...previous.experience, section: { ...previous.experience.section, subtitleBn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "সাবটাইটেল (ইংরেজি)" : "Subtitle (English)"} className="sm:col-span-2"><Textarea rows={2} value={expSection.subtitleEn} onChange={(e) => updateConfig((previous) => ({ ...previous, experience: { ...previous.experience, section: { ...previous.experience.section, subtitleEn: e.target.value } } }))} /></Field>
        </div>
      </GlassCard>

      {/* Experience items */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "অভিজ্ঞতা টাইমলাইন" : "Experience timeline"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, experience: { ...previous.experience, items: [...previous.experience.items, createExperienceItem()] } }))}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন অভিজ্ঞতা" : "Add experience"}
          </Button>
        </div>
        <div className="space-y-4">
          {config.experience.items.map((item, index) => (
            <div key={item.id} className="rounded-lg border border-border/50 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">{isBn ? "আইটেম" : "Item"} {index + 1}</span>
                <ReorderControls index={index} count={config.experience.items.length} onMove={(d) => updateConfig((previous) => ({ ...previous, experience: { ...previous.experience, items: moveItem(previous.experience.items, index, d) } }))} onRemove={() => updateConfig((previous) => ({ ...previous, experience: { ...previous.experience, items: previous.experience.items.filter((_, i) => i !== index) } }))} removeLabel="Delete experience" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField label="Icon" value={item.icon} options={EXPERIENCE_ICON_OPTIONS} onChange={(v) => patchItem(index, { icon: v as ExperienceIconName })} />
                <SelectField label={isBn ? "স্ট্যাটাস" : "Status"} value={item.status} options={STATUS_OPTIONS} onChange={(v) => patchItem(index, { status: v as ExperienceStatus })} />
                <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}><Input value={item.titleBn} onChange={(e) => patchItem(index, { titleBn: e.target.value })} /></Field>
                <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}><Input value={item.titleEn} onChange={(e) => patchItem(index, { titleEn: e.target.value })} /></Field>
                <Field label={isBn ? "ভূমিকা (বাংলা)" : "Role (Bangla)"}><Input value={item.roleBn} onChange={(e) => patchItem(index, { roleBn: e.target.value })} /></Field>
                <Field label={isBn ? "ভূমিকা (ইংরেজি)" : "Role (English)"}><Input value={item.roleEn} onChange={(e) => patchItem(index, { roleEn: e.target.value })} /></Field>
                <Field label={isBn ? "সময়কাল (বাংলা)" : "Period (Bangla)"}><Input value={item.periodBn} onChange={(e) => patchItem(index, { periodBn: e.target.value })} /></Field>
                <Field label={isBn ? "সময়কাল (ইংরেজি)" : "Period (English)"}><Input value={item.periodEn} onChange={(e) => patchItem(index, { periodEn: e.target.value })} /></Field>
                <Field label={isBn ? "বিবরণ (বাংলা)" : "Description (Bangla)"} className="sm:col-span-2"><Textarea rows={2} value={item.descriptionBn} onChange={(e) => patchItem(index, { descriptionBn: e.target.value })} /></Field>
                <Field label={isBn ? "বিবরণ (ইংরেজি)" : "Description (English)"} className="sm:col-span-2"><Textarea rows={2} value={item.descriptionEn} onChange={(e) => patchItem(index, { descriptionEn: e.target.value })} /></Field>
                <Field label={isBn ? "লিংক (ঐচ্ছিক)" : "Link (optional)"} className="sm:col-span-2"><Input value={item.link} onChange={(e) => patchItem(index, { link: e.target.value })} placeholder="https://..." /></Field>
              </div>
              {/* Details */}
              <div className="mt-3 border-t border-border/40 pt-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{isBn ? "বিবরণ পয়েন্ট" : "Detail points"}</span>
                  <Button type="button" size="sm" variant="outline" onClick={() => patchItem(index, { details: [...item.details, createDetail()] })}>
                    <Plus className="h-4 w-4" /> {isBn ? "পয়েন্ট" : "Point"}
                  </Button>
                </div>
                <div className="space-y-2">
                  {item.details.map((detail, di) => (
                    <div key={detail.id} className="grid grid-cols-2 gap-2 rounded-lg border border-border/40 p-2 sm:grid-cols-5">
                      <Input value={detail.labelBn} onChange={(e) => patchDetail(index, di, { labelBn: e.target.value })} placeholder="লেবেল (বাংলা)" className="text-xs" />
                      <Input value={detail.labelEn} onChange={(e) => patchDetail(index, di, { labelEn: e.target.value })} placeholder="Label (EN)" className="text-xs" />
                      <Input value={detail.valueBn} onChange={(e) => patchDetail(index, di, { valueBn: e.target.value })} placeholder="মান (বাংলা)" className="text-xs" />
                      <Input value={detail.valueEn} onChange={(e) => patchDetail(index, di, { valueEn: e.target.value })} placeholder="Value (EN)" className="text-xs" />
                      <Button type="button" size="icon-sm" variant="ghost" onClick={() => patchItem(index, { details: item.details.filter((_, x) => x !== di) })} aria-label="Remove">
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Blood society */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "শান্তিচক্র ব্লাড সোসাইটি" : "Shantichakra Blood Society"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "ব্যাজ (বাংলা)" : "Badge (Bangla)"}><Input value={blood.section.badgeBn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, section: { ...previous.blood.section, badgeBn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "ব্যাজ (ইংরেজি)" : "Badge (English)"}><Input value={blood.section.badgeEn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, section: { ...previous.blood.section, badgeEn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}><Input value={blood.section.titleBn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, section: { ...previous.blood.section, titleBn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}><Input value={blood.section.titleEn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, section: { ...previous.blood.section, titleEn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "সাবটাইটেল (বাংলা)" : "Subtitle (Bangla)"} className="sm:col-span-2"><Textarea rows={2} value={blood.section.subtitleBn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, section: { ...previous.blood.section, subtitleBn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "সাবটাইটেল (ইংরেজি)" : "Subtitle (English)"} className="sm:col-span-2"><Textarea rows={2} value={blood.section.subtitleEn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, section: { ...previous.blood.section, subtitleEn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "ভূমিকা ব্যাজ (বাংলা)" : "Role badge (Bangla)"}><Input value={blood.roleBadgeBn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, roleBadgeBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ভূমিকা ব্যাজ (ইংরেজি)" : "Role badge (English)"}><Input value={blood.roleBadgeEn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, roleBadgeEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ভূমিকা শিরোনাম (বাংলা)" : "Role title (Bangla)"} className="sm:col-span-2"><Input value={blood.roleTitleBn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, roleTitleBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ভূমিকা শিরোনাম (ইংরেজি)" : "Role title (English)"} className="sm:col-span-2"><Input value={blood.roleTitleEn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, roleTitleEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ভূমিকা বডি (বাংলা)" : "Role body (Bangla)"} className="sm:col-span-2"><Textarea rows={3} value={blood.roleBodyBn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, roleBodyBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ভূমিকা বডি (ইংরেজি)" : "Role body (English)"} className="sm:col-span-2"><Textarea rows={3} value={blood.roleBodyEn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, roleBodyEn: e.target.value } }))} /></Field>
        </div>

        {/* Stats */}
        <div className="border-t border-border/40 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">{isBn ? "পাবলিক কাউন্টার" : "Public counters"}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, stats: [...previous.blood.stats, createStat()] } }))}>
              <Plus className="h-4 w-4" /> {isBn ? "কাউন্টার" : "Counter"}
            </Button>
          </div>
          <div className="space-y-2">
            {blood.stats.map((stat, index) => (
              <div key={stat.id} className="grid grid-cols-2 gap-2 rounded-lg border border-border/40 p-2 sm:grid-cols-6">
                <Input type="number" min={0} value={stat.value ?? ""} onChange={(e) => patchStat(index, { value: e.target.value === "" ? null : Number(e.target.value) })} placeholder="সংখ্যা" className="text-xs" />
                <Input value={stat.text} onChange={(e) => patchStat(index, { text: e.target.value })} placeholder="টেক্সট (A+)" className="text-xs" />
                <Input value={stat.suffix} onChange={(e) => patchStat(index, { suffix: e.target.value })} placeholder="সাফিক্স" className="text-xs" />
                <Input value={stat.labelBn} onChange={(e) => patchStat(index, { labelBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
                <Input value={stat.labelEn} onChange={(e) => patchStat(index, { labelEn: e.target.value })} placeholder="English" className="text-xs" />
                <Button type="button" size="icon-sm" variant="ghost" onClick={() => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, stats: previous.blood.stats.filter((_, i) => i !== index) } }))} aria-label="Remove">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency */}
        <div className="border-t border-border/40 pt-4">
          <span className="mb-2 block text-xs font-semibold text-muted-foreground">{isBn ? "জরুরি হটলাইন ও হোয়াটসঅ্যাপ" : "Emergency hotline & WhatsApp"}</span>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={isBn ? "হটলাইন লেবেল (বাংলা)" : "Hotline label (Bangla)"}><Input value={blood.emergency.hotlineBn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, emergency: { ...previous.blood.emergency, hotlineBn: e.target.value } } }))} /></Field>
            <Field label={isBn ? "হটলাইন লেবেল (ইংরেজি)" : "Hotline label (English)"}><Input value={blood.emergency.hotlineEn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, emergency: { ...previous.blood.emergency, hotlineEn: e.target.value } } }))} /></Field>
            <Field label={isBn ? "হটলাইন নম্বর" : "Hotline number"}><Input value={blood.emergency.hotlineNumber} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, emergency: { ...previous.blood.emergency, hotlineNumber: e.target.value } } }))} /></Field>
            <Field label={isBn ? "হোয়াটসঅ্যাপ লিংক" : "WhatsApp link"}><Input value={blood.emergency.whatsappLink} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, emergency: { ...previous.blood.emergency, whatsappLink: e.target.value } } }))} placeholder="https://wa.me/..." /></Field>
            <Field label={isBn ? "হোয়াটসঅ্যাপ লেবেল (বাংলা)" : "WhatsApp label (Bangla)"}><Input value={blood.emergency.whatsappLabelBn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, emergency: { ...previous.blood.emergency, whatsappLabelBn: e.target.value } } }))} /></Field>
            <Field label={isBn ? "হোয়াটসঅ্যাপ লেবেল (ইংরেজি)" : "WhatsApp label (English)"}><Input value={blood.emergency.whatsappLabelEn} onChange={(e) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, emergency: { ...previous.blood.emergency, whatsappLabelEn: e.target.value } } }))} /></Field>
          </div>
        </div>

        {/* Coverage areas */}
        <div className="border-t border-border/40 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">{isBn ? "সেবা এলাকা" : "Coverage areas"}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, emergency: { ...previous.blood.emergency, coverageAreas: [...previous.blood.emergency.coverageAreas, createCoverage()] } } }))}>
              <Plus className="h-4 w-4" /> {isBn ? "এলাকা" : "Area"}
            </Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {blood.emergency.coverageAreas.map((area, index) => (
              <div key={area.id} className="flex items-center gap-2 rounded-lg border border-border/40 p-2">
                <Input value={area.nameBn} onChange={(e) => patchCoverage(index, { nameBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
                <Input value={area.nameEn} onChange={(e) => patchCoverage(index, { nameEn: e.target.value })} placeholder="English" className="text-xs" />
                <Button type="button" size="icon-sm" variant="ghost" onClick={() => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, emergency: { ...previous.blood.emergency, coverageAreas: previous.blood.emergency.coverageAreas.filter((_, i) => i !== index) } } }))} aria-label="Remove">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div className="border-t border-border/40 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">{isBn ? "কার্যক্রম" : "Activities"}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, activities: [...previous.blood.activities, createActivity()] } }))}>
              <Plus className="h-4 w-4" /> {isBn ? "কার্যক্রম" : "Activity"}
            </Button>
          </div>
          <div className="space-y-2">
            {blood.activities.map((activity, index) => (
              <div key={activity.id} className="rounded-lg border border-border/40 p-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{isBn ? "কার্যক্রম" : "Activity"} {index + 1}</span>
                  <ReorderControls index={index} count={blood.activities.length} onMove={(d) => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, activities: moveItem(previous.blood.activities, index, d) } }))} onRemove={() => updateConfig((previous) => ({ ...previous, blood: { ...previous.blood, activities: previous.blood.activities.filter((_, i) => i !== index) } }))} removeLabel="Delete activity" />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <SelectField label="Icon" value={activity.icon} options={BLOOD_ICON_OPTIONS} onChange={(v) => patchActivity(index, { icon: v as BloodActivity["icon"] })} />
                  <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}><Input value={activity.titleBn} onChange={(e) => patchActivity(index, { titleBn: e.target.value })} /></Field>
                  <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}><Input value={activity.titleEn} onChange={(e) => patchActivity(index, { titleEn: e.target.value })} /></Field>
                  <Field label={isBn ? "বিবরণ (বাংলা)" : "Description (Bangla)"}><Input value={activity.descriptionBn} onChange={(e) => patchActivity(index, { descriptionBn: e.target.value })} /></Field>
                  <Field label={isBn ? "বিবরণ (ইংরেজি)" : "Description (English)"}><Input value={activity.descriptionEn} onChange={(e) => patchActivity(index, { descriptionEn: e.target.value })} /></Field>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Memorial */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "স্মৃতিচারণ (মেমোরিয়াল)" : "Memorial"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "ব্যাজ (বাংলা)" : "Badge (Bangla)"}><Input value={memorial.section.badgeBn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, section: { ...previous.memorial.section, badgeBn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "ব্যাজ (ইংরেজি)" : "Badge (English)"}><Input value={memorial.section.badgeEn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, section: { ...previous.memorial.section, badgeEn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}><Input value={memorial.section.titleBn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, section: { ...previous.memorial.section, titleBn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}><Input value={memorial.section.titleEn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, section: { ...previous.memorial.section, titleEn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "সাবটাইটেল (বাংলা)" : "Subtitle (Bangla)"} className="sm:col-span-2"><Textarea rows={2} value={memorial.section.subtitleBn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, section: { ...previous.memorial.section, subtitleBn: e.target.value } } }))} /></Field>
          <Field label={isBn ? "সাবটাইটেল (ইংরেজি)" : "Subtitle (English)"} className="sm:col-span-2"><Textarea rows={2} value={memorial.section.subtitleEn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, section: { ...previous.memorial.section, subtitleEn: e.target.value } } }))} /></Field>
        </div>

        {/* Photo */}
        <div className="border-t border-border/40 pt-4">
          <div className="mb-2 flex items-center gap-2">
            <FileImage className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground">{isBn ? "প্রোফাইল ছবি" : "Profile photo"}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label={isBn ? "ছবি আপলোড" : "Upload photo"}>
              <Input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={uploadMemorialImage} disabled={uploading} />
              {uploading && <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" />{isBn ? "আপলোড হচ্ছে..." : "Uploading..."}</span>}
            </Field>
            <Field label="Image URL">
              <Input value={memorial.imageUrl} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, imageUrl: e.target.value } }))} placeholder="https://..." />
            </Field>
            <Field label="Cloudinary public ID">
              <Input value={memorial.imagePublicId} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, imagePublicId: e.target.value } }))} />
            </Field>
            <Field label={isBn ? "এপিগ্রাফ (বাংলা)" : "Epigraph (Bangla)"}><Input value={memorial.epigraphBn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, epigraphBn: e.target.value } }))} /></Field>
            <Field label={isBn ? "এপিগ্রাফ (ইংরেজি)" : "Epigraph (English)"}><Input value={memorial.epigraphEn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, epigraphEn: e.target.value } }))} /></Field>
            <Field label={isBn ? "নাম (বাংলা)" : "Name (Bangla)"}><Input value={memorial.nameBn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, nameBn: e.target.value } }))} /></Field>
            <Field label={isBn ? "নাম (ইংরেজি)" : "Name (English)"}><Input value={memorial.nameEn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, nameEn: e.target.value } }))} /></Field>
            <Field label={isBn ? "সম্পর্ক (বাংলা)" : "Relation (Bangla)"}><Input value={memorial.relationBn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, relationBn: e.target.value } }))} /></Field>
            <Field label={isBn ? "সম্পর্ক (ইংরেজি)" : "Relation (English)"}><Input value={memorial.relationEn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, relationEn: e.target.value } }))} /></Field>
            <Field label={isBn ? "মৃত্যু ব্যাজ (বাংলা)" : "Death badge (Bangla)"}><Input value={memorial.deathBadgeBn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, deathBadgeBn: e.target.value } }))} /></Field>
            <Field label={isBn ? "মৃত্যু ব্যাজ (ইংরেজি)" : "Death badge (English)"}><Input value={memorial.deathBadgeEn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, deathBadgeEn: e.target.value } }))} /></Field>
            <Field label={isBn ? "শ্রদ্ধা বার্তা (বাংলা)" : "Tribute (Bangla)"} className="sm:col-span-2"><Textarea rows={3} value={memorial.tributeBn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, tributeBn: e.target.value } }))} /></Field>
            <Field label={isBn ? "শ্রদ্ধা বার্তা (ইংরেজি)" : "Tribute (English)"} className="sm:col-span-2"><Textarea rows={3} value={memorial.tributeEn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, tributeEn: e.target.value } }))} /></Field>
            <Field label={isBn ? "দোয়া (বাংলা)" : "Dua (Bangla)"} className="sm:col-span-2"><Textarea rows={2} value={memorial.duaBn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, duaBn: e.target.value } }))} /></Field>
            <Field label={isBn ? "দোয়া (ইংরেজি)" : "Dua (English)"} className="sm:col-span-2"><Textarea rows={2} value={memorial.duaEn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, duaEn: e.target.value } }))} /></Field>
            <Field label={isBn ? "স্বাক্ষর (বাংলা)" : "Signed by (Bangla)"} className="sm:col-span-2"><Input value={memorial.signedByBn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, signedByBn: e.target.value } }))} /></Field>
            <Field label={isBn ? "স্বাক্ষর (ইংরেজি)" : "Signed by (English)"} className="sm:col-span-2"><Input value={memorial.signedByEn} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, signedByEn: e.target.value } }))} /></Field>
          </div>
        </div>

        {/* Roles */}
        <div className="border-t border-border/40 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">{isBn ? "পরিচয় কার্ড" : "Identity roles"}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, roles: [...previous.memorial.roles, createMemorialRole()] } }))}>
              <Plus className="h-4 w-4" /> {isBn ? "পরিচয়" : "Role"}
            </Button>
          </div>
          <div className="space-y-2">
            {memorial.roles.map((role, index) => (
              <div key={role.id} className="rounded-lg border border-border/40 p-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{isBn ? "পরিচয়" : "Role"} {index + 1}</span>
                  <ReorderControls index={index} count={memorial.roles.length} onMove={(d) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, roles: moveItem(previous.memorial.roles, index, d) } }))} onRemove={() => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, roles: previous.memorial.roles.filter((_, i) => i !== index) } }))} removeLabel="Delete role" />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <SelectField label="Icon" value={role.icon} options={MEMORIAL_ICON_OPTIONS} onChange={(v) => patchMemorialRole(index, { icon: v as MemorialRoleIconName })} />
                  <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}><Input value={role.titleBn} onChange={(e) => patchMemorialRole(index, { titleBn: e.target.value })} /></Field>
                  <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}><Input value={role.titleEn} onChange={(e) => patchMemorialRole(index, { titleEn: e.target.value })} /></Field>
                  <Field label={isBn ? "বিবরণ (বাংলা)" : "Description (Bangla)"}><Input value={role.descriptionBn} onChange={(e) => patchMemorialRole(index, { descriptionBn: e.target.value })} /></Field>
                  <Field label={isBn ? "বিবরণ (ইংরেজি)" : "Description (English)"}><Input value={role.descriptionEn} onChange={(e) => patchMemorialRole(index, { descriptionEn: e.target.value })} /></Field>
                  <Field label={isBn ? "সময়কাল (বাংলা)" : "Period (Bangla)"}><Input value={role.periodBn} onChange={(e) => patchMemorialRole(index, { periodBn: e.target.value })} /></Field>
                  <Field label={isBn ? "সময়কাল (ইংরেজি)" : "Period (English)"}><Input value={role.periodEn} onChange={(e) => patchMemorialRole(index, { periodEn: e.target.value })} /></Field>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Developments */}
        <div className="border-t border-border/40 pt-4">
          <span className="mb-2 block text-xs font-semibold text-muted-foreground">{isBn ? "উন্নয়নমূলক কাজ" : "Development works"}</span>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label={isBn ? "উন্নয়ন (বাংলা — প্রতি লাইনে একটি)" : "Developments (Bangla — one per line)"}>
              <Textarea rows={4} value={memorial.developmentsBn.join("\n")} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, developmentsBn: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean) } }))} />
            </Field>
            <Field label={isBn ? "উন্নয়ন (ইংরেজি)" : "Developments (English)"}>
              <Textarea rows={4} value={memorial.developmentsEn.join("\n")} onChange={(e) => updateConfig((previous) => ({ ...previous, memorial: { ...previous.memorial, developmentsEn: e.target.value.split("\n").map((line) => line.trim()).filter(Boolean) } }))} />
            </Field>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
