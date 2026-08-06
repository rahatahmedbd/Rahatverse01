# Database migration guide

## Production-safe rule

**Never run `DROP TABLE`, `CASCADE`, or a hand-written replacement-table script in production.** Those commands erase data and can break Row Level Security (RLS).

The repository now has a versioned migration for the current database repair:

- `supabase/migrations/006_security_and_blog_schema_hardening.sql`

It does the following without deleting tables or rows:

- aligns the bilingual `blog_posts` columns used by the app;
- converts legacy blog tags from `jsonb` to `text[]` when required;
- replaces publicly permissive RLS policies with least-privilege policies;
- protects messages, orders, blood requests, newsletter addresses, bookings, and profiles;
- keeps public forms insert-only and limits private-record access to administrators.

## Apply the migration

1. Back up the Supabase database first.
2. Open the relevant Supabase project’s **SQL Editor**.
3. Copy the complete contents of `supabase/migrations/006_security_and_blog_schema_hardening.sql`.
4. Run it once.
5. Verify the following:
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

Do not expose `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, or any email-provider secret to the browser.
