# 🧑‍💻 Developer Guide

This guide helps developers understand the RahatVerse codebase, set up a local
environment, and follow project conventions.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 |
| Backend | Supabase (Auth + Postgres + Storage + Realtime) |
| Media | Cloudinary |
| Hosting | Vercel |
| State | Zustand |
| i18n | next-intl (Bengali + English) |
| Animation | Framer Motion + GSAP + Lenis |
| Email | Resend |
| Icons | Lucide React |

## Repository Layout

```
src/
├── app/
│   ├── [locale]/            # Localized marketing, auth & dashboard pages
│   ├── api/                 # Route handlers (admin/, newsletter/, analytics/, ...)
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Root redirect -> [locale]
├── components/
│   ├── ui/                  # Base UI primitives
│   ├── layout/              # Navbar, footer, bottom nav
│   ├── sections/            # Page sections
│   ├── three/               # R3F 3D components
│   ├── animations/          # Animation wrappers
│   ├── admin/               # Admin dashboard widgets
│   ├── analytics/           # Tracking + dashboard components
│   └── newsletter/          # Newsletter UI + admin
├── lib/
│   ├── supabase/            # server.ts, client.ts, guards.ts, auth.ts, actions.ts
│   ├── email/               # service.ts, templates.ts (Resend gateway)
│   ├── newsletter/          # tokens.ts, sendCampaign.ts
│   ├── analytics/           # tracker.ts, device.ts, referrer.ts
│   ├── cloudinary/          # utils.ts
│   └── api/                 # validation.ts
├── hooks/                   # Shared React hooks
├── store/                   # Zustand stores
├── i18n/                    # next-intl messages (bn, en)
└── types/                   # TS types incl. database.ts
supabase/                    # SQL migrations + seed
tests/                       # Vitest unit & integration tests
e2e/                         # Playwright end-to-end tests
docs/                        # This documentation set
```

## Local Setup

```bash
git clone <repo-url>
cd Rahatverse01
npm install

# Create your environment file from the template
cp .env.local.example .env.local
# Fill in values (see .env.local.example and docs/DEPLOYMENT_GUIDE.md)

npm run dev          # http://localhost:3000
```

> **Note:** without real `NEXT_PUBLIC_SUPABASE_*` variables the app uses a mock
> client, so most public pages work without a backend. Forms and admin features
> require a real Supabase project.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint check |
| `npm run type-check` | TypeScript check (`tsc --noEmit`) |
| `npm test` | Run unit + integration tests (Vitest) |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:watch` | Run tests in watch mode |
| `npm run e2e` | Run Playwright end-to-end tests |

## Conventions

- **TypeScript strict mode** is enabled. New code must type-check cleanly.
- **Path alias** `@/*` maps to `src/*` (matches `tsconfig.json`).
- **Server-only** modules (e.g. `lib/email/service.ts`) must not be imported from
  client components. Use the `server-only` package guard.
- **Supabase access:** use `createClient()` (cookie-aware, for server components and
  route handlers) or the browser client for client-side work. Never expose
  `SUPABASE_SERVICE_ROLE_KEY` to the client.
- **Authorization** always derives from Supabase's verified user via
  `getCurrentUserContext()` — never trust client-supplied roles/ids.
- **i18n:** user-facing text lives in `src/i18n/messages` (`bn` and `en`). Run
  `npm run lint` after changing locale files.

## Adding a New Feature

1. Update `MASTER_PLAN.md` (feature masterlist).
2. Follow the phase rules — one phase at a time, on its own branch.
3. Add unit/integration tests under `tests/` for any new lib logic or API routes.
4. Run `npm run lint`, `npm run type-check`, `npm test`, `npm run build` before finishing.
5. Document the change in `docs/CHANGELOG.md`.
