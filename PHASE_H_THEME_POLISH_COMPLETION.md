# Phase H: "থিম পোলিশ" (Dark/Light + Customization) — Completion Report

## Status: ✅ COMPLETED (validated on `arena/019fdaae-rahatverse01`)

## Overview

Polished the theming system: an accent color customizer with smooth transitions,
theme persistence, dark/light crossfade (color morph), accent-aware selection and
custom scrollbar, keeping contrast and accessibility correct in both themes.

## What Was Implemented

### 1. Dark/light contrast + accessibility
- Every accent palette defines explicit **dark and light** `--primary`,
  `--primary-foreground`, `--ring`, `--accent`, `--accent-foreground` and
  `--gradient-primary` values, so contrast stays correct regardless of theme.

### 2. Accent customizer — more colors + smooth transition
- **Store** (`src/store/index.ts`) gained an `accent` state + `setAccent`,
  persisted via zustand `persist` (localStorage key `rahatverse-preferences`,
  along with the theme).
- **`AccentCustomizer`** component (`src/components/layout/accent-customizer.tsx`)
  — a palette button + popover with **6 accent swatches** (Amber, Blue, Green,
  Purple, Rose, Teal). Wired into the navbar next to the theme toggle.
- Accent colors are applied via a `data-accent` attribute on `<html>` and defined
  in `globals.css` as `[data-accent="..."]` selectors (dark + light variants).

### 3. Theme switch crossfade / color morph
- **`ThemeApplier`** component (`src/components/layout/theme-applier.tsx`)
  hydrates the persisted theme + accent on mount (no flash of wrong theme).
- `globals.css` now adds smooth color transitions to `html`/`body`/cards/buttons/
  inputs so toggling dark/light or accent **color-morphs** instead of jumping.
- **`ThemeToggle`** now crossfades between the sun/moon icon (`animate-fade-in`)
  while the palette morphs underneath.

### 4. Custom scrollbar + selection color
- Scrollbar upgraded (thicker, rounded, accent-tinted thumb with a background
  border, plus Firefox `scrollbar-width`/`scrollbar-color`).
- Selection now uses an accent-aware `--selection` variable so it recolors with
  the chosen accent.

## Validation
- `npm install` — clean (0 vulnerabilities)
- `npm run type-check` — ✅
- `npm run lint` — ✅
- `npm run build` — ✅
- `npm run test` — 57 tests passed
- Dev-server smoke test — `/bn` returns 200; the accent customizer renders in the
  navbar; no runtime/console warnings.

## Note
Per the session setup this work is committed to `arena/019fdaae-rahatverse01`
(not a per-phase branch). The GitHub PR → `main` merge → Vercel production
deploy → live verification steps of the charter must be run from your
GitHub/Vercel side.
