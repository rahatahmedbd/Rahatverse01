# Phase K: "প্রিমিয়াম হিরো" (Premium Hero & Navigation) — Completion Report

## Status: ✅ COMPLETED

## Overview

Redesigned the home page hero into a premium, professional "product" layout
(inspired by Samsung, Apple and Pixel design language) and upgraded the mobile
bottom navigation into a modern floating capsule. Also fixed a pre-existing
navigation active-state bug and a Cloudinary env robustness issue.

## Delivered

### 1. Premium Hero — `src/components/sections/HeroSection.tsx`
New element order (matches the requested layout):

1. **Welcome badge** — small gradient eyebrow pill (unchanged, admin editable).
2. **Name** — gradient headline + English subtitle.
3. **Typing animation** — rotating role tags.
4. **Motto quote** — the signature line *"Standing by people, learning, and
   teaching — these three things drive me forward."* with a `Quote` icon,
   italic treatment, attribution ("— Rahat Ahmed") and a gradient hairline
   divider. Fully admin-editable via the About config (`biography.quote`).
5. **CTA row — placed BEFORE the profile image** — the primary **"Order a
   Website"** button is now `xl`-sized and sits directly above the avatar
   (with View Projects / Contact beside it).
6. **Profile image section** — now below the text and CTA, so the hero reads
   like an Apple/Samsung product page: headline → subline → action → product.
7. Role badges and stats counters follow below.

The long description paragraph was replaced by the quote block so the hero
stays clean and professional.

### 2. Professional 3D-style Profile Image — `src/components/sections/ProfileImage.tsx`
- **Gentle idle float** animation for a light 3D "product" presence.
- **Rotating conic rim-light ring** (masked arc, spins continuously) in the
  frame's accent color — premium watch-style detail.
- **Gradient rim** around the circular image (`p-[3px]` gradient border) with
  layered colored shadow.
- **Soft static ring + ambient halo** retained and refined; the status pill now
  floats together with the avatar.
- Mouse 3D parallax in the hero was kept and tuned (`intensity={16}`).
- Same props/API — used automatically on the About page too.

### 3. Mobile Bottom Navigation — `src/components/layout/bottom-nav.tsx`
- **Floating frosted-glass capsule** (rounded-full, centered, `max-w-md`).
- **Spring-animated active pill** (`layoutId`) that slides between items
  (Pixel / iOS style).
- **Active dot indicator** above the icon (Samsung One UI style).
- Icons + labels per item (Home / Achievements / Order / Contact), `aria-current`
  for accessibility.

### 4. Bug Fixes
- **Navigation active state** — `usePathname()` returns the locale path (`/bn`)
  while the home link was built as `/bn/` (trailing slash), so **Home was never
  highlighted**. Normalized trailing slashes on both sides in the bottom nav and
  the desktop navbar (desktop + mobile menu). Verified server-side and for every
  locale/route.
- **Cloudinary env robustness** — `CloudinaryImage` computed a fallback cloud
  name but never passed it to `CldImage`, so any page using images threw
  `"A Cloudinary Cloud name is required"` when `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
  was unset (local previews / staging). Now the computed cloud name is passed via
  `config={{ cloud: { cloudName } }}`, so pages render everywhere and the existing
  GitHub-image fallback handles load failures. In production the real env var
  still takes precedence.

## Validation

- ✅ `npm install`
- ✅ `npm run lint`
- ✅ `npm run type-check`
- ✅ `npm test` — 33 files / 227 tests passed
- ✅ `npm run build` — compiled successfully, 24 static pages generated
- ✅ Manual verification: `/`, `/bn`, `/en`, `/bn/achievements`, `/bn/about` all
  render 200; hero order (quote → order CTA → image → badges → stats) confirmed
  in rendered HTML; active nav pill + dot + `aria-current` confirmed per route.
