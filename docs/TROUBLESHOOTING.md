# 🛠️ Troubleshooting Guide

Common issues and their fixes.

## Build / dev issues

**`npm run build` fails on type errors**
Run `npm run type-check` and fix the reported files. Strict mode is on; missing
props or incorrect types are common causes.

**`npm run dev` shows a 503 / "Service unavailable" on API routes**
The route uses Supabase but `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
are missing. Add them to `.env.local` or configure a mock (public pages still work).

**Cron route returns 401**
`CRON_SECRET` is unset or the `Authorization: Bearer <CRON_SECRET>` header is
missing/mismatched. Set it in Vercel and in Vercel Cron configuration.

## Supabase issues

**"Permission denied for table" (RLS)**
A query violates a Row Level Security policy. Review the migration for the table
and confirm the authenticated user role. Do not disable RLS globally.

**Admin features 403 even when logged in**
The user's `profiles.role` is not `admin`. Update the profile row, or check that
the `profiles` table auto-creates rows on signup.

**Newsletter confirmation returns 410 (token expired)**
Confirmation tokens expire after 48 hours. Ask the user to resubscribe for a new
confirmation email.

## Email issues

**Emails not delivered in production**
- `RESEND_API_KEY` / `EMAIL_FROM` unset, or `EMAIL_FROM` not from a verified domain.
- Check `email_deliveries` rows and the Resend dashboard for bounce reasons.

**Mock emails in production**
When `RESEND_API_KEY` is absent the app falls back to mock (logged) delivery. Set
`ENABLE_EMAIL_LOG=true` to see them. This is expected in non-production builds.

**Webhook returns 503**
`RESEND_WEBHOOK_SECRET` is not configured. Set it and point Resend at
`/api/email/webhook`.

## Analytics

**Dashboard shows no data**
- Analytics requires the `analytics_page_views` / `analytics_events` tables
  (migrations) and Supabase configured.
- The tracker skips requests when `navigator.webdriver` or Do Not Track is set, and
  when visiting as a bot.
- Data is only collected from real client browsers after they load the tracker.

## Media

**Uploads fail**
Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`,
and that the preset allows the file type/size.

## Local environment not matching production

Always run the full validation before shipping:
```bash
npm install && npm run lint && npm run type-check && npm test && npm run build
```
If tests fail, run `npm run test:coverage` and inspect the failing spec; many
failures are from mocked services returning unexpected shapes.

## Still stuck?

Check `docs/CHANGELOG.md` for recent changes, review `MASTER_PLAN.md` for feature
scope, and open an issue with: the command run, the full error output, and whether
the environment has real Supabase/Resend credentials.
