"use client";

import Script from "next/script";

// ── Google Analytics 4 ─────────────────────────────────
// Loads gtag.js when NEXT_PUBLIC_GA_MEASUREMENT_ID is configured. Automatic
// page views are disabled; AnalyticsProvider sends one explicit page_view per
// client-side navigation so SPA route changes are counted exactly once.

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() { window.dataLayer.push(arguments); }
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: false,
            anonymize_ip: true,
          });
        `}
      </Script>
    </>
  );
}
