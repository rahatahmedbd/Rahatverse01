"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_GLOBAL_CONFIG, validateGlobalConfig } from "@/lib/global/config";
import type { GlobalConfig } from "@/types/global";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";

interface GlobalControlPanelProps {
  locale?: string;
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function GlobalControlPanel({ locale = "bn" }: GlobalControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<GlobalConfig>(DEFAULT_GLOBAL_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/global-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateGlobalConfig(json.data) ?? DEFAULT_GLOBAL_CONFIG);
    } catch {
      setError(isBn ? "গ্লোবাল কনফিগ লোড করা যায়নি" : "Failed to load Global configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  const updateConfig = (updater: (p: GlobalConfig) => GlobalConfig) => setConfig((prev) => updater(prev));
  const announcement = config.announcement;
  const header = config.header;
  const footer = config.footer;
  const maintenance = config.maintenance;

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const validated = validateGlobalConfig(config);
    if (!validated) {
      setError(isBn ? "ভ্যালিডেশন ব্যর্থ" : "Validation failed");
      setSaving(false);
      return;
    }
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "global_config", value: validated }),
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
        badge="⚙️"
        title="Global Site Settings & Maintenance"
        titleBn="গ্লোবাল সাইট সেটিংস ও মেইনটেন্যান্স"
        subtitle={isBn ? "ব্যানার, ফুটার, বিজনেস কন্টাক্ট এবং মেইনটেন্যান্স মোড নিয়ন্ত্রণ করুন" : "Control banners, footer, business contacts and maintenance mode"}
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

      {/* Announcement banner */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "অ্যানাউন্সমেন্ট ব্যানার" : "Announcement banner"}</h3>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={announcement.enabled} onChange={(e) => updateConfig((p) => ({ ...p, announcement: { ...p.announcement, enabled: e.target.checked } }))} />{isBn ? "ব্যানার চালু" : "Banner enabled"}</label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "টেক্সট (বাংলা)" : "Text (Bangla)"}><Input value={announcement.textBn} onChange={(e) => updateConfig((p) => ({ ...p, announcement: { ...p.announcement, textBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "টেক্সট (ইংরেজি)" : "Text (English)"}><Input value={announcement.textEn} onChange={(e) => updateConfig((p) => ({ ...p, announcement: { ...p.announcement, textEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "লিংক (ঐচ্ছিক)" : "Link (optional)"} className="sm:col-span-2"><Input value={announcement.link} onChange={(e) => updateConfig((p) => ({ ...p, announcement: { ...p.announcement, link: e.target.value } }))} /></Field>
        </div>
      </GlassCard>

      {/* Header announcement */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "হেডার অ্যানাউন্সমেন্ট" : "Header announcement"}</h3>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={header.enabled} onChange={(e) => updateConfig((p) => ({ ...p, header: { ...p.header, enabled: e.target.checked } }))} />{isBn ? "চালু" : "Enabled"}</label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "টেক্সট (বাংলা)" : "Text (Bangla)"}><Input value={header.textBn} onChange={(e) => updateConfig((p) => ({ ...p, header: { ...p.header, textBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "টেক্সট (ইংরেজি)" : "Text (English)"}><Input value={header.textEn} onChange={(e) => updateConfig((p) => ({ ...p, header: { ...p.header, textEn: e.target.value } }))} /></Field>
        </div>
      </GlassCard>

      {/* Footer */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "ফুটার সেটিংস" : "Footer settings"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "কপিরাইট (বাংলা)" : "Copyright (Bangla)"}><Input value={footer.copyrightBn} onChange={(e) => updateConfig((p) => ({ ...p, footer: { ...p.footer, copyrightBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "কপিরাইট (ইংরেজি)" : "Copyright (English)"}><Input value={footer.copyrightEn} onChange={(e) => updateConfig((p) => ({ ...p, footer: { ...p.footer, copyrightEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "মেড উইথ (বাংলা)" : "Made with (Bangla)"}><Input value={footer.madeWithBn} onChange={(e) => updateConfig((p) => ({ ...p, footer: { ...p.footer, madeWithBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "মেড উইথ (ইংরেজি)" : "Made with (English)"}><Input value={footer.madeWithEn} onChange={(e) => updateConfig((p) => ({ ...p, footer: { ...p.footer, madeWithEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "বিজনেস ফোন" : "Business phone"}><Input value={footer.businessPhone} onChange={(e) => updateConfig((p) => ({ ...p, footer: { ...p.footer, businessPhone: e.target.value } }))} /></Field>
          <Field label={isBn ? "বিজনেস ইমেইল" : "Business email"}><Input value={footer.businessEmail} onChange={(e) => updateConfig((p) => ({ ...p, footer: { ...p.footer, businessEmail: e.target.value } }))} /></Field>
          <Field label={isBn ? "হোয়াটসঅ্যাপ লিংক" : "WhatsApp link"}><Input value={footer.businessWhatsapp} onChange={(e) => updateConfig((p) => ({ ...p, footer: { ...p.footer, businessWhatsapp: e.target.value } }))} /></Field>
          <Field label={isBn ? "অবস্থান (বাংলা)" : "Location (Bangla)"}><Input value={footer.locationBn} onChange={(e) => updateConfig((p) => ({ ...p, footer: { ...p.footer, locationBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "অবস্থান (ইংরেজি)" : "Location (English)"}><Input value={footer.locationEn} onChange={(e) => updateConfig((p) => ({ ...p, footer: { ...p.footer, locationEn: e.target.value } }))} /></Field>
        </div>
      </GlassCard>

      {/* Maintenance */}
      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "মেইনটেন্যান্স মোড" : "Maintenance mode"}</h3>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={maintenance.enabled} onChange={(e) => updateConfig((p) => ({ ...p, maintenance: { ...p.maintenance, enabled: e.target.checked } }))} />{isBn ? "মেইনটেন্যান্স চালু" : "Maintenance enabled"}</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={maintenance.allowAdmins} onChange={(e) => updateConfig((p) => ({ ...p, maintenance: { ...p.maintenance, allowAdmins: e.target.checked } }))} />{isBn ? "অ্যাডমিনদের অ্যাক্সেস দাও" : "Allow admin access"}</label>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "বার্তা (বাংলা)" : "Message (Bangla)"}><Textarea rows={2} value={maintenance.messageBn} onChange={(e) => updateConfig((p) => ({ ...p, maintenance: { ...p.maintenance, messageBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "বার্তা (ইংরেজি)" : "Message (English)"}><Textarea rows={2} value={maintenance.messageEn} onChange={(e) => updateConfig((p) => ({ ...p, maintenance: { ...p.maintenance, messageEn: e.target.value } }))} /></Field>
        </div>
      </GlassCard>
    </section>
  );
}
