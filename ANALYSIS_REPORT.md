# RahatVerse — Project Analysis & Roadmap Audit

**Audit date:** 2026-08-08 UTC

**Session branch:** `arena/019fe120-rahatverse01`

**Baseline:** `3ba7fc3` (`origin/main` when the phase began)

**Stack:** Next.js 16.3, React 19, TypeScript 5, Tailwind CSS 4, Supabase,
Cloudinary, Vercel, Vitest, and Playwright

## 1. Git and roadmap finding

The worktree was clean and the session was not on `main`. Arena pins this
session to `arena/019fe120-rahatverse01`, so a separate phase-named branch cannot
be created without breaking session tracking.

All 15 phases in the supplied **100% Admin Control** roadmap were already merged
before this audit. Evidence includes:

- merged PRs #46–#49;
- migrations `011_hero_admin_control.sql` through
  `024_global_admin_control.sql`;
- corresponding public config APIs, authenticated dashboard editors, runtime
  consumers, tests, changelog entries, and `PHASE_01`–`PHASE_15` reports.

The repository's continuation plan in `docs/ENHANCEMENT_PHASES.md` records Phase
31 as complete and identifies **Phase 32 — “লাইভ কোট” Live Price Estimator &
Package Compare** as the first uncompleted phase. No Phase 33+ work is included.

## 2. Baseline health before modification

| Gate | Result |
|---|---|
| `npm install` | Passed — 585 packages, 0 vulnerabilities |
| `npm run lint` | Passed |
| `npm run type-check` | Passed |
| `npm test` | Passed — 227 tests in 33 files |
| `npm run build` | Passed |
| Dependency/package conflicts | None found |
| TODO/FIXME/HACK scan | No runtime markers found |
| Skipped/exclusive tests | None found |

The local environment has no Supabase credentials, and the project correctly
uses its documented mock/fallback path during build and local rendering.

## 3. Relevant defects found

1. **Inline validation was unreachable.** The wizard's Next button was disabled
   while required fields were empty, so clicking it could not reveal the error
   messages delivered in Phase 31.
2. **Admin options could not be submitted.** `POST /api/orders` used hard-coded
   package and website-type enums even though the admin dashboard can add those
   options dynamically.
3. **Package query values were not normalized.** A hidden, stale, or forged
   `?package=` value could remain in client state.
4. **Pricing was disconnected.** Package prices existed in `services_config`,
   but the order wizard had no page/add-on pricing contract or estimator.
5. **Literal placeholders were public.** Featured/default service cards still
   displayed `৳X` instead of configured values.
6. **The comparison matrix was static.** Users could not select packages or
   isolate differences.
7. **Pricing could remain blocked.** The pricing component hid all defaults
   behind a network request with no abort timeout.
8. **Test output contained warnings.** Vitest's config extension caused an ESM
   loader warning, and a theme test allowed an asynchronous hook update to leak
   outside the test lifecycle.
9. **Documentation claimed premature order tracking.** The user guide referred
   to a public tracking page that belongs to future Phase 34 and does not exist.

## 4. Phase 32 implementation

### Quote engine and user experience

- Added a pure `calculateLiveQuote` module with package, included-page, extra-page,
  and selected-add-on breakdowns in BDT and USD.
- Added a bilingual, accessible live estimate card with range margin, custom
  quote handling, and a clear non-binding disclaimer.
- Package and feature chips now expose their applicable prices.
- The estimate remains visible through the wizard and review step.
- Invalid query package values fall back to a visible configured option.

### Interactive package comparison

- Added package-column selectors with an enforced two-column minimum.
- Added a differences-only mode, responsive horizontal scrolling, sticky feature
  labels, and direct order actions for each compared tier.
- Pricing now renders safe defaults immediately and aborts a slow config fetch
  after eight seconds.

### Admin control and compatibility

- Order settings now control quote enablement, BDT/USD page prices, range margin,
  bilingual quote copy, and BDT/USD add-on prices.
- Service settings now control the order value, included-page allowance,
  package-included feature values (so included items are not charged twice), and
  the pricing tier linked to a featured package.
- Existing valid Phase 4/5 JSON is hydrated at runtime when the new fields are
  absent; explicit stored values win.
- Migration `026_live_quote_pricing.sql` applies the same additions
  idempotently and preserves existing admin values.

### Security and API consistency

- Order submissions validate package and website type against currently visible
  `orders_config` options rather than trusting input or using hard-coded enums.
- Valid administrator-created options are accepted; unknown and hidden values
  are rejected.
- The displayed estimate remains advisory and cannot set payment state or a
  trusted server-side invoice amount.

## 5. Validation status

After implementation:

- lint and strict type-check pass;
- 241 unit/integration tests pass across 35 files with no warnings;
- English/Bangla order and services pages and both config APIs return HTTP 200 in
  the local runtime;
- Phase 32 Playwright flows compile and are listed for desktop and mobile.

The sandbox did not contain Playwright's Chromium binary. An installation was
attempted, but the external CDN reset the TLS connection on every mirror. This
is an environment/download limitation, not an application assertion failure;
the browser suite should run in CI or a connected environment with
`npx playwright install chromium`.

## 6. Release boundary

The implementation will be committed, pushed, and proposed to `main` in a Pull
Request. Per the owner's instruction, it must **not be merged** until explicit
permission is given. Consequently, Vercel production deployment and live-site
verification remain intentionally pending. Phase 33 must not begin before that
production gate is approved and verified.
