# 🔌 API Reference

All endpoints live under `/api`. Public endpoints are unauthenticated;
admin endpoints require an authenticated user whose `profiles.role` is `admin`.

**Auth model:** authorization always comes from the Supabase session cookie
(Supabase Auth). Requests without a session get `401`; non-admin sessions get `403`;
when Supabase is not configured the server returns `503`.

---

## Public endpoints

### `GET /api/services-config`
Public, validated Services / pricing / process configuration endpoint (Phase 4).
- Returns `{ data }` where `data` is the `services_config` document stored in
  `site_settings` (service offerings, website types, features, featured packages,
  pricing packages with BDT/USD amounts, comparison matrix, process timeline, CTA).
- Falls back to built-in defaults when the database is unavailable or the stored
  value fails validation — the public site never breaks.

### `GET /api/about-config`
Public, validated About / Education / Achievements configuration endpoint (Phase 3).
- Returns `{ data }` where `data` is the `about_config` document stored in
  `site_settings`. Falls back to built-in defaults when unavailable/invalid.

### `GET /api/hero-config`
Public, validated Hero section configuration endpoint (Phase 2).
- Returns `{ data }` where `data` is the `hero_config` document stored in
  `site_settings`. Falls back to built-in defaults when unavailable/invalid.

### `POST /api/analytics`
Client-side first-party tracking ingestion (used by `lib/analytics/tracker.ts`).
- **Body:** `{ sessionId, pageViews: [{path, referrer?, screenWidth?, ts?}], events: [{name, category?, label?, path?, value?, metadata?, ts?}] }`
- **Limits:** body ≤ 64 KB; ≤ 10 page views and ≤ 25 events per batch.
- **Returns:** `200 { success, stored }`. Invalid payloads → `400`, oversized → `413`.
- This endpoint is intentionally lenient and never blocks page render.

### `POST /api/messages`
Submit a contact form message.
- **Body:** `{ name, email, subject, message, phone? }`
- `subject` is one of `web_dev | tutoring | blood | collaboration | general | other`.
- **Returns:** `201 { success: true }` or `400` on validation failure.
- If `ADMIN_EMAIL` is set, a notification email is sent to the admin.

### `POST /api/blood-requests`
Create a blood donation request. Reading (`GET`) is admin-only.
- **Body:** `{ name, phone, blood_group, location, urgency?, message? }`
- `blood_group`: `A+ A- B+ B- AB+ AB- O+ O-`; `urgency`: `normal | urgent | critical` (default `normal`).
- **Returns:** `201` or `400`.

### `POST /api/newsletter`
Subscribe to the newsletter (double opt-in).
- **Body:** `{ email, name?, locale? }`
- Sends a confirmation email; the subscriber must confirm to become active.

### `GET /api/newsletter/confirm?token=...`
Confirms a subscription (also `POST` with `{ token, locale }`).
- Confirmation tokens expire after 48 hours. Returns `410` when expired.

### `GET /api/newsletter/unsubscribe?token=...`
Unsubscribes a subscriber (token-only; also `POST` with `{ token, locale }`).

### `GET /api/newsletter/preferences?token=...`
Manage newsletter preferences for a token owner.

### `POST /api/search`
Site-wide search across indexed content.

### `POST /api/comments`
Submit a comment on blog content (goes through moderation).

### `POST /api/orders`
Place a website order (multi-step wizard). Reads the order status.

### `POST /api/upload`
Upload a media file to Cloudinary (auth + size/type validated).

### `POST /api/testimonials`
Submit a testimonial (goes through moderation).

### `GET /api/blog`
List published blog posts; `GET /api/blog/[slug]` not a route — posts are rendered
server-side. See `[locale]/blog/[slug]`.

---

## Admin endpoints (require `admin` role)

| Endpoint | Purpose |
|----------|---------|
| `GET /api/analytics` | Aggregated analytics (range: 7/30/90 days) |
| `GET /api/analytics/export` | CSV export of analytics |
| `GET /api/admin/activity` | Recent activity feed |
| `GET /api/admin/audit-logs` | Audit log entries |
| `GET /api/admin/backup` | Database backup status/tooling |
| `CRUD /api/admin/blog` | Blog CMS |
| `GET/PATCH /api/admin/comments` | Comment moderation |
| `GET /api/admin/email-deliveries` | Email delivery dashboard |
| `GET /api/admin/export` | Generic data export |
| `GET /api/admin/health` | System health checks |
| `GET /api/admin/logs` | System logs viewer |
| `GET/PATCH /api/admin/notifications` | Notification center |
| `GET/PATCH /api/admin/settings` | Settings management, including `about_config` |
| `GET/PATCH /api/admin/users` | User management (RBAC) |
| `POST /api/newsletter/campaigns` | Create/dispatch newsletter campaigns |
| `GET /api/newsletter/export` | Export subscriber list |

## Webhooks & cron (service-level)

- **`POST /api/email/webhook`** — Resend delivery webhook. Validates the Svix
  signature with `RESEND_WEBHOOK_SECRET` and updates `email_deliveries`
  (delivered / bounced / complained). Returns `503` when the secret is unset.
- **`GET /api/cron/newsletter`** — Vercel Cron target. Requires
  `Authorization: Bearer <CRON_SECRET>`. Dispatches due scheduled campaigns.

## Error response format

```json
{ "error": "Human readable message", "code": "OPTIONAL_MACHINE_CODE" }
```

## Notes

- All endpoints are Server Routes (`force-dynamic` where relevant) — there is no
  client-only secret handling.
- Admin authorization uses `getCurrentUserContext()` and never trusts client input.
