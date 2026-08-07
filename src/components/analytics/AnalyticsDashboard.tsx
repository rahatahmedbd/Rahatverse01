"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { BarList, DonutChart, TrendChart } from "@/components/analytics/charts";
import {
  Activity,
  Clock,
  Download,
  Eye,
  Gauge,
  Globe2,
  MousePointerClick,
  RefreshCw,
  Smartphone,
  TrendingUp,
  Users,
} from "lucide-react";

// ── Analytics Dashboard ────────────────────────────────
// Admin-only visualisation of first-party analytics collected via
// /api/analytics: traffic trends, sessions, bounce rate, session duration,
// devices, geography, referral sources, custom events and Core Web Vitals.

interface AnalyticsSummary {
  range: { days: number; from: string; to: string };
  totals: {
    pageViews: number;
    sessions: number;
    events: number;
    viewsToday: number;
    bounceRate: number | null;
    avgSessionSeconds: number;
  };
  series: Array<{ date: string; pageViews: number; sessions: number }>;
  topPages: Array<{ path: string; views: number }>;
  devices: Array<{ deviceType: string; views: number }>;
  countries: Array<{ country: string; views: number }>;
  referrers: Array<{ source: string; views: number }>;
  topEvents: Array<{ name: string; count: number }>;
  vitals: Array<{ metric: string; count: number; p75: number | null; average: number | null }>;
}

const RANGES = [7, 30, 90] as const;

const DEVICE_LABELS: Record<string, string> = {
  mobile: "Mobile",
  desktop: "Desktop",
  tablet: "Tablet",
  unknown: "Unknown",
};

const DEVICE_COLORS: Record<string, string> = {
  mobile: "#38bdf8",
  desktop: "#f59e0b",
  tablet: "#a78bfa",
  unknown: "#94a3b8",
};

const COUNTRY_NAMES: Record<string, string> = {
  BD: "Bangladesh",
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  SE: "Sweden",
  AE: "UAE",
  SA: "Saudi Arabia",
  QA: "Qatar",
  OM: "Oman",
  KW: "Kuwait",
  MY: "Malaysia",
  SG: "Singapore",
  ID: "Indonesia",
  TH: "Thailand",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  PK: "Pakistan",
  LK: "Sri Lanka",
  NP: "Nepal",
  BR: "Brazil",
  MX: "Mexico",
  RU: "Russia",
  TR: "Turkey",
  EG: "Egypt",
  ZA: "South Africa",
  NG: "Nigeria",
};

const VITAL_THRESHOLDS: Record<string, { good: number; poor: number; unit: string }> = {
  LCP: { good: 2500, poor: 4000, unit: "ms" },
  INP: { good: 200, poor: 500, unit: "ms" },
  FID: { good: 100, poor: 300, unit: "ms" },
  CLS: { good: 0.1, poor: 0.25, unit: "" },
  TTFB: { good: 800, poor: 1800, unit: "ms" },
  FCP: { good: 1800, poor: 3000, unit: "ms" },
};

function formatDuration(totalSeconds: number, isBn: boolean): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return isBn ? "০সে" : "0s";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function formatVitalValue(metric: string, value: number): string {
  const unit = VITAL_THRESHOLDS[metric]?.unit ?? "";
  return metric === "CLS" ? value.toFixed(3) : `${Math.round(value)}${unit}`;
}

function vitalStatus(
  metric: string,
  p75: number | null,
  overrides?: Partial<DashboardFlags>
): "good" | "warning" | "poor" | "none" {
  if (p75 === null) return "none";
  const thresholds = VITAL_THRESHOLDS[metric];
  if (!thresholds) return "none";
  // Apply admin-configured good thresholds for LCP / INP / CLS.
  const good =
    metric === "LCP" && overrides?.lcpTargetMs
      ? overrides.lcpTargetMs
      : metric === "INP" && overrides?.inpTargetMs
        ? overrides.inpTargetMs
        : metric === "CLS" && overrides?.clsTarget
          ? overrides.clsTarget
          : thresholds.good;
  if (p75 <= good) return "good";
  if (p75 <= thresholds.poor) return "warning";
  return "poor";
}

interface AnalyticsDashboardProps {
  locale?: string;
}

interface DashboardFlags {
  showDevices: boolean;
  showGeo: boolean;
  showVitals: boolean;
  lcpTargetMs: number;
  inpTargetMs: number;
  clsTarget: number;
}

const DEFAULT_FLAGS: DashboardFlags = {
  showDevices: true,
  showGeo: true,
  showVitals: true,
  lcpTargetMs: 2500,
  inpTargetMs: 200,
  clsTarget: 0.1,
};

export function AnalyticsDashboard({ locale = "bn" }: AnalyticsDashboardProps) {
  const isBn = locale === "bn";
  const [range, setRange] = useState<number>(30);
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [flags, setFlags] = useState<DashboardFlags>(DEFAULT_FLAGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load admin-controlled analytics settings (panel toggles + vitals thresholds).
  useEffect(() => {
    let cancelled = false;
    fetch("/api/analytics-config", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((json) => {
        if (cancelled) return;
        const settings = (json as { data?: { settings?: DashboardFlags } } | null)?.data?.settings;
        if (settings) {
          setFlags({
            showDevices: settings.showDevices ?? true,
            showGeo: settings.showGeo ?? true,
            showVitals: settings.showVitals ?? true,
            lcpTargetMs: settings.lcpTargetMs ?? 2500,
            inpTargetMs: settings.inpTargetMs ?? 200,
            clsTarget: settings.clsTarget ?? 0.1,
          });
        }
      })
      .catch(() => {
        /* fall back to defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/analytics?range=${range}`, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const json = (await response.json()) as AnalyticsSummary;
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError(isBn ? "অ্যানালিটিক্স ডেটা লোড করা যায়নি" : "Failed to load analytics data");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [range, refreshKey, isBn]);

  const selectRange = (days: number) => {
    if (days === range) return;
    setRange(days);
    setLoading(true);
  };

  const refresh = () => {
    setRefreshKey((key) => key + 1);
    setLoading(true);
  };

  const totals = data?.totals;

  const statCards = [
    {
      icon: Eye,
      label: isBn ? "মোট পেজ ভিউ" : "Total Page Views",
      value: totals ? totals.pageViews.toLocaleString() : "—",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      icon: Users,
      label: isBn ? "সেশন (ভিজিটর)" : "Sessions (Visitors)",
      value: totals ? totals.sessions.toLocaleString() : "—",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Activity,
      label: isBn ? "আজকের ভিউ" : "Views Today",
      value: totals ? totals.viewsToday.toLocaleString() : "—",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: TrendingUp,
      label: isBn ? "বাউন্স রেট" : "Bounce Rate",
      value:
        totals && totals.bounceRate !== null ? `${(totals.bounceRate * 100).toFixed(1)}%` : "—",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      icon: Clock,
      label: isBn ? "গড় সেশন সময়" : "Avg. Session Duration",
      value: totals ? formatDuration(totals.avgSessionSeconds, isBn) : "—",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: MousePointerClick,
      label: isBn ? "মোট ইভেন্ট" : "Total Events",
      value: totals ? totals.events.toLocaleString() : "—",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
  ];

  return (
    <section className="py-8">
      <SectionTitle
        badge={isBn ? "📊 অ্যানালিটিক্স" : "📊 Analytics"}
        title="Advanced Analytics"
        titleBn="অ্যাডভান্সড অ্যানালিটিক্স"
        locale={locale}
      />

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl border border-border bg-card/50 p-1">
          {RANGES.map((days) => (
            <button
              key={days}
              onClick={() => selectRange(days)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                range === days
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {days} {isBn ? "দিন" : "days"}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-card disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {isBn ? "রিফ্রেশ" : "Refresh"}
          </button>
          <a
            href={`/api/analytics/export?dataset=page_views&range=${range}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-card"
          >
            <Download className="h-4 w-4" />
            {isBn ? "পেজ ভিউ CSV" : "Page Views CSV"}
          </a>
          <a
            href={`/api/analytics/export?dataset=events&range=${range}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-card"
          >
            <Download className="h-4 w-4" />
            {isBn ? "ইভেন্ট CSV" : "Events CSV"}
          </a>
        </div>
      </div>

      {error && (
        <GlassCard className="mb-6 border-red-500/30 p-4 text-center text-sm text-red-400 bn">
          {error}
        </GlassCard>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <GlassCard key={index} className="h-28 animate-pulse bg-muted/30" />
          ))}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {statCards.map((card) => (
              <GlassCard key={card.label} className="p-4">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="mt-1 text-xs text-muted-foreground bn">{card.label}</p>
              </GlassCard>
            ))}
          </div>

          {totals && totals.pageViews === 0 && (
            <GlassCard className="mt-6 p-6 text-center text-sm text-muted-foreground bn">
              {isBn
                ? "নির্বাচিত সময়ে কোনো ভিজিটর ডেটা নেই। ভিজিটররা সাইট ব্রাউজ করলে ডেটা এখানে দেখা যাবে (Supabase analytics মাইগ্রেশন প্রয়োগ করা থাকতে হবে)।"
                : "No visitor data in the selected range. Data will appear here once visitors browse the site (ensure the Supabase analytics migration has been applied)."}
            </GlassCard>
          )}

          {/* Traffic trend */}
          <GlassCard className="mt-6 p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold bn">{isBn ? "ট্রাফিক ট্রেন্ড" : "Traffic Trend"}</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  {isBn ? "পেজ ভিউ" : "Page views"}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-sky-400" />
                  {isBn ? "সেশন" : "Sessions"}
                </span>
              </div>
            </div>
            {data && data.series.length > 0 ? (
              <TrendChart data={data.series} />
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground bn">
                {isBn ? "কোনো ডেটা নেই" : "No data available"}
              </p>
            )}
          </GlassCard>

          {/* Breakdowns */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <GlassCard className="p-5">
              <h3 className="mb-4 text-lg font-bold bn">{isBn ? "জনপ্রিয় পেজ" : "Top Pages"}</h3>
              <BarList
                items={(data?.topPages ?? []).map((page) => ({ label: page.path, value: page.views }))}
                emptyLabel={isBn ? "কোনো পেজ ভিউ নেই" : "No page views yet"}
              />
            </GlassCard>

            {flags.showDevices && (
              <GlassCard className="p-5">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold bn">
                  <Smartphone className="h-5 w-5 text-sky-400" />
                  {isBn ? "ডিভাইস ব্রেকডাউন" : "Device Breakdown"}
                </h3>
                <DonutChart
                  centerLabel={isBn ? "ভিউ" : "views"}
                  segments={(data?.devices ?? []).map((device) => ({
                    label: DEVICE_LABELS[device.deviceType] ?? device.deviceType,
                    value: device.views,
                    color: DEVICE_COLORS[device.deviceType] ?? "#94a3b8",
                  }))}
                />
              </GlassCard>
            )}

            {flags.showGeo && (
              <GlassCard className="p-5">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold bn">
                  <Globe2 className="h-5 w-5 text-green-400" />
                  {isBn ? "ভৌগোলিক অবস্থান" : "Geographic Visitors"}
                </h3>
                <BarList
                  items={(data?.countries ?? []).map((entry) => ({
                    label:
                      entry.country === "unknown"
                        ? isBn
                          ? "অজানা"
                          : "Unknown"
                        : COUNTRY_NAMES[entry.country] ?? entry.country,
                    value: entry.views,
                    hint: entry.country,
                  }))}
                  emptyLabel={isBn ? "কোনো ভৌগোলিক ডেটা নেই" : "No geographic data yet"}
                />
              </GlassCard>
            )}

            <GlassCard className="p-5">
              <h3 className="mb-4 text-lg font-bold bn">{isBn ? "ট্রাফিক সোর্স" : "Referral Sources"}</h3>
              <BarList
                items={(data?.referrers ?? []).map((entry) => ({
                  label: entry.source === "direct" ? (isBn ? "সরাসরি" : "Direct") : entry.source,
                  value: entry.views,
                }))}
                emptyLabel={isBn ? "কোনো রেফারেল ডেটা নেই" : "No referral data yet"}
              />
            </GlassCard>

            <GlassCard className="p-5">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold bn">
                <MousePointerClick className="h-5 w-5 text-cyan-400" />
                {isBn ? "শীর্ষ ইভেন্ট" : "Top Events"}
              </h3>
              <BarList
                items={(data?.topEvents ?? []).map((event) => ({
                  label: event.name,
                  value: event.count,
                }))}
                emptyLabel={isBn ? "কোনো ইভেন্ট ট্র্যাক হয়নি" : "No events tracked yet"}
              />
            </GlassCard>

            {flags.showVitals && (
              <GlassCard className="p-5">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold bn">
                  <Gauge className="h-5 w-5 text-purple-400" />
                  {isBn ? "কোর ওয়েব ভাইটালস" : "Core Web Vitals"}
                </h3>
              {data && data.vitals.length > 0 ? (
                <ul className="space-y-3">
                  {data.vitals.map((vital) => {
                    const status = vitalStatus(vital.metric, vital.p75, flags);
                    const statusColor =
                      status === "good"
                        ? "bg-green-500/15 text-green-400"
                        : status === "warning"
                          ? "bg-amber-500/15 text-amber-400"
                          : status === "poor"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-muted text-muted-foreground";
                    return (
                      <li key={vital.metric} className="flex items-center justify-between gap-3">
                        <span className="font-mono text-sm font-semibold">{vital.metric}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusColor}`}>
                          {vital.p75 !== null ? `p75 ${formatVitalValue(vital.metric, vital.p75)}` : "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {isBn ? "গড়" : "avg"}{" "}
                          {vital.average !== null ? formatVitalValue(vital.metric, vital.average) : "—"} ·{" "}
                          {vital.count} {isBn ? "নমুনা" : "samples"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground bn">
                  {isBn ? "এখনো ভাইটালস ডেটা নেই" : "No vitals data yet"}
                </p>
              )}
              </GlassCard>
            )}
          </div>
        </>
      )}
    </section>
  );
}
