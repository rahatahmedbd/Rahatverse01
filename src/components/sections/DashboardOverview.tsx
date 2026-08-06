"use client";

import { useState, useEffect, useCallback } from "react";
import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { SystemHealthPanel } from "@/components/admin/SystemHealthPanel";
import {
  ShoppingCart,
  MessageSquare,
  Droplets,
  Star,
  TrendingUp,
  Users,
  ArrowUpRight,
  Image as ImageIcon,
  BarChart3,
  Eye,
  Clock,
  Mail,
  CheckCircle2,
  Bell,
  LayoutDashboard,
  Settings2,
  RefreshCw,
  HeartPulse,
} from "lucide-react";
import Link from "next/link";

// ── Enhanced Dashboard Overview (Phase 28) ────────────
// Real-time statistics (30s polling), analytics overview widget, recent
// activities feed, quick actions, notification preview, health monitoring
// and dashboard customization (widget visibility toggles).

interface DashboardOverviewProps {
  locale?: string;
}

interface AnalyticsOverview {
  pageViews: number;
  sessions: number;
  bounceRate: number | null;
  avgSessionSeconds: number;
}

interface NewsletterOverview {
  total: number;
  confirmed: number;
  pending: number;
}

interface NotificationPreview {
  id: string;
  title: string;
  title_bn: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface HealthPreview {
  ok: boolean;
  database: { connected: boolean; latencyMs: number };
}

const WIDGETS = [
  { key: "stats", labelBn: "পরিসংখ্যান কার্ড", labelEn: "Stat cards" },
  { key: "analytics", labelBn: "অ্যানালিটিক্স", labelEn: "Analytics" },
  { key: "newsletter", labelBn: "নিউজলেটার", labelEn: "Newsletter" },
  { key: "activity", labelBn: "অ্যাক্টিভিটি ফিড", labelEn: "Activity feed" },
  { key: "health", labelBn: "সিস্টেম হেলথ", labelEn: "System health" },
  { key: "notifications", labelBn: "নোটিফিকেশন", labelEn: "Notifications" },
  { key: "quick", labelBn: "দ্রুত কাজ", labelEn: "Quick actions" },
] as const;

const DEFAULT_WIDGETS: Record<string, boolean> = {
  stats: true,
  analytics: true,
  newsletter: true,
  activity: true,
  health: false,
  notifications: true,
  quick: true,
};

export function DashboardOverview({ locale = "bn" }: DashboardOverviewProps) {
  const isBn = locale === "bn";
  const [stats, setStats] = useState({ orders: 0, messages: 0, bloodRequests: 0, testimonials: 0 });
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [newsletter, setNewsletter] = useState<NewsletterOverview | null>(null);
  const [notifications, setNotifications] = useState<NotificationPreview[]>([]);
  const [health, setHealth] = useState<HealthPreview | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [widgets, setWidgets] = useState<Record<string, boolean>>(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("rv_dashboard_widgets") : null;
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, boolean>;
        return { ...DEFAULT_WIDGETS, ...parsed };
      }
    } catch {
      // Ignore storage failures.
    }
    return DEFAULT_WIDGETS;
  });
  const [customizing, setCustomizing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadAll = useCallback(async () => {
    setRefreshing(true);
    try {
      const [orders, messages, blood, testimonials, analyticsSummary, newsletterSummary, notifRes, healthRes] =
        await Promise.all([
          fetch("/api/orders").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/messages").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/blood-requests").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/testimonials").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/analytics?range=30").then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch("/api/newsletter").then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch("/api/admin/notifications").then((r) => (r.ok ? r.json() : null)).catch(() => null),
          fetch("/api/admin/health").then((r) => (r.ok ? r.json() : null)).catch(() => null),
        ]);

      setStats({
        orders: orders?.data?.length || 0,
        messages: messages?.data?.length || 0,
        bloodRequests: blood?.data?.length || 0,
        testimonials: testimonials?.data?.length || 0,
      });

      if (analyticsSummary?.totals) {
        setAnalytics({
          pageViews: analyticsSummary.totals.pageViews ?? 0,
          sessions: analyticsSummary.totals.sessions ?? 0,
          bounceRate: analyticsSummary.totals.bounceRate ?? null,
          avgSessionSeconds: analyticsSummary.totals.avgSessionSeconds ?? 0,
        });
      }

      if (newsletterSummary?.stats) {
        setNewsletter({
          total: newsletterSummary.stats.total ?? 0,
          confirmed: newsletterSummary.stats.confirmed ?? 0,
          pending: newsletterSummary.stats.pending ?? 0,
        });
      }

      setNotifications((notifRes?.data ?? []).slice(0, 5));
      setHealth(healthRes ? { ok: healthRes.ok, database: healthRes.database } : null);
      setLastRefresh(new Date());
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();

    // Real-time statistics: poll every 30 seconds.
    const interval = window.setInterval(() => {
      loadAll();
    }, 30_000);

    return () => window.clearInterval(interval);
  }, [loadAll]);

  // Dashboard customization — widget visibility, persisted in localStorage.
  const toggleWidget = (key: string) => {
    setWidgets((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem("rv_dashboard_widgets", JSON.stringify(next));
      } catch {
        // Ignore storage failures.
      }
      return next;
    });
  };

  const visible = (key: string) => widgets[key] !== false;

  const statCards = [
    {
      icon: ShoppingCart,
      label: isBn ? "মোট অর্ডার" : "Total Orders",
      value: stats.orders,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      link: `/${locale}/dashboard/orders`,
    },
    {
      icon: MessageSquare,
      label: isBn ? "বার্তা" : "Messages",
      value: stats.messages,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      link: `/${locale}/dashboard/messages`,
    },
    {
      icon: Droplets,
      label: isBn ? "রক্তের অনুরোধ" : "Blood Requests",
      value: stats.bloodRequests,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      link: "#",
    },
    {
      icon: Star,
      label: isBn ? "মতামত" : "Testimonials",
      value: stats.testimonials,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      link: "#",
    },
  ];

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <SectionTitle
            badge={isBn ? "🎮 কমান্ড সেন্টার" : "🎮 Command Center"}
            title="Admin Dashboard"
            titleBn="অ্যাডমিন ড্যাশবোর্ড"
            locale={locale}
          />
          <div className="flex items-center gap-2">
            {lastRefresh && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {isBn ? "শেষ আপডেট" : "Updated"}: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={loadAll}
              className="flex h-9 items-center gap-2 rounded-lg border border-border/60 px-3 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {isBn ? "রিফ্রেশ" : "Refresh"}
            </button>
            <button
              onClick={() => setCustomizing((c) => !c)}
              className="flex h-9 items-center gap-2 rounded-lg border border-border/60 px-3 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Settings2 className="h-4 w-4" />
              {isBn ? "কাস্টমাইজ" : "Customize"}
            </button>
          </div>
        </div>

        {/* Dashboard customization panel */}
        {customizing && (
          <FadeInUp>
            <GlassCard className="mb-6 p-5">
              <h3 className="mb-3 flex items-center gap-2 font-bold bn">
                <LayoutDashboard className="h-4 w-4 text-primary" />
                {isBn ? "উইজেট কাস্টমাইজেশন" : "Widget Customization"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {WIDGETS.map((widget) => (
                  <button
                    key={widget.key}
                    onClick={() => toggleWidget(widget.key)}
                    className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                      visible(widget.key)
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground opacity-60"
                    }`}
                  >
                    <span className="bn">{isBn ? widget.labelBn : widget.labelEn}</span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </FadeInUp>
        )}

        {/* System health strip */}
        {health && (
          <FadeInUp delay={0.04}>
            <Link href={`/${locale}/dashboard/health`} className="mb-4 block">
              <GlassCard className="group flex items-center justify-between gap-4 p-4 transition-all hover:border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                    <HeartPulse className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold bn">
                      {isBn ? "সিস্টেম হেলথ" : "System Health"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {health.database.connected
                        ? isBn
                          ? `ডেটাবেস সচল · ${health.database.latencyMs}ms`
                          : `Database connected · ${health.database.latencyMs}ms`
                        : isBn
                          ? "ডেটাবেস সংযোগ সমস্যা"
                          : "Database connection issue"}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </GlassCard>
            </Link>
          </FadeInUp>
        )}

        {/* Notification preview strip */}
        {visible("notifications") && notifications.length > 0 && (
          <FadeInUp delay={0.05}>
            <Link href={`/${locale}/dashboard/notifications`} className="mb-4 block">
              <GlassCard className="group flex items-center justify-between gap-4 p-4 transition-all hover:border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <Bell className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold bn">
                      {isBn ? "নতুন নোটিফিকেশন" : "Notifications"}
                      {notifications.filter((n) => !n.is_read).length > 0 && (
                        <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
                          {notifications.filter((n) => !n.is_read).length}
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {isBn && notifications[0]?.title_bn
                        ? notifications[0].title_bn
                        : notifications[0]?.title}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </GlassCard>
            </Link>
          </FadeInUp>
        )}

        {/* Stats Grid */}
        {visible("stats") && (
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => (
              <StaggerItem key={card.label}>
                <Link href={card.link}>
                  <GlassCard className="group cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bgColor}`}>
                        <card.icon className={`h-6 w-6 ${card.color}`} />
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <div className="mt-4">
                      <p className="text-3xl font-bold">{card.value}</p>
                      <p className="mt-1 text-sm text-muted-foreground bn">{card.label}</p>
                    </div>
                  </GlassCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {/* Analytics overview widget */}
        {visible("analytics") && analytics && (
          <FadeInUp delay={0.15}>
            <Link href={`/${locale}/dashboard/analytics`} className="mt-6 block">
              <GlassCard className="group flex flex-col gap-4 p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                    <BarChart3 className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-bold bn">{isBn ? "ভিজিটর পরিসংখ্যান (৩০ দিন)" : "Visitor Statistics (30 days)"}</p>
                    <p className="text-xs text-muted-foreground bn">
                      {isBn ? "বিস্তারিত অ্যানালিটিক্স দেখতে ক্লিক করুন" : "Click to open the full analytics dashboard"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:flex sm:items-center sm:gap-6">
                  <span className="flex items-center gap-2 text-sm">
                    <Eye className="h-4 w-4 text-amber-400" />
                    <span className="font-bold">{analytics.pageViews.toLocaleString()}</span>
                    <span className="text-muted-foreground bn">{isBn ? "ভিউ" : "views"}</span>
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="font-bold">{analytics.sessions.toLocaleString()}</span>
                    <span className="text-muted-foreground bn">{isBn ? "সেশন" : "sessions"}</span>
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-red-400" />
                    <span className="font-bold">
                      {analytics.bounceRate !== null ? `${(analytics.bounceRate * 100).toFixed(1)}%` : "—"}
                    </span>
                    <span className="text-muted-foreground bn">{isBn ? "বাউন্স" : "bounce"}</span>
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-purple-400" />
                    <span className="font-bold">
                      {analytics.avgSessionSeconds > 0
                        ? `${Math.floor(analytics.avgSessionSeconds / 60)}m ${analytics.avgSessionSeconds % 60}s`
                        : "0s"}
                    </span>
                    <span className="text-muted-foreground bn">{isBn ? "গড় সময়" : "avg. time"}</span>
                  </span>
                  <ArrowUpRight className="hidden h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:block" />
                </div>
              </GlassCard>
            </Link>
          </FadeInUp>
        )}

        {/* Newsletter statistics widget */}
        {visible("newsletter") && newsletter && (
          <FadeInUp delay={0.16}>
            <Link href={`/${locale}/dashboard/newsletter`} className="mt-4 block">
              <GlassCard className="group flex flex-col gap-4 p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                    <Mail className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold bn">{isBn ? "নিউজলেটার পরিসংখ্যান" : "Newsletter Statistics"}</p>
                    <p className="text-xs text-muted-foreground bn">
                      {isBn ? "সাবস্ক্রাইবার ম্যানেজ করতে ক্লিক করুন" : "Click to manage subscribers"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="font-bold">{newsletter.total.toLocaleString()}</span>
                    <span className="text-muted-foreground bn">{isBn ? "মোট" : "total"}</span>
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="font-bold">{newsletter.confirmed.toLocaleString()}</span>
                    <span className="text-muted-foreground bn">{isBn ? "কনফার্মড" : "confirmed"}</span>
                  </span>
                  <span className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <span className="font-bold">{newsletter.pending.toLocaleString()}</span>
                    <span className="text-muted-foreground bn">{isBn ? "পেন্ডিং" : "pending"}</span>
                  </span>
                  <ArrowUpRight className="hidden h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:block" />
                </div>
              </GlassCard>
            </Link>
          </FadeInUp>
        )}

        {/* Activity feed + health */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {visible("activity") && (
            <FadeInUp delay={0.2} className="lg:col-span-2">
              <ActivityFeed locale={locale} limit={10} />
            </FadeInUp>
          )}
          {visible("health") && (
            <FadeInUp delay={0.25}>
              <SystemHealthPanel locale={locale} compact />
            </FadeInUp>
          )}
        </div>

        {/* Quick actions */}
        {visible("quick") && (
          <FadeInUp delay={0.3}>
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-bold bn">{isBn ? "দ্রুত কাজ" : "Quick Actions"}</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Link href={`/${locale}/dashboard/orders`}>
                  <GlassCard className="flex items-center gap-3 transition-all hover:border-primary/30">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-medium bn">{isBn ? "অর্ডার ম্যানেজ" : "Manage Orders"}</span>
                  </GlassCard>
                </Link>
                <Link href={`/${locale}/dashboard/blog`}>
                  <GlassCard className="flex items-center gap-3 transition-all hover:border-primary/30">
                    <ImageIcon className="h-5 w-5 text-purple-400" />
                    <span className="font-medium bn">{isBn ? "নতুন ব্লগ পোস্ট" : "New Blog Post"}</span>
                  </GlassCard>
                </Link>
                <Link href={`/${locale}/dashboard/comments`}>
                  <GlassCard className="flex items-center gap-3 transition-all hover:border-primary/30">
                    <MessageSquare className="h-5 w-5 text-blue-400" />
                    <span className="font-medium bn">{isBn ? "কমেন্ট মডারেশন" : "Comment Moderation"}</span>
                  </GlassCard>
                </Link>
                <Link href={`/${locale}/dashboard/users`}>
                  <GlassCard className="flex items-center gap-3 transition-all hover:border-primary/30">
                    <Users className="h-5 w-5 text-green-400" />
                    <span className="font-medium bn">{isBn ? "ইউজার ম্যানেজ" : "User Management"}</span>
                  </GlassCard>
                </Link>
                <Link href={`/${locale}/dashboard/newsletter`}>
                  <GlassCard className="flex items-center gap-3 transition-all hover:border-primary/30">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <span className="font-medium bn">{isBn ? "নিউজলেটার" : "Newsletter"}</span>
                  </GlassCard>
                </Link>
                <Link href={`/${locale}/dashboard/export`}>
                  <GlassCard className="flex items-center gap-3 transition-all hover:border-primary/30">
                    <BarChart3 className="h-5 w-5 text-amber-400" />
                    <span className="font-medium bn">{isBn ? "ডেটা এক্সপোর্ট" : "Export Data"}</span>
                  </GlassCard>
                </Link>
              </div>
            </div>
          </FadeInUp>
        )}
      </div>
    </section>
  );
}
