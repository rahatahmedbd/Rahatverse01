"use client";

import { CustomCursor } from "./CustomCursor";
import { ScrollProgress } from "./ScrollProgress";
import { ScrollToTop } from "./ScrollProgress";
import { PWAInstallPrompt } from "../interactive/PWAInstallPrompt";

// ── Animation Providers ────────────────────────────────
// Renders global animation effects (cursor, progress, scroll-top)
// Does NOT wrap children — just renders alongside layout

interface ProvidersProps {
  showCursor?: boolean;
  showProgress?: boolean;
  showScrollTop?: boolean;
}

export function AnimationProviders({
  showCursor = true,
  showProgress = true,
  showScrollTop = true,
}: ProvidersProps) {
  return (
    <>
      {showProgress && <ScrollProgress />}
      {showCursor && <CustomCursor />}
      {showScrollTop && <ScrollToTop />}
      <PWAInstallPrompt />
    </>
  );
}
