# 🚀 Deployment Guide

This guide covers deploying RahatVerse 2.0 to production on Vercel with Supabase,
Cloudinary, and Resend.

## Prerequisites

- A **Vercel** account (Hobby or Pro).
- A **Supabase** project.
- A **Cloudinary** account.
- A **Resend** account with a verified sending domain.

## 1. Database (Supabase)

1. Create a Supabase project.
2. Apply the migrations in `supabase/` in order through
   `019_links_admin_control.sql`, using the Supabase SQL editor or CLI:
   ```bash
   npx supabase db push
   ```
   or copy each `supabase/00X_*.sql` file into the SQL editor and run them in order.
3. Migrations create all tables, Row Level Security (RLS) policies, and triggers.
   Keep RLS enabled — the app relies on it.
4. If using email confirmation, add a site URL and the redirect URL to Supabase
   Auth settings.

## 2. Media (Cloudinary)

1. Set up a Cloudinary cloud (or reuse an existing one).
2. Create an **unsigned upload preset** for client uploads (used by
   `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`).
3. Note the cloud name and API credentials.

## 3. Email (Resend)

1. Verify a sending domain in Resend (e.g. `rahatverse01.vercel.app`).
2. Create an API key (`RESEND_API_KEY`).
3. Set a default from address (`EMAIL_FROM`) and admin recipient (`ADMIN_EMAIL`).
4. (Recommended) Configure the delivery webhook:
   - Create a webhook signing secret (`RESEND_WEBHOOK_SECRET`, `whsec_...`).
   - In Resend, point the webhook at `https://<your-domain>/api/email/webhook`
     and subscribe to **sent / delivered / bounced / complained** events.

## 4. Vercel

1. Import the GitHub repository into Vercel.
2. Add all environment variables (see `.env.local.example` and below).
3. Deploy. Vercel will read `vercel.json` which declares the newsletter cron:
   ```json
   { "crons": [{ "path": "/api/cron/newsletter", "schedule": "0 9 * * *" }] }
   ```
   Hobby plans support one daily cron; Pro supports more frequent schedules.

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL |
| `NEXT_PUBLIC_APP_NAME` | No | App display name |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Service role for webhooks/cron |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Yes | Unsigned upload preset |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | For admin upload | Signed uploads |
| `RESEND_API_KEY` | For real email | Resend API key |
| `EMAIL_FROM` | For real email | Verified sender address |
| `ADMIN_EMAIL` | For notifications | Admin notification recipient |
| `RESEND_WEBHOOK_SECRET` | For webhook | `whsec_...` signing secret |
| `CRON_SECRET` | For cron | Protects `/api/cron/newsletter` |
| `ENABLE_EMAIL_LOG` | No | Log mock emails in production |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | GA4 measurement id (e.g. `G-...`) |

> **Never** expose `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, or
> `RESEND_API_KEY` to the browser. Only `NEXT_PUBLIC_*` values are public.

## Deployment checklist

- [ ] All Supabase migrations applied and RLS enabled
- [ ] Resend domain verified and `EMAIL_FROM` set
- [ ] `CRON_SECRET` generated and configured in Vercel
- [ ] Webhook configured in Resend (if using delivery tracking)
- [ ] `NEXT_PUBLIC_SITE_URL` matches the production domain
- [ ] `npm run lint`, `npm run type-check`, `npm test`, `npm run build` all pass
- [ ] Vercel production deployment succeeded
- [ ] Live site verified (public pages, admin login, newsletter, contact form)
