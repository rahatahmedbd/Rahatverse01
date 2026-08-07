# 🌌 RahatVerse 2.0

> সর্বোচ্চ মানের ইন্টারঅ্যাকটিভ পোর্টফোলিও ও ওয়েবসাইট অর্ডারিং প্ল্যাটফর্ম
> — The ultimate interactive portfolio & website-ordering platform.

RahatVerse is a fully-featured, bilingual (বাংলা + English) interactive portfolio
and business platform built with Next.js, Supabase, Cloudinary, and Vercel. It
includes a gamified interactive experience, a website-ordering system, an admin
dashboard, analytics, a double opt-in newsletter, and transactional email.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 |
| **Backend** | Supabase (Auth + Postgres + Storage + Realtime) |
| **Media** | Cloudinary |
| **Email** | Resend |
| **Hosting** | Vercel |
| **State** | Zustand |
| **i18n** | next-intl (বাংলা + English) |
| **Animation** | Framer Motion + GSAP + Lenis |
| **Icons** | Lucide React |

## ✨ Key Features

- **Interactive experience** — 3D scenes, scroll animations, custom cursor, ambient
  sound, XP/level gamification, day/night themes, theme customizer.
- **Ordering platform** — multi-step website order wizard, pricing comparison,
  real-time order tracking, WhatsApp integration, payments (bKash/Nagad/SSLCommerz).
- **Content** — bilingual blog CMS, gallery, portfolio case studies, testimonials,
  resources, booking/appointment system.
- **Admin dashboard** — real-time stats, system health, RBAC user management, audit
  log, settings, blog CMS, comment moderation, notifications, export, system logs.
- **Analytics** — GA4 + first-party tracking, Core Web Vitals, device/geo/referrer
  breakdowns, CSV export.
- **Newsletter** — double opt-in, preferences, campaigns, unsubscribe, delivery tracking.
- **Email notifications** — welcome, order confirmation, contact, campaign emails
  via Resend with a signed delivery webhook.
- **Security & SEO** — RLS, server-side auth, input validation, rate limiting,
  metadata, structured data, sitemap.

## 📂 Project Structure

```
src/
├── app/
│   ├── [locale]/          # Multi-language routes (marketing, auth, dashboard)
│   ├── api/               # Route handlers (admin/, newsletter/, analytics/, ...)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Root redirect
├── components/
│   ├── ui/                # Base UI primitives
│   ├── layout/            # Navbar, footer, bottom nav
│   ├── sections/          # Page sections
│   ├── three/             # 3D components (R3F)
│   ├── animations/        # Animation wrappers
│   ├── admin/             # Admin dashboard widgets
│   ├── analytics/         # Tracking + dashboard
│   └── newsletter/        # Newsletter UI + admin
├── lib/
│   ├── supabase/          # server.ts, client.ts, guards.ts, auth.ts, actions.ts
│   ├── email/             # service.ts, templates.ts (Resend gateway)
│   ├── newsletter/        # tokens.ts, sendCampaign.ts
│   ├── analytics/         # tracker.ts, device.ts, referrer.ts
│   ├── cloudinary/        # utils.ts
│   └── api/               # validation.ts
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state management
├── i18n/                  # Translations (bn, en)
└── types/                 # TypeScript definitions
supabase/                  # SQL migrations + seed
tests/                     # Vitest unit & integration tests
e2e/                       # Playwright end-to-end tests
docs/                      # Documentation
```

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Fill in Supabase, Cloudinary, Resend values (see docs/DEPLOYMENT_GUIDE.md)

# 3. Run the dev server
npm run dev          # http://localhost:3000

# 4. Validate & test
npm run lint
npm run type-check
npm test
npm run build
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint check |
| `npm run type-check` | TypeScript check |
| `npm test` | Unit + integration tests (Vitest) |
| `npm run test:coverage` | Tests with coverage report |
| `npm run e2e` | Playwright end-to-end tests |

## 📚 Documentation

See the **[docs/](docs/README.md)** folder:

| Doc | Description |
|-----|-------------|
| [User Guide](docs/USER_GUIDE.md) | How to use the website |
| [Developer Guide](docs/DEVELOPER_GUIDE.md) | Architecture, setup, conventions |
| [API Reference](docs/API_REFERENCE.md) | All HTTP endpoints |
| [Testing Guide](docs/TESTING.md) | Running unit/integration/E2E tests |
| [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) | Vercel + Supabase + Cloudinary + Resend |
| [Security](docs/SECURITY.md) | Threat model & controls |
| [Accessibility](docs/ACCESSIBILITY.md) | WCAG 2.1 AA notes |
| [SEO](docs/SEO.md) | Metadata, structured data, sitemap |
| [Troubleshooting](docs/TROUBLESHOOTING.md) | Common issues & fixes |
| [Contributing](docs/CONTRIBUTING.md) | How to contribute |
| [Changelog](docs/CHANGELOG.md) | Version history |
| [Master Plan](MASTER_PLAN.md) | Full roadmap & feature list |

## 🗺️ Development Phases

| Phase | Name | Description |
|-------|------|-------------|
| 01–18 | Genesis → Crown Jewel | Foundation, interactivity, business features (see `MASTER_PLAN.md`) |
| 19 | Image Migration | Cloudinary image infrastructure |
| 20 | Profile Images | Profile photo integration |
| 21 | Gallery Upload | Gallery images upload |
| 22 | Services & Portfolio | Services/portfolio enhancement |
| 23 | Blog System | Bilingual blog system |
| 24 | Search Functionality | Site-wide real-time search |
| 25 | Security & SEO | RLS hardening + SEO fixes |
| 26 | Advanced Analytics | GA4 + first-party tracking + dashboard |
| 27 | Newsletter System | Double opt-in + campaigns + admin |
| 28 | Admin Dashboard | Real-time stats, health, RBAC, CMS, comments, notifications, export, logs |
| 29 | Email Notification System | Resend transactional delivery, signed webhooks, delivery dashboard, scheduled campaigns |
| 30 | **Final Testing & Documentation** | Testing suite, docs, optimization ✅ |
| Custom 1–2 | 100% Admin Control Foundation | Core access/settings and Hero CMS ✅ |
| Custom 3 | **About, Education & Achievements CMS** | Bilingual biography, timeline, awards, profile media ✅ |
| Custom 4 | **Services & Interactive Pricing CMS** | Service cards, website types, packages (BDT/USD), comparison matrix, process timeline ✅ |
| Custom 5 | **Client Orders, Kanban & Payments** | Wizard config CMS, Kanban pipeline, admin notes/files, payment tracking ✅ |
| Custom 6 | **Experience, Blood Society & Memorial CMS** | Experience timeline, blood-society command hub, incoming blood requests, memorial tribute ✅ |
| Custom 7 | **Media Library, Gallery & Video CMS** | Cloudinary media manager, album gallery CMS, video showcase CMS ✅ |
| Custom 8 | **Bilingual Blog & Comment Moderation** | Blog settings/categories CMS, admin-reply comment moderation ✅ |
| Custom 9 | **Contact, Bookings & Testimonials** | Messages inbox, booking calendar, testimonial manager, contact settings CMS ✅ |
| Custom 10 | **Link Hub, Tools & Resume CMS** | Link cards + click tracking, tool recommendations, CV manager ✅ |
| Custom 11 | **Newsletter & Email CMS** | Newsletter section/topics CMS, topic-preference signup ✅ |
| Custom 12 | **Theme, XP & Audio CMS** | Theme presets, XP rules/levels, ambient audio, effect toggles ✅ |
| Custom 13 | **Search, FAQ & Legal CMS** | Search weights, FAQ accordion CMS, legal policy pages ✅ |

## 👤 Author

**Rahat Ahmed** — রাহাত আহমেদ
- 📍 Sunamganj, Bangladesh
- 🎓 HSC Student (Science)
- 💻 Web Developer
- 🩸 Blood Donor (A+)
- 🎖️ BNCC Cadet

## 📄 License

Private project. All rights reserved.
