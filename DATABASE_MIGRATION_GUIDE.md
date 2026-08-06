# Database migration guide

## Production-safe rule

**Never run `DROP TABLE`, `CASCADE`, or a hand-written replacement-table script in production.** Those commands erase data and can break Row Level Security (RLS).

The repository now has versioned migrations:

- `supabase/migrations/006_security_and_blog_schema_hardening.sql`
- `supabase/migrations/007_create_analytics_tables.sql` (Phase 26 — analytics)
- `supabase/migrations/008_newsletter_double_optin.sql` (Phase 27 — newsletter)
- `supabase/migrations/009_admin_dashboard_enhancement.sql` (Phase 28 — admin dashboard)

It does the following without deleting tables or rows:

- aligns the bilingual `blog_posts` columns used by the app;
- converts legacy blog tags from `jsonb` to `text[]` when required;
- replaces publicly permissive RLS policies with least-privilege policies;
- protects messages, orders, blood requests, newsletter addresses, bookings, and profiles;
- keeps public forms insert-only and limits private-record access to administrators.

Migration `007_create_analytics_tables.sql` adds first-party analytics storage:

- creates `analytics_page_views` and `analytics_events` with supporting indexes;
- allows public (insert-only) writes from the `/api/analytics` endpoint;
- restricts select/delete to administrators via the existing `is_admin()` helper;
- is non-destructive and safe to run once on the production database.

Migration `008_newsletter_double_optin.sql` (Phase 27) adds double opt-in newsletter:

- extends `newsletter_subscribers` with `is_confirmed`, `confirmation_token`, `unsubscribe_token`, `preferences`, `source`, `bounce_count`, `last_email_sent_at`, `updated_at`;
- backfills `unsubscribe_token` for legacy rows and migrates active rows to `is_confirmed=true`;
- creates `newsletter_campaigns` (subject, content, status, counts, scheduled_at) and `newsletter_sends` (per-subscriber delivery tracking);
- indexes on `lower(email)`, `is_active`, `is_confirmed`, tokens; RLS admin-only for campaigns/sends;
- is non-destructive, idempotent, and safe to run once.

Migration `009_admin_dashboard_enhancement.sql` (Phase 28) adds the admin
dashboard foundation:

- creates `audit_logs`, `admin_notifications`, `blog_comments`,
  `system_logs` and `system_backups` with supporting indexes;
- RLS: audit logs / notifications / system logs / backups are admin-only;
  blog comments are public-insert (pending), public-read (approved only),
  admin-moderation;
- seeds one welcome notification (idempotent);
- is non-destructive, idempotent, and safe to run once.

## Apply the migration

1. Back up the Supabase database first.
2. Open the relevant Supabase project’s **SQL Editor**.
3. Copy the complete contents of `supabase/migrations/006_security_and_blog_schema_hardening.sql`, run it once, then repeat the same steps for `supabase/migrations/007_create_analytics_tables.sql`, `supabase/migrations/008_newsletter_double_optin.sql` and `supabase/migrations/009_admin_dashboard_enhancement.sql` (order matters: 006 → 007 → 008 → 009).
4. Verify the following:
   - An anonymous visitor cannot select `messages`, `orders`, `blood_requests`, or `newsletter_subscribers`.
   - A visitor can submit a contact message and website order.
   - An authenticated administrator can access `/bn/dashboard` and read dashboard data, including `/bn/dashboard/newsletter` and `/bn/dashboard/analytics`.
   - Public visitors can read only published blog posts and approved testimonials.
   - New newsletter signup at `/bn#newsletter` creates a pending subscriber and logs a mock confirmation email (check Vercel logs). Confirm via `/bn/newsletter/confirm?token=...` sets `is_confirmed=true`.
   - An administrator can open `/bn/dashboard` and see real-time stats, and use the new admin pages: `/bn/dashboard/users`, `/bn/dashboard/audit`, `/bn/dashboard/settings`, `/bn/dashboard/blog`, `/bn/dashboard/comments`, `/bn/dashboard/notifications`, `/bn/dashboard/health`, `/bn/dashboard/logs`, `/bn/dashboard/export`.
   - A visitor can comment on a published blog post at `/bn/blog/<slug>`; the comment stays hidden until an admin approves it in `/bn/dashboard/comments`.

## Fresh installations

For a brand-new database, first create the base tables from `supabase/schema.sql`, then apply the SQL files under `supabase/migrations/` in numeric order. The base schema deliberately enables RLS without permissive policies; the migrations establish the required access rules.

## Important deployment variables

Configure these in Vercel before enabling forms or media uploads:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional — Google Analytics 4; first-party analytics work without it)
- `ENABLE_EMAIL_LOG` (optional — set `true` to keep mock newsletter email logs in production until Phase 29 provider `RESEND_API_KEY`/`EMAIL_FROM` is configured)

Do not expose `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, `RESEND_API_KEY`, or any email-provider secret to the browser.

## Phase 29 — Email notification delivery tracking

Apply `supabase/migrations/010_email_notification_system.sql` after migration 009.
It creates the admin-only `email_deliveries` audit table used by the Resend
webhook. Configure `RESEND_API_KEY`, `EMAIL_FROM`, `RESEND_WEBHOOK_SECRET`,
`SUPABASE_SERVICE_ROLE_KEY`, and `CRON_SECRET` in Vercel before enabling real
email delivery and scheduled campaigns.
