# 📜 Changelog

All notable changes to **RahatVerse 2.0** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/); versioning follows
[Semantic Versioning](https://semver.org/).

## [0.5.0] — Phase 31 — "প্রিমিয়াম UI কিট" Premium Form & Feedback System

### Added
- New unified form field kit (`src/components/ui/form.tsx`): `FormField`,
  `TextField`, `TextAreaField`, `SelectField`, `ChipGroup` with inline validation,
  error/success states, focus rings and micro-interactions. Exported from the UI
  barrel.
- Inline per-step validation on the **Order Wizard** and **Contact form**
  (Bengali + English), with error clearing on edit and richer review/success
  presentation.
- Live feature-count hints and feature badges on the order review step.
- Unit tests for the email/phone validation contracts used by both forms.

### Changed
- Order Wizard and Contact form now use the shared premium form kit instead of
  ad-hoc raw inputs (consistent styling, accessibility, feedback).

### Docs
- `docs/ENHANCEMENT_PHASES.md` — new roadmap (Phase 31+) for UI/UX & order-system
  polish; `PHASE_31_COMPLETION.md` added.

## [0.4.0] — Phase 30 — Final Testing & Documentation (in progress)

### Added
- Testing infrastructure: **Vitest** + React Testing Library (jsdom) for unit and
  integration tests, and **Playwright** for end-to-end smoke tests.
  - `npm test`, `npm run test:coverage`, `npm run e2e` scripts.
  - 53 unit/integration tests covering utility modules and public API routes
    (analytics ingestion, contact messages, blood requests) with mocked Supabase.
- E2E smoke suite (`e2e/smoke.spec.ts`) validating core pages render without errors
  on desktop and mobile viewports.
- Comprehensive documentation set under `docs/` (user, developer, API, testing,
  deployment, security, accessibility, SEO, troubleshooting, contributing, changelog).
- `SECURITY.md`, `ACCESSIBILITY.md`, `SEO.md`, `TESTING.md` added.

### Changed
- `README.md` rewritten into a comprehensive project guide with environment,
  scripts, architecture, phase table (now through Phase 30) and docs links.
- `src/lib/api/validation.ts` — removed the misleading, no-op `required` parameter
  from `validPhone` (behavior preserved; it always returned `null` for both paths).
- `scripts` in `package.json` extended with `test`, `test:watch`, `test:coverage`, `e2e`.

## [0.3.0] — Phase 29 — Email Notification System

- Resend integration (transactional emails: welcome, confirm, unsubscribe, order,
  contact notification) via a single server-only `sendEmail` gateway.
- `email_deliveries` audit table (migration 010) with delivery status tracking.
- Signed Resend webhook (`POST /api/email/webhook`) updating delivered/bounced/complained.
- Admin delivery dashboard (`/[locale]/dashboard/email`).
- Scheduled newsletter campaigns via Vercel Cron (`/api/cron/newsletter`, `CRON_SECRET`).
- Security fix: unsubscribe is token-only (email alone cannot unsubscribe a user).

## [0.2.0] — Phases 26–28 — Analytics, Newsletter, Admin Dashboard

- GA4 + first-party analytics pipeline with admin analytics dashboard and CSV export.
- Double opt-in newsletter system (subscription, confirmation, preferences, campaigns).
- Enhanced admin dashboard: real-time stats, system health, RBAC user management,
  audit log, settings, blog CMS, comment moderation, notifications, export, system logs.

## [0.1.0] — Phases 01–25 — Foundation & Core Features

Initial release covering the interactive portfolio, ordering system, blog, auth,
gallery, services, payments, booking, Supabase backend, multi-language (bn/en),
PWA, search, security & SEO, image migration, and more. See `MASTER_PLAN.md`.
