"use client";

import dynamic from "next/dynamic";

/**
 * Client-side dynamic loader for Nuva AI Chat Widget.
 * Code-splits the 666-line AI chat UI out of the initial public route bundles
 * so it never blocks first page render or Core Web Vitals.
 */
export const AIChatWidgetLoader = dynamic(
  () => import("@/components/ai/AIChatWidget").then((mod) => mod.AIChatWidget),
  { ssr: false }
);
