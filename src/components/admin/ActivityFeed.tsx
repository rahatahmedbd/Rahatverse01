"use client";

import { useEffect, useState, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ScrollText,
  ShoppingCart,
  MessageSquare,
  Mail,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ── Recent Activities Feed ─────────────────────────────
// Merged, reverse-chronological feed of admin actions + newest orders,
// messages and newsletter subscribers.

interface ActivityItem {
  id: string;
  type: "audit" | "order" | "message" | "subscriber";
  title: string;
  detail: string;
  createdAt: string;
}

interface ActivityFeedProps {
  locale?: string;
  limit?: number;
}

const typeIcons: Record<ActivityItem["type"], typeof ScrollText> = {
  audit: ScrollText,
  order: ShoppingCart,
  message: MessageSquare,
  subscriber: Mail,
};

const typeColors: Record<ActivityItem["type"], string> = {
  audit: "text-amber-400",
  order: "text-blue-400",
  message: "text-purple-400",
  subscriber: "text-green-400",
};

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function ActivityFeed({ locale = "bn", limit = 10 }: ActivityFeedProps) {
  const isBn = locale === "bn";
  const [items, setItems] = useState<ActivityItem[] | null>(null);
  const [error, setError] = useState(false);

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/activity", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setItems((json.data ?? []).slice(0, limit));
      setError(false);
    } catch {
      setError(true);
    }
  }, [limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchActivity();
  }, [fetchActivity]);

  if (error) {
    return (
      <GlassCard className="p-6 text-center text-sm text-muted-foreground">
        {isBn ? "অ্যাক্টিভিটি লোড করা যায়নি" : "Failed to load activities"}
      </GlassCard>
    );
  }

  if (!items) {
    return (
      <GlassCard className="space-y-3 p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </GlassCard>
    );
  }

  if (items.length === 0) {
    return (
      <GlassCard className="p-6 text-center text-sm text-muted-foreground bn">
        {isBn ? "এখনো কোনো অ্যাক্টিভিটি নেই" : "No activities yet"}
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-bold bn">{isBn ? "সাম্প্রতিক অ্যাক্টিভিটি" : "Recent Activities"}</h3>
        <Button variant="ghost" size="icon-sm" onClick={fetchActivity} aria-label="Refresh">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const Icon = typeIcons[item.type];
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card border border-border/50">
                <Icon className={`h-4 w-4 ${typeColors[item.type]}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(item.createdAt)}</span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
