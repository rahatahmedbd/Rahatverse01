"use client";

import { CustomCursor } from "./CustomCursor";
import { ScrollProgress } from "./ScrollProgress";
import { ScrollToTop } from "./ScrollProgress";

// ── Animation Providers ────────────────────────────────
// Wraps the app with global animation components

interface ProvidersProps {
  children: React.ReactNode;
  showCursor?: boolean;
  showProgress?: boolean;
  showScrollTop?: boolean;
}

export function AnimationProviders({
  children,
  showCursor = true,
  showProgress = true,
  showScrollTop = true,
}: ProvidersProps) {
  return (
    <>
      {children}
      {showProgress && <ScrollProgress />}
      {showCursor && <CustomCursor />}
      {showScrollTop && <ScrollToTop />}
    </>
  );
}
