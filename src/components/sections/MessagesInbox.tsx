"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { MessageSquare, Calendar, Mail, CheckCircle2 } from "lucide-react";

// ── Types ──────────────────────────────────────────────
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  dateBn: string;
  read: boolean;
  category?: "general" | "blood" | "project" | "collaboration";
}

interface MessagesInboxProps {
  locale?: string;
  messages?: ContactMessage[];
}

// ── Demo Fallback Data ─────────────────────────────────
const fallbackMessages: ContactMessage[] = [
  {
    id: "1",
    name: "Dr. Anisur Rahman",
    email: "anisur.rahman@example.com",
    subject: "Invitation for Science Fair Panel Discussion",
    message:
      "Hello Rahat, we saw your science fair project and would love to invite you as a guest speaker for our upcoming youth science summit.",
    date: "2 hours ago",
    dateBn: "২ ঘণ্টা আগে",
    read: false,
    category: "project",
  },
  {
    id: "2",
    name: "Shantichakra Blood Coordinator",
    email: "coordinator@blood.org",
    subject: "Emergency O+ Blood Request in Bogura",
    message:
      "We need an O+ blood donor at Bogura Medical College Hospital by tonight. Can your network assist?",
    date: "1 day ago",
    dateBn: "১ দিন আগে",
    read: false,
    category: "blood",
  },
  {
    id: "3",
    name: "Tanvir Ahmed",
    email: "tanvir.dev@example.com",
    subject: "Collaboration on Next.js Portfolio Project",
    message:
      "Hi Rahat! Great work on RahatVerse. I am working on an open-source educational platform and would like to collaborate with you.",
    date: "3 days ago",
    dateBn: "৩ দিন আগে",
    read: true,
    category: "collaboration",
  },
];

export function MessagesInbox({
  locale = "bn",
  messages = fallbackMessages,
}: MessagesInboxProps) {
  const isBn = locale === "bn";
  const [msgList, setMsgList] = useState<ContactMessage[]>(messages);

  const handleMarkAsRead = (id: string) => {
    setMsgList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m))
    );
  };

  const categoryLabels: Record<string, { en: string; bn: string }> = {
    general: { en: "General", bn: "সাধারণ" },
    blood: { en: "Blood Request", bn: "রক্তদান" },
    project: { en: "Project", bn: "প্রজেক্ট" },
    collaboration: { en: "Collaboration", bn: "সহযোগিতা" },
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        <SectionTitle
          badge={isBn ? "📬 বার্তা সমূহ" : "📬 Messages"}
          title="Contact Inbox"
          titleBn="বার্তা ইনবক্স"
          locale={locale}
        />

        {msgList.length === 0 ? (
          <FadeInUp>
            <EmptyState
              icon={MessageSquare}
              title={isBn ? "এখনো কোনো বার্তা নেই" : "No messages yet"}
              description={
                isBn
                  ? "নতুন বার্তা আসলে এখানে দেখাবে"
                  : "New contact messages will appear here when visitors get in touch."
              }
            />
          </FadeInUp>
        ) : (
          <StaggerContainer className="space-y-4">
            {msgList.map((msg) => (
              <StaggerItem key={msg.id}>
                <GlassCard
                  className={`relative p-6 transition-all ${
                    !msg.read ? "border-l-4 border-l-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {msg.name}
                        </span>
                        {!msg.read && (
                          <Badge variant="glow" className="text-[10px]">
                            {isBn ? "নতুন" : "New"}
                          </Badge>
                        )}
                        {msg.category && (
                          <Badge variant="outline" className="text-[10px]">
                            {isBn
                              ? categoryLabels[msg.category]?.bn || msg.category
                              : categoryLabels[msg.category]?.en || msg.category}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {msg.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {isBn ? msg.dateBn : msg.date}
                        </span>
                      </div>

                      <h4 className="mt-2 text-sm font-medium text-foreground">
                        {msg.subject}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground bn leading-relaxed">
                        {msg.message}
                      </p>
                    </div>

                    {!msg.read && (
                      <button
                        onClick={() => handleMarkAsRead(msg.id)}
                        className="flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {isBn ? "পড়া হয়েছে" : "Mark read"}
                      </button>
                    )}
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}
