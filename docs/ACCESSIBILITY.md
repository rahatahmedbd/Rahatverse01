# ♿ Accessibility (WCAG 2.1)

RahatVerse aims for **WCAG 2.1 AA** conformance. This document records the areas
covered and the checks used during development and QA.

## Principles covered

### Perceivable
- **Color contrast:** interactive text meets 4.5:1 (AA) and large text 3:1 in both
  light and dark themes. Verify when adding new palette colors.
- **Not relying on color alone:** focus/selected states use borders, icons, and
  text labels in addition to color.
- **Alt text:** meaningful `alt` attributes on images; decorative images marked
  `alt=""`.
- **Video/audio:** YouTube embeds provide captions where available.

### Operable
- **Keyboard:** all interactive elements are focusable and operable via keyboard;
  focus indicators are visible (custom cursor is decorative and never traps focus).
- **Menus/dialogs:** Radix UI primitives used for dialog/dropdown/tabs/tooltip,
  which provide keyboard + focus-trap + ARIA out of the box.
- **Enough time:** forms do not auto-expire unexpectedly; confirmation tokens
  expire after 48h with clear messaging.
- **Motion:** `prefers-reduced-motion` respected — heavy animations (GSAP/3D/aurora)
  are reduced or disabled. Users can disable ambient sound.

### Understandable
- **Language:** pages declare `lang`; content is available in Bengali and English
  with consistent navigation.
- **Labels:** all form fields have associated `<label>` or `aria-label`.
- **Consistent navigation:** shared navbar/bottom-nav across pages.

### Robust
- Semantic HTML (`header`, `nav`, `main`, `footer`, `section`, `h1`…`h6` hierarchy).
- ARIA roles/names verified on interactive widgets.
- Valid, accessible markup from Shadcn/Radix-based components.

## Automated checks (recommended)
- **axe-core** via Playwright (`@axe-core/playwright`) in the E2E suite.
- Lighthouse Accessibility score in CI.

## Manual QA checklist
- [ ] Navigate with keyboard only (Tab / Shift+Tab / Enter / Space / Escape).
- [ ] Screen reader smoke test on home, about, services, order, blog, contact.
- [ ] Check contrast in both light and dark theme.
- [ ] Verify `prefers-reduced-motion` reduces animation.
- [ ] Verify every form field has a label and error messaging.
- [ ] Confirm focus outline is visible on all interactive elements.
