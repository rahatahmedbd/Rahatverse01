"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import {
  Mail,
  Users,
  CheckCircle2,
  Clock,
  UserX,
  TrendingUp,
  Download,
  Search,
  Trash2,
  Send,
  Plus,
  BarChart3,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  is_confirmed: boolean;
  subscribed_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  source: string | null;
}

interface Campaign {
  id: string;
  subject: string;
  content: string;
  status: string;
  recipient_count: number;
  sent_count: number;
  created_at: string;
  sent_at: string | null;
}

export function NewsletterDashboard({ locale = "bn" }: { locale?: string }) {
  const isBn = locale === "bn";
  const [tab, setTab] = useState<"subscribers" | "campaigns">("subscribers");

  // subscribers
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<{ total: number; confirmed: number; pending: number; unsubscribed: number; last7Days: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campLoading, setCampLoading] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newContent, setNewContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const fetchSubs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20", status: statusFilter });
      if (search) params.set("search", search);
      const res = await fetch(`/api/newsletter?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      setSubs(j.data || []);
      setTotal(j.pagination?.total ?? 0);
      setStats(j.stats);
    } catch {
      setError(isBn ? "সাবস্ক্রাইবার লোড করা যায়নি" : "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, isBn]);

  const fetchCampaigns = useCallback(async () => {
    setCampLoading(true);
    try {
      const res = await fetch("/api/newsletter/campaigns", { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        setCampaigns(j.data || []);
      }
    } finally {
      setCampLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSubs();
  }, [fetchSubs]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (tab === "campaigns") fetchCampaigns();
  }, [tab, fetchCampaigns]);

  const handleDelete = async (id: string) => {
    if (!confirm(isBn ? "এই সাবস্ক্রাইবার মুছবেন?" : "Delete this subscriber?")) return;
    const res = await fetch(`/api/newsletter?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchSubs();
  };

  const handleExport = (fmt: string) => {
    window.open(`/api/newsletter/export?status=${statusFilter}&format=${fmt}`, "_blank");
  };

  const handleCreateCampaign = async () => {
    if (!newSubject.trim() || !newContent.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/newsletter/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: newSubject, content: newContent }),
      });
      if (res.ok) {
        setNewSubject("");
        setNewContent("");
        fetchCampaigns();
      }
    } finally {
      setCreating(false);
    }
  };

  const handleSendCampaign = async (id: string) => {
    if (!confirm(isBn ? "এই ক্যাম্পেইন সব কনফার্মড সাবস্ক্রাইবারের কাছে পাঠানো হবে। নিশ্চিত?" : "Send this campaign to all confirmed subscribers? Confirm.")) return;
    setSendingId(id);
    try {
      const res = await fetch("/api/newsletter/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "send" }),
      });
      const j = await res.json();
      if (res.ok) {
        alert(isBn ? `${j.sent} জনের কাছে পাঠানো হয়েছে` : `Sent to ${j.sent} subscribers`);
        fetchCampaigns();
      } else {
        alert(j.error || "Failed to send");
      }
    } finally {
      setSendingId(null);
    }
  };

  const statCards = [
    { icon: Users, label: isBn ? "মোট সাবস্ক্রাইবার" : "Total", value: stats?.total ?? "—", color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: CheckCircle2, label: isBn ? "কনফার্মড" : "Confirmed", value: stats?.confirmed ?? "—", color: "text-green-400", bg: "bg-green-500/10" },
    { icon: Clock, label: isBn ? "পেন্ডিং" : "Pending", value: stats?.pending ?? "—", color: "text-amber-400", bg: "bg-amber-500/10" },
    { icon: UserX, label: isBn ? "আনসাবস্ক্রাইবড" : "Unsubscribed", value: stats?.unsubscribed ?? "—", color: "text-red-400", bg: "bg-red-500/10" },
    { icon: TrendingUp, label: isBn ? "শেষ ৭ দিন" : "Last 7 days", value: stats?.last7Days ?? "—", color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <section className="py-8">
      <SectionTitle badge={isBn ? "📧 নিউজলেটার" : "📧 Newsletter"} title="Newsletter System" titleBn="নিউজলেটার সিস্টেম" locale={locale} />

      <FadeInUp>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setTab("subscribers")}
            className={`px-4 py-2 rounded-xl text-sm font-medium border ${tab === "subscribers" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/30"}`}
          >
            <Users className="inline h-4 w-4 mr-1" /> {isBn ? "সাবস্ক্রাইবার" : "Subscribers"}
          </button>
          <button
            onClick={() => setTab("campaigns")}
            className={`px-4 py-2 rounded-xl text-sm font-medium border ${tab === "campaigns" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/30"}`}
          >
            <Send className="inline h-4 w-4 mr-1" /> {isBn ? "ক্যাম্পেইন" : "Campaigns"}
          </button>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={() => (tab === "subscribers" ? fetchSubs() : fetchCampaigns())}>
              <RefreshCw className="h-4 w-4" /> {isBn ? "রিফ্রেশ" : "Refresh"}
            </Button>
            {tab === "subscribers" && (
              <>
                <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
                  <Download className="h-4 w-4" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport("json")}>
                  <BarChart3 className="h-4 w-4" /> JSON
                </Button>
              </>
            )}
          </div>
        </div>
      </FadeInUp>

      {tab === "subscribers" ? (
        <>
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
            {statCards.map((card) => (
              <StaggerItem key={card.label}>
                <GlassCard className="p-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  <p className="mt-3 text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground bn">{card.label}</p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <GlassCard className="p-4 mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={isBn ? "ইমেইল বা নাম খুঁজুন..." : "Search email or name..."} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" onKeyDown={(e) => e.key === "Enter" && (setPage(1), fetchSubs())} />
            </div>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
              <option value="all">{isBn ? "সব" : "All"}</option>
              <option value="confirmed">{isBn ? "কনফার্মড" : "Confirmed"}</option>
              <option value="pending">{isBn ? "পেন্ডিং" : "Pending"}</option>
              <option value="unsubscribed">{isBn ? "আনসাবস্ক্রাইবড" : "Unsubscribed"}</option>
            </select>
            <Button onClick={() => { setPage(1); fetchSubs(); }}>{isBn ? "খুঁজুন" : "Search"}</Button>
          </GlassCard>

          {loading ? (
            <GlassCard className="p-12 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">{isBn ? "লোড হচ্ছে..." : "Loading..."}</p>
            </GlassCard>
          ) : error ? (
            <GlassCard className="p-8 text-center border-red-500/20">
              <AlertCircle className="mx-auto h-6 w-6 text-red-400" />
              <p className="mt-2 text-sm text-red-400">{error}</p>
            </GlassCard>
          ) : subs.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Mail className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground bn">{isBn ? "কোনো সাবস্ক্রাইবার পাওয়া যায়নি" : "No subscribers found"}</p>
            </GlassCard>
          ) : (
            <GlassCard className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30 text-muted-foreground">
                    <tr>
                      <th className="text-left p-3 font-medium">{isBn ? "ইমেইল" : "Email"}</th>
                      <th className="text-left p-3 font-medium">{isBn ? "নাম" : "Name"}</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">{isBn ? "তারিখ" : "Date"}</th>
                      <th className="text-right p-3 font-medium">{isBn ? "অ্যাকশন" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subs.map((s) => (
                      <tr key={s.id} className="border-t border-border/50 hover:bg-muted/20">
                        <td className="p-3 font-mono text-xs">{s.email}</td>
                        <td className="p-3">{s.name || "—"}</td>
                        <td className="p-3">
                          {s.is_active && s.is_confirmed ? (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-500/15 text-green-400 px-2 py-1 rounded-full"><CheckCircle2 className="h-3 w-3" /> {isBn ? "সক্রিয়" : "Active"}</span>
                          ) : s.is_confirmed ? (
                            <span className="inline-flex items-center gap-1 text-xs bg-amber-500/15 text-amber-400 px-2 py-1 rounded-full"><Clock className="h-3 w-3" /> Pending</span>
                          ) : s.unsubscribed_at ? (
                            <span className="inline-flex items-center gap-1 text-xs bg-red-500/15 text-red-400 px-2 py-1 rounded-full"><UserX className="h-3 w-3" /> {isBn ? "আনসাবস্ক্রাইবড" : "Unsub"}</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs bg-amber-500/15 text-amber-400 px-2 py-1 rounded-full"><Clock className="h-3 w-3" /> {isBn ? "পেন্ডিং" : "Pending"}</span>
                          )}
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">{new Date(s.subscribed_at).toLocaleDateString()}</td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="h-7 px-2 text-red-400 hover:text-red-400">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between p-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">{total} {isBn ? "জন" : "total"} • {isBn ? "পৃষ্ঠা" : "Page"} {page}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>{isBn ? "আগে" : "Prev"}</Button>
                  <Button variant="outline" size="sm" disabled={subs.length < 20} onClick={() => setPage((p) => p + 1)}>{isBn ? "পরে" : "Next"}</Button>
                </div>
              </div>
            </GlassCard>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="font-bold flex items-center gap-2"><Plus className="h-4 w-4" /> {isBn ? "নতুন ক্যাম্পেইন" : "New Campaign"}</h3>
            <div className="mt-4 space-y-3">
              <Input placeholder={isBn ? "বিষয় (Subject)" : "Subject"} value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
              <textarea
                placeholder={isBn ? "কন্টেন্ট (HTML সমর্থিত)" : "Content (HTML supported)"}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-border bg-background p-3 text-sm"
              />
              <p className="text-xs text-muted-foreground bn">
                {isBn ? "ভেরিয়েবল: {{name}} স্বয়ংক্রিয়ভাবে প্রতিস্থাপিত হবে। HTML সমর্থিত।" : "Variables: {{name}} will be auto-replaced. HTML supported."}
              </p>
              <Button onClick={handleCreateCampaign} disabled={creating || !newSubject.trim() || !newContent.trim()}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {isBn ? "তৈরি করুন" : "Create campaign"}
              </Button>
            </div>
          </GlassCard>

          {campLoading ? (
            <GlassCard className="p-8 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin" /></GlassCard>
          ) : campaigns.length === 0 ? (
            <GlassCard className="p-8 text-center text-muted-foreground bn">{isBn ? "কোনো ক্যাম্পেইন নেই" : "No campaigns yet"}</GlassCard>
          ) : (
            <div className="grid gap-4">
              {campaigns.map((c) => (
                <GlassCard key={c.id} className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{c.subject}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{c.content.slice(0, 200)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${c.status === "sent" ? "bg-green-500/15 text-green-400" : c.status === "draft" ? "bg-muted text-muted-foreground" : "bg-amber-500/15 text-amber-400"}`}>{c.status}</span>
                        <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</span>
                        {c.sent_count > 0 && <span className="text-xs text-muted-foreground">• {c.sent_count} sent</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {c.status !== "sent" && (
                        <Button size="sm" onClick={() => handleSendCampaign(c.id)} disabled={sendingId === c.id} className="bg-green-600 hover:bg-green-700">
                          {sendingId === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          {isBn ? "পাঠান" : "Send"}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          if (!confirm("Delete?")) return;
                          await fetch(`/api/newsletter/campaigns?id=${c.id}`, { method: "DELETE" });
                          fetchCampaigns();
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
