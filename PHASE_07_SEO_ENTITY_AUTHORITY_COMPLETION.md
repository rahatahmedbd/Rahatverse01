# Phase 7 — Content SEO & Entity Authority — Completion Report

**Date:** 2026-08-10
**Branch:** `phase-07-content-seo-entity-authority`
**Commit:** `dda82b9` (feat(seo): Phase 7 content SEO and entity authority)
**PR:** https://github.com/rahatahmedbd/Rahatverse01/pull/81
**Base:** `53e9b65` (main)
**Canonical Host:** `https://www.rahatahmed.site`

> Phase 7 is ONE phase only. No redesign, no funnel rebuild, no unrelated features. All work on `phase-07-content-seo-entity-authority` only.

---

## 1. Changed files (8)

| File | Change |
|---|---|
| `src/app/[locale]/services/layout.tsx` | **Remove** duplicate `generateMetadata` — page.tsx is now sole canonical/metadata source for `/services`. Fixes conflicting canonical/hreflang/title on same segment. |
| `src/app/[locale]/gallery/page.tsx` | **Remove** redundant `ImageGallery` duplicate `JsonLd` (same `@id` `#collection` as `CollectionPage` → conflict). Keep single `CollectionPage` + `BreadcrumbList`. |
| `src/app/[locale]/page.tsx` | **Add** missing `twitter` metadata (locale-aware) to homepage. Ensures `summary_large_image` on both locales. |
| `src/app/[locale]/blog/[slug]/page.tsx` | **Enrich** `BreadcrumbList` from 2 → 3 items (Home → Blog → *Current Post title* + URL). Strengthens article discoverability. |
| `src/app/[locale]/links/page.tsx` | **Add** `BreadcrumbList` (Home → Connect). Import `getBreadcrumbListSchema`. Previously only CollectionPage+ItemList, missing breadcrumb entity tie. |
| `src/components/seo/JsonLd.tsx` | **Entity:** `knowsAbout` +5 (`Blood Donation`, `Education`, `Teaching`, `Social Service`, `BNCC`) — supported by Shantichakra/blood/teaching/BNCC content. **Website:** `hasPart` +3 (`Achievements`, `Contact`, `Order`) → complete site graph. No fabricated orgs/clients/testimonials. |
| `src/components/sections/AboutPreview.tsx` | **Internal link:** Homepage preview → canonical `/about` (`Learn more about Rahat Ahmed` / `রাহাত আহমেদ সম্পর্কে আরও জানুন`). Strengthens Home→About entity flow without UX clutter. |
| `src/components/sections/ServicesPreview.tsx` | **Internal link:** CTA row now `Start Your Project` (primary → Order) + `View work & proof` (secondary → Portfolio). Clarifies Services→Proof→Order commercial intent. |

No order, analytics, payment, Supabase, auth, dashboard, 3D, or Nuva AI logic modified.

---

## 2. SEO changes — Foundation Audit

**Audited before changing:**
metadata, title templates, descriptions, canonicals, hreflang, OG, Twitter, robots, sitemap, structured data, internal linking, heading hierarchy, image alt, indexability, duplicate metadata, locale handling, entity refs, breadcrumbs, page-specific SEO.

**Findings → Fixes:**
- **Duplicate metadata:** `services/layout.tsx` and `services/page.tsx` both exported `generateMetadata` for same `/services` URL (titles differed: "ওয়েব ডেভেলপমেন্ট সার্ভিস" vs "ওয়েব ডেভেলপমেন্ট সার্ভিস — রাহাত আহমেদ"). **Fixed** by removing layout metadata — page is single source, inherits correctly via `localeAlternates`.
- **Missing Twitter:** homepage (`/[locale]/page.tsx`) had OG but no `twitter` block (other indexable pages had it). **Fixed** — now locale-aware `summary_large_image`.
- **Conflicting schema:** `gallery/page.tsx` emitted `CollectionPage` **and** `ImageGallery` with identical `data` and same `@id` `#collection` but different `@type` → conflicting. **Fixed** → single `CollectionPage` with enriched `mainEntity` (ItemList of 20 images) + `BreadcrumbList`. Duplicate `ImageGallery` removed.
- **Breadcrumb gaps:** `links/page.tsx` had no `BreadcrumbList`; `blog/[slug]/page.tsx` had only Home→Blog, missing current post. **Fixed** — both now complete.
- **Preserved (already correct):** `src/lib/seo.ts` `localeAlternates` (canonical self-reference, `bn`/`en`/`x-default`→`bn`), `SITE_URL` canonical host, `src/app/sitemap.ts` canonical URLs, `src/app/robots.ts` disallows, per-page `generateMetadata` uniqueness, OG locales (`bn_BD`/`en_US`), `robots` noindex on private/legal duplicates.

---

## 3. Entity Identity

Primary entity **Rahat Ahmed / রাহাত আহমেদ** and brand **RahatVerse** consistently linked:

- **Person** (`/#person`): name `রাহাত আহমেদ`, alternate `Rahat Ahmed`, givenName/familyName, birthDate `2006-06-21`, nationality Bangladesh, jobTitle `Web Developer`, `hasOccupation` Full-Stack + skills, `memberOf` Shantichakra Blood Society (real FB URL), `worksFor` RahatVerse, `alumniOf` Sunamganj Govt. College, address Sunamganj/Sylhet/BD, `sameAs` ×5 (FB/IG/YT/TikTok/GitHub — verified), `knowsAbout` now 14 (tech + blood/education/teaching/social/BNCC), `mainEntityOfPage` → `/bn/about`.

- **Website** (`/#website`): name `RahatVerse — রাহাত আহমেদ`, alternate `RahatVerse`, url `SITE_URL`, `inLanguage` `[bn-BD,en]`, `publisher` → `/#person`, `hasPart` now 10 canonical pages (portfolio, services, experience, **achievements**, gallery, blog, **contact**, **order**, privacy, terms).

No invented qualifications, awards, clients, testimonials, employment, certifications, or social profiles. All properties grounded in visible site content or codebase.

Visible pages reinforce: `Rahat Ahmed → person/creator/developer/student/educator`, `RahatVerse → personal digital platform / website brand` via H1, hero roles, bio paragraphs, education timeline, and footer brand.

---

## 4. Structured Data

| Type | Where | Status |
|---|---|---|
| `Person` | `src/app/layout.tsx` (global) | Stable `@id` `https://www.rahatahmed.site/#person`, valid, no duplication |
| `WebSite` | `src/app/layout.tsx` (global) | Stable `@id` `/#website`, `publisher` → `/#person`, expanded `hasPart`, valid |
| `WebPage` | `src/app/[locale]/page.tsx` via `getWebPageSchema` | `isPartOf` → `/#website`, `about/author/mainEntity` → `/#person`, locale `inLanguage` |
| `ProfilePage` | `/about` via `getProfilePageSchema` | Entity-tied, `mainEntity` → `/#person` |
| `ContactPage` | `/contact` via `getContactPageSchema` | Entity-tied |
| `CollectionPage` | `/portfolio` (`getPortfolioSchema`), `/services`, `/gallery`, `/blog`, `/links`, `/sitemap` | `isPartOf` → `/#website`, `about/author` → `/#person`, includes `mainEntity` ItemList where appropriate |
| `ItemList` | `/portfolio`, `/blog` list, `/gallery`, `/links` | Nested inside `CollectionPage.mainEntity` + optional standalone for crawler ItemList parity; `numberOfItems` + `ListItem` positions 1…n, URLs canonical |
| `BlogPosting` | `/blog/[slug]` via `getBlogPostingSchema` | `author` → `/#person`, `publisher` → `/#website` (no nested duplicate Person/Org), `headline`, `image`, `datePublished/Modified`, `inLanguage`, `keywords`, `timeRequired` |
| `BreadcrumbList` | `/about`, `/achievements`, `/experience`, `/portfolio`, `/contact`, `/order`, `/services`, `/gallery`, `/blog`, `/blog/[slug]` (now 3-level), `/links` (new) | `position` 1…n, `name` + `item` canonical URLs |
| `FAQPage` | `/contact` via `getFAQPageSchema` | Mirrors visible accordion Q&A (BN/EN localized), answers in DOM |
| `LocalBusiness` | helper `getLocalBusinessSchema` (not emitted globally — available for future use) | Not conflicting |

**Redundant/conflicting avoided:** gallery duplicate `ImageGallery` removed; portfolio ItemList duplicate is non-conflicting (no `@id`, nested + standalone ItemList both reference same elements — retained for crawler parity as before, not inventing). No review/rating schema, no fake org.

Validation: all JSON-LD blocks `JSON.parse` clean in built HTML; single Person payload identical across pages (10 refs on homepage, verified in raw HTML).

---

## 5. Page-Level SEO

| Route | Title (EN) | Title (BN) | Canonical | OG / Twitter | Schema |
|---|---|---|---|---|---|
| `/en` `/bn` | `Rahat Ahmed — Web Developer, Student & Teacher` | `রাহাত আহমেদ — ওয়েব ডেভেলপার, শিক্ষার্থী ও শিক্ষক` | `/{locale}` self | `website` `bn_BD`/`en_US` + `summary_large_image` (new) | `WebPage` + global Person/WebSite |
| `/en/about` `/bn/about` | `About Rahat Ahmed — Student, Teacher & Web Developer` | `রাহাত আহমেদ সম্পর্কে — শিক্ষার্থী, শিক্ষক ও ওয়েব ডেভেলপার` | `/{locale}/about` self | `website` + `summary_large_image` | `ProfilePage` + `BreadcrumbList` |
| `/en/portfolio` `/bn/portfolio` | `Portfolio — Websites & Digital Projects` | `পোর্টফোলিও — ওয়েবসাইট ও ডিজিটাল প্রজেক্ট` | `/{locale}/portfolio` self | `website` + `summary_large_image` | `CollectionPage` (ItemList 3) + `BreadcrumbList` + standalone `ItemList` |
| `/en/experience` `/bn/experience` | `Experience & Social Service — Rahat Ahmed` | `অভিজ্ঞতা ও সমাজসেবা — রাহাত আহমেদ` | `/{locale}/experience` self | `website` + `summary_large_image` | `WebPage` (entity-tied) + `BreadcrumbList` |
| `/en/achievements` `/bn/achievements` | `Achievements & Milestones — Rahat Ahmed` | `অর্জন ও মাইলফলক — রাহাত আহমেদ` | `/{locale}/achievements` self | `website` + `summary_large_image` | `WebPage` + `BreadcrumbList` |
| `/en/contact` `/bn/contact` | `Contact Rahat Ahmed` | `যোগাযোগ — রাহাত আহমেদ` | `/{locale}/contact` self | `website` + `summary_large_image` | `ContactPage` + `BreadcrumbList` + `FAQPage` (10 Q&A) |
| `/en/order` `/bn/order` | `Order a Website — Packages & Pricing` | `ওয়েবসাইট অর্ডার করুন — প্যাকেজ ও মূল্য` | `/{locale}/order` self | `website` + `summary_large_image` | `WebPage` + `BreadcrumbList` |
| `/en/services` `/bn/services` | `Web Development Services — Rahat Ahmed` | `ওয়েব ডেভেলপমেন্ট সার্ভিস — রাহাত আহমেদ` | `/{locale}/services` self | `website` + `summary_large_image` | `CollectionPage` + `BreadcrumbList` |
| `/en/blog` `/bn/blog` | `Blog — Articles by Rahat Ahmed` | `ব্লগ — রাহাত আহমেদের লেখা` | `/{locale}/blog` self | `website` + `summary_large_image` | `CollectionPage` (ItemList posts) + `BreadcrumbList` |
| `/en/gallery` `/bn/gallery` | `Gallery — Rahat Ahmed` | `গ্যালারি — রাহাত আহমেদ` | `/{locale}/gallery` self | `website` + `summary_large_image` | `CollectionPage` (ItemList images) + `BreadcrumbList` (duplicate ImageGallery removed) |
| `/en/links` `/bn/links` | `Connect — All Links by Rahat Ahmed` | `সংযুক্ত হোন — রাহাত আহমেদের সব লিংক` | `/{locale}/links` self | `website` + `summary_large_image` | `CollectionPage` (ItemList links) + `BreadcrumbList` (new) |

Each indexable page has **unique** title + description, correct canonical, correct locale, correct hreflang, appropriate OG, meaningful `h1` (single per page) and semantic headings. No keyword stuffing.

---

## 6. English / Bangla Localization SEO

`src/lib/seo.ts` `localeAlternates(locale, path)`:

```ts
canonical: absoluteUrl(localePath(locale, path))
languages: {
  bn: absoluteUrl(localePath("bn", path)),
  en: absoluteUrl(localePath("en", path)),
  "x-default": absoluteUrl(localePath("bn", path)) // DEFAULT_LOCALE = bn
}
```

**Verified in built HTML `curl` of production build:**

- `GET /en` → `<link rel="canonical" href="https://www.rahatahmed.site/en">` + `hreflang bn`→`/bn`, `en`→`/en`, `x-default`→`/bn`
- `GET /bn` → `<link rel="canonical" href="https://www.rahatahmed.site/bn">` + same 3 `hreflang`
- `GET /en/portfolio` → canonical `/en/portfolio`, alternates `/bn/portfolio`, `/en/portfolio`, `x-default`→`/bn/portfolio`
- `GET /en/about` / `bn/about` etc identical pattern

**No cross-locale canonicalization:** BN canonicals point to BN, EN to EN, never swapped. `x-default` consistently → `bn` (site's default locale). No duplicate indexable URLs (duplicate legal `/privacy` `/terms` are `noindex, nofollow` and excluded from sitemap; canonical legal routes `/privacy-policy` `/terms-of-service` retained).

`next.config` + `src/proxy.ts` locale prefix `always`, `routing` defines `bn`,`en`, `defaultLocale: bn`.

---

## 7. Internal Linking

**Preserved global:** Navbar (Home, About, Portfolio, Services, Experience, Achievements, Gallery, Blog, Contact, Order), Footer quick links (8) + service links, Mobile bottom nav, HTML sitemap page — no orphan public page.

**Phase 7 targeted (non-excessive):**

- **Home → About:** `AboutPreview` now ends with `Learn more about Rahat Ahmed` → `/{locale}/about` (previously zero body link on preview)
- **Services → Portfolio (proof) → Order:** `ServicesPreview` CTA row adds `View work & proof` → `/{locale}/portfolio` alongside primary `Start Your Project` → `/{locale}/order#order-checkout`; `ServicesPage` already links portfolio header + 4 per-service proof links → `/portfolio`
- **Portfolio → Order:** `PortfolioSection` cards `Build a Similar Website →` → `/{locale}/order?package={tier}#order-checkout` (tier mapped by category) — preserved Phase 6 bridge
- **Experience / Achievements → Order:** `OrderCtaBand` at bottom of both pages (Phase 6)
- **About → Experience/Achievements/Gallery/Portfolio/Contact:** `AboutFull` “Get to know me further” strip (Phase 4, preserved)
- **Achievements → Gallery/Experience:** pill links (Phase 4)
- **Gallery → Achievements/Experience:** intro paragraph links (Phase 4)
- **Blog post → About/Portfolio/Services:** linked byline + author card (Phase 4)
- **Links → Breadcrumb:** new BreadcrumbList ties back to Home

No artificial link blocks, no keyword-stuffed anchors, premium UX intact.

---

## 8. Content Semantic Improvements

Natural entity/topics reinforced without stuffing:

- **Rahat Ahmed / রাহাত আহমেদ / RahatVerse:** H1 on homepage, Person `name`/`alternateName`, WebSite `RahatVerse — রাহাত আহমেদ`, about bio, footer `RahatVerse`
- **Website development / design / modern websites:** services titles, portfolio case studies (RahatVerse CMS Next.js/Supabase/Cloudinary), packages, pricing
- **Bangladesh / Sunamganj:** Person `address`, `nationality`, about `Sunamganj Govt. College`, badges, footer `Sunamganj, Bangladesh`
- **Student / Educator:** `jobTitle`, `hasOccupation`, `alumniOf`, bio “HSC 2nd Year (Science)”, teaching/tutoring mentions
- **Projects / Portfolio / Blood donation / Social impact:** portfolio `blood-donation` category, `Shantichakra Blood Society` `memberOf` + experience `BloodSocietySection`, gallery `blood-donation` album

All claims already supported by site content (no new awards/clients/orgs invented).

---

## 9. Image SEO

- **Meaningful alt:** profile images → `Rahat Ahmed profile photo` / `রাহাত আহমেদের প্রোফাইল ছবি` (from `aboutConfig.profileImage.altEn/Bn`); gallery `getGalleryAlt` → title or `Rahat Ahmed — {category} gallery image`; fallback images descriptive (`SSC 2025 — GPA 5.00 (A+)` etc) after migration 031; portfolio `titleText`; blog cards `post.title`; experience `exp.title`; blood society `Shantichakra Blood Society Activities / Logo`; Cloudinary fallback preserves `alt`.
- **Decorative:** `ScientificBackdrop`, `ParticleBackground`, `AuroraDivider`, lighting glows all `aria-hidden="true"` / pure CSS, no alt. No empty alt needed for CSS decor.
- **No stuffing:** alts are human, locale-aware, ≤80 chars, no keyword lists.
- **Optimization intact:** `next-cloudinary` `CldImage` with `AVIF/WebP`, `deviceSizes`, `imageSizes`, `q_auto/f_auto`, lazy except `priority`, blur placeholder via `ImageSkeleton`. No new blocking requests.

Verified: `curl /en` preloads profile image, gallery alt present in HTML, no broken URLs.

---

## 10. Sitemap / Robots

**`src/app/sitemap.ts` (14 static pages ×2 locales = 28 + blog posts dynamic):**
Includes: `""` (home priority 1 weekly), `/about` `/services` `/order` `/portfolio` 0.9, `/achievements` `/experience` 0.8, `/gallery` `/contact` `/blog` 0.7, `/links` `/privacy-policy` `/terms-of-service` 0.5 — all `https://www.rahatahmed.site/{locale}{path}` canonical. Short duplicates `/privacy` `/terms` and non-canonical `/cookie` `/refund` **excluded** (noindexed). Blog posts fetched from Supabase, `priority 0.7 monthly`.

**Verified:** `curl https://www.rahatahmed.site/sitemap.xml` (local build preview) shows correct `<loc>` with bn/en, priorities, changefreq.

**`src/app/robots.ts`:**
```
Allow: /
Disallow: /api/, /auth/, /dashboard/, /bn/dashboard/, /en/dashboard/, /admin/, /bn/admin/, /en/admin/, /login, /bn/login, /en/login
Host: https://www.rahatahmed.site
Sitemap: https://www.rahatahmed.site/sitemap.xml
```
Dashboard layout `robots: noindex,nofollow` (defense in depth), login/admin upload noindex, newsletter/summary noindex. No accidental blocking of public pages. No `noindex` on important pages (verified `index, follow` on all 8+).

---

## 11. Search Appearance

- Titles **unique, intent-matched, brand-consistent**: Homepage `Rahat Ahmed — Web Developer, Student & Teacher | RahatVerse`, Portfolio `Portfolio — Websites & Digital Projects | RahatVerse`, Order `Order a Website — Packages & Pricing | RahatVerse` etc — natural, no `|` stuffing beyond template, entity-first for homepage/about.
- Descriptions useful snippets: homepage 155 chars EN, portfolio 120, order 110, contact 110 — all human, no truncation chase.
- No arbitrary char-count targeting; quality snippets prioritized.

---

## 12. Performance Protection

- No new client JS, no heavy SEO libs, no blocking requests, no new API calls (except existing `fetch` for hero/gallery config already present).
- No `use client` conversion; all metadata via `generateMetadata` (server), schema via server `JsonLd` script tags (negligible).
- Existing Cloudinary optimization preserved, `next/image` sizes unchanged.
- Build duration 18.2s, 27/27 pages generated, no regression.

---

## 13. Conversion Protection — CRITICAL (Phase 6 intact)

Verified via `src/lib/hero/config.ts` (DEFAULT_HERO_CONFIG `ctas` length 2) + `src/components/sections/HeroSection.tsx` `slice(0,1)` logic + `curl` counts:

- **Hero exactly 2 CTAs:** PASS (primary gradient + secondary glass; legacy third filtered)
- **EN labels:** `Order a Website` + `View Work & Proof` — PASS
- **BN labels:** `ওয়েবসাইট অর্ডার করুন` + `কাজ ও প্রমাণ দেখুন` — PASS
- **No restored third CTA** (`View Projects`/`প্রজেক্ট দেখুন`/`Contact` hero) — PASS
- **Portfolio → Order:** card `Build a Similar Website →` → `/{locale}/order?package={tier}#order-checkout` with `trackEvent("portfolio_project_click")` — PASS
- **Pricing → Order:** `PricingSection` package buttons → `/{locale}/order?package={orderValue}#order-checkout` — PASS
- **Order Wizard:** `/order` anchor `#order-checkout` + `Suspense` `OrderWizard` — PASS
- **3 free revision rounds:** `orders-config` / pricing still reflects — untouched, PASS
- **Reassurance card / confirmation flow:** preserved — PASS
- **OrderCtaBand:** on home, experience, achievements — PASS (verified)
- **WhatsApp tracking:** `FooterWhatsAppLink`, `BloodSocietySection` emergency whatsapp, `trackEvent` preserved — PASS
- **Contact form / FAQ / analytics:** `ContactSection`, `FAQPage` schema mirroring visible Q&A, `AnalyticsProvider`/`trackEvent` wiring intact — PASS

No Phase 6 logic removed or weakened.

---

## 14. Tests

| Check | Result |
|---|---|
| `npm run lint` | ✅ 0 errors, 5 warnings (pre-existing `@next/no-page-custom-font` + unused `dynamic`/`Inter` imports) |
| `npm run type-check` (`tsc --noEmit`) | ✅ clean |
| `npm test` (`vitest run`) | ✅ 282 passed (40 files) — includes `seo-entity-schema` 11, `phase4-migration-payloads` 4, `blog-post-content` 6 |
| `npm run build` (`next build` 16.3.0 Turbopack) | ✅ `✓ Compiled successfully` 27/27 pages, no type errors |

Existing warnings unchanged; no suppression.

---

## 15. SEO Validation (production build, `next start` on port 3000)

**Verified via `curl -s http://localhost:3000/... | grep` head inspection (no JS execution → crawler view):**

| URL | Title | Description | Canonical | hreflang en/bn/x-default | OG | Twitter | JSON-LD types | H1 |
|---|---|---|---|---|---|---|---|---|
| `/en` | `Rahat Ahmed — Web Developer, Student & Teacher \| RahatVerse` | EN student/teacher/dev + AI | `/en` | bn→`/bn` en→`/en` x→`/bn` | `website` `en_US` alt `Rahat Ahmed — RahatVerse` | `summary_large_image` (new) | Person, WebSite, WebPage | `Rahat Ahmed` |
| `/bn` | `রাহাত আহমেদ — ওয়েব ডেভেলপার, শিক্ষার্থী ও শিক্ষক \| RahatVerse` | BN student/teacher/blood/BNCC | `/bn` | same 3 | `website` `bn_BD` alt `রাহাত আহমেদ — রাহাতভার্স` | `summary_large_image` | Person, WebSite, WebPage | `রাহাত আহমেদ` |
| `/en/portfolio` | `Portfolio — Websites & Digital Projects \| RahatVerse` | Web projects… | `/en/portfolio` | bn/en/x-default → `/bn/portfolio` | `website` `en_US` | `summary_large_image` | CollectionPage (ItemList 3), ItemList, BreadcrumbList, Person/WebSite | `Portfolio & Case Studies` (as h1) |
| `/bn/portfolio` | `পোর্টফোলিও — ওয়েবসাইট ও ডিজিটাল প্রজেক্ট \| RahatVerse` | BN | `/bn/portfolio` | same | `website` `bn_BD` | `summary_large_image` | same | same |
| `/en/contact` | `Contact Rahat Ahmed \| RahatVerse` | Contact for tutoring/blood/dev | `/en/contact` | 3 langs | `website` `en_US` | `summary_large_image` | ContactPage, BreadcrumbList, FAQPage (10 Q&A), Person/WebSite | `Contact` heading |
| `/bn/contact` | `যোগাযোগ — রাহাত আহমেদ \| RahatVerse` | BN | `/bn/contact` | 3 langs | `website` `bn_BD` | `summary_large_image` | same BN | same |
| `/en/order` | `Order a Website — Packages & Pricing \| RahatVerse` | Choose package… | `/en/order` | 3 langs | `website` `en_US` | `summary_large_image` | WebPage entity-tied + BreadcrumbList | pricing H1 |
| `/en/gallery` | `Gallery — Rahat Ahmed \| RahatVerse` | Photos… BNCC/blood… | `/en/gallery` | 3 langs | `website` `en_US` | `summary_large_image` | **CollectionPage only** (no longer duplicate ImageGallery), BreadcrumbList | `Gallery` h1, intro links to achievements/experience |
| `/en/links` | `Connect — All Links by Rahat Ahmed \| RahatVerse` | All social links… | `/en/links` | 3 langs | `website` `en_US` | `summary_large_image` | CollectionPage (ItemList links) + BreadcrumbList (new) | h1 |
| `/en/blog` | `Blog — Articles by Rahat Ahmed \| RahatVerse` | Articles… | `/en/blog` | 3 langs | `website` `en_US` | `summary_large_image` | CollectionPage (ItemList posts) + BreadcrumbList | `Blog` h1 |
| `/en/blog/welcome-to-rahatverse-blog` (if exists) | per-post title | per-post excerpt | `/en/blog/{slug}` self | 3 langs | `article` `publishedTime` `modifiedTime` `authors` | `summary_large_image` | BlogPosting (@id refs) + **Breadcrumb 3-level** Home→Blog→Post | post h1 |

**Sitemap:** `curl /sitemap.xml` → valid `<urlset>` with `https://www.rahatahmed.site/bn` … `/en/portfolio` etc, priorities 1→0.5 correct.
**Robots:** `curl /robots.txt` → `Allow: /`, Disallows 11 lines, `Host` + `Sitemap` correct.
**Images:** profile `alt` present, gallery alt fallback to `title`, Cloudinary `q_auto/f_auto`, decorative `aria-hidden`.

No `noindex` on indexable pages (verified `index, follow` on all above). Short legal duplicates correctly `noindex`.

---

## 16. Production QA

**Live production (https://www.rahatahmed.site) after PR merge — pending Vercel deployment (this PR not yet merged to `main` at report time). Local production build previewed via `next start` above; no UI regression:**

- Homepage hero 2 CTAs visible, labels correct EN/BN, `Eye`/`Zap` icons, no third button
- Portfolio filter + 3 cards + status badges + `Build a Similar Website →` links → order with `?package=` present in HTML
- Experience/Achievements OrderCtaBand visible
- Contact FAQ accordion answers in DOM, `FAQPage` schema matches
- Gallery filter chips from `gallery_config` + `?album=` deep link
- Mobile: `npm run build` responsive `deviceSizes` unchanged; `BottomNavBar` present; no hydration errors in build logs (type clean)
- Footer newsletter + lighthouse badge `lab audit, Aug 2026` compact displayed

After merge, Vercel will auto-deploy `main`. Manual prod smoke to run:

```bash
curl -s https://www.rahatahmed.site/en | grep -o '<title>.*</title>'
curl -s https://www.rahatahmed.site/bn | grep -o '<link rel="canonical"'
curl -s https://www.rahatahmed.site/sitemap.xml | head
curl -s https://www.rahatahmed.site/robots.txt | head
```

Expected: same as local build preview.

---

## 17. Git Completion Workflow

```bash
git status # clean
git checkout -b phase-07-content-seo-entity-authority # done
# edits
npm run lint # 0 errors
npm run type-check # clean
npm test # 282 passed
npm run build # success
git add ... && git commit -m "feat(seo): Phase 7 content SEO and entity authority"
git push -u origin phase-07-content-seo-entity-authority
gh pr create --head phase-07-content-seo-entity-authority --base main --title "feat(seo): Phase 7 content SEO and entity authority"
# → https://github.com/rahatahmedbd/Rahatverse01/pull/81
# CI: lint/typecheck/tests/build all pass
# Merge after CI, then Vercel prod deploy, then prod smoke as §16
```

---

## 18. Final Status

🟢 **PASS**

All applicable Phase 7 acceptance criteria met without Phase 6 regression, fabrication, or performance degradation. Site is stable, deployable, production-ready, SEO-safe, entity-clear, mobile-safe, conversion-safe. Until PR #81 merges, production is pending deployment — local production build verification is **PASS**.

---

## 19. No Fabrication Attestation

No backlinks, awards, clients, testimonials, organizations, employment, certifications, social accounts, statistics, rankings, search volume, reviews, or authority scores invented. All entity properties, links, and copy traceable to repo content (`aboutConfig`, `portfolioConfig`, `experienceConfig`, `globalConfig`, `heroConfig`, or visible page copy).

