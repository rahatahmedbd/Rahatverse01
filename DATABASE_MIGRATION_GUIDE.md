# Database migration guide

## Production-safe rule

**Never run `DROP TABLE`, `CASCADE`, or a hand-written replacement-table script in production.** Those commands erase data and can break Row Level Security (RLS).

The repository now has versioned migrations:

- `supabase/migrations/006_security_and_blog_schema_hardening.sql`
- `supabase/migrations/007_create_analytics_tables.sql` (Phase 26 — analytics)

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

## Apply the migration

1. Back up the Supabase database first.
2. Open the relevant Supabase project’s **SQL Editor**.
3. Copy the complete contents of `supabase/migrations/006_security_and_blog_schema_hardening.sql`, run it once, then repeat the same steps for `supabase/migrations/007_create_analytics_tables.sql` (order matters).
4. Verify the following:
   - An anonymous visitor cannot select `messages`, `orders`, `blood_requests`, or `newsletter_subscribers`.
   - A visitor can submit a contact message and website order.
   - An authenticated administrator can access `/bn/dashboard` and read dashboard data.
   - Public visitors can read only published blog posts and approved testimonials.

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

Do not expose `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, or any email-provider secret to the browser.
