# Phase 6: Experience, Shantichakra Blood Society & Memorial Section — Completion Report

## Status: ✅ IMPLEMENTED AND VALIDATED

Phase 6 of the 15-phase "100% Admin Control" roadmap is complete in the
session-tracked branch. The professional experience timeline, the Shantichakra
Blood Society command hub, and the memorial tribute page are all now stored in
Supabase and editable from the admin dashboard without a redeploy.

## Delivered

### Database and validation
- Added `supabase/migrations/015_experience_admin_control.sql` (guidance; the
  owner may supply final SQL) that seeds a validated `site_settings.experience_config`
  document covering all three sub-sections.
- `src/types/experience.ts` + `src/lib/experience/{config,server}.ts` with
  defaults and strict validation (bounded arrays/text, allow-listed icon sets,
  status allow-list active/paused/completed, safe URLs including WhatsApp links,
  numeric + string-form counters).

### Public site
- Added `GET /api/experience-config` (public, validated, defaults fallback).
- Refactored `ExperienceSection` — DB-driven timeline with status badges
  (🟢 Active / 🟡 Paused / ⚪ Completed), roles, periods, detail points and links.
- Refactored `BloodSocietySection` — DB-driven role, counters, activities and CTA,
  plus new **emergency hotline number**, **WhatsApp direct link**, and **regional
  coverage areas**.
- Refactored `MemorialSection` — DB-driven tribute text, epigraph, profile photo
  (Cloudinary public id or uploaded URL), death badge, identity roles, development
  works, Dua and sign-off.

### Admin dashboard
- `ExperienceControlPanel` at `/[locale]/dashboard/experience` (new "Experience &
  Memorial" nav entry):
  - Experience timeline CRUD with reorder, icon selection, bilingual fields,
    status select, detail-point editor and optional link.
  - Blood society role text, public counters (numeric or string), activities CRUD,
    emergency hotline + WhatsApp + coverage areas, and CTA.
  - Memorial tribute text, photo upload through the authenticated Cloudinary API,
    identity roles CRUD, development-works line editor, Dua and sign-off.
- `BloodRequestsManager` at `/[locale]/dashboard/blood-requests` (new "Blood
  Requests" nav entry) — filter by status, private admin notes, and mark an
  incoming emergency blood request as responded or closed.
- Admin-only audited `PATCH /api/admin/blood-requests` for responding/closing
  requests (uses the existing `blood_requests` table).

### Tests and documentation
- Ten unit tests covering the CMS validation contract.
- Updated API reference, deployment guide, changelog, README, and analysis report.

## Required database action

Apply migration `015_experience_admin_control.sql` (or the owner's equivalent) to
the production Supabase project to unlock persisted admin control. Until applied,
the site and admin area remain fully functional using built-in defaults.

## Validation

| Check | Result |
|-------|--------|
| `npm install` | ✅ (existing lockfile, 0 vulnerabilities) |
| `npm run lint` | ✅ 0 errors, 0 warnings |
| `npm run type-check` | ✅ Clean TypeScript compilation |
| `npm test` | ✅ 143 passed (23 files; +10 new experience-config tests) |
| `npm run build` | ✅ Next.js 16 success — includes `/api/experience-config`, `/api/admin/blood-requests`, `/[locale]/dashboard/experience`, `/[locale]/dashboard/blood-requests` |

## Notes
- No breaking changes — defaults replicate previous hardcoded content, so prod is
  identical until an admin edits.
- RLS unchanged — reads public, writes admin-only through the existing guards and
  the authenticated admin settings + blood-requests APIs.
- Branch: `arena/019fdc61-rahatverse01` (session-locked as required by Arena).

## Next Phase
Ready for **Phase 7: Cloudinary Media Library, Photo Gallery & Video Showcase**
(cloud media asset manager, interactive photo gallery CMS, video portfolio
showcase).
