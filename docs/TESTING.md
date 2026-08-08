# 🧪 Testing Guide

RahatVerse uses **Vitest** for unit and integration tests and **Playwright** for
end-to-end browser tests. This document explains how to run and extend them.

## Prerequisites

```bash
npm install
# One-time, for E2E only:
npx playwright install chromium
```

## Running Tests

```bash
# Unit + integration tests (fast, no network/browser)
npm test

# Watch mode
npm run test:watch

# With coverage report (prints table + writes to /coverage)
npm run test:coverage

# End-to-end tests (starts a production server automatically)
npm run e2e
```

## What Is Covered

### Unit tests (`tests/unit`)
Pure logic and utilities that require no external services:

- `utils.ts` — `cn`, date formatting, `clamp`, `generateId`, `sleep`, `isDefined`.
- `lib/api/validation.ts` — email/phone/text/enum/integer validators.
- `lib/analytics/device.ts` — device classification from user agents.
- `lib/analytics/referrer.ts` — referrer → source classification.
- `lib/newsletter/tokens.ts` — token generation and expiry.
- `lib/orders/quote.ts` — package/page/add-on totals, estimate ranges, custom
  quotes, hidden add-ons, and currency formatting.
- Order/services config validators — Phase 32 pricing validation plus safe
  hydration of legacy JSON documents.

### Integration tests (`tests/integration`)
Route handlers exercised end-to-end with Supabase and email services **mocked**:

- `POST /api/analytics` — payload validation, ingestion, size limits.
- `POST /api/messages` — contact form validation and admin notification.
- `POST /api/blood-requests` — field validation and defaults.
- `POST /api/orders` — configured default/custom option acceptance and rejection
  of hidden or unknown package/website values.

Integration tests mock `@/lib/supabase/server`, `@/lib/supabase/guards`, and
`@/lib/email/service` via Vitest's `vi.mock`, so they run with no network access.

### End-to-end tests (`e2e`)
Playwright smoke tests that boot the production server and assert core pages
render without errors across desktop and mobile viewports:

- Every key public route, including `/en/order`, returns < 400 and shows no
  Next.js error boundary.
- Home page loads the expected locale/title and the theme toggle is interactive.
- The order wizard exposes inline validation and recalculates its live estimate.
- Package comparison columns and differences-only filtering are interactive.

## Adding a Test

1. Unit/utility logic → `tests/unit/<module>.test.ts`.
2. API route → `tests/integration/<route>.test.ts` (mock Supabase/email as above).
3. Browser flow → `e2e/<feature>.spec.ts` (keep tests backend-agnostic when possible).

Follow the existing style: use `describe`/`it`, import from `vitest`, and mock
external services explicitly so tests stay fast and deterministic.

## CI Suggestion

```bash
# Example CI steps
npm ci
npm run lint
npm run type-check
npm run test
npm run build
```
