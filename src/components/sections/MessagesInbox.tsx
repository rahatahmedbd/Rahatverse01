"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { MessageSquare, Mail, Calendar, Eye } from "lucide-react";

// ── Messages Inbox ─────────────────────────────────────
interface MessagesInboxProps {
  locale?: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function MessagesInbox({ locale = "bn" }: MessagesInboxProps) {
  const isBn = locale === "bn";
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        if (data.data) setMessages(data.data);
      })
      .catch(() => {});
  }, []);

  const subjectLabels: Record<string, Record<string, string>> = {
    web_dev: { bn: "ওয়েব ডেভেলপমেন্ট", en: "Web Development" },
    tutoring: { bn: "টিউশন", en: "Tutoring" },
    blood: { bn: "রক্তদান", en: "Blood Donation" },
    collaboration: { bn: "সহযোগিতা", en: "Collaboration" },
    general: { bn: "সাধারণ", en: "General" },
  };

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "💬 বার্তা" : "💬 Messages"}
          title="Message Inbox"
          titleBn="বার্তা ইনবক্স"
          locale={locale}
        />

        {messages.length === 0 ? (
          <FadeInUp>
            <GlassCard className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium bn">
                {isBn ? "এখনো কোনো বার্তা নেই" : "No messages yet"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground bn">
                {isBn ? "নতুন বার্তা আসলে এখানে দেখাবে" : "New messages will appear here"}
              </p>
            </GlassCard>
          </FadeInUp>
        ) : (
          <StaggerContainer className="space-y-3">
            {messages.map((msg) => (
              <StaggerItem key={msg.id}>
                <GlassCard
                  className="cursor-pointer transition-all hover:border-primary/30"
                  onClick={() => setSelectedMessage(msg)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${msg.is_read ? "bg-muted" : "bg-primary/10"}`}>
                        <MessageSquare className={`h-5 w-5 ${msg.is_read ? "text-muted-foreground" : "text-primary"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{msg.name}</p>
                          {!msg.is_read && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {subjectLabels[msg.subject]?.[locale] || msg.subject}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleDateString(isBn ? "bn-BD" : "en-US")}
                      </span>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedMessage(null)}>
            <GlassCard className="max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{selectedMessage.name}</h3>
                <Badge variant={selectedMessage.is_read ? "secondary" : "glow"}>
                  {selectedMessage.is_read ? (isBn ? "পঠিত" : "Read") : (isBn ? "নতুন" : "New")}
                </Badge>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4" />
                    <span>{selectedMessage.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(selectedMessage.created_at).toLocaleString(isBn ? "bn-BD" : "en-US")}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2">
                  {isBn ? "বিষয়" : "Subject"}: {subjectLabels[selectedMessage.subject]?.[locale] || selectedMessage.subject}
                </p>
                <p className="text-sm leading-relaxed">{selectedMessage.message}</p>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </section>
  );
}
