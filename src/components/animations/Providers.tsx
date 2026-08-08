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
  // Native cursors and direct button feedback feel faster and more familiar.
  // The effects remain opt-in for campaign pages that explicitly need them.
  showCursor = false,
  showProgress = true,
  showScrollTop = true,
  showMagnetic = false,
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
