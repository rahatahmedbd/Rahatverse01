"use client";

import { useEffect } from "react";

// ── Web Vitals Reporter ────────────────────────────────
// Reports Core Web Vitals for performance monitoring

interface PerformanceEntryWithProcessing extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  hadRecentInput: boolean;
  value: number;
}

export function WebVitalsReporter() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Report LCP (Largest Contentful Paint)
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log("LCP:", lastEntry.startTime);
    });

    try {
      observer.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      // Browser doesn't support this API
    }

    // Report FID (First Input Delay)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const perfEntry = entry as PerformanceEntryWithProcessing;
        const fid = perfEntry.processingStart - entry.startTime;
        console.log("FID:", fid);
      });
    });

    try {
      fidObserver.observe({ type: "first-input", buffered: true });
    } catch {
      // Browser doesn't support this API
    }

    // Report CLS (Cumulative Layout Shift)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const layoutShiftEntry = entry as LayoutShiftEntry;
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
          console.log("CLS:", clsValue);
        }
      });
    });

    try {
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch {
      // Browser doesn't support this API
    }

    return () => {
      observer.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return null;
}
