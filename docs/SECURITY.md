# 🔐 Security

This document describes the security model of RahatVerse and how to keep it safe.

## Threat model

RahatVerse is a public marketing + ordering platform with an admin area. The main
assets are: admin credentials, user data (orders, messages, blood requests), and
the Cloudinary / Resend / Supabase credentials.

## Key controls

### Authentication & authorization
- All auth uses **Supabase Auth** (email/password, OAuth, magic link).
- Admin authorization is server-side via `getCurrentUserContext()` which reads the
  verified Supabase session and the `profiles.role` column.
- **Never** trust a client-supplied `role`, `user_id`, or admin flag.

### Row Level Security (RLS)
- Every table created in Supabase has RLS policies in its migration.
- Public tables expose only safe columns (e.g. published blog posts, confirmed
  testimonials). Sensitive tables (messages, blood_requests, orders, users) are
  admin-read / user-owned.
- **Keep RLS enabled.** Disabling it exposes data to anonymous requests.

### Secrets
- Server-only secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`,
  `CLOUDINARY_API_SECRET`, `CRON_SECRET`, `RESEND_WEBHOOK_SECRET`) are read from
  `process.env` in server routes only. They must never be prefixed `NEXT_PUBLIC_`.
- No secret is committed to the repository (`.env*.local` is gitignored).

### API hardening
- **Input validation** via `lib/api/validation.ts` on all public endpoints
  (length, format, enum whitelists).
- **Rate limiting** applied on public mutation endpoints (contact, newsletter,
  comments, orders) — see `lib/api/` rate limiting utilities.
- **Analytics ingestion** caps payload size and batch counts, and validates paths
  and session ids to prevent abuse.
- **Webhook verification:** `/api/email/webhook` validates the Resend/Svix
  signature; `/api/cron/newsletter` requires `Authorization: Bearer <CRON_SECRET>`.
- **Unsubscribe is token-only:** an email address alone cannot unsubscribe another
  recipient (previously a vulnerability — fixed in Phase 29).

### CSRF / CORS
- Mutation endpoints accept JSON and are same-origin; the client-side tracker uses
  `sendBeacon`/`fetch` with no cross-origin cookies. Supabase cookies are
  `HttpOnly` where applicable.

## Response handling
- Admin endpoints return `401` (unauthenticated), `403` (non-admin), `503`
  (Supabase not configured) without leaking internals.
- Errors are logged server-side; user-facing messages are generic.

## Reporting a vulnerability
Contact the repository owner directly (see `README.md` author section). Do not open
a public issue for security defects.

## Audit checklist (before each release)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` used only in server routes
- [ ] RLS enabled on all tables
- [ ] No secrets in git history or client bundles
- [ ] Public endpoints validate input & limit rate
- [ ] Admin routes check role server-side
- [ ] Dependencies scanned (`npm audit` → 0 vulnerabilities)
