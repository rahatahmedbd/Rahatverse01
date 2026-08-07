"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_BLOG_CONFIG, validateBlogConfig } from "@/lib/blog/config";
import type { BlogCategory, BlogConfig } from "@/types/blog";
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

interface BlogControlPanelProps {
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

function createCategory(): BlogCategory {
  return { id: newId("cat"), value: "", labelBn: "নতুন ক্যাটাগরি", labelEn: "New category", visible: true };
}

export function BlogControlPanel({ locale = "bn" }: BlogControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<BlogConfig>(DEFAULT_BLOG_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/blog-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateBlogConfig(json.data) ?? DEFAULT_BLOG_CONFIG);
    } catch {
      setError(isBn ? "ব্লগ কনফিগ লোড করা যায়নি" : "Failed to load Blog configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  const updateConfig = (updater: (previous: BlogConfig) => BlogConfig) => {
    setConfig((previous) => updater(previous));
  };

  const patchCategory = (index: number, patch: Partial<BlogCategory>) => {
    updateConfig((previous) => ({
      ...previous,
      categories: previous.categories.map((category, i) => (i === index ? { ...category, ...patch } : category)),
    }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const validated = validateBlogConfig(config);
    if (!validated) {
      setError(
        isBn
          ? "ভ্যালিডেশন ব্যর্থ — ক্যাটাগরি স্লাগ এবং নাম সম্পূর্ণ করুন"
          : "Validation failed — complete category slugs and names"
      );
      setSaving(false);
      return;
    }
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "blog_config", value: validated }),
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
  const author = config.author;
  const comments = config.comments;

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="✍️"
        title="Blog & Comment Moderation Control"
        titleBn="ব্লগ ও কমেন্ট মডারেশন কন্ট্রোল"
        subtitle={isBn ? "ব্লগ সেকশন, ক্যাটাগরি এবং কমেন্ট সেটিংস নিয়ন্ত্রণ করুন" : "Control blog section, categories and comment settings"}
        locale={locale}
      />

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>}

      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.visible ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-semibold">{isBn ? "ব্লগ সেকশন দৃশ্যমান" : "Blog section visible"}</span>
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
          <Field label={isBn ? "রিডিং ওয়র্ড-পার-মিনিট" : "Reading WPM"} className="sm:col-span-2">
            <Input type="number" min={20} max={1000} value={config.readingWpm} onChange={(e) => updateConfig((previous) => ({ ...previous, readingWpm: Number(e.target.value) || 200 }))} />
          </Field>
        </div>
      </GlassCard>

      {/* Categories */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "ক্যাটাগরি" : "Categories"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((previous) => ({ ...previous, categories: [...previous.categories, createCategory()] }))}>
            <Plus className="h-4 w-4" /> {isBn ? "নতুন ক্যাটাগরি" : "Add category"}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {config.categories.map((category, index) => (
            <div key={category.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={category.visible} onChange={(e) => patchCategory(index, { visible: e.target.checked })} />
                  {isBn ? "দৃশ্যমান" : "Visible"}
                </label>
                <ReorderControls index={index} count={config.categories.length} onMove={(d) => updateConfig((previous) => ({ ...previous, categories: moveItem(previous.categories, index, d) }))} onRemove={() => updateConfig((previous) => ({ ...previous, categories: previous.categories.filter((_, i) => i !== index) }))} removeLabel="Delete category" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input value={category.value} onChange={(e) => patchCategory(index, { value: e.target.value })} placeholder="slug" className="text-xs" />
                <Input value={category.labelBn} onChange={(e) => patchCategory(index, { labelBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
                <Input value={category.labelEn} onChange={(e) => patchCategory(index, { labelEn: e.target.value })} placeholder="English" className="text-xs" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Author profile */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "লেখক প্রোফাইল" : "Author profile"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "নাম (বাংলা)" : "Name (Bangla)"}><Input value={author.nameBn} onChange={(e) => updateConfig((previous) => ({ ...previous, author: { ...previous.author, nameBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "নাম (ইংরেজি)" : "Name (English)"}><Input value={author.nameEn} onChange={(e) => updateConfig((previous) => ({ ...previous, author: { ...previous.author, nameEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ভূমিকা (বাংলা)" : "Role (Bangla)"}><Input value={author.roleBn} onChange={(e) => updateConfig((previous) => ({ ...previous, author: { ...previous.author, roleBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ভূমিকা (ইংরেজি)" : "Role (English)"}><Input value={author.roleEn} onChange={(e) => updateConfig((previous) => ({ ...previous, author: { ...previous.author, roleEn: e.target.value } }))} /></Field>
          <Field label="Avatar URL" className="sm:col-span-2"><Input value={author.avatar} onChange={(e) => updateConfig((previous) => ({ ...previous, author: { ...previous.author, avatar: e.target.value } }))} placeholder="https://..." /></Field>
          <Field label={isBn ? "বায়ো (বাংলা)" : "Bio (Bangla)"} className="sm:col-span-2"><Textarea rows={2} value={author.bioBn} onChange={(e) => updateConfig((previous) => ({ ...previous, author: { ...previous.author, bioBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "বায়ো (ইংরেজি)" : "Bio (English)"} className="sm:col-span-2"><Textarea rows={2} value={author.bioEn} onChange={(e) => updateConfig((previous) => ({ ...previous, author: { ...previous.author, bioEn: e.target.value } }))} /></Field>
        </div>
      </GlassCard>

      {/* Comment settings */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "কমেন্ট মডারেশন সেটিংস" : "Comment moderation settings"}</h3>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={comments.requireApproval} onChange={(e) => updateConfig((previous) => ({ ...previous, comments: { ...previous.comments, requireApproval: e.target.checked } }))} />
          {isBn ? "প্রদর্শনের আগে অনুমোদন প্রয়োজন" : "Require approval before display"}
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "অ্যাডমিন ব্যাজ (বাংলা)" : "Admin badge (Bangla)"}><Input value={comments.adminBadgeBn} onChange={(e) => updateConfig((previous) => ({ ...previous, comments: { ...previous.comments, adminBadgeBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "অ্যাডমিন ব্যাজ (ইংরেজি)" : "Admin badge (English)"}><Input value={comments.adminBadgeEn} onChange={(e) => updateConfig((previous) => ({ ...previous, comments: { ...previous.comments, adminBadgeEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "রিপ্লাই লেখক (বাংলা)" : "Reply author (Bangla)"}><Input value={comments.replyAuthorBn} onChange={(e) => updateConfig((previous) => ({ ...previous, comments: { ...previous.comments, replyAuthorBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "রিপ্লাই লেখক (ইংরেজি)" : "Reply author (English)"}><Input value={comments.replyAuthorEn} onChange={(e) => updateConfig((previous) => ({ ...previous, comments: { ...previous.comments, replyAuthorEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "হেডিং (বাংলা)" : "Heading (Bangla)"}><Input value={comments.headingBn} onChange={(e) => updateConfig((previous) => ({ ...previous, comments: { ...previous.comments, headingBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "হেডিং (ইংরেজি)" : "Heading (English)"}><Input value={comments.headingEn} onChange={(e) => updateConfig((previous) => ({ ...previous, comments: { ...previous.comments, headingEn: e.target.value } }))} /></Field>
        </div>
      </GlassCard>
    </section>
  );
}
