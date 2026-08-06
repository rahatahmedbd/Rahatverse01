# Phase 26: Advanced Analytics - Completion Report

## Status: ✅ COMPLETED

## Overview
Delivered a full advanced analytics system combining Google Analytics 4 with a
first-party tracking pipeline stored in Supabase. The system tracks page views,
user interactions, Core Web Vitals and sessions, and visualises everything in a
new admin analytics dashboard with charts and CSV export.

## What Was Implemented

### 1. Google Analytics 4 (GA4) Integration
**Files:** `src/components/analytics/GoogleAnalytics.tsx`
- ✅ Loads gtag.js when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured
- ✅ IP anonymisation enabled
- ✅ SPA-safe: automatic page views disabled; one explicit `page_view` per
  client-side navigation (no double counting)
- ✅ All first-party events are mirrored to GA4 via `window.gtag`

### 2. First-Party Tracking Pipeline
**Files:** `src/lib/analytics/tracker.ts`, `src/lib/analytics/referrer.ts`,
`src/lib/analytics/device.ts`, `src/components/analytics/AnalyticsProvider.tsx`
- ✅ Page view tracking on every route change (path + query + referrer + screen width)
- ✅ Session management: per-tab session id with 30-minute inactivity timeout
- ✅ Interaction tracking:
  - Clicks (event delegation for `data-track` elements, links, buttons)
  - Scroll depth milestones (25 / 50 / 75 / 100 %, once per page)
  - Form submissions (conversion category)
- ✅ Engagement heartbeat (30 s) powering session duration + bounce rate
- ✅ Custom event tracking API: `trackEvent(name, { category, label, value, metadata })`
- ✅ Batched queue with periodic flush, flush on tab-hide/unload via
  `sendBeacon` / `fetch keepalive` — analytics can never break the UX
- ✅ Privacy: skips bots (`navigator.webdriver`) and Do-Not-Track visitors
- ✅ Referral source classification (google, facebook, direct, internal, …)
- ✅ Server-side device detection (mobile / tablet / desktop) from user agent
- ✅ Geographic detection via Vercel `x-vercel-ip-country` header (Cloudflare
  `cf-ipcountry` fallback)

### 3. Performance Monitoring (Core Web Vitals)
**Files:** `src/components/seo/web-vitals-reporter.tsx`
- ✅ Upgraded from console-logging to real reporting using `useReportWebVitals`
- ✅ LCP, INP, CLS, TTFB, FCP sent to the first-party pipeline and GA4
- ✅ Dashboard shows p75 + average per metric with good/warning/poor status

### 4. Custom Analytics API Endpoint
**Files:** `src/app/api/analytics/route.ts`, `src/app/api/analytics/export/route.ts`
- ✅ `POST /api/analytics` — public ingestion with strict validation:
  payload size cap (64 KB), batch caps (10 page views / 25 events),
  session id pattern, event name pattern, metadata size limits, timestamp
  sanity checks
- ✅ `GET /api/analytics?range=7|30|90` — admin-only aggregated statistics:
  totals, daily series, top pages, devices, countries, referral sources,
  top events, bounce rate, average session duration, Core Web Vitals (p75)
- ✅ `GET /api/analytics/export?dataset=page_views|events&range=` — admin-only
  CSV export (UTF-8 BOM for Excel/Bengali)

### 5. Supabase Schema (Migration 007)
**Files:** `supabase/migrations/007_create_analytics_tables.sql`
- ✅ `analytics_page_views` + `analytics_events` tables with indexes
- ✅ RLS: public insert (sanitised via API), admin-only select/delete using
  the existing `is_admin()` helper
- ✅ Non-destructive, idempotent migration following project conventions

### 6. Analytics Dashboard
**Files:** `src/components/analytics/AnalyticsDashboard.tsx`,
`src/components/analytics/charts.tsx`, `src/app/[locale]/dashboard/analytics/page.tsx`
- ✅ New admin route `/[locale]/dashboard/analytics` (guarded by dashboard layout)
- ✅ Stat cards: total page views, sessions (visitors), views today, bounce
  rate, average session duration, total events
- ✅ Dependency-free SVG/div charts: traffic trend (area + line), device
  donut, horizontal bar lists for pages/countries/referrers/events
- ✅ Range selector (7 / 30 / 90 days), refresh, CSV export buttons
- ✅ Core Web Vitals panel with p75 thresholds (green/amber/red)
- ✅ Bilingual (বাংলা / English), responsive, matches existing glass design
- ✅ Visitor statistics strip on the admin overview + analytics quick action
  (`DashboardOverview.tsx`)

## Verification

| Check | Result |
|-------|--------|
| `npm install` | ✅ Clean |
| `npm run lint` | ✅ 0 errors |
| `npm run type-check` | ✅ 0 errors |
| `npm run build` | ✅ Success — `/api/analytics`, `/api/analytics/export`, `/[locale]/dashboard/analytics` registered |
| POST `/api/analytics` (valid payload) | ✅ 200 `{ success: true }` |
| POST `/api/analytics` (invalid session / event name) | ✅ 400 rejected |
| GET `/api/analytics` unauthenticated | ✅ 401 (no Supabase in sandbox: 503) |
| Analytics dashboard unauthenticated | ✅ 307 redirect to login |
| Home page render with GA4 + tracker | ✅ 200 |

## Setup Required (Production)

1. **Supabase:** apply `supabase/migrations/007_create_analytics_tables.sql`
   (requires migration 006 for `is_admin()`).
2. **Google Analytics (optional):** set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in
   Vercel environment variables. First-party analytics work without it.

## Files Added
- `supabase/migrations/007_create_analytics_tables.sql`
- `src/lib/analytics/tracker.ts`
- `src/lib/analytics/referrer.ts`
- `src/lib/analytics/device.ts`
- `src/components/analytics/GoogleAnalytics.tsx`
- `src/components/analytics/AnalyticsProvider.tsx`
- `src/components/analytics/AnalyticsDashboard.tsx`
- `src/components/analytics/charts.tsx`
- `src/app/api/analytics/route.ts`
- `src/app/api/analytics/export/route.ts`
- `src/app/[locale]/dashboard/analytics/page.tsx`
- `PHASE_26_COMPLETION.md`

## Files Modified
- `src/app/[locale]/layout.tsx` — mount GA4 + AnalyticsProvider
- `src/components/seo/web-vitals-reporter.tsx` — real vitals reporting
- `src/components/sections/DashboardOverview.tsx` — visitor statistics strip + analytics quick action
- `src/types/database.ts` — analytics table types
- `.env.local.example` — `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `MASTER_PLAN.md` — analytics dashboard item checked off

## Notes for Future Phases
- `trackEvent()` is ready for conversion tracking in later phases
  (e.g. newsletter subscribe in Phase 27 can fire a `newsletter_subscribe` event).
- The analytics API is designed for extension (e.g. realtime widgets in Phase 28).
