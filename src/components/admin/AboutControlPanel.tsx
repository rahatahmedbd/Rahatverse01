"use client";

import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_ABOUT_CONFIG, validateAboutConfig } from "@/lib/about/config";
import type {
  AboutAchievement,
  AboutAchievementStat,
  AboutBadgeType,
  AboutConfig,
  AboutEducationItem,
  AboutFrameStyle,
  AboutIconName,
  AboutInterest,
  AboutPersonalInfo,
  AboutSectionContent,
  AchievementIconName,
  AchievementRarity,
} from "@/types/about";
import {
  Award,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FileImage,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";

interface AboutControlPanelProps {
  locale?: string;
}

type UploadKey = "profile" | `certificate-${number}` | null;

const ICON_OPTIONS: AboutIconName[] = [
  "Calendar",
  "MapPin",
  "Droplets",
  "GraduationCap",
  "BookOpen",
  "Award",
  "Code",
  "Users",
  "Heart",
  "Trophy",
  "Medal",
  "Star",
];
const ACHIEVEMENT_ICON_OPTIONS: AchievementIconName[] = ["Trophy", "Medal", "Award", "Star"];
const FRAME_OPTIONS: AboutFrameStyle[] = ["amber", "blue", "emerald", "purple", "rose"];
const BADGE_OPTIONS: AboutBadgeType[] = [
  "default",
  "glow",
  "outline",
  "secondary",
  "gradient",
  "success",
  "warning",
  "info",
];
const RARITY_OPTIONS: AchievementRarity[] = ["common", "rare", "epic", "legendary"];

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

function SectionFields({
  section,
  onChange,
  isBn,
}: {
  section: AboutSectionContent;
  onChange: (patch: Partial<AboutSectionContent>) => void;
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

function createPersonalInfo(): AboutPersonalInfo {
  return {
    id: newId("info"),
    icon: "Award",
    labelBn: "নতুন তথ্য",
    labelEn: "New information",
    valueBn: "মান যোগ করুন",
    valueEn: "Add a value",
  };
}

function createInterest(): AboutInterest {
  return {
    id: newId("interest"),
    icon: "Star",
    labelBn: "নতুন আগ্রহ",
    labelEn: "New interest",
  };
}

function createEducation(): AboutEducationItem {
  return {
    id: newId("education"),
    yearBn: "২০২৬",
    yearEn: "2026",
    titleBn: "নতুন শিক্ষামাইলস্টোন",
    titleEn: "New education milestone",
    institutionBn: "প্রতিষ্ঠানের নাম",
    institutionEn: "Institution name",
    locationBn: "অবস্থান",
    locationEn: "Location",
    descriptionBn: "বিস্তারিত বিবরণ লিখুন",
    descriptionEn: "Write a detailed description",
    badgeBn: "",
    badgeEn: "",
    badgeType: "outline",
    gpa: "",
  };
}

function createAchievement(): AboutAchievement {
  return {
    id: newId("achievement"),
    yearBn: "২০২৬",
    yearEn: "2026",
    titleBn: "নতুন অর্জন",
    titleEn: "New achievement",
    descriptionBn: "অর্জনের বিবরণ লিখুন",
    descriptionEn: "Write an achievement description",
    icon: "Trophy",
    rarity: "common",
    unlockCriteriaBn: "অর্জনের মানদণ্ড লিখুন",
    unlockCriteriaEn: "Write the unlock criteria",
    completedAt: "2026",
    sparkle: false,
    sound: false,
    certificateUrl: "",
    certificatePublicId: "",
  };
}

function createStat(): AboutAchievementStat {
  return {
    id: newId("stat"),
    labelBn: "নতুন পরিসংখ্যান",
    labelEn: "New statistic",
    value: 0,
    suffix: "",
  };
}

export function AboutControlPanel({ locale = "bn" }: AboutControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<AboutConfig>(DEFAULT_ABOUT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<UploadKey>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/about-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateAboutConfig(json.data) ?? DEFAULT_ABOUT_CONFIG);
    } catch {
      setError(isBn ? "অ্যাবাউট কনফিগ লোড করা যায়নি" : "Failed to load About configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  const updateConfig = (updater: (previous: AboutConfig) => AboutConfig) => {
    setConfig((previous) => updater(previous));
  };

  const updateEducation = (index: number, patch: Partial<AboutEducationItem>) => {
    updateConfig((previous) => ({
      ...previous,
      education: previous.education.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  };

  const updateAchievement = (index: number, patch: Partial<AboutAchievement>) => {
    updateConfig((previous) => ({
      ...previous,
      achievements: previous.achievements.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  };

  const uploadMedia = async (file: File, category: string, title: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("title", title);
    formData.append("title_bn", title);
    formData.append("description", "RahatVerse About CMS asset");
    formData.append("description_bn", "রাহাতভার্স অ্যাবাউট CMS মিডিয়া");

    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const json = (await response.json()) as {
      success?: boolean;
      error?: string;
      image?: { url?: string; public_id?: string };
    };
    if (!response.ok || !json.success || !json.image?.url || !json.image.public_id) {
      throw new Error(json.error || "Upload failed");
    }
    return { url: json.image.url, publicId: json.image.public_id };
  };

  const handleProfileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading("profile");
    setError(null);
    try {
      const uploaded = await uploadMedia(file, "profile", "About profile photo");
      updateConfig((previous) => ({
        ...previous,
        profileImage: {
          ...previous.profileImage,
          url: uploaded.url,
          publicId: uploaded.publicId,
        },
      }));
      setSuccess(isBn ? "প্রোফাইল ছবি আপলোড হয়েছে" : "Profile photo uploaded");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : isBn ? "আপলোড ব্যর্থ" : "Upload failed");
    } finally {
      setUploading(null);
      event.target.value = "";
    }
  };

  const handleCertificateUpload = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(`certificate-${index}`);
    setError(null);
    try {
      const achievement = config.achievements[index];
      const uploaded = await uploadMedia(file, "achievements", achievement.titleEn);
      updateAchievement(index, {
        certificateUrl: uploaded.url,
        certificatePublicId: uploaded.publicId,
      });
      setSuccess(isBn ? "সার্টিফিকেট আপলোড হয়েছে" : "Certificate uploaded");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : isBn ? "আপলোড ব্যর্থ" : "Upload failed");
    } finally {
      setUploading(null);
      event.target.value = "";
    }
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const validated = validateAboutConfig(config);
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
        body: JSON.stringify({ key: "about_config", value: validated }),
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

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="📖"
        title="About, Education & Achievements"
        titleBn="অ্যাবাউট, শিক্ষা ও অর্জন কন্ট্রোল"
        subtitle={isBn ? "গল্প, মাইলস্টোন এবং পুরস্কার — এক জায়গা থেকে নিয়ন্ত্রণ করুন" : "Control your story, milestones, and awards from one place"}
        locale={locale}
      />

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>}

      {/* Visibility and profile image */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.visible ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-semibold">{isBn ? "অ্যাবাউট কনটেন্ট দৃশ্যমান" : "About content visible"}</span>
            <Badge variant={config.visible ? "default" : "outline"} className="text-[10px]">
              {config.visible ? "ON" : "OFF"}
            </Badge>
          </div>
          <Button type="button" size="sm" variant={config.visible ? "outline" : "gradient"} onClick={() => updateConfig((previous) => ({ ...previous, visible: !previous.visible }))}>
            {config.visible ? (isBn ? "লুকান" : "Hide") : isBn ? "দেখান" : "Show"}
          </Button>
        </div>

        <div className="border-t border-border/40 pt-5">
          <div className="mb-4 flex items-center gap-2">
            <FileImage className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">{isBn ? "প্রোফাইল ছবি ও ফ্রেম" : "Profile photo & frame"}</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-[auto_1fr]">
            <div className="flex items-center justify-center rounded-lg border border-dashed border-border/60 p-4">
              <div className="h-28 w-28 overflow-hidden rounded-full bg-muted">
                {config.profileImage.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={config.profileImage.url} alt={isBn ? config.profileImage.altBn : config.profileImage.altEn} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-xs text-muted-foreground">{isBn ? "Cloudinary fallback" : "Cloudinary fallback"}</div>
                )}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={isBn ? "ছবি আপলোড (JPEG/PNG/WebP/AVIF)" : "Upload photo (JPEG/PNG/WebP/AVIF)"} className="sm:col-span-2">
                <Input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleProfileUpload} disabled={uploading === "profile"} />
                {uploading === "profile" && <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" />{isBn ? "আপলোড হচ্ছে..." : "Uploading..."}</span>}
              </Field>
              <Field label="Image URL">
                <Input value={config.profileImage.url} onChange={(event) => updateConfig((previous) => ({ ...previous, profileImage: { ...previous.profileImage, url: event.target.value } }))} placeholder="https://res.cloudinary.com/..." />
              </Field>
              <Field label="Cloudinary public ID">
                <Input value={config.profileImage.publicId} onChange={(event) => updateConfig((previous) => ({ ...previous, profileImage: { ...previous.profileImage, publicId: event.target.value } }))} />
              </Field>
              <SelectField label={isBn ? "ফ্রেমের রঙ" : "Frame color"} value={config.profileImage.frame} options={FRAME_OPTIONS} onChange={(value) => updateConfig((previous) => ({ ...previous, profileImage: { ...previous.profileImage, frame: value as AboutFrameStyle } }))} />
              <Field label={isBn ? "স্ট্যাটাস লেবেল (বাংলা)" : "Status label (Bangla)"}>
                <Input value={config.profileImage.statusLabelBn} onChange={(event) => updateConfig((previous) => ({ ...previous, profileImage: { ...previous.profileImage, statusLabelBn: event.target.value } }))} />
              </Field>
              <Field label={isBn ? "স্ট্যাটাস লেবেল (ইংরেজি)" : "Status label (English)"}>
                <Input value={config.profileImage.statusLabelEn} onChange={(event) => updateConfig((previous) => ({ ...previous, profileImage: { ...previous.profileImage, statusLabelEn: event.target.value } }))} />
              </Field>
              <label className="flex items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
                <input type="checkbox" checked={config.profileImage.showStatus} onChange={(event) => updateConfig((previous) => ({ ...previous, profileImage: { ...previous.profileImage, showStatus: event.target.checked } }))} />
                {isBn ? "ছবির পাশে Available স্ট্যাটাস দেখান" : "Show the Available status indicator"}
              </label>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Biography and section headings */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" /><h3 className="text-sm font-semibold">{isBn ? "বায়োগ্রাফি ও শিরোনাম" : "Biography & section headings"}</h3></div>
        <SectionFields section={config.section} isBn={isBn} onChange={(patch) => updateConfig((previous) => ({ ...previous, section: { ...previous.section, ...patch } }))} />

        <div className="border-t border-border/40 pt-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold">{isBn ? "গল্পের অনুচ্ছেদ" : "Story paragraphs"}</h4>
            <Button type="button" size="sm" variant="outline" disabled={config.biography.paragraphs.length >= 12} onClick={() => updateConfig((previous) => ({ ...previous, biography: { ...previous.biography, paragraphs: [...previous.biography.paragraphs, { bn: "নতুন অনুচ্ছেদ", en: "New paragraph" }] } }))}><Plus className="h-3 w-3" />{isBn ? "যোগ" : "Add"}</Button>
          </div>
          <div className="space-y-3">
            {config.biography.paragraphs.map((paragraph, index) => (
              <div key={`paragraph-${index}`} className="rounded-lg border border-border/40 p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label={`বাংলা ${index + 1}`}><Textarea rows={4} value={paragraph.bn} onChange={(event) => updateConfig((previous) => ({ ...previous, biography: { ...previous.biography, paragraphs: previous.biography.paragraphs.map((item, itemIndex) => itemIndex === index ? { ...item, bn: event.target.value } : item) } }))} /></Field>
                  <Field label={`English ${index + 1}`}><Textarea rows={4} value={paragraph.en} onChange={(event) => updateConfig((previous) => ({ ...previous, biography: { ...previous.biography, paragraphs: previous.biography.paragraphs.map((item, itemIndex) => itemIndex === index ? { ...item, en: event.target.value } : item) } }))} /></Field>
                </div>
                <div className="mt-2 flex justify-end"><Button type="button" size="sm" variant="ghost" onClick={() => updateConfig((previous) => ({ ...previous, biography: { ...previous.biography, paragraphs: previous.biography.paragraphs.filter((_, itemIndex) => itemIndex !== index) } }))} disabled={config.biography.paragraphs.length <= 1}><Trash2 className="h-4 w-4 text-red-400" />{isBn ? "মুছুন" : "Remove"}</Button></div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 border-t border-border/40 pt-5 sm:grid-cols-2">
          <Field label={isBn ? "উক্তি (বাংলা)" : "Quote (Bangla)"}><Textarea rows={3} value={config.biography.quote.bn} onChange={(event) => updateConfig((previous) => ({ ...previous, biography: { ...previous.biography, quote: { ...previous.biography.quote, bn: event.target.value } } }))} /></Field>
          <Field label={isBn ? "উক্তি (ইংরেজি)" : "Quote (English)"}><Textarea rows={3} value={config.biography.quote.en} onChange={(event) => updateConfig((previous) => ({ ...previous, biography: { ...previous.biography, quote: { ...previous.biography.quote, en: event.target.value } } }))} /></Field>
          <Field label={isBn ? "উক্তিকার (বাংলা)" : "Quote by (Bangla)"}><Input value={config.biography.quoteBy.bn} onChange={(event) => updateConfig((previous) => ({ ...previous, biography: { ...previous.biography, quoteBy: { ...previous.biography.quoteBy, bn: event.target.value } } }))} /></Field>
          <Field label={isBn ? "উক্তিকার (ইংরেজি)" : "Quote by (English)"}><Input value={config.biography.quoteBy.en} onChange={(event) => updateConfig((previous) => ({ ...previous, biography: { ...previous.biography, quoteBy: { ...previous.biography.quoteBy, en: event.target.value } } }))} /></Field>
          <Field label={isBn ? "আগ্রহের শিরোনাম (বাংলা)" : "Interests heading (Bangla)"}><Input value={config.biography.interestsTitleBn} onChange={(event) => updateConfig((previous) => ({ ...previous, biography: { ...previous.biography, interestsTitleBn: event.target.value } }))} /></Field>
          <Field label={isBn ? "আগ্রহের শিরোনাম (ইংরেজি)" : "Interests heading (English)"}><Input value={config.biography.interestsTitleEn} onChange={(event) => updateConfig((previous) => ({ ...previous, biography: { ...previous.biography, interestsTitleEn: event.target.value } }))} /></Field>
        </div>
      </GlassCard>

      {/* Personal info and interests */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">{isBn ? "ব্যক্তিগত তথ্য কার্ড" : "Personal information cards"}<Badge variant="outline" className="ml-2 text-[10px]">{config.personalInfo.length}</Badge></h3><Button type="button" size="sm" variant="outline" disabled={config.personalInfo.length >= 12} onClick={() => updateConfig((previous) => ({ ...previous, personalInfo: [...previous.personalInfo, createPersonalInfo()] }))}><Plus className="h-3 w-3" />{isBn ? "যোগ" : "Add"}</Button></div>
        <div className="space-y-3">
          {config.personalInfo.map((item, index) => (
            <div key={item.id} className="rounded-lg border border-border/40 p-3">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Field label="Icon"><select value={item.icon} onChange={(event) => updateConfig((previous) => ({ ...previous, personalInfo: previous.personalInfo.map((value, itemIndex) => itemIndex === index ? { ...value, icon: event.target.value as AboutIconName } : value) }))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">{ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}</select></Field>
                <Field label="Label BN"><Input value={item.labelBn} onChange={(event) => updateConfig((previous) => ({ ...previous, personalInfo: previous.personalInfo.map((value, itemIndex) => itemIndex === index ? { ...value, labelBn: event.target.value } : value) }))} /></Field>
                <Field label="Label EN"><Input value={item.labelEn} onChange={(event) => updateConfig((previous) => ({ ...previous, personalInfo: previous.personalInfo.map((value, itemIndex) => itemIndex === index ? { ...value, labelEn: event.target.value } : value) }))} /></Field>
                <div className="flex items-end justify-end"><ReorderControls index={index} count={config.personalInfo.length} onMove={(direction) => updateConfig((previous) => ({ ...previous, personalInfo: moveItem(previous.personalInfo, index, direction) }))} onRemove={() => updateConfig((previous) => ({ ...previous, personalInfo: previous.personalInfo.filter((_, itemIndex) => itemIndex !== index) }))} removeLabel={isBn ? "তথ্য মুছুন" : "Remove information"} /></div>
                <Field label="Value BN" className="lg:col-span-2"><Input value={item.valueBn} onChange={(event) => updateConfig((previous) => ({ ...previous, personalInfo: previous.personalInfo.map((value, itemIndex) => itemIndex === index ? { ...value, valueBn: event.target.value } : value) }))} /></Field>
                <Field label="Value EN" className="lg:col-span-2"><Input value={item.valueEn} onChange={(event) => updateConfig((previous) => ({ ...previous, personalInfo: previous.personalInfo.map((value, itemIndex) => itemIndex === index ? { ...value, valueEn: event.target.value } : value) }))} /></Field>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border/40 pt-5">
          <div className="mb-3 flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">{isBn ? "আগ্রহের ব্যাজ" : "Interest badges"}<Badge variant="outline" className="ml-2 text-[10px]">{config.interests.length}</Badge></h3><Button type="button" size="sm" variant="outline" disabled={config.interests.length >= 12} onClick={() => updateConfig((previous) => ({ ...previous, interests: [...previous.interests, { ...createInterest(), icon: "Star" }] }))}><Plus className="h-3 w-3" />{isBn ? "যোগ" : "Add"}</Button></div>
          <div className="space-y-3">
            {config.interests.map((item, index) => (
              <div key={item.id} className="grid gap-3 rounded-lg border border-border/40 p-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
                <SelectField label="Icon" value={item.icon} options={ICON_OPTIONS} onChange={(value) => updateConfig((previous) => ({ ...previous, interests: previous.interests.map((interest, itemIndex) => itemIndex === index ? { ...interest, icon: value as AboutIconName } : interest) }))} />
                <Field label="Label BN"><Input value={item.labelBn} onChange={(event) => updateConfig((previous) => ({ ...previous, interests: previous.interests.map((interest, itemIndex) => itemIndex === index ? { ...interest, labelBn: event.target.value } : interest) }))} /></Field>
                <Field label="Label EN"><Input value={item.labelEn} onChange={(event) => updateConfig((previous) => ({ ...previous, interests: previous.interests.map((interest, itemIndex) => itemIndex === index ? { ...interest, labelEn: event.target.value } : interest) }))} /></Field>
                <ReorderControls index={index} count={config.interests.length} onMove={(direction) => updateConfig((previous) => ({ ...previous, interests: moveItem(previous.interests, index, direction) }))} onRemove={() => updateConfig((previous) => ({ ...previous, interests: previous.interests.filter((_, itemIndex) => itemIndex !== index) }))} removeLabel={isBn ? "আগ্রহ মুছুন" : "Remove interest"} />
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Education editor */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-2"><div><h3 className="text-sm font-semibold">{isBn ? "শিক্ষা টাইমলাইন" : "Education timeline"}</h3><p className="mt-1 text-xs text-muted-foreground">{isBn ? "মাইলস্টোনের ক্রম, প্রতিষ্ঠান, ফলাফল ও লোকেশন ব্যাজ নিয়ন্ত্রণ করুন" : "Control milestone order, institutions, results, and location badges"}</p></div><Button type="button" size="sm" variant="outline" disabled={config.education.length >= 24} onClick={() => updateConfig((previous) => ({ ...previous, education: [...previous.education, createEducation()] }))}><Plus className="h-3 w-3" />{isBn ? "মাইলস্টোন যোগ" : "Add milestone"}</Button></div>
        <SectionFields section={config.educationSection} isBn={isBn} onChange={(patch) => updateConfig((previous) => ({ ...previous, educationSection: { ...previous.educationSection, ...patch } }))} />
        <div className="space-y-4 border-t border-border/40 pt-5">
          {config.education.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-border/50 bg-background/20 p-4">
              <div className="mb-4 flex items-center justify-between gap-3"><Badge variant="glow">#{index + 1}</Badge><ReorderControls index={index} count={config.education.length} onMove={(direction) => updateConfig((previous) => ({ ...previous, education: moveItem(previous.education, index, direction) }))} onRemove={() => updateConfig((previous) => ({ ...previous, education: previous.education.filter((_, itemIndex) => itemIndex !== index) }))} removeLabel={isBn ? "মাইলস্টোন মুছুন" : "Remove milestone"} /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Year BN"><Input value={item.yearBn} onChange={(event) => updateEducation(index, { yearBn: event.target.value })} /></Field>
                <Field label="Year EN"><Input value={item.yearEn} onChange={(event) => updateEducation(index, { yearEn: event.target.value })} /></Field>
                <Field label="Title BN"><Input value={item.titleBn} onChange={(event) => updateEducation(index, { titleBn: event.target.value })} /></Field>
                <Field label="Title EN"><Input value={item.titleEn} onChange={(event) => updateEducation(index, { titleEn: event.target.value })} /></Field>
                <Field label="Institution BN"><Input value={item.institutionBn} onChange={(event) => updateEducation(index, { institutionBn: event.target.value })} /></Field>
                <Field label="Institution EN"><Input value={item.institutionEn} onChange={(event) => updateEducation(index, { institutionEn: event.target.value })} /></Field>
                <Field label="Location BN"><Input value={item.locationBn} onChange={(event) => updateEducation(index, { locationBn: event.target.value })} /></Field>
                <Field label="Location EN"><Input value={item.locationEn} onChange={(event) => updateEducation(index, { locationEn: event.target.value })} /></Field>
                <Field label="Description BN"><Textarea rows={3} value={item.descriptionBn} onChange={(event) => updateEducation(index, { descriptionBn: event.target.value })} /></Field>
                <Field label="Description EN"><Textarea rows={3} value={item.descriptionEn} onChange={(event) => updateEducation(index, { descriptionEn: event.target.value })} /></Field>
                <Field label="Result / badge BN"><Input value={item.badgeBn} onChange={(event) => updateEducation(index, { badgeBn: event.target.value })} /></Field>
                <Field label="Result / badge EN"><Input value={item.badgeEn} onChange={(event) => updateEducation(index, { badgeEn: event.target.value })} /></Field>
                <SelectField label="Badge style" value={item.badgeType} options={BADGE_OPTIONS} onChange={(value) => updateEducation(index, { badgeType: value as AboutBadgeType })} />
                <Field label="GPA / result"><Input value={item.gpa} onChange={(event) => updateEducation(index, { gpa: event.target.value })} placeholder="5.00" /></Field>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Achievement editor */}
      <GlassCard className="space-y-5 p-5">
        <div className="flex items-center justify-between gap-2"><div><h3 className="text-sm font-semibold">{isBn ? "অর্জন ও সার্টিফিকেট" : "Achievements & certificates"}</h3><p className="mt-1 text-xs text-muted-foreground">{isBn ? "গেমিং-স্টাইল ব্যাজ, মানদণ্ড, স্পার্কল/সাউন্ড এবং ফুল-স্ক্রিন সার্টিফিকেট" : "Gaming-style badges, criteria, sparkle/sound controls, and full-screen certificates"}</p></div><Button type="button" size="sm" variant="outline" disabled={config.achievements.length >= 24} onClick={() => updateConfig((previous) => ({ ...previous, achievements: [...previous.achievements, createAchievement()] }))}><Plus className="h-3 w-3" />{isBn ? "অর্জন যোগ" : "Add achievement"}</Button></div>
        <SectionFields section={config.achievementsSection} isBn={isBn} onChange={(patch) => updateConfig((previous) => ({ ...previous, achievementsSection: { ...previous.achievementsSection, ...patch } }))} />
        <div className="space-y-4 border-t border-border/40 pt-5">
          {config.achievements.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-border/50 bg-background/20 p-4">
              <div className="mb-4 flex items-center justify-between gap-3"><Badge variant="gradient"><Award className="mr-1 h-3 w-3" />#{index + 1}</Badge><ReorderControls index={index} count={config.achievements.length} onMove={(direction) => updateConfig((previous) => ({ ...previous, achievements: moveItem(previous.achievements, index, direction) }))} onRemove={() => updateConfig((previous) => ({ ...previous, achievements: previous.achievements.filter((_, itemIndex) => itemIndex !== index) }))} removeLabel={isBn ? "অর্জন মুছুন" : "Remove achievement"} /></div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Year BN"><Input value={item.yearBn} onChange={(event) => updateAchievement(index, { yearBn: event.target.value })} /></Field>
                <Field label="Year EN"><Input value={item.yearEn} onChange={(event) => updateAchievement(index, { yearEn: event.target.value })} /></Field>
                <Field label="Title BN"><Input value={item.titleBn} onChange={(event) => updateAchievement(index, { titleBn: event.target.value })} /></Field>
                <Field label="Title EN"><Input value={item.titleEn} onChange={(event) => updateAchievement(index, { titleEn: event.target.value })} /></Field>
                <Field label="Description BN"><Textarea rows={3} value={item.descriptionBn} onChange={(event) => updateAchievement(index, { descriptionBn: event.target.value })} /></Field>
                <Field label="Description EN"><Textarea rows={3} value={item.descriptionEn} onChange={(event) => updateAchievement(index, { descriptionEn: event.target.value })} /></Field>
                <SelectField label="Icon" value={item.icon} options={ACHIEVEMENT_ICON_OPTIONS} onChange={(value) => updateAchievement(index, { icon: value as AchievementIconName })} />
                <SelectField label="Rarity" value={item.rarity} options={RARITY_OPTIONS} onChange={(value) => updateAchievement(index, { rarity: value as AchievementRarity })} />
                <Field label="Unlock criteria BN"><Input value={item.unlockCriteriaBn} onChange={(event) => updateAchievement(index, { unlockCriteriaBn: event.target.value })} /></Field>
                <Field label="Unlock criteria EN"><Input value={item.unlockCriteriaEn} onChange={(event) => updateAchievement(index, { unlockCriteriaEn: event.target.value })} /></Field>
                <Field label="Completion date"><Input value={item.completedAt} onChange={(event) => updateAchievement(index, { completedAt: event.target.value })} placeholder="2025-06-01" /></Field>
                <div className="flex items-end gap-4 pb-2 text-xs text-muted-foreground"><label className="flex items-center gap-2"><input type="checkbox" checked={item.sparkle} onChange={(event) => updateAchievement(index, { sparkle: event.target.checked })} />{isBn ? "স্পার্কল" : "Sparkle"}</label><label className="flex items-center gap-2"><input type="checkbox" checked={item.sound} onChange={(event) => updateAchievement(index, { sound: event.target.checked })} />{isBn ? "সাউন্ড" : "Sound"}</label></div>
                <Field label={isBn ? "সার্টিফিকেট URL (ফুল-স্ক্রিন)" : "Certificate URL (full-screen)"} className="sm:col-span-2"><Input value={item.certificateUrl} onChange={(event) => updateAchievement(index, { certificateUrl: event.target.value })} placeholder="https://res.cloudinary.com/..." /></Field>
                <Field label="Certificate public ID" className="sm:col-span-2"><Input value={item.certificatePublicId} onChange={(event) => updateAchievement(index, { certificatePublicId: event.target.value })} /></Field>
                <Field label={isBn ? "ছবি সার্টিফিকেট আপলোড" : "Upload image certificate"} className="sm:col-span-2"><Input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => void handleCertificateUpload(index, event)} disabled={uploading === `certificate-${index}`} />{uploading === `certificate-${index}` && <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" />{isBn ? "আপলোড হচ্ছে..." : "Uploading..."}</span>}</Field>
                {item.certificateUrl && (
                  <div className="flex items-center gap-3 rounded-lg border border-border/40 p-2 sm:col-span-2">
                    <div className="h-14 w-20 overflow-hidden rounded bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.certificateUrl} alt={item.titleEn} className="h-full w-full object-cover" />
                    </div>
                    <a href={item.certificateUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline-offset-4 hover:underline">
                      {isBn ? "সার্টিফিকেট প্রিভিউ" : "Preview certificate"}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Achievement stats */}
      <GlassCard className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-2"><div><h3 className="text-sm font-semibold">{isBn ? "অর্জনের পরিসংখ্যান" : "Achievement statistics"}</h3><p className="mt-1 text-xs text-muted-foreground">{isBn ? "কার্ডের সংখ্যা, লেবেল ও suffix সম্পাদনা করুন" : "Edit stat card values, labels, and suffixes"}</p></div><Button type="button" size="sm" variant="outline" disabled={config.achievementStats.length >= 8} onClick={() => updateConfig((previous) => ({ ...previous, achievementStats: [...previous.achievementStats, createStat()] }))}><Plus className="h-3 w-3" />{isBn ? "স্ট্যাট যোগ" : "Add stat"}</Button></div>
        <div className="space-y-3">
          {config.achievementStats.map((stat, index) => (
            <div key={stat.id} className="grid gap-3 rounded-lg border border-border/40 p-3 sm:grid-cols-4 sm:items-end">
              <Field label="Label BN"><Input value={stat.labelBn} onChange={(event) => updateConfig((previous) => ({ ...previous, achievementStats: previous.achievementStats.map((value, itemIndex) => itemIndex === index ? { ...value, labelBn: event.target.value } : value) }))} /></Field>
              <Field label="Label EN"><Input value={stat.labelEn} onChange={(event) => updateConfig((previous) => ({ ...previous, achievementStats: previous.achievementStats.map((value, itemIndex) => itemIndex === index ? { ...value, labelEn: event.target.value } : value) }))} /></Field>
              <div className="grid grid-cols-2 gap-2"><Field label="Value"><Input type="number" min={0} value={stat.value} onChange={(event) => updateConfig((previous) => ({ ...previous, achievementStats: previous.achievementStats.map((value, itemIndex) => itemIndex === index ? { ...value, value: Number(event.target.value) } : value) }))} /></Field><Field label="Suffix"><Input value={stat.suffix} onChange={(event) => updateConfig((previous) => ({ ...previous, achievementStats: previous.achievementStats.map((value, itemIndex) => itemIndex === index ? { ...value, suffix: event.target.value } : value) }))} /></Field></div>
              <ReorderControls index={index} count={config.achievementStats.length} onMove={(direction) => updateConfig((previous) => ({ ...previous, achievementStats: moveItem(previous.achievementStats, index, direction) }))} onRemove={() => updateConfig((previous) => ({ ...previous, achievementStats: previous.achievementStats.filter((_, itemIndex) => itemIndex !== index) }))} removeLabel={isBn ? "স্ট্যাট মুছুন" : "Remove stat"} />
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => void fetchConfig()} disabled={saving || uploading !== null}>{isBn ? "রিসেট" : "Reset"}</Button>
        <Button type="button" onClick={() => void save()} disabled={saving || uploading !== null} className="min-w-32">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? (isBn ? "সংরক্ষণ..." : "Saving...") : isBn ? "পরিবর্তন সংরক্ষণ" : "Save changes"}
        </Button>
      </div>

      <p className="text-center text-[11px] text-muted-foreground">
        <Upload className="mr-1 inline h-3 w-3" />
        {isBn ? "মিডিয়া Cloudinary-তে আপলোড হবে এবং পরিবর্তন site_settings ও audit log-এ সংরক্ষিত হবে।" : "Media uploads go to Cloudinary; content changes are stored in site_settings and audited."}
      </p>
    </section>
  );
}
