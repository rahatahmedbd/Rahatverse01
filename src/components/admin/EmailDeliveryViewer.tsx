"use client";

import { useCallback, useEffect, useState } from "react";
import { MailCheck, RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/sections/SectionTitle";

interface Delivery { id: string; recipient: string; category: string; status: string; error: string | null; created_at: string; }
const variants: Record<string, "info" | "success" | "warning" | "destructive" | "secondary"> = { sent: "info", delivered: "success", bounced: "warning", complained: "destructive", failed: "destructive" };

export function EmailDeliveryViewer({ locale = "bn" }: { locale?: string }) {
  const isBn = locale === "bn";
  const [rows, setRows] = useState<Delivery[]>([]); const [status, setStatus] = useState("all"); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  const load = useCallback(async () => { setLoading(true); setError(false); try { const query = status === "all" ? "" : `?status=${status}`; const res = await fetch(`/api/admin/email-deliveries${query}`, { cache: "no-store" }); if (!res.ok) throw new Error(); const json = await res.json(); setRows(json.data || []); } catch { setError(true); } finally { setLoading(false); } }, [status]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);
  return <section className="py-4"><SectionTitle badge="✉️" title="Email Delivery" titleBn="ইমেইল ডেলিভারি" locale={locale} />
    <GlassCard className="mb-4 p-4"><div className="flex flex-wrap gap-2">{["all", "sent", "delivered", "bounced", "complained", "failed"].map((item) => <Button key={item} size="sm" variant={status === item ? "default" : "outline"} onClick={() => setStatus(item)}>{item}</Button>)}<Button className="ml-auto" variant="ghost" size="icon-sm" onClick={load} aria-label="Refresh"><RefreshCw className="h-4 w-4" /></Button></div></GlassCard>
    <GlassCard className="overflow-x-auto">{loading ? <p className="p-8 text-center text-sm text-muted-foreground">Loading…</p> : error ? <p className="p-8 text-center text-sm text-red-400">{isBn ? "ইমেইল ডেলিভারি তথ্য লোড করা যায়নি" : "Unable to load email deliveries"}</p> : rows.length === 0 ? <p className="p-8 text-center text-sm text-muted-foreground">{isBn ? "এখনও কোনো ইমেইল রেকর্ড নেই" : "No email records yet"}</p> : <table className="w-full min-w-[650px] text-sm"><thead><tr className="border-b border-border/60 text-left text-xs text-muted-foreground"><th className="p-3">{isBn ? "সময়" : "Time"}</th><th className="p-3">{isBn ? "প্রাপক" : "Recipient"}</th><th className="p-3">{isBn ? "ধরন" : "Category"}</th><th className="p-3">Status</th><th className="p-3">{isBn ? "ত্রুটি" : "Error"}</th></tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-b border-border/30"><td className="whitespace-nowrap p-3 text-xs text-muted-foreground">{new Date(row.created_at).toLocaleString(isBn ? "bn-BD" : "en-US")}</td><td className="p-3">{row.recipient}</td><td className="p-3 font-mono text-xs">{row.category}</td><td className="p-3"><Badge variant={variants[row.status] || "secondary"}>{row.status}</Badge></td><td className="max-w-xs break-words p-3 text-xs text-red-400">{row.error || "—"}</td></tr>)}</tbody></table>}</GlassCard>
    <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><MailCheck className="h-4 w-4" />{isBn ? "Resend webhook delivery, bounce ও complaint status আপডেট করে।" : "Resend webhooks update delivery, bounce, and complaint statuses."}</p>
  </section>;
}
