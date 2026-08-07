"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { DEFAULT_CONTACT_CONFIG, validateContactConfig } from "@/lib/contact/config";
import type { ContactConfig } from "@/types/contact";
import {
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

interface ContactControlPanelProps {
  locale?: string;
}

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function ContactControlPanel({ locale = "bn" }: ContactControlPanelProps) {
  const isBn = locale === "bn";
  const [config, setConfig] = useState<ContactConfig>(DEFAULT_CONTACT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/contact-config", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: unknown };
      setConfig(validateContactConfig(json.data) ?? DEFAULT_CONTACT_CONFIG);
    } catch {
      setError(isBn ? "কন্টাক্ট কনফিগ লোড করা যায়নি" : "Failed to load Contact configuration");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchConfig();
  }, [fetchConfig]);

  const updateConfig = (updater: (p: ContactConfig) => ContactConfig) => setConfig((prev) => updater(prev));
  const section = config.section;
  const quick = config.quickLinks;
  const booking = config.booking;
  const tst = config.testimonials;

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    const validated = validateContactConfig(config);
    if (!validated) {
      setError(isBn ? "ভ্যালিডেশন ব্যর্থ" : "Validation failed");
      setSaving(false);
      return;
    }
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "contact_config", value: validated }),
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
        badge="💬"
        title="Contact, Booking & Testimonials Control"
        titleBn="যোগাযোগ, বুকিং ও টেস্টিমোনিয়াল কন্ট্রোল"
        subtitle={isBn ? "কন্টাক্ট সেকশন, বুকিং সেটিংস এবং রিভিউ ডিসপ্লে নিয়ন্ত্রণ করুন" : "Control contact section, booking settings and review display"}
        locale={locale}
      />
      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">{success}</div>}

      <GlassCard className="space-y-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {config.visible ? <Eye className="h-4 w-4 text-green-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-semibold">{isBn ? "কন্টাক্ট দৃশ্যমান" : "Contact visible"}</span>
            <Badge variant={config.visible ? "default" : "outline"} className="text-[10px]">{config.visible ? "ON" : "OFF"}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" variant={config.visible ? "outline" : "gradient"} onClick={() => updateConfig((p) => ({ ...p, visible: !p.visible }))}>{config.visible ? (isBn ? "লুকান" : "Hide") : isBn ? "দেখান" : "Show"}</Button>
            <Button type="button" size="sm" variant="gradient" onClick={save} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{isBn ? "সংরক্ষণ করুন" : "Save"}</Button>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "সেকশন হেডিং ও কুইক লিংক" : "Section heading & quick links"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "ব্যাজ (বাংলা)" : "Badge (Bangla)"}><Input value={section.badgeBn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, badgeBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "ব্যাজ (ইংরেজি)" : "Badge (English)"}><Input value={section.badgeEn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, badgeEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (বাংলা)" : "Title (Bangla)"}><Input value={section.titleBn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, titleBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "শিরোনাম (ইংরেজি)" : "Title (English)"}><Input value={section.titleEn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, titleEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "সাবটাইটেল (বাংলা)" : "Subtitle (Bangla)"} className="sm:col-span-2"><Textarea rows={2} value={section.subtitleBn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, subtitleBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "সাবটাইটেল (ইংরেজি)" : "Subtitle (English)"} className="sm:col-span-2"><Textarea rows={2} value={section.subtitleEn} onChange={(e) => updateConfig((p) => ({ ...p, section: { ...p.section, subtitleEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "হোয়াটসঅ্যাপ URL" : "WhatsApp URL"} className="sm:col-span-2"><Input value={quick.whatsappUrl} onChange={(e) => updateConfig((p) => ({ ...p, quickLinks: { ...p.quickLinks, whatsappUrl: e.target.value } }))} placeholder="https://wa.me/..." /></Field>
          <Field label={isBn ? "ইমেইল" : "Email"}><Input value={quick.emailAddress} onChange={(e) => updateConfig((p) => ({ ...p, quickLinks: { ...p.quickLinks, emailAddress: e.target.value } }))} /></Field>
          <Field label={isBn ? "ফোন" : "Phone"}><Input value={quick.phoneNumber} onChange={(e) => updateConfig((p) => ({ ...p, quickLinks: { ...p.quickLinks, phoneNumber: e.target.value } }))} /></Field>
          <Field label={isBn ? "রেসপন্স টাইম (বাংলা)" : "Response time (Bangla)"}><Input value={quick.responseTimeBn} onChange={(e) => updateConfig((p) => ({ ...p, quickLinks: { ...p.quickLinks, responseTimeBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "রেসপন্স টাইম (ইংরেজি)" : "Response time (English)"}><Input value={quick.responseTimeEn} onChange={(e) => updateConfig((p) => ({ ...p, quickLinks: { ...p.quickLinks, responseTimeEn: e.target.value } }))} /></Field>
        </div>
      </GlassCard>

      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "বুকিং সেটিংস" : "Booking settings"}</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label={isBn ? "হেডিং (বাংলা)" : "Heading (Bangla)"}><Input value={booking.headingBn} onChange={(e) => updateConfig((p) => ({ ...p, booking: { ...p.booking, headingBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "হেডিং (ইংরেজি)" : "Heading (English)"}><Input value={booking.headingEn} onChange={(e) => updateConfig((p) => ({ ...p, booking: { ...p.booking, headingEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "বাফার (মিনিট)" : "Buffer (min)"}><Input type="number" min={0} max={240} value={booking.bufferMinutes} onChange={(e) => updateConfig((p) => ({ ...p, booking: { ...p.booking, bufferMinutes: Number(e.target.value) || 0 } }))} /></Field>
          <Field label={isBn ? "প্রতি সপ্তাহে সর্বোচ্চ" : "Max per week"}>
            <Input type="number" min={1} max={100} value={booking.maxPerWeek} onChange={(e) => updateConfig((p) => ({ ...p, booking: { ...p.booking, maxPerWeek: Number(e.target.value) || 1 } }))} />
          </Field>
          <Field label={isBn ? "কনফার্মেশন (বাংলা)" : "Confirmation (Bangla)"} className="sm:col-span-3"><Textarea rows={2} value={booking.confirmationMessageBn} onChange={(e) => updateConfig((p) => ({ ...p, booking: { ...p.booking, confirmationMessageBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "কনফার্মেশন (ইংরেজি)" : "Confirmation (English)"} className="sm:col-span-3"><Textarea rows={2} value={booking.confirmationMessageEn} onChange={(e) => updateConfig((p) => ({ ...p, booking: { ...p.booking, confirmationMessageEn: e.target.value } }))} /></Field>
        </div>
        <div className="border-t border-border/40 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">{isBn ? "টাইম স্লট" : "Time slots"}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((p) => ({ ...p, booking: { ...p.booking, timeSlots: [...p.booking.timeSlots, "12:00"] } }))}><Plus className="h-4 w-4" /> {isBn ? "স্লট" : "Slot"}</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {booking.timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center gap-1 rounded-lg border border-border/60 px-2 py-1">
                <Input value={slot} onChange={(e) => updateConfig((p) => ({ ...p, booking: { ...p.booking, timeSlots: p.booking.timeSlots.map((s, i) => (i === index ? e.target.value : s)) } }))} className="w-16 text-xs" />
                <Button type="button" size="icon-sm" variant="ghost" onClick={() => updateConfig((p) => ({ ...p, booking: { ...p.booking, timeSlots: p.booking.timeSlots.filter((_, i) => i !== index) } }))} aria-label="Remove"><Trash2 className="h-4 w-4 text-red-400" /></Button>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-border/40 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">{isBn ? "বুকিং উদ্দেশ্য" : "Booking purposes"}</span>
            <Button type="button" size="sm" variant="outline" onClick={() => updateConfig((p) => ({ ...p, booking: { ...p.booking, purposes: [...p.booking.purposes, { id: newId("purp"), value: "", labelBn: "নতুন", labelEn: "New", visible: true }] } }))}><Plus className="h-4 w-4" /> {isBn ? "উদ্দেশ্য" : "Purpose"}</Button>
          </div>
          <div className="space-y-2">
            {booking.purposes.map((purpose, index) => (
              <div key={purpose.id} className="flex items-center gap-2 rounded-lg border border-border/40 p-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={purpose.visible} onChange={(e) => updateConfig((p) => ({ ...p, booking: { ...p.booking, purposes: p.booking.purposes.map((x, i) => (i === index ? { ...x, visible: e.target.checked } : x)) } }))} />{isBn ? "দৃশ্যমান" : "Visible"}</label>
                <Input value={purpose.value} onChange={(e) => updateConfig((p) => ({ ...p, booking: { ...p.booking, purposes: p.booking.purposes.map((x, i) => (i === index ? { ...x, value: e.target.value } : x)) } }))} placeholder="value" className="text-xs" />
                <Input value={purpose.labelBn} onChange={(e) => updateConfig((p) => ({ ...p, booking: { ...p.booking, purposes: p.booking.purposes.map((x, i) => (i === index ? { ...x, labelBn: e.target.value } : x)) } }))} placeholder="বাংলা" className="text-xs" />
                <Input value={purpose.labelEn} onChange={(e) => updateConfig((p) => ({ ...p, booking: { ...p.booking, purposes: p.booking.purposes.map((x, i) => (i === index ? { ...x, labelEn: e.target.value } : x)) } }))} placeholder="English" className="text-xs" />
                <Button type="button" size="icon-sm" variant="ghost" onClick={() => updateConfig((p) => ({ ...p, booking: { ...p.booking, purposes: p.booking.purposes.filter((_, i) => i !== index) } }))} aria-label="Remove"><Trash2 className="h-4 w-4 text-red-400" /></Button>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="space-y-5 p-5">
        <h3 className="text-sm font-semibold">{isBn ? "টেস্টিমোনিয়াল ডিসপ্লে" : "Testimonial display"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={isBn ? "হেডিং (বাংলা)" : "Heading (Bangla)"}><Input value={tst.headingBn} onChange={(e) => updateConfig((p) => ({ ...p, testimonials: { ...p.testimonials, headingBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "হেডিং (ইংরেজি)" : "Heading (English)"}><Input value={tst.headingEn} onChange={(e) => updateConfig((p) => ({ ...p, testimonials: { ...p.testimonials, headingEn: e.target.value } }))} /></Field>
          <Field label={isBn ? "কারোসেল সংখ্যা" : "Carousel count"}>
            <Input type="number" min={1} max={20} value={tst.carouselCount} onChange={(e) => updateConfig((p) => ({ ...p, testimonials: { ...p.testimonials, carouselCount: Number(e.target.value) || 1 } }))} />
          </Field>
          <Field label={isBn ? "অটোপ্লে (সেকেন্ড)" : "Auto-play (sec)"}>
            <Input type="number" min={2} max={30} value={tst.autoPlaySeconds} onChange={(e) => updateConfig((p) => ({ ...p, testimonials: { ...p.testimonials, autoPlaySeconds: Number(e.target.value) || 5 } }))} />
          </Field>
          <Field label={isBn ? "সাবটাইটেল (বাংলা)" : "Subtitle (Bangla)"} className="sm:col-span-2"><Textarea rows={2} value={tst.subtitleBn} onChange={(e) => updateConfig((p) => ({ ...p, testimonials: { ...p.testimonials, subtitleBn: e.target.value } }))} /></Field>
          <Field label={isBn ? "সাবটাইটেল (ইংরেজি)" : "Subtitle (English)"} className="sm:col-span-2"><Textarea rows={2} value={tst.subtitleEn} onChange={(e) => updateConfig((p) => ({ ...p, testimonials: { ...p.testimonials, subtitleEn: e.target.value } }))} /></Field>
        </div>
      </GlassCard>
    </section>
  );
}
