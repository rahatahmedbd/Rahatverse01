# Phase 32 — “লাইভ কোট” Live Price Estimator & Package Compare

## Status

**Implementation complete and ready for review.**

**Merge, Vercel production deployment, and live-site verification are pending
explicit owner permission.**

## Delivered

### Live estimate

- Admin-controlled package base prices, included-page allowances, per-page
  charges, feature add-on prices, and estimate range margin.
- Pure quote engine in `src/lib/orders/quote.ts`.
- Bilingual BDT/USD estimate card with an itemized breakdown, custom-quote state,
  range output, accessible live updates, and a non-binding disclaimer.
- Price-aware package and feature selections throughout the order wizard.

### Package comparison

- Selectable package columns with a safe minimum of two.
- Differences-only filtering.
- Mobile horizontal scrolling and sticky feature labels.
- Per-package CTAs that correctly preselect the mapped order package and scroll
  to checkout.

### Admin and migration

- Quote controls and feature prices in Order Settings.
- Order mapping, included pages/features, and featured package mapping in Service
  Settings; features already included in a tier are never charged twice.
- Backward-compatible config hydration for legacy production JSON.
- Additive/idempotent migration `supabase/migrations/026_live_quote_pricing.sql`.

### Defects fixed

- Restored clickable Next buttons so inline validation is reachable.
- Replaced hard-coded order API enums with visible admin-config validation.
- Rejected hidden/stale/forged package values while safely normalizing the UI.
- Removed public `৳X` placeholders.
- Removed pricing's indefinite loading risk with immediate defaults and an abort
  timeout.
- Removed Vitest ESM and asynchronous React test warnings.
- Corrected the premature public order-tracking claim in the user guide.

## Tests

- `tests/unit/live-quote.test.ts`: quote arithmetic, ranges, page allowances,
  custom quotes, hidden/duplicate add-ons, formatting.
- Expanded order/services config tests: legacy hydration and invalid mappings.
- `tests/integration/orders.route.test.ts`: default/custom configured options and
  hidden/unknown rejection.
- Expanded Playwright smoke flows: order route, inline validation, quote updates,
  package filtering, and differences mode on desktop/mobile.

## Validation

| Gate | Result |
|---|---|
| `npm install` | ✅ 0 vulnerabilities |
| `npm run lint` | ✅ Passed |
| `npm run type-check` | ✅ Passed |
| `npm test` | ✅ 241 tests, 35 files, no warnings |
| `npm run build` | ✅ Passed |
| Runtime HTTP checks | ✅ `/en/order`, `/bn/order`, `/en/services`, `/bn/services`, both config APIs return 200 |
| Playwright spec compilation | ✅ 26 desktop/mobile tests listed |
| Playwright browser execution | ⚠️ Sandbox Chromium absent; CDN install failed with external TLS `ECONNRESET` |

## Deployment checklist (blocked intentionally)

1. Review and approve the Pull Request.
2. Apply migration 026 to Supabase.
3. Merge only after owner permission.
4. Wait for Vercel production deployment.
5. Verify English/Bangla order, services, order-settings, and service-settings
   routes on production.
6. Run Playwright where Chromium is installed.
7. Begin Phase 33 only after the production gate is confirmed.
