"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertCircle, Loader2, Settings, Mail } from "lucide-react";

interface PreferencesProps {
  token: string;
  locale?: string;
}

export function NewsletterPreferences({ token, locale = "bn" }: PreferencesProps) {
  const isBn = locale === "bn";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<{ email: string; name: string | null; preferences: Record<string, unknown>; is_active: boolean } | null>(null);
  const [name, setName] = useState("");
  const [freq, setFreq] = useState<string>("weekly");
  const [topics, setTopics] = useState<string[]>([]);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch(`/api/newsletter/preferences?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.data) {
          setData(j.data);
          setName(j.data.name || "");
          const prefs = j.data.preferences || {};
          setFreq((prefs.frequency as string) || "weekly");
          setTopics((prefs.topics as string[]) || []);
        } else {
          setMsg({ type: "error", text: j.error || "Invalid token" });
        }
      })
      .catch(() => setMsg({ type: "error", text: "Network error" }))
      .finally(() => setLoading(false));
  }, [token]);

  const toggleTopic = (t: string) => setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/newsletter/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name: name || null, preferences: { frequency: freq, topics, locale } }),
      });
      const j = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: isBn ? "পছন্দ সংরক্ষিত হয়েছে!" : "Preferences saved!" });
        setData(j.data);
      } else setMsg({ type: "error", text: j.error || "Failed to save" });
    } catch {
      setMsg({ type: "error", text: "Network error" });
    } finally {
      setSaving(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!confirm(isBn ? "আপনি কি আনসাবস্ক্রাইব করতে চান?" : "Unsubscribe?")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, locale }),
      });
      const j = await res.json();
      if (res.ok) {
        setMsg({ type: "success", text: isBn ? "আনসাবস্ক্রাইব করা হয়েছে।" : "Unsubscribed." });
        if (data) setData({ ...data, is_active: false });
      } else setMsg({ type: "error", text: j.error || "Failed" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-8 text-center">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">{isBn ? "লোড হচ্ছে..." : "Loading..."}</p>
      </GlassCard>
    );
  }

  if (!data && msg?.type === "error") {
    return (
      <GlassCard className="p-8 text-center border-red-500/20">
        <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
        <p className="mt-2 font-semibold">{msg.text}</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
            <Settings className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold bn">{isBn ? "নিউজলেটার পছন্দ" : "Newsletter preferences"}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" /> {data?.email}
            </p>
          </div>
          <span className={`ml-auto text-xs px-2 py-1 rounded-full ${data?.is_active ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
            {data?.is_active ? (isBn ? "সক্রিয়" : "Active") : isBn ? "নিষ্ক্রিয়" : "Inactive"}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium bn">{isBn ? "নাম" : "Name"}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={isBn ? "আপনার নাম" : "Your name"} className="mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium bn">{isBn ? "ফ্রিকোয়েন্সি" : "Frequency"}</label>
            <div className="mt-2 flex gap-2">
              {[
                { id: "weekly", label: isBn ? "সাপ্তাহিক" : "Weekly" },
                { id: "monthly", label: isBn ? "মাসিক" : "Monthly" },
                { id: "instant", label: isBn ? "তাৎক্ষণিক" : "Instant" },
              ].map((o) => (
                <button
                  key={o.id}
                  onClick={() => setFreq(o.id)}
                  className={`px-4 py-2 rounded-lg text-sm border ${freq === o.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/30"}`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium bn">{isBn ? "বিষয়" : "Topics"}</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {[
                { id: "education", label: isBn ? "শিক্ষা" : "Education" },
                { id: "technology", label: isBn ? "প্রযুক্তি" : "Technology" },
                { id: "social", label: isBn ? "সমাজসেবা" : "Social Service" },
                { id: "projects", label: isBn ? "প্রজেক্ট আপডেট" : "Project Updates" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleTopic(t.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${topics.includes(t.id) ? "bg-amber-500/15 border-amber-500/30 text-amber-400" : "border-border"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {msg && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${msg.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
              {msg.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span>{msg.text}</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} {isBn ? "সংরক্ষণ করুন" : "Save preferences"}
            </Button>
            <Button variant="outline" onClick={handleUnsubscribe} disabled={saving} className="text-red-400 hover:text-red-400">
              {isBn ? "আনসাবস্ক্রাইব" : "Unsubscribe"}
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
