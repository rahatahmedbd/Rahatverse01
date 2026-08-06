# 🔍 SEO Guide

RahatVerse follows modern SEO best practices using Next.js App Router metadata and
structured data.

## What is implemented

- **Metadata:** every page exports `generateMetadata` / `Metadata` with title,
  description, canonical URL, and Open Graph tags.
- **Multi-language hreflang:** `lib/seo.ts` `localeAlternates` emits `bn` and `en`
  alternates with canonical URL per locale.
- **`robots.txt`:** served via `src/app/robots.ts`.
- **`sitemap.xml`:** generated via `src/app/sitemap.ts`.
- **JSON-LD structured data:** `getBlogPostingSchema` emits `BlogPosting` schema
  on blog posts (headline, author, publisher, dates, image, reading time).
- **OG/Twitter cards:** shared site image and per-page titles.

## Conventions when adding pages

1. Add a `generateMetadata` export using `seo.ts` helpers:
   ```ts
   export async function generateMetadata(): Promise<Metadata> {
     return {
       title: "About — RahatVerse",
       description: "...",
       alternates: localeAlternates(locale, "/about"),
       openGraph: { title, description, images: [{ url: SITE_IMAGE }] },
     };
   }
   ```
2. Use `absoluteUrl()` for absolute URLs and `localePath()` for localized paths.
3. Ensure only one `h1` per page and a logical heading hierarchy.

## Canonical site

`NEXT_PUBLIC_SITE_URL` must be set to the production domain in Vercel so canonical
and sitemap URLs are correct.

## Performance (Core Web Vitals)

- Images use Cloudinary transformations (`f_auto`, `q_auto`, width/height) and
  Next `<Image>` with responsive sizing.
- Analytics tracking is non-blocking (`sendBeacon`, `keepalive`) and batches events.
- Use Lighthouse / PageSpeed Insights to monitor LCP, CLS, INP and set budgets.

## Checklist
- [ ] `NEXT_PUBLIC_SITE_URL` = production domain
- [ ] Every public page has unique title + description
- [ ] Canonical + hreflang present for bn/en
- [ ] Blog posts emit `BlogPosting` JSON-LD
- [ ] `sitemap.xml` and `robots.txt` generated and reachable
- [ ] OG image configured
