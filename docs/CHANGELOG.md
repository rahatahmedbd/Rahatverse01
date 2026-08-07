# 📜 Changelog

All notable changes to **RahatVerse 2.0** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/); versioning follows
[Semantic Versioning](https://semver.org/).

## [0.17.0] — Phase 14 — Analytics, Real-Time Visitor Telemetry & Performance Vitals CMS

### Added
- `analytics_config` site_settings document (migration `023_analytics_admin_control.sql`)
  driving dashboard panel toggles (demographics/devices/geo/vitals), the
  first-party telemetry switch, the conversion-goal label and Core Web Vitals
  thresholds (LCP/INP/CLS).
- Public `/api/analytics-config` endpoint with resilient defaults.
- Global `setTelemetryEnabled` hook in the analytics tracker; `shouldTrack()`
  now respects the admin telemetry switch.
- `AnalyticsControlPanel` at `/[locale]/dashboard/analytics-settings` (new
  "Analytics Settings" nav entry).
- Seven unit tests covering the new CMS validation contract.

## [0.16.0] — Phase 13 — Site-Wide Search, FAQ & Legal Policies CMS

### Added
- `content_config` site_settings document (migration `022_content_admin_control.sql`)
  driving FAQ categories/items, search scope & weights, and legal policy pages.
- Public `/api/content-config` endpoint with resilient defaults.
- `ContentControlPanel` at `/[locale]/dashboard/content` (new "FAQ & Legal" nav
  entry) — FAQ categories/items CRUD, search scope & weights, and rich-text legal
  page editor (Privacy, Terms, Cookie, Refund).
- Refactored `FAQSection` to render DB-driven category-filtered accordions.
- Added a shared `LegalContent` renderer and rewired `/privacy`, `/terms` and new
  `/cookie`, `/refund` pages to render from config.
- Eight unit tests covering the new CMS validation contract.

## [0.15.0] — Phase 12 — Interactive Themes, Gamification (XP) & Audio Controls CMS

### Added
- `theme_config` site_settings document (migration `021_theme_admin_control.sql`)
  driving theme presets, defaults (accent/theme/customizer), XP rules & levels,
  ambient-audio playlist + volume, and background-effect toggles/intensities.
- Public `/api/theme-config` endpoint with resilient defaults.
- `useThemeConfig` client hook (cached) + `applyPresetToDOM`.
- `ThemeControlPanel` at `/[locale]/dashboard/theme` (new "Theme & Effects" nav
  entry) — presets CRUD, defaults, XP rules/levels, audio tracks, effect toggles.
- Refactored `AccentCustomizer` to load admin-defined presets from the config and
  apply them to the DOM.
- Eight unit tests covering the new CMS validation contract.

## [0.14.0] — Phase 11 — Newsletter & Campaign Control CMS

### Added
- `newsletter_config` site_settings document (migration `020_newsletter_admin_control.sql`)
  driving the newsletter section headings, topic preferences and campaign
  defaults (from name/email, default subject, personalization hint).
- Public `/api/newsletter-config` endpoint with resilient defaults.
- `NewsletterControlPanel` at `/[locale]/dashboard/newsletter-settings` (new
  "Newsletter Settings" nav entry) — topics CRUD/reorder/visibility and campaign
  defaults.
- Refactored `NewsletterSignup` to render topic-preference chips from the config
  and submit the selected preferences (double opt-in preserved).
- Six unit tests covering the new CMS validation contract.

## [0.13.0] — Phase 10 — Link Hub, Tool Recommendations & Resume/CV Manager

### Added
- `links_config` site_settings document (migration `019_links_admin_control.sql`)
  driving link-hub cards (with click counts), tool recommendations, resume/CV
  settings and the profile header.
- Public `/api/links-config` endpoint with resilient defaults and a
  `POST /api/links/click` counter.
- `LinksControlPanel` at `/[locale]/dashboard/links` (new "Links & Tools" nav
  entry) — link cards CRUD/reorder/visibility/icon/colors, tool recommendations
  (development/design/productivity), CV URLs + in-browser-preview toggle.
- Refactored `LinkHubSection` to render DB-driven links, tools and a working
  CV download/preview, with per-link click tracking.
- Eight unit tests covering the new CMS validation contract.

## [0.12.0] — Phase 9 — Contact, Booking Calendar & Social Testimonials CMS

### Added
- `contact_config` site_settings document (migration `018_contact_admin_control.sql`)
  driving the contact section, quick links, booking settings (time slots, buffer,
  max-per-week, purposes) and testimonial display (carousel count, autoplay).
- Public `/api/contact-config` endpoint with resilient defaults.
- `MessagesManager` at `/[locale]/dashboard/messages` — centralized inbox reading
  real submissions with read/unread toggles and one-click email/WhatsApp links
  (new admin `/api/admin/messages` GET/PATCH).
- `BookingCalendarManager` at `/[locale]/dashboard/bookings` — approve / complete /
  cancel consultation bookings (new admin `/api/admin/bookings`).
- `TestimonialManager` at `/[locale]/dashboard/testimonials` — approve / edit /
  delete / featured-toggle reviews (new admin `/api/admin/testimonials`).
- `ContactControlPanel` at `/[locale]/dashboard/contact-settings` (new "Contact
  Settings" nav entry) plus "Bookings" and "Testimonials" nav entries.
- Seven unit tests covering the contact config validation contract.

## [0.11.0] — Phase 8 — Bilingual Blog & Comment Moderation CMS

### Added
- `blog_config` site_settings document (migration `017_blog_admin_control.sql`)
  driving blog section headings, categories, author profile, comment-moderation
  settings and reading speed.
- Public `/api/blog-config` endpoint with resilient defaults.
- `BlogControlPanel` at `/[locale]/dashboard/blog-settings` (new "Blog Settings"
  nav entry) — categories CRUD/reorder/visibility, section headings, author
  profile, comment approval toggle and admin-badge labels.
- Admin comment **reply** with a verified "Admin / Author" badge — new
  `admin_reply` / `reply_author` columns (migration 017) and PATCH support in
  `/api/admin/comments`; `CommentModeration` now shows replies and a reply
  composer.
- Refactored `BlogListSection` to use config-driven categories.
- Eight unit tests covering the new CMS validation contract.

## [0.10.0] — Phase 7 — Cloudinary Media Library, Photo Gallery & Video Showcase CMS

### Added
- **Photo Gallery CMS** — `site_settings.gallery_config` (migration
  `016_media_admin_control.sql`) drives albums (name/slug/description/featured
  cover public_id/ordering/visibility), section headings and the default
  mosaic/grid layout.
- **Video Portfolio CMS** — `site_settings.video_config` drives
  YouTube/Vimeo/direct videos (title, description, category, video id for modal
  embeds, thumbnail, ordering, visibility) plus social links.
- Public `/api/gallery-config` and `/api/video-config` endpoints with resilient
  defaults.
- `GalleryControlPanel` at `/[locale]/dashboard/gallery` and `VideoControlPanel`
  at `/[locale]/dashboard/videos` (new "Gallery CMS" and "Video CMS" nav entries).
- Refactored home `GallerySection` into a config-driven album browser, updated the
  dedicated `Gallery` page to use album-driven filters (and `?album=` deep links),
  and made `VideoPortfolio` config-driven with an in-page video modal preview.
- Twelve unit tests covering the new CMS validation contracts.

## [0.9.0] — Phase 6 — Experience, Shantichakra Blood Society & Memorial CMS

### Added
- **Experience / Blood / Memorial CMS** — `site_settings.experience_config`
  (migration `015_experience_admin_control.sql`) drives the professional
  experience timeline, the Shantichakra Blood Society command hub, and the
  memorial tribute page.
- Public `/api/experience-config` endpoint with resilient defaults.
- `ExperienceControlPanel` at `/[locale]/dashboard/experience` (new "Experience &
  Memorial" nav entry) — experience timeline CRUD with status badges
  (Active/Paused/Completed), blood society role text, public counters, emergency
  hotline & WhatsApp link, coverage areas, activities, and memorial tribute/roles/
  developments/dua with photo upload.
- `BloodRequestsManager` at `/[locale]/dashboard/blood-requests` (new "Blood
  Requests" nav entry) — filter, private notes, mark responded / close incoming
  emergency blood requests.
- Admin-only audited `PATCH /api/admin/blood-requests`.
- Refactored `ExperienceSection`, `BloodSocietySection` (now showing emergency
  hotline + coverage areas) and `MemorialSection` to render DB-driven content.
- Ten unit tests covering the new CMS validation contract.

## [0.8.0] — Phase 5 — Client Orders, Kanban Pipeline & Payment Tracking

### Added
- **Order intake wizard CMS** — `site_settings.orders_config` (migration
  `014_orders_admin_control.sql`) drives package options, website types, feature
  add-ons, design styles, page-count increments, budget ranges, timelines, step
  labels and CTA/success messages.
- Public `/api/orders-config` endpoint with resilient defaults.
- `OrderSettingsControlPanel` at `/[locale]/dashboard/orders-settings` (new
  "Order Settings" nav entry) — CRUD/reorder/visibility for every wizard option.
- **Order Wizard refactor** — now renders from `orders_config`, adds a configurable
  **design-style selector** and **page-count increment** selector, and submits an
  optional `design_style`.
- **Kanban order pipeline** — `OrderKanbanBoard` at `/[locale]/dashboard/orders`
  groups orders by workflow stage (New Lead → Under Review → In Progress → Client
  Feedback → Completed → Archived) with drag-and-drop and click-to-open detail.
- **Order detail editor** — pipeline stage, private admin notes, project links
  (repo/staging/Figma/live), payment status/method/amounts with configurable
  milestones, and a client communication log.
- **Admin API** `PATCH /api/admin/orders` (admin-only, audited) to persist the
  above; mirrors payment status/amount onto the legacy scalar columns.
- Ten unit tests covering the orders config validation contract and Kanban stage
  normalization.

### Changed
- `src/app/[locale]/dashboard/orders` now hosts the Kanban pipeline instead of the
  static demo list.
- The orders POST route accepts an optional `design_style`.

## [0.7.0] — Phase 4 — Services, Website Types & Interactive Pricing Packages CMS

### Added
- Bilingual Services & Pricing CMS configuration with Supabase migration
  `013_services_admin_control.sql`.
- Validated public `/api/services-config` endpoint with resilient defaults.
- Admin control panel at `/[locale]/dashboard/services` (new "Services & Pricing"
  nav entry) covering: service offering cards (icon, bilingual text, feature points,
  price, delivery timeline), website types, why-choose-us features, featured
  packages (home flip cards with badge variants), pricing packages with BDT (৳) and
  USD ($) amounts plus a Popular toggle, a side-by-side comparison matrix with
  per-package rows, the workflow/process timeline, and the services CTA block.
- A shared Lucide icon resolver (`src/lib/services/icons.tsx`) with a bounded,
  allow-listed icon set.
- Ten unit tests covering the new CMS validation contract.

### Changed
- `PricingSection`, `ServicesPreview`, and the Services page now render from the
  DB-driven `services_config` with a full fallback to defaults when Supabase is
  unavailable or the stored value is invalid — production stays identical until
  an admin edits the content.
- Pricing cards now also display a USD-equivalent price under the BDT amount.
- Added a side-by-side package comparison matrix under the pricing cards.

## [0.6.0] — Phase 3 — About, Education & Achievements CMS

### Added
- Bilingual About CMS configuration with Supabase migration `012_about_admin_control.sql`.
- Admin control panel for biography, personal info, interests, education milestones,
  achievement badges, statistics, profile uploads, frame presets, and certificates.
- Validated public `/api/about-config` endpoint with resilient defaults.
- Server-loaded About content on the home, About, and Achievements pages.
- Six unit tests covering the new CMS validation contract.

### Changed
- Profile image rendering now supports CMS-controlled Cloudinary/URL sources and
  configurable glow frames/status labels.
- Shared education storyline supports location and GPA badges.
- Generic admin settings payload limit is now 100 KB to support bounded bilingual CMS documents.

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

## [0.10.0] — Phase 7 — Cloudinary Media Library, Photo Gallery & Video Showcase CMS
