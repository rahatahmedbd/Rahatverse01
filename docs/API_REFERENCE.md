# 🔌 API Reference

All endpoints live under `/api`. Public endpoints are unauthenticated;
admin endpoints require an authenticated user whose `profiles.role` is `admin`.

**Auth model:** authorization always comes from the Supabase session cookie
(Supabase Auth). Requests without a session get `401`; non-admin sessions get `403`;
when Supabase is not configured the server returns `503`.

---

## Public endpoints

### `GET /api/contact-config`
Public, validated contact / booking / testimonial configuration endpoint
(Phase 9). Returns `{ data }` — the `contact_config` document in `site_settings`
(contact section, quick links, booking settings, testimonial display). Falls back
to defaults when the database is unavailable or the value fails validation.

### `GET|PATCH /api/admin/messages`
Admin-only. `GET` lists contact-form submissions (`?unread=true|false`);
`PATCH` marks a message read/unread or archived. Body: `{ id, is_read?, archived? }`.

### `GET|PATCH /api/admin/bookings`
Admin-only. `GET` lists consultation bookings (`?status=`); `PATCH` approves /
cancels / completes a booking (`{ id, status }`) or reschedules
(`{ id, date, time_slot }`).

### `GET|PATCH|DELETE /api/admin/testimonials`
Admin-only. `GET` lists reviews (`?status=pending|approved`); `PATCH` approves /
edits / toggles featured (`{ id, is_approved?, featured?, name?, role?, ... }`);
`DELETE` removes a review.

### `GET /api/blog-config`
Public, validated blog & comment configuration endpoint (Phase 8). Returns
`{ data }` — the `blog_config` document in `site_settings` (blog section
headings, categories, author profile, comment-moderation settings, reading
speed). Falls back to built-in defaults when the database is unavailable or the
value fails validation.

### `PATCH /api/admin/comments` (reply)
Admin-only. Body may include `admin_reply` (and optional `reply_author`) to post
a verified admin reply on a comment (Phase 8). Also still accepts
`{ id, approved }` to approve/reject. Adds `admin_reply`/`reply_author` columns
via migration 017.

### `GET /api/gallery-config`
Public, validated photo-gallery configuration endpoint (Phase 7). Returns
`{ data }` — the `gallery_config` document in `site_settings` (albums with
featured cover public_ids, ordering, visibility, section headings, default
mosaic/grid layout). Falls back to built-in defaults when the database is
unavailable or the value fails validation.

### `GET /api/video-config`
Public, validated video-portfolio configuration endpoint (Phase 7). Returns
`{ data }` — the `video_config` document in `site_settings` (YouTube/Vimeo/direct
videos with video ids for modal embeds, categories, ordering, visibility, social
links). Falls back to built-in defaults when the database is unavailable or the
value fails validation.

### `GET /api/experience-config`
Public, validated Experience / Blood Society / Memorial configuration endpoint
(Phase 6). Returns `{ data }` — the `experience_config` document in
`site_settings` (professional experience timeline, Shantichakra Blood Society
counters/hotline/coverage/activities, and the memorial tribute). Falls back to
built-in defaults when the database is unavailable or the value fails validation.

### `PATCH /api/admin/blood-requests`
Admin-only update to respond to / close an incoming blood donation request
(Phase 6). Body: `{ id, status?, admin_notes? }` where `status` is
`open | responded | closed`. Audited via `audit_logs`. Returns `{ success, data }`.

### `GET /api/orders-config`
Public, validated order-intake wizard configuration endpoint (Phase 5).
- Returns `{ data }` where `data` is the `orders_config` document stored in
  `site_settings` (package options, website types, feature add-ons, design
  styles, page-count increments, budget ranges, timelines, step & CTA labels).
- Falls back to built-in defaults when the database is unavailable or the stored
  value fails validation.

### `PATCH /api/admin/orders`
Admin-only partial update of an order (Phase 5 Kanban + payment tracking).
- **Auth:** admin only (server-side RBAC guard + audit log entry).
- **Body:** `{ id, status?, admin_notes?, project_links?, payment?, communication_log? }`.
  - `status`: one of `new_lead | under_review | in_progress | client_feedback | completed | archived`.
  - `project_links`: `{ repo?, staging?, figma?, live? }` (https or relative URLs only).
  - `payment`: `{ status?, method?, advanceAmount?, totalAmount?, currency?, milestones? }`
    where `status` is `unpaid | pending_advance | fifty_percent | fully_settled | refunded`
    and `method` is `bkash | nagad | bank_transfer | sslcommerz | other`.
  - `communication_log`: array of `{ id, date, authorBn, authorEn, messageBn, messageEn }`.
- Mirrors the primary payment status/amount onto the legacy `payment_status` /
  `payment_amount` scalar columns.
- Returns `{ success, data }` or `400/401/403/500` on errors.

### `POST /api/orders`
Submit a website order (public). Also accepts an optional `design_style` field
(Phase 5) captured from the configurable design-style selector in the wizard.

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
