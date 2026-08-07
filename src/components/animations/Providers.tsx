"use client";

import { MotionConfig } from "framer-motion";
import { CustomCursor } from "./CustomCursor";
import { ScrollProgress } from "./ScrollProgress";
import { ScrollToTop } from "./ScrollProgress";
import { PWAInstallPrompt } from "../interactive/PWAInstallPrompt";
import { MagneticCursor } from "../interactive/MagneticCursor";

// ── Animation Providers ────────────────────────────────
// Renders global animation effects. MotionConfig reducedMotion="user"
// makes every framer-motion animation across the app respect the user's
// prefers-reduced-motion setting (Phase E).

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
    <MotionConfig reducedMotion="user">
      {showProgress && <ScrollProgress />}
      {showCursor && <CustomCursor />}
      {showMagnetic && <MagneticCursor />}
      {showScrollTop && <ScrollToTop />}
      <PWAInstallPrompt />
    </MotionConfig>
  );
}
