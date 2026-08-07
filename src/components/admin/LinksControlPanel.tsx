"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_LINKS_CONFIG, validateLinksConfig } from "@/lib/links/config";
import { LINK_ICON_OPTIONS } from "@/lib/links/icons";
import type { LinkIconName, LinkItem, LinksConfig, ToolRecommendation } from "@/types/links";
import { ChevronDown, ChevronUp, Eye, EyeOff, Loader2, Plus, Save, Trash2 } from "lucide-react";

interface LinksControlPanelProps {
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

function createLink(): LinkItem {
  return { id: newId("link"), labelBn: "নতুন লিংক", labelEn: "New link", url: "https://", icon: "Globe", color: "text-primary", bgColor: "bg-primary/10", visible: true, clicks: 0 };
}
function createTool(): ToolRecommendation {
  return { id: newId("tool"), nameBn: "নতুন টুল", nameEn: "New tool", category: "development", descriptionBn: "", descriptionEn: "", url: "https://", visible: true };
}

export function LinksControlPanel({ locale = "bn" }: LinksControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<LinksConfig>(DEFAULT_LINKS_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/links-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateLinksConfig(json.data) ?? DEFAULT_LINKS_CONFIG);
    } catch {
      setError(isBn ? "লিংক কনফিগ লোড করা যায়নি" : "Failed to load Links configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  const updateConfig = (updater: (p: LinksConfig) => LinksConfig) => setConfig((prev) => updater(prev));

  const patchLink = (index: number, patch: Partial<LinkItem>) => {
    updateConfig((p) => ({ ...p, links: p.links.map((l, i) => (i === index ? { ...l, ...patch } : l)) }));
  };
  const patchTool = (index: number, patch: Partial<ToolRecommendation>) => {
    updateConfig((p) => ({ ...p, tools: p.tools.map((t, i) => (i === index ? { ...t, ...patch } : t)) }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const validated = validateLinksConfig(config);
    if (!validated) {
      setError(isBn ? "ভ্যালিডেশন ব্যর্থ — লিংক নাম ও URL সম্পূর্ণ করুন" : "Validation failed");
      setSaving(false);
      return;
    }
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "links_config", value: validated }),
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

  const section = config.section;
  const profile = config.profile;
  const resume = config.resume;

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="🔗"
        title="Link Hub, Tools & Resume Control"
        titleBn="লিংক হাব, টুলস ও রিজিউম কন্ট্রোল"
        subtitle={isBn ? "সোশ্যাল লিংক, টুল রেকমেন্ডেশন এবং CV ডাউনলোড নিয়ন্ত্রণ করুন" : "Control social links, tool recommendations and CV downloads"}
        locale={locale}
      />
      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>}

      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.visible ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-semibold">{isBn ? "লিংক হাব দৃশ্যমান" : "Link Hub visible"}</span>
            <Badge variant={config.visible ? "default" : "outline"} className="text-[10px]">{config.visible ? "ON" : "OFF"}</Badge>
          </div>
          <Button type="button" size="sm" variant="gradient" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{isBn ? "সংরক্ষণ করুন" : "Save"}</Button>
        </div>
      </GlassCard>

      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "সেকশন ও প্রোফাইল" : "Section & profile"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "ব্যাজ (বাংলা)" : "Badge (Bangla)"}><Input value={section.badgeBn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, badgeBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ব্যাজ (ইংরেজি)" : "Badge (English)"}><Input value={section.badgeEn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, badgeEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}><Input value={section.titleBn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, titleBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}><Input value={section.titleEn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, titleEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ইনিশিয়াল" : "Initials"}><Input value={profile.initials} onChange={(e) => updateConfig((p) => ({ ...p, profile: { ...p.profile, initials: e.target.value } }))} /></Field>
          <Field label="Avatar URL"><Input value={profile.avatar} onChange={(e) => updateConfig((p) => ({ ...p, profile: { ...p.profile, avatar: e.target.value } }))} /></Field>
          <Field label={isBn ? "নাম (বাংলা)" : "Name (Bangla)"}><Input value={profile.nameBn} onChange={(e) => updateConfig((p) => ({ ...p, profile: { ...p.profile, nameBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "নাম (ইংরেজি)" : "Name (English)"}><Input value={profile.nameEn} onChange={(e) => updateConfig((p) => ({ ...p, profile: { ...p.profile, nameEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ট্যাগলাইন (বাংলা)" : "Tagline (Bangla)"} className="sm:col-span-2"><Input value={profile.taglineBn} onChange={(e) => updateConfig((p) => ({ ...p, profile: { ...p.profile, taglineBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ট্যাগলাইন (ইংরেজি)" : "Tagline (English)"} className="sm:col-span-2"><Input value={profile.taglineEn} onChange={(e) => updateConfig((p) => ({ ...p, profile: { ...p.profile, taglineEn: e.target.value } }))} /></Field>
        </div>
      </GlassCard>

      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "লিংক কার্ড" : "Link cards"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((p) => ({ ...p, links: [...p.links, createLink()] }))}><Plus className="h-4 w-4" /> {isBn ? "লিংক" : "Link"}</Button>
        </div>
        <div className="space-y-3">
          {config.links.map((link, index) => (
            <div key={link.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={link.visible} onChange={(e) => patchLink(index, { visible: e.target.checked })} />
                  {isBn ? "দৃশ্যমান" : "Visible"} · {link.clicks ?? 0}× {isBn ? "ক্লিক" : "clicks"}
                </label>
                <ReorderControls index={index} count={config.links.length} onMove={(d) => updateConfig((p) => ({ ...p, links: moveItem(p.links, index, d) }))} onRemove={() => updateConfig((p) => ({ ...p, links: p.links.filter((_, i) => i !== index) }))} removeLabel="Delete link" />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Input value={link.labelBn} onChange={(e) => patchLink(index, { labelBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
                <Input value={link.labelEn} onChange={(e) => patchLink(index, { labelEn: e.target.value })} placeholder="English" className="text-xs" />
                <Input value={link.url} onChange={(e) => patchLink(index, { url: e.target.value })} placeholder="https://..." className="text-xs sm:col-span-2" />
                <select value={link.icon} onChange={(e) => patchLink(index, { icon: e.target.value as LinkIconName })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-xs">
                  {LINK_ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <Input value={link.color} onChange={(e) => patchLink(index, { color: e.target.value })} placeholder="color" className="text-xs" />
                <Input value={link.bgColor} onChange={(e) => patchLink(index, { bgColor: e.target.value })} placeholder="bgColor" className="text-xs" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{isBn ? "টুল রেকমেন্ডেশন" : "Tool recommendations"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((p) => ({ ...p, tools: [...p.tools, createTool()] }))}><Plus className="h-4 w-4" /> {isBn ? "টুল" : "Tool"}</Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}><Input value={config.toolsSectionTitleBn} onChange={(e) => updateConfig((p) => ({ ...p, toolsSectionTitleBn: e.target.value }))} /></Field>
          <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}><Input value={config.toolsSectionTitleEn} onChange={(e) => updateConfig((p) => ({ ...p, toolsSectionTitleEn: e.target.value }))} /></Field>
        </div>
        <div className="space-y-3">
          {config.tools.map((tool, index) => (
            <div key={tool.id} className="rounded-lg border border-border/50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={tool.visible} onChange={(e) => patchTool(index, { visible: e.target.checked })} />{isBn ? "দৃশ্যমান" : "Visible"}</label>
                <Button type="button" size="icon-sm" variant="ghost" onClick={() => updateConfig((p) => ({ ...p, tools: p.tools.filter((_, i) => i !== index) }))} aria-label="Delete"><Trash2 className="h-4 w-4 text-red-400" /></Button>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Input value={tool.nameBn} onChange={(e) => patchTool(index, { nameBn: e.target.value })} placeholder="বাংলা" className="text-xs" />
                <Input value={tool.nameEn} onChange={(e) => patchTool(index, { nameEn: e.target.value })} placeholder="English" className="text-xs" />
                <select value={tool.category} onChange={(e) => patchTool(index, { category: e.target.value as ToolRecommendation["category"] })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-xs">
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="productivity">Productivity</option>
                </select>
                <Input value={tool.url} onChange={(e) => patchTool(index, { url: e.target.value })} placeholder="https://..." className="text-xs sm:col-span-3" />
                <Input value={tool.descriptionBn} onChange={(e) => patchTool(index, { descriptionBn: e.target.value })} placeholder="বিবরণ (বাংলা)" className="text-xs" />
                <Input value={tool.descriptionEn} onChange={(e) => patchTool(index, { descriptionEn: e.target.value })} placeholder="Description (English)" className="text-xs" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "রিজিউম / CV" : "Resume / CV"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "বাংলা CV URL" : "Bangla CV URL"}><Input value={resume.cvBnUrl} onChange={(e) => updateConfig((p) => ({ ...p, resume: { ...p.resume, cvBnUrl: e.target.value } }))} placeholder="https://...pdf" /></Field>
          <Field label={isBn ? "ইংরেজি CV URL" : "English CV URL"}><Input value={resume.cvEnUrl} onChange={(e) => updateConfig((p) => ({ ...p, resume: { ...p.resume, cvEnUrl: e.target.value } }))} placeholder="https://...pdf" /></Field>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={resume.previewInBrowser} onChange={(e) => updateConfig((p) => ({ ...p, resume: { ...p.resume, previewInBrowser: e.target.checked } }))} />
            {isBn ? "ব্রাউজারে প্রিভিউ (ডাউনলোডের বদলে)" : "Preview in browser (instead of download)"}
          </label>
          <Field label={isBn ? "ডাউনলোড লেবেল (বাংলা)" : "Download label (Bangla)"}><Input value={resume.downloadLabelBn} onChange={(e) => updateConfig((p) => ({ ...p, resume: { ...p.resume, downloadLabelBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ডাউনলোড লেবেল (ইংরেজি)" : "Download label (English)"}><Input value={resume.downloadLabelEn} onChange={(e) => updateConfig((p) => ({ ...p, resume: { ...p.resume, downloadLabelEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "কামিং সুন (বাংলা)" : "Coming soon (Bangla)"}><Input value={resume.comingSoonBn} onChange={(e) => updateConfig((p) => ({ ...p, resume: { ...p.resume, comingSoonBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "কামিং সুন (ইংরেজি)" : "Coming soon (English)"}><Input value={resume.comingSoonEn} onChange={(e) => updateConfig((p) => ({ ...p, resume: { ...p.resume, comingSoonEn: e.target.value } }))} /></Field>
        </div>
      </GlassCard>
    </section>
  );
}
