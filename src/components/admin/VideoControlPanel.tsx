"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_VIDEO_CONFIG, validateVideoConfig } from "@/lib/media/config";
import type { VideoConfig, VideoItem, VideoPlatform, VideoSocialLink } from "@/types/media";
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

interface VideoControlPanelProps {
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

const PLATFORM_OPTIONS: VideoPlatform[] = ["youtube", "vimeo", "direct"];

function createVideo(): VideoItem {
  return {
    id: newId("vid"),
    titleBn: "নতুন ভিডিও",
    titleEn: "New video",
    descriptionBn: "",
    descriptionEn: "",
    platform: "youtube",
    url: "",
    videoId: "",
    categoryBn: "",
    categoryEn: "",
    thumbnail: "",
    visible: true,
  };
}

function createSocialLink(): VideoSocialLink {
  return { id: newId("soc"), label: "New", url: "" };
}

export function VideoControlPanel({ locale = "bn" }: VideoControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<VideoConfig>(DEFAULT_VIDEO_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/video-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateVideoConfig(json.data) ?? DEFAULT_VIDEO_CONFIG);
    } catch {
      setError(isBn ? "ভিডিও কনফিগ লোড করা যায়নি" : "Failed to load Video configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  const updateConfig = (updater: (previous: VideoConfig) => VideoConfig) => {
    setConfig((previous) => updater(previous));
  };

  const patchVideo = (index: number, patch: Partial<VideoItem>) => {
    updateConfig((previous) => ({
      ...previous,
      videos: previous.videos.map((video, i) => (i === index ? { ...video, ...patch } : video)),
    }));
  };

  const patchSocialLink = (index: number, patch: Partial<VideoSocialLink>) => {
    updateConfig((previous) => ({
      ...previous,
      socialLinks: previous.socialLinks.map((link, i) => (i === index ? { ...link, ...patch } : link)),
    }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const validated = validateVideoConfig(config);
    if (!validated) {
      setError(
        isBn
          ? "ভ্যালিডেশন ব্যর্থ — শিরোনাম এবং URL সম্পূর্ণ করুন"
          : "Validation failed — complete titles and URLs"
      );
      setSaving(false);
      return;
    }
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "video_config", value: validated }),
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
        badge="🎬"
        title="Video Portfolio Control"
        titleBn="ভিডিও পোর্টফোলিও কন্ট্রোল"
        subtitle={isBn ? "YouTube, Vimeo ও ডাইরেক্ট ভিডিও লিংক যোগ করুন ও সাজান" : "Add and reorder YouTube, Vimeo and direct video links"}
        locale={locale}
      />

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>}

      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.visible ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-semibold">{isBn ? "ভিডিও সেকশন দৃশ্যমান" : "Video section visible"}</span>
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
        </div>
      </GlassCard>

      {/* Videos */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "ভিডিওসমূহ" : "Videos"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, videos: [...previous.videos, createVideo()] }))}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন ভিডিও" : "Add video"}
          </Button>
        </div>
        <div className="space-y-4">
          {config.videos.map((video, index) => (
            <div key={video.id} className="rounded-lg border border-border/50 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={video.visible} onChange={(e) => patchVideo(index, { visible: e.target.checked })} />
                  {isBn ? "দৃশ্যমান" : "Visible"}
                </label>
                <ReorderControls index={index} count={config.videos.length} onMove={(d) => updateConfig((previous) => ({ ...previous, videos: moveItem(previous.videos, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, videos: previous.videos.filter((_, i) => i !== index) }))} removeLabel="Delete video" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={isBn ? "প্ল্যাটফর্ম" : "Platform"}>
                  <select value={video.platform} onChange={(e) => patchVideo(index, { platform: e.target.value as VideoPlatform })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    {PLATFORM_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Video ID (YouTube/Vimeo)"><Input value={video.videoId} onChange={(e) => patchVideo(index, { videoId: e.target.value })} placeholder="dQw4w9WgXcQ" /></Field>
                <Field label="URL"><Input value={video.url} onChange={(e) => patchVideo(index, { url: e.target.value })} placeholder="https://..." /></Field>
                <Field label={isBn ? "থাম্বনেইল URL" : "Thumbnail URL"}><Input value={video.thumbnail} onChange={(e) => patchVideo(index, { thumbnail: e.target.value })} placeholder="https://..." /></Field>
                <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}><Input value={video.titleBn} onChange={(e) => patchVideo(index, { titleBn: e.target.value })} /></Field>
                <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}><Input value={video.titleEn} onChange={(e) => patchVideo(index, { titleEn: e.target.value })} /></Field>
                <Field label={isBn ? "ক্যাটাগরি (বাংলা)" : "Category (Bangla)"}><Input value={video.categoryBn} onChange={(e) => patchVideo(index, { categoryBn: e.target.value })} /></Field>
                <Field label={isBn ? "ক্যাটাগরি (ইংরেজি)" : "Category (English)"}><Input value={video.categoryEn} onChange={(e) => patchVideo(index, { categoryEn: e.target.value })} /></Field>
                <Field label={isBn ? "বিবরণ (বাংলা)" : "Description (Bangla)"} className="sm:col-span-2"><Textarea rows={2} value={video.descriptionBn} onChange={(e) => patchVideo(index, { descriptionBn: e.target.value })} /></Field>
                <Field label={isBn ? "বিবরণ (ইংরেজি)" : "Description (English)"} className="sm:col-span-2"><Textarea rows={2} value={video.descriptionEn} onChange={(e) => patchVideo(index, { descriptionEn: e.target.value })} /></Field>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Social links */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "সোশ্যাল লিংক" : "Social links"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, socialLinks: [...previous.socialLinks, createSocialLink()] }))}>
            <Plus className="h-4 w-4" /> {isBn ? "লিংক" : "Link"}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "ফলো-আপ বার্তা (বাংলা)" : "Follow message (Bangla)"} className="sm:col-span-2"><Input value={config.socialFollowBn} onChange={(e) => updateConfig((previous) => ({ ...previous, socialFollowBn: e.target.value }))} /></Field>
          <Field label={isBn ? "ফলো-আপ বার্তা (ইংরেজি)" : "Follow message (English)"} className="sm:col-span-2"><Input value={config.socialFollowEn} onChange={(e) => updateConfig((previous) => ({ ...previous, socialFollowEn: e.target.value }))} /></Field>
          {config.socialLinks.map((link, index) => (
            <div key={link.id} className="flex items-center gap-2 rounded-lg border border-border/50 p-2">
              <Input value={link.label} onChange={(e) => patchSocialLink(index, { label: e.target.value })} placeholder="Label" className="text-xs" />
              <Input value={link.url} onChange={(e) => patchSocialLink(index, { url: e.target.value })} placeholder="https://..." className="text-xs" />
              <Button type="button" size="icon-sm" variant="ghost" onClick={() => updateConfig((previous) => ({ ...previous, socialLinks: previous.socialLinks.filter((_, i) => i !== index) }))} aria-label="Delete">
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          ))}
        </div>
      </GlassCard>
    </section>
  );
}
