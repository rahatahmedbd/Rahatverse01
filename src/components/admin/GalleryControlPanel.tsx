"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_GALLERY_CONFIG, validateGalleryConfig } from "@/lib/media/config";
import type { GalleryAlbum, GalleryConfig, GalleryLayoutMode } from "@/types/media";
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

interface GalleryControlPanelProps {
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

function createAlbum(): GalleryAlbum {
  return {
    id: newId("alb"),
    value: "",
    nameBn: "নতুন অ্যালবাম",
    nameEn: "New album",
    descriptionBn: "",
    descriptionEn: "",
    featuredPublicId: "",
    visible: true,
  };
}

export function GalleryControlPanel({ locale = "bn" }: GalleryControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<GalleryConfig>(DEFAULT_GALLERY_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gallery-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateGalleryConfig(json.data) ?? DEFAULT_GALLERY_CONFIG);
    } catch {
      setError(isBn ? "গ্যালারি কনফিগ লোড করা যায়নি" : "Failed to load Gallery configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  const updateConfig = (updater: (previous: GalleryConfig) => GalleryConfig) => {
    setConfig((previous) => updater(previous));
  };

  const patchAlbum = (index: number, patch: Partial<GalleryAlbum>) => {
    updateConfig((previous) => ({
      ...previous,
      albums: previous.albums.map((album, i) => (i === index ? { ...album, ...patch } : album)),
    }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const validated = validateGalleryConfig(config);
    if (!validated) {
      setError(
        isBn
          ? "ভ্যালিডেশন ব্যর্থ — অ্যালবামের স্লাগ এবং নাম সম্পূর্ণ করুন"
          : "Validation failed — complete album slugs and names"
      );
      setSaving(false);
      return;
    }
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "gallery_config", value: validated }),
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

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="🖼️"
        title="Photo Gallery Control"
        titleBn="ফটো গ্যালারি কন্ট্রোল"
        subtitle={isBn ? "অ্যালবাম তৈরি, পুনর্বিন্যাস এবং কভার ছবি নির্বাচন করুন" : "Create, reorder albums and select featured cover images"}
        locale={locale}
      />

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>}

      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.visible ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-semibold">{isBn ? "গ্যালারি দৃশ্যমান" : "Gallery visible"}</span>
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
          <Field label={isBn ? "ব্যাজ (বাংলা)" : "Badge (Bangla)"}><Input value={section.badgeBn} onChange={(e) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, badgeBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ব্যাজ (ইংরেজি)" : "Badge (English)"}><Input value={section.badgeEn} onChange={(e) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, badgeEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}><Input value={section.titleBn} onChange={(e) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, titleBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}><Input value={section.titleEn} onChange={(e) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, titleEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "সাবটাইটেল (বাংলা)" : "Subtitle (Bangla)"} className="sm:col-span-2"><Textarea rows={2} value={section.subtitleBn} onChange={(e) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, subtitleBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "সাবটাইটেল (ইংরেজি)" : "Subtitle (English)"} className="sm:col-span-2"><Textarea rows={2} value={section.subtitleEn} onChange={(e) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, subtitleEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ডিফল্ট লেআউট" : "Default layout"} className="sm:col-span-2">
            <select
              value={config.defaultLayout}
              onChange={(e) => updateConfig((previous) => ({ ...previous, defaultLayout: e.target.value as GalleryLayoutMode }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="mosaic">{isBn ? "মোসাইক" : "Mosaic"}</option>
              <option value="grid">{isBn ? "গ্রিড" : "Grid"}</option>
            </select>
          </Field>
        </div>
      </GlassCard>

      {/* Albums */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "অ্যালবামসমূহ" : "Albums"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, albums: [...previous.albums, createAlbum()] }))}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন অ্যালবাম" : "Add album"}
          </Button>
        </div>
        <div className="space-y-4">
          {config.albums.map((album, index) => (
            <div key={album.id} className="rounded-lg border border-border/50 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={album.visible} onChange={(e) => patchAlbum(index, { visible: e.target.checked })} />
                  {isBn ? "দৃশ্যমান" : "Visible"}
                </label>
                <ReorderControls index={index} count={config.albums.length} onMove={(d) => updateConfig((previous) => ({ ...previous, albums: moveItem(previous.albums, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, albums: previous.albums.filter((_, i) => i !== index) }))} removeLabel="Delete album" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Slug / Category"><Input value={album.value} onChange={(e) => patchAlbum(index, { value: e.target.value })} placeholder="achievements" /></Field>
                <Field label={isBn ? "নাম (বাংলা)" : "Name (Bangla)"}><Input value={album.nameBn} onChange={(e) => patchAlbum(index, { nameBn: e.target.value })} /></Field>
                <Field label={isBn ? "নাম (ইংরেজি)" : "Name (English)"}><Input value={album.nameEn} onChange={(e) => patchAlbum(index, { nameEn: e.target.value })} /></Field>
                <Field label={isBn ? "ফিচার্ড কভার public_id" : "Featured cover public_id"}><Input value={album.featuredPublicId} onChange={(e) => patchAlbum(index, { featuredPublicId: e.target.value })} placeholder="rahatverse/..." /></Field>
                <Field label={isBn ? "বিবরণ (বাংলা)" : "Description (Bangla)"}><Input value={album.descriptionBn} onChange={(e) => patchAlbum(index, { descriptionBn: e.target.value })} /></Field>
                <Field label={isBn ? "বিবরণ (ইংরেজি)" : "Description (English)"}><Input value={album.descriptionEn} onChange={(e) => patchAlbum(index, { descriptionEn: e.target.value })} /></Field>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Note */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "পাদটীকা" : "Footer note"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "নোট (বাংলা)" : "Note (Bangla)"}><Input value={config.note.bn} onChange={(e) => updateConfig((previous) => ({ ...previous, note: { ...previous.note, bn: e.target.value } }))} /></Field>
          <Field label={isBn ? "নোট (ইংরেজি)" : "Note (English)"}><Input value={config.note.en} onChange={(e) => updateConfig((previous) => ({ ...previous, note: { ...previous.note, en: e.target.value } }))} /></Field>
        </div>
      </GlassCard>
    </section>
  );
}
