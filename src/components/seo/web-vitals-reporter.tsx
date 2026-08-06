"use client";

import { useReportWebVitals } from "next/web-vitals";
import { trackEvent } from "@/lib/analytics/tracker";

// ── Web Vitals Reporter ────────────────────────────────
// Reports Core Web Vitals (LCP, INP/INP, CLS, TTFB, FCP) to the first-party
// analytics pipeline and GA4. Timing metrics are stored in milliseconds;
// CLS is stored as its unitless raw score (3 decimals).

export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    const { id, name, value, rating } = metric;

    const normalized =
      name === "CLS" ? Math.round(value * 1000) / 1000 : Math.round(value);

    trackEvent("web_vital", {
      category: "performance",
      label: name,
      value: normalized,
      metadata: { metric_id: id, rating, raw_value: value },
    });
  });

  return null;
}
