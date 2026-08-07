# Phase K: "প্রিমিয়াম হিরো" (Premium Hero & Navigation) — Completion Report

## Status: ✅ COMPLETED

## Overview

Redesigned the home page hero exactly as requested: the original hero layout
was restored (profile image back on top), the profile image is now **square**
with a light 3D presentation and an **animated typing caption**, and the
**website-ordering CTA was moved out of the hero** to sit directly **above the
featured image boxes** — which were moved further down the page and given
always-working images.

## Delivered

### 1. Hero restored to the original layout — `src/components/sections/HeroSection.tsx`
Original order is back:

1. **Welcome badge** (admin editable).
2. **Profile image — back at the top** (below the badge), wrapped in the light
   3D mouse-parallax container.
3. **Name** — gradient headline + English subtitle.
4. **Role badges**, **description**, **CTA row** (back below the description —
   no longer above the profile image), and **stats counters**.

The previous experiment (quote → Order CTA → profile image order) was fully
reverted per feedback.

### 2. Square profile image + animated caption — `src/components/sections/ProfileImage.tsx`
- **Square** shape (`rounded-3xl`) instead of the circle, with a premium
  `3px` gradient rim and layered colored shadow.
- **Light 3D vibe**: gentle idle float, rotating conic rim-light ring around
  the square (masked square ring), soft ambient halo, plus the hero's mouse
  parallax tilt (`intensity={12}`).
- **Animated caption**: a frosted-glass pill under the image with a sparkle
  icon and a **typing animation** that cycles the role texts
  ("ওয়েব ডেভেলপার → শিক্ষার্থী → গৃহশিক্ষক → …") with a blinking cursor —
  the "shortcut text" requested next to the picture.
- Status pill retained; same props/API (About page automatically gets the
  square design too).

### 3. Ordering system above the image boxes — `src/components/sections/OrderCtaBand.tsx` + home page
- New **Order CTA band** ("আপনার স্বপ্নের ওয়েবসাইট তৈরি করুন") with a large
  gradient **Order a Website** button and a **Contact** button.
- Placed on the home page **directly above the featured image boxes** — not
  above the profile image.

### 4. Image boxes fixed & moved down — `src/components/gallery/FeaturedGallery.tsx` + home page
- The featured gallery (the "box box box" cards with images) was **moved down
  the page** — it now sits after Services and Testimonials, before the
  newsletter.
- **Every card now has a real image**: the old fallbacks pointed to dead
  `rahatahmedbd.github.io` URLs (only 4 of 12 files exist and the host is
  unreachable), so the boxes rendered empty. They now use the bundled,
  always-working local SVGs (`/images/gallery-science.svg`,
  `gallery-blood.svg`, `gallery-web.svg`, `gallery-bncc.svg`) mapped by
  category, keeping the real titles/descriptions and hover overlays.

### 5. Mobile bottom navigation — `src/components/layout/bottom-nav.tsx`
Kept the premium floating frosted capsule (Samsung One UI / Apple / Pixel
inspired) with the spring-animated active pill, active dot, and `aria-current`.

### 6. Bug fixes (from the first revision, retained)
- **Nav active state** — home item was never highlighted due to a
  trailing-slash mismatch (`/bn/` vs `/bn`); fixed in bottom nav and desktop
  navbar.
- **Cloudinary env robustness** — `CloudinaryImage` now passes the computed
  cloud name to `CldImage`, so pages no longer throw when
  `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is unset (local/staging); production env
  still takes precedence.

## Validation

- ✅ `npm install`
- ✅ `npm run lint`
- ✅ `npm run type-check`
- ✅ `npm test` — 33 files / 227 tests passed
- ✅ `npm run build` — compiled successfully, 24 static pages generated
- ✅ Manual verification on `/`, `/bn`, `/en`:
  - DOM order: badge → **square profile image (+ animated caption)** → name →
    role badges → description → **hero CTA (below the pic)** → stats →
    About (quote with name) → Services → Testimonials → **Order CTA band →
    gallery boxes** → Newsletter
  - No ordering CTA above the profile image; no dead GitHub image URLs in the
    gallery fallbacks.
