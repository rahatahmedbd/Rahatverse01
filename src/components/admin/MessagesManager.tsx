"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { EmptyState } from "@/components/ui/empty-state";
import { Loader2, Mail, MailOpen, Phone, MessageSquare, ExternalLink } from "lucide-react";

interface MessagesManagerProps {
  locale?: string;
}

interface MessageRow {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  is_read?: boolean;
  created_at?: string;
}

function formatDate(value?: string, isBn = false) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString(isBn ? "bn-BD" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function MessagesManager({ locale = "bn" }: MessagesManagerProps) {
  const isBn = locale === "bn";
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filter === "unread" ? "/api/admin/messages?unread=true" : "/api/admin/messages";
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = (await response.json()) as { data?: MessageRow[] };
      setMessages(json.data ?? []);
    } catch {
      setError(isBn ? "বার্তা লোড করা যায়নি" : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [filter, isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const markRead = async (id: string, is_read: boolean) => {
    setActingId(id);
    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_read }),
      });
      await load();
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {isBn ? "বার্তা লোড হচ্ছে..." : "Loading messages..."}
      </div>
    );
  }

  return (
    <section className="space-y-6 py-4">
      <SectionTitle
        badge="📥"
        title="Centralized Messages Inbox"
        titleBn="কেন্দ্রীয় বার্তা ইনবক্স"
        subtitle={isBn ? "কন্টাক্ট ফর্ম জমা পড়া বার্তা পড়ুন, খুঁজুন ও সাড়া দিন" : "Read, search and respond to contact form submissions"}
        locale={locale}
      />

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">{error}</div>}

      <div className="flex flex-wrap gap-2">
        {[
          { key: "all", label: isBn ? "সব" : "All" },
          { key: "unread", label: isBn ? "অপঠিত" : "Unread" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === f.key
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title={isBn ? "কোনো বার্তা নেই" : "No messages"}
          description={isBn ? "কন্টাক্ট ফর্ম থেকে জমা পড়া বার্তা এখানে দেখা যাবে।" : "Messages from the contact form will appear here."}
        />
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <GlassCard key={message.id} className={`p-5 ${!message.is_read ? "border-primary/40" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {message.is_read ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary" />
                    )}
                    <span className="font-semibold">{message.name || "—"}</span>
                    <span className="text-xs text-muted-foreground">{message.email}</span>
                    {!message.is_read && (
                      <Badge variant="glow" className="text-[10px]">
                        {isBn ? "অপঠিত" : "Unread"}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium">{message.subject || ""}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{message.message}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span>{formatDate(message.created_at, isBn)}</span>
                    {message.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {message.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {message.email && (
                    <a
                      href={`mailto:${message.email}`}
                      className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs transition-all hover:border-primary/30 hover:text-primary"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {isBn ? "ইমেইল" : "Email"}
                    </a>
                  )}
                  {message.phone && (
                    <a
                      href={`https://wa.me/${message.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-xs transition-all hover:border-green-500/30 hover:text-green-400"
                    >
                      <MessageSquare className="h-3 w-3" />
                      {isBn ? "হোয়াটসঅ্যাপ" : "WhatsApp"}
                    </a>
                  )}
                  <Button size="sm" variant={message.is_read ? "outline" : "default"} disabled={actingId === message.id} onClick={() => markRead(message.id, !message.is_read)}>
                    {message.is_read ? (isBn ? "অপঠিত করুন" : "Mark Unread") : isBn ? "পড়েছেন" : "Mark Read"}
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </section>
  );
}
