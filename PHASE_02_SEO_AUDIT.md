# PHASE 2 — PAGE-LEVEL SEO AUDIT

**Audit type:** Read-only analysis (no code changes, no deployment)
**Site:** https://www.rahatahmed.site
**Primary SEO entity:** Rahat Ahmed
**Canonical host:** `https://www.rahatahmed.site`
**Framework:** Next.js 16 (App Router) + next-intl (`/en`, `/bn`, `localePrefix: "always"`)
**Date:** 2026-08-09

> This report is the Phase 2 deliverable. It contains findings and recommendations only.
> **No files were modified, no commit, no push, no PR, no merge, no deployment.**

---

## 0. HOW THIS AUDIT WAS PERFORMED

- Static analysis of the Next.js source (`src/app`, `src/lib`, `src/components`).
- Live verification of rendered `<title>` and page content on production for key routes via the web fetcher.
- Note: the sandbox cannot `curl` the production host directly (outbound blocked), so `<head>` meta inspection relied on the fetcher (which returns rendered titles) plus deterministic server-rendered metadata from the code. Canonical/hreflang/OG behavior is derived from the metadata generators in code.

---

## 1. OVERALL PHASE 2 SEO HEALTH — SUMMARY

The site has a **solid SEO foundation** already in place:

| Area | Status |
|---|---|
| `metadataBase` | ✅ Set in root layout to `SITE_URL` |
| Canonical URLs | ✅ Correct absolute `https://www.rahatahmed.site/{locale}/...` via `localeAlternates` |
| hreflang (`bn`, `en`) | ✅ Emitted per page via `alternates.languages` |
| x-default | ✅ Set to `/bn` via `alternates` |
| robots / indexability | ✅ Default `index,follow`; dashboards/api/auth correctly noindexed/disallowed |
| Homepage (Phase 1) | ✅ Optimized (title, desc, OG, WebPage + global Person/WebSite schema) |
| Blog post pages | ✅ Strong (title, desc, OG article, twitter, BlogPosting schema) |
| services + portfolio | ✅ Have page-specific titles/descriptions |
| Legal canonical pages | ✅ privacy-policy / terms-of-service have titles |

### ⚠️ CRITICAL CROSS-CUTTING DEFECT

**Duplicate titles & descriptions on most public pages.** The metadata generators for `/about`, `/achievements`, `/experience`, `/gallery`, `/blog`, `/contact`, `/order`, `/links`, `/privacy`, `/terms`, `/newsletter`, `/login`, and the blog **list** page return **only `alternates`** (no `title`/`description`). They therefore inherit the `[locale]/layout.tsx` **default** title/description — the exact same string as the homepage:

- EN: `Rahat Ahmed — Web Developer, Student & Teacher | RahatVerse`
- BN: `রাহাত আহমেদ — ওয়েব ডেভেলপার, শিক্ষার্থী ও শিক্ষক | RahatVerse`

Live confirmation: `/bn`, `/en/about`, `/en/blog`, `/en/contact` (and by construction `/en/experience`, `/en/achievements`, `/en/gallery`, `/en/order`) all render the **identical** `<title>` and default description.

This is the single most important Phase 2 issue: nearly every important public page is competing with the homepage (and each other) for the same title/description, destroying page-level uniqueness and click relevance.

---

## 2. PAGE-BY-PAGE AUDIT

### 2.1 `/about` (EN + BN)

- **Search intent:** Personal identity / background of Rahat Ahmed.
- **Current title:** `Rahat Ahmed — Web Developer, Student & Teacher | RahatVerse` (inherited default — **duplicate**).
- **Current description:** Inherited default ("Rahat Ahmed is a student, teacher and web developer…") — **duplicate**.
- **Current H1:** ❌ **Missing.** Page renders `AboutFull` → `SectionTitle` (**H2** "About Me"), then `EducationTimeline` (**H2**), `PerformanceReport`. No H1 on the page.
- **Canonical:** ✅ `https://www.rahatahmed.site/{locale}/about`.
- **hreflang / x-default:** ✅ present.
- **OG / twitter:** ❌ Not page-specific (inherits site-level OG/twitter).
- **Structured data:** No page-level `AboutPage`/`ProfilePage` schema. (Global Person/WebSite appear on every page via root layout.)
- **Indexable:** Yes — should remain indexed.
- **Priority:** Critical (title/description), High (missing H1).

### 2.2 `/services` (EN + BN)

- **Search intent:** Web development / digital services offered by Rahat Ahmed.
- **Current title:** `Web Development Services | RahatVerse` ✅ unique.
- **Current description:** "Professional web development packages, portfolio sites, and full-featured e-commerce solutions built with Next.js and Supabase." ✅ good (set in `services/layout.tsx`).
- **Current H1:** ✅ `<h1>` "What I Build" / "আমি যা তৈরি করি".
- **Canonical / hreflang / x-default:** ✅ present.
- **OG / twitter:** ❌ Not page-specific.
- **Structured data:** ❌ No `Service` / `Offer` / `ItemList` / `FAQPage` schema (FAQ-style content exists on contact, not here). No `Service` schema.
- **Indexable:** Yes.
- **Priority:** Medium (add OG/twitter + Service schema). Title/desc already good.

### 2.3 `/portfolio` (EN + BN)

- **Search intent:** Projects / websites developed by Rahat Ahmed.
- **Current title:** `Portfolio & Experience | RahatVerse` ✅ unique (but mixes "Experience" into the title).
- **Current description:** "Rahat Ahmed's projects, case studies, experience and personal information." ✅ ok.
- **Current H1:** ❌ **Missing.** `PortfolioSection` uses an **H2** ("Ready to Transform Your Idea…"); the page then repeats About/Experience sections (also H2). No H1.
- **Canonical / hreflang / x-default:** ✅ present.
- **OG / twitter:** ❌ Not page-specific.
- **Structured data:** ❌ No `CollectionPage`/`ItemList` schema emitted (the global WebSite schema references `hasPart` nodes, but no actual CollectionPage node is rendered). No BreadcrumbList.
- **Indexable:** Yes.
- **Priority:** Critical (title/desc ok but missing H1), Medium (schema, OG).

### 2.4 `/blog` (EN + BN) — list page

- **Search intent:** Articles / content published by Rahat Ahmed.
- **Current title:** Inherited **default** — `Rahat Ahmed — Web Developer, Student & Teacher | RahatVerse` — **duplicate with homepage**.
- **Current description:** Inherited default — **duplicate**.
- **Current H1:** ✅ `<h1>` "Blog" / "ব্লগ".
- **Canonical / hreflang / x-default:** ✅ present.
- **OG / twitter:** ❌ Not page-specific.
- **Structured data:** ❌ No `Blog`/`ItemList` schema for the list.
- **Indexable:** Yes.
- **Priority:** Critical (title/description), Medium (schema/OG).

### 2.5 `/blog/[slug]` (EN + BN) — article

- **Search intent:** A specific article.
- **Current title:** ✅ Dynamic post title (no template suffix — acceptable for articles).
- **Current description:** ✅ Dynamic excerpt (fallback to first 160 chars).
- **Current H1:** ⚠️ Post title H1 present, but the body renderer maps markdown `# ` lines to **additional `<h1>`s** → **possible multiple H1s** on posts whose content uses `# `. Post body H2/H3 otherwise fine.
- **Canonical:** ✅ absolute via `localeAlternates`.
- **OG / twitter:** ✅ Article type, images, publishedTime. **⚠️ Bug:** `openGraph.url` is **relative** (`/${locale}/blog/${slug}`) — should be absolute.
- **Structured data:** ✅ `BlogPosting` schema (good: headline, dates, author, publisher, inLanguage).
- **Indexable:** Yes.
- **Priority:** Medium (fix relative og:url; demote body `# ` to H2 to guarantee single H1).

### 2.6 `/experience` (EN + BN)

- **Search intent:** Experience / background of Rahat Ahmed.
- **Current title:** Inherited **default** — **duplicate**.
- **Current description:** Inherited default — **duplicate**.
- **Current H1:** ❌ **Missing.** `ExperienceSection` → `SectionTitle` (**H2**), plus BloodSociety/Memorial sections (H2).
- **Canonical / hreflang / x-default:** ✅ present.
- **OG / twitter:** ❌ Not page-specific.
- **Structured data:** ❌ None (no `ProfilePage` / `Organization` for Blood Society).
- **Indexable:** Yes.
- **Priority:** Critical (title/description), High (missing H1).

### 2.7 `/achievements` (EN + BN)

- **Search intent:** Achievements / milestones.
- **Current title:** Inherited **default** — **duplicate**.
- **Current description:** Inherited default — **duplicate**.
- **Current H1:** ❌ **Missing.** `AchievementsSection` → `SectionTitle` (**H2**).
- **Canonical / hreflang / x-default:** ✅ present.
- **OG / twitter:** ❌ Not page-specific.
- **Structured data:** ❌ None.
- **Indexable:** Yes.
- **Priority:** Critical (title/description), High (missing H1).

### 2.8 `/gallery` (EN + BN)

- **Search intent:** Visual / media content.
- **Current title:** Inherited **default** — **duplicate**.
- **Current description:** Inherited default — **duplicate**.
- **Current H1:** ✅ `<h1>` "Gallery" / "গ্যালারি".
- **Canonical / hreflang / x-default:** ✅ present.
- **OG / twitter:** ❌ Not page-specific.
- **Structured data:** ❌ None (no `ImageGallery`/`MediaObject` schema).
- **Indexable:** Yes (borderline value; images could drive image-search traffic).
- **Priority:** Critical (title/description), Low/Medium (schema).

### 2.9 `/contact` (EN + BN)

- **Search intent:** Ways to contact Rahat Ahmed.
- **Current title:** Inherited **default** — **duplicate**.
- **Current description:** Inherited default — **duplicate**.
- **Current H1:** ❌ **Missing.** `ContactSection` → `SectionTitle` (**H2** "Get In Touch").
- **Canonical / hreflang / x-default:** ✅ present.
- **OG / twitter:** ❌ Not page-specific.
- **Structured data:** ❌ No `ContactPage`/`ContactPoint` schema (email/phone exist in `LocalBusiness` helper but that schema is not emitted anywhere).
- **Indexable:** Yes.
- **Priority:** Critical (title/description), High (missing H1), Medium (ContactPage schema).

### 2.10 `/order` (EN + BN)

- **Search intent:** Website / service ordering page (commerce-style).
- **Current title:** Inherited **default** — **duplicate**.
- **Current description:** Inherited default — **duplicate**.
- **Current H1:** ❌ **Missing.** `PricingSection` → `SectionTitle` (**H2**) + `OrderWizard` (**H2**). No H1.
- **Canonical / hreflang / x-default:** ✅ present.
- **OG / twitter:** ❌ Not page-specific.
- **Structured data:** ❌ No `Offer`/`Product`/`ItemList` for pricing packages (services/order pricing is real and schema-worthy).
- **Indexable:** Yes.
- **Priority:** Critical (title/description), High (missing H1), Medium (Offer schema).

### 2.11 `/links` (Link Hub)

- **Search intent:** Aggregation of social/profile links.
- **Current title:** Inherited **default** — **duplicate**.
- **Current description:** Inherited default — **duplicate**.
- **Current H1:** ❌ **Missing** (`SectionTitle` → H2).
- **Canonical / hreflang:** ✅ present.
- **OG / twitter:** ❌ none.
- **Indexable:** ⚠️ Low value / thin content. It's in the sitemap. Recommendation: keep (it is a legitimate navigation hub and internally linked) **or** `noindex` it; do not give it high sitemap priority.
- **Priority:** Low.

### 2.12 Legal / utility pages

| Route | Current title | Notes | Indexable |
|---|---|---|---|
| `/privacy-policy` | `Privacy Policy \| RahatVerse` ✅ | Has title+desc; H1 present; canonical | Yes (keep) |
| `/privacy` | Inherited **default** ❌ | **Duplicate content** of `/privacy-policy`; falls back to same body | ⚠️ See §3 |
| `/terms-of-service` | `Terms of Service \| RahatVerse` ✅ | Has title+desc; H1 present | Yes (keep) |
| `/terms` | Inherited **default** ❌ | **Duplicate content** of `/terms-of-service` | ⚠️ See §3 |
| `/cookie` | Inherited default | No `generateMetadata` at all; not in sitemap | Low value |
| `/refund` | Inherited default | No `generateMetadata`; not in sitemap | Low value |
| `/sitemap` | Inherited default | HTML sitemap; in sitemap.xml | Low value |
| `/summary` | Inherited default | Dev "project summary" page (phase list); in sitemap | ⚠️ Low value |
| `/newsletter`, `/login`, `/newsletter/*` | Inherited default | Utility/functional pages; not in sitemap | ⚠️ Suggest noindex |
| `/dashboard/**`, `/admin/**`, `/api/**`, `/auth/**` | — | Correctly noindexed / disallowed in robots | No |

---

## 3. DUPLICATE / OVERLAPPING ROUTE AUDIT

Confirmed duplicates (identical body/title in `content_config` defaults):

- **`/privacy` vs `/privacy-policy`** — same content. `/privacy-policy` is the canonical, metadata-complete one and is the one linked in the footer.
- **`/terms` vs `/terms-of-service`** — same content. `/terms-of-service` is canonical and footer-linked.

Both pairs are currently present in `sitemap.xml`.

**Recommendation (NOT implemented):**
1. Canonicalize the short routes (`/privacy` → `/privacy-policy`; `/terms` → `/terms-of-service`) — either a server-side redirect (preferred, with `x-robots-tag`) or at minimum `noindex` + remove from sitemap.
2. Do **not** keep both indexable with duplicate content.
3. `/summary` — dev-facing, thin, non-user content. Recommend **remove from sitemap** + `noindex` (or delete from crawl path).
4. `/cookie`, `/refund` — legal; optionally add minimal metadata and either add to sitemap or `noindex` (legal pages need not rank). Currently indexable but absent from sitemap (harmless but inconsistent).
5. `/sitemap` HTML page — low value; can stay noindexed or removed from sitemap.xml (the XML sitemap is the crawl authority).
6. `/newsletter`, `/login`, `/newsletter/confirm|preferences|unsubscribe` — functional, not search intents → `noindex`.

---

## 4. SITEMAP AUDIT (`src/app/sitemap.ts`)

- ✅ Includes all important public pages for both locales.
- ✅ Blog posts added dynamically with `lastModified`, `is_published` filter.
- ✅ Correct `absoluteUrl` host (`https://www.rahatahmed.site`).
- ⚠️ **Over-inclusion:**
  - Both `/privacy` **and** `/privacy-policy` (duplicate).
  - Both `/terms` **and** `/terms-of-service` (duplicate).
  - `/summary` (thin dev page).
  - `/sitemap` (low value).
  - `/links` (borderline; low priority 0.5 is acceptable if kept).
- ⚠️ **Not included:** `/cookie`, `/refund` (legal), and no utility pages — acceptable if those are noindexed.
- ⚠️ Homepage canonical: sitemap uses `/{locale}` (e.g. `/en`, `/bn`) — correct given `localePrefix: "always"`. Apex `/` redirects to `/bn`; no `https://www.rahatahmed.site/` entry needed.
- ✅ Priorities/frequencies are reasonable.

**Recommendation (NOT implemented):** Remove duplicate short legal routes + `/summary` + `/sitemap` from `staticPages`; keep `/links` if retained; add `/cookie`/`/refund` only if they get proper metadata and are meant to rank.

---

## 5. STRUCTURED DATA AUDIT

Currently emitted:
- **Person** schema — global (root layout), every page. ✅
- **WebSite** schema — global (root layout), every page. ✅
- **WebPage** schema — homepage only (`getWebPageSchema`). 
- **BlogPosting** schema — blog post pages. ✅
- `getPortfolioSchema`, `getLocalBusinessSchema` — **defined but never used** (dead code).

Present site-wide: none of `BreadcrumbList`, `CollectionPage` (actual node), `Service`, `Offer`/`Product`, `ContactPage`/`ContactPoint`, `ImageGallery`, `FAQPage`, `Organization` (real one), `Article` for blog.

**Gaps by page (recommendation only, NOT implemented):**
- `/about` → `ProfilePage` / `AboutPage` (ties to global Person `@id`).
- `/services` → `Service` + `Offer` (`ItemList` of services).
- `/portfolio` → `CollectionPage` (emit the node the WebSite schema already references) + `ItemList` of projects.
- `/experience` → `ProfilePage` (work history) + optional `Organization` for Shantichakra Blood Society.
- `/contact` → `ContactPage` + `ContactPoint` (use the already-written `LocalBusiness` helper or similar).
- `/order` → `Offer`/`Product` for the pricing packages.
- `/blog` (list) → `Blog` + `ItemList`.
- `/gallery` → `ImageGallery`.
- All important pages → optional `BreadcrumbList` (Home › Section) since hreflang/canonical already established.
- ❌ **Do not** emit `LocalBusiness`/`Organization` claiming a formal business unless the actual service model supports it; keep `Person` as primary entity.

---

## 6. SOCIAL METADATA AUDIT

- ✅ Site-level OG + Twitter configured in root layout (image, siteName, fallback).
- ✅ Homepage and blog posts have page-specific OG (and blog posts have Twitter).
- ❌ **Most other pages lack page-specific OG/twitter** — they inherit the generic site OG (title = site name, image = profile photo). No unique `og:title`, `og:description`, `og:url`, `twitter:*` per page.
- ⚠️ Blog post `og:url` is **relative** (should be absolute).
- ⚠️ OG `type` stays `website` on all pages (correct for most; blog posts correctly use `article`).
- Social image system is single-sourced (`SITE_IMAGE`) — adequate; no redesign needed, just reuse per page with page-appropriate alt text.

---

## 7. INDEXABILITY RECOMMENDATION SUMMARY

| Route | Index? |
|---|---|
| `/`, `/about`, `/services`, `/portfolio`, `/blog`, `/blog/[slug]`, `/experience`, `/achievements`, `/gallery`, `/contact`, `/order` | ✅ Yes (keep indexed) |
| `/privacy-policy`, `/terms-of-service` | ✅ Yes (keep) |
| `/privacy`, `/terms` | ⚠️ Redirect → `/privacy-policy`, `/terms-of-service` (or noindex) |
| `/summary` | ⚠️ Remove from sitemap + noindex (thin/dev content) |
| `/sitemap`, `/links` | ⚠️ Optional noindex; at minimum drop `/sitemap` from XML |
| `/cookie`, `/refund` | ⚠️ noindex or add metadata (decide; don't leave half-state) |
| `/newsletter`, `/login`, `/newsletter/*`, `/offline` | ⚠️ noindex (functional) |
| `/dashboard/**`, `/admin/**`, `/api/**`, `/auth/**` | ❌ Already blocked/noindexed ✅ |

---

## 8. RECOMMENDED TITLES / DESCRIPTIONS / H1 (per page, both locales)

> Recommendations follow the intent of each page; "Rahat Ahmed" is used only where it adds search relevance, never stuffed.

### /about
- **Title EN:** `About Rahat Ahmed — Student, Teacher & Web Developer`
- **Title BN:** `রাহাত আহমেদের সম্পর্কে — শিক্ষার্থী, শিক্ষক ও ওয়েব ডেভেলপার`
- **Desc EN:** `Meet Rahat Ahmed — an HSC student, teacher, BNCC cadet and web developer from Sunamganj, Bangladesh, building for education, social service and technology.`
- **Desc BN:** `রাহাত আহমেদের পরিচয় — সুনামগঞ্জের একজন শিক্ষার্থী, শিক্ষক, বিএনসিসি ক্যাডেট ও ওয়েব ডেভেলপার। শিক্ষা, সমাজসেবা ও প্রযুক্তিতে কাজ করছেন।`
- **H1 EN:** `About Rahat Ahmed` / **BN:** `রাহাত আহমেদের সম্পর্কে` (single H1; demote "About Me"/"Education Timeline" to H2 — they already are).

### /services
- **Title EN:** `Web Development Services & Packages — RahatVerse` (refine existing)
- **Desc EN:** keep/lightly refine existing (accurate). **H1:** existing "What I Build" is fine (single H1).

### /portfolio
- **Title EN:** `Portfolio & Case Studies — Web Projects by Rahat Ahmed`
- **Desc EN:** `Selected web projects, websites and case studies developed by Rahat Ahmed — portfolio sites, e-commerce, education and blood-donation platforms.`
- **H1 EN:** `Portfolio & Case Studies` (single H1; demote existing "Ready to Transform…" to H2).

### /blog
- **Title EN:** `Blog — Web Development, Education & Social Service by Rahat Ahmed`
- **Desc EN:** `Articles and insights by Rahat Ahmed on web development, technology, education, blood donation and social service.`
- **H1 EN:** `Blog` (existing, fine).

### /experience
- **Title EN:** `Experience & Social Service — Rahat Ahmed`
- **Desc EN:** `Rahat Ahmed's experience and social contributions — teaching, BNCC cadetship, Shantichakra Blood Society and community service.`
- **H1 EN:** `Experience & Social Service`.

### /achievements
- **Title EN:** `Achievements & Milestones — Rahat Ahmed`
- **Desc EN:** `Achievements and milestones of Rahat Ahmed — national science fair awards, academic distinctions and social-service milestones.`
- **H1 EN:** `Achievements & Milestones`.

### /gallery
- **Title EN:** `Gallery — Moments from Rahat Ahmed's Journey`
- **Desc EN:** `Photos and moments from Rahat Ahmed's journey — education, science fairs, BNCC, blood donation drives and web development.`
- **H1 EN:** `Gallery` (existing).

### /contact
- **Title EN:** `Contact Rahat Ahmed — Web Development, Tutoring & Blood Donation`
- **Desc EN:** `Contact Rahat Ahmed for web development, tutoring, blood donation coordination or collaboration. Response within 24 hours.`
- **H1 EN:** `Contact Rahat Ahmed` / **BN:** `যোগাযোগ করুন`.

### /order
- **Title EN:** `Order a Website — Packages & Pricing by RahatVerse`
- **Desc EN:** `Choose a website package and start your project — portfolio, business, e-commerce and custom web applications built by RahatVerse.`
- **H1 EN:** `Order a Website` (single H1; demote Pricing "Our Packages" to H2).

### /privacy-policy / /terms-of-service
- Titles/descriptions already present and accurate ✅. Keep.

---

## 9. PHASE 2 IMPLEMENTATION PLAN

Grouped by priority. **Nothing in this plan is implemented during this audit.**

### 🔴 HIGH PRIORITY
1. **Add unique `title` + `description` + `openGraph` + `twitter` to every page that currently inherits the default:** `/about`, `/blog`, `/experience`, `/achievements`, `/gallery`, `/contact`, `/order` (EN + BN). Resolve the site-wide duplicate-title/description defect (§1, §2).
2. **Restore exactly one meaningful H1 per page:** add H1s to `/about`, `/experience`, `/achievements`, `/contact`, `/order`, `/portfolio` (currently H2-based via `SectionTitle`). Keep the single-H1 pages as-is.
3. **Blog posts — fix multiple-H1 risk:** render body `# ` lines as H2 (not H1) so every post has exactly one H1 (the title).
4. **Resolve legal duplicates:** redirect `/privacy`→`/privacy-policy` and `/terms`→`/terms-of-service` (or noindex + remove from sitemap). Update `sitemap.ts` accordingly (remove duplicates, `/summary`, `/sitemap`).

### 🟠 MEDIUM PRIORITY
5. **Blog `og:url` bug:** use an absolute URL for `openGraph.url` on `/blog/[slug]`.
6. **Add page-specific OG/twitter** (title/description/url) reusing `SITE_IMAGE` for the pages that get new metadata (§6).
7. **Structured data additions** (only where semantically accurate): `ProfilePage`/`AboutPage` (about), `Service`+`Offer` (services/order), `CollectionPage`+`ItemList` (portfolio), `ContactPage`+`ContactPoint` (contact), `Blog`+`ItemList` (blog list), `ImageGallery` (gallery). Wire the unused `getPortfolioSchema` / `getLocalBusinessSchema` only if they add accurate value.
8. **Add metadata (title/desc) + decide indexability for `/cookie`, `/refund`, `/sitemap`, `/links`, `/summary`** so they are not left with default titles and ambiguous indexability.

### 🟢 LOW PRIORITY
9. Optional `BreadcrumbList` on top-level public pages.
10. Add `noindex` to functional pages `/newsletter`, `/login`, `/newsletter/*`, `/offline` (default noindex for the whole subtree where possible).
11. Refine `/portfolio` title to decouple "Portfolio" from "Experience" intent (§8) and confirm the merged About/Experience content on `/portfolio` doesn't thin the page's topical focus.
12. Re-verify all `<h1>`/`<h2>` heading hierarchy after edits (audit via crawl).

---

## 10. STOP — NO CHANGES MADE

Per Phase 2 rules, this is a read-only audit. **No code was modified, no commit/push/PR/merge/deployment was performed.** This report is the complete Phase 2 deliverable.
