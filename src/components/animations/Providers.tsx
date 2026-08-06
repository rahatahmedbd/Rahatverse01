"use client";

import { CustomCursor } from "./CustomCursor";
import { ScrollProgress } from "./ScrollProgress";
import { ScrollToTop } from "./ScrollProgress";
import { PWAInstallPrompt } from "../interactive/PWAInstallPrompt";
import { MagneticCursor } from "../interactive/MagneticCursor";

// ── Animation Providers ────────────────────────────────
// Renders global animation effects

interface ProvidersProps {
  showCursor?: boolean;
  showProgress?: boolean;
  showScrollTop?: boolean;
  showMagnetic?: boolean;
}

export function AnimationProviders({
  showCursor = true,
  showProgress = true,
  showScrollTop = true,
  showMagnetic = true,
}: ProvidersProps) {
  return (
    <>
      {showProgress && <ScrollProgress />}
      {showCursor && <CustomCursor />}
      {showMagnetic && <MagneticCursor />}
      {showScrollTop && <ScrollToTop />}
      <PWAInstallPrompt />
    </>
  );
}
