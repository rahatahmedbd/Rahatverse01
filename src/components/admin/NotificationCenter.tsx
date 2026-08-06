"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Loader2,
  Plus,
  Trash2,
  CheckCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { SectionTitle } from "@/components/sections/SectionTitle";

// ── Notification Center ────────────────────────────────
// List, create, mark-as-read and delete in-app admin notifications.

interface NotificationRow {
  id: string;
  title: string;
  title_bn: string | null;
  message: string | null;
  message_bn: string | null;
  type: "info" | "success" | "warning" | "error";
  link: string | null;
  is_read: boolean;
  created_at: string;
}

interface NotificationCenterProps {
  locale?: string;
}

const typeIcons = { info: Info, success: CheckCircle2, warning: AlertTriangle, error: XCircle };
const typeColors = {
  info: "text-blue-400",
  success: "text-green-400",
  warning: "text-amber-400",
  error: "text-red-400",
};

export function NotificationCenter({ locale = "bn" }: NotificationCenterProps) {
  const isBn = locale === "bn";
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "success" | "warning" | "error">("info");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/notifications", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setNotifications(json.data || []);
      setUnread(json.unread ?? 0);
    } catch {
      setError(isBn ? "নোটিফিকেশন লোড করা যায়নি" : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllRead = async () => {
    await Promise.all(
      notifications.filter((n) => !n.is_read).map((n) =>
        fetch("/api/admin/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: n.id, is_read: true }),
        })
      )
    );
    fetchNotifications();
  };

  const createNotification = async () => {
    if (!title.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, title_bn: titleBn, message, type }),
      });
      if (res.ok) {
        setTitle("");
        setTitleBn("");
        setMessage("");
        fetchNotifications();
      }
    } finally {
      setCreating(false);
    }
  };

  const deleteNotification = async (id: string) => {
    const res = await fetch(`/api/admin/notifications?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchNotifications();
  };

  const markRead = async (notification: NotificationRow) => {
    if (notification.is_read) return;
    await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: notification.id, is_read: true }),
    });
    fetchNotifications();
  };

  return (
    <section className="py-4">
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle
          badge="🔔"
          title="Notification Center"
          titleBn="নোটিফিকেশন সেন্টার"
          locale={locale}
        />
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4" />
            {isBn ? "সব পড়া হয়েছে" : "Mark all read"}
          </Button>
        )}
      </div>

      {/* Create form */}
      <GlassCard className="mb-6 p-5">
        <h3 className="mb-3 font-bold bn">{isBn ? "নতুন নোটিফিকেশন" : "New Notification"}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            placeholder={isBn ? "টাইটেল" : "Title"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder={isBn ? "বাংলা টাইটেল (ঐচ্ছিক)" : "Bengali title (optional)"}
            value={titleBn}
            onChange={(e) => setTitleBn(e.target.value)}
          />
          <Textarea
            className="sm:col-span-2"
            rows={2}
            placeholder={isBn ? "বার্তা (ঐচ্ছিক)" : "Message (optional)"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {(["info", "success", "warning", "error"] as const).map((t) => (
            <Button key={t} size="sm" variant={type === t ? "default" : "outline"} onClick={() => setType(t)}>
              {t}
            </Button>
          ))}
          <Button className="ml-auto" size="sm" onClick={createNotification} disabled={creating || !title.trim()}>
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {isBn ? "তৈরি করুন" : "Create"}
          </Button>
        </div>
      </GlassCard>

      {error && (
        <GlassCard className="mb-4 p-4 text-center text-sm text-red-400">{error}</GlassCard>
      )}

      <div className="space-y-3">
        {loading ? (
          <GlassCard className="flex items-center justify-center gap-2 p-10 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </GlassCard>
        ) : notifications.length === 0 ? (
          <GlassCard className="p-10 text-center text-sm text-muted-foreground">
            <Bell className="mx-auto mb-2 h-8 w-8 opacity-40" />
            {isBn ? "কোনো নোটিফিকেশন নেই" : "No notifications"}
          </GlassCard>
        ) : (
          notifications.map((notification) => {
            const Icon = typeIcons[notification.type];
            const displayTitle = isBn && notification.title_bn ? notification.title_bn : notification.title;
            const displayMessage = isBn && notification.message_bn ? notification.message_bn : notification.message;
            return (
              <GlassCard
                key={notification.id}
                className={`cursor-pointer p-5 transition-opacity ${notification.is_read ? "opacity-60" : ""}`}
                onClick={() => markRead(notification)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${typeColors[notification.type]}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{displayTitle}</p>
                        {!notification.is_read && <span className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      {displayMessage && (
                        <p className="mt-1 text-sm text-muted-foreground">{displayMessage}</p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString(isBn ? "bn-BD" : "en-US")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </section>
  );
}
