"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  initAnalyticsQueue,
  shouldTrack,
  trackEvent,
  trackPageView,
} from "@/lib/analytics/tracker";

// ── Analytics Provider ─────────────────────────────────
// Global tracking behaviour:
// * page views on every client-side navigation
// * scroll depth milestones (25 / 50 / 75 / 100 %)
// * click tracking (data-track elements, links, buttons)
// * form submission tracking
// * engagement heartbeats used for session duration + bounce rate
// Renders nothing; mount once in the locale layout.

const SCROLL_THRESHOLDS = [25, 50, 75, 100];
const ENGAGEMENT_INTERVAL_MS = 30_000;
const CLICKABLE_SELECTOR = "[data-track], a[href], button, [role='button']";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const firedScrollThresholds = useRef<Set<number>>(new Set());

  // Queue lifecycle: periodic flush + flush on tab hide / page unload.
  useEffect(() => {
    initAnalyticsQueue();
  }, []);

  // Page view tracking on route change.
  useEffect(() => {
    if (!pathname) return;
    const search = typeof window !== "undefined" ? window.location.search : "";
    trackPageView(`${pathname}${search}`);
    firedScrollThresholds.current = new Set();
  }, [pathname]);

  // Scroll depth milestones, once per threshold per page.
  useEffect(() => {
    if (!shouldTrack()) return;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const percent = Math.round((window.scrollY / scrollable) * 100);
      for (const threshold of SCROLL_THRESHOLDS) {
        if (percent >= threshold && !firedScrollThresholds.current.has(threshold)) {
          firedScrollThresholds.current.add(threshold);
          trackEvent("scroll_depth", {
            category: "engagement",
            label: String(threshold),
            value: threshold,
          });
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click tracking via event delegation.
  useEffect(() => {
    if (!shouldTrack()) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const element = target.closest<HTMLElement>(CLICKABLE_SELECTOR);
      if (!element || element.closest("form")) return;

      const explicit = element.getAttribute("data-track");
      const anchor =
        element instanceof HTMLAnchorElement
          ? element
          : element.closest("a[href]");
      const isLink = anchor !== null;
      const isExternal =
        anchor instanceof HTMLAnchorElement &&
        anchor.host !== window.location.host &&
        anchor.protocol.startsWith("http");

      const category = isExternal ? "outbound" : isLink ? "navigation" : "interaction";
      const label =
        explicit ||
        element.getAttribute("aria-label") ||
        (element.textContent || "").trim().slice(0, 80) ||
        (isExternal && anchor instanceof HTMLAnchorElement ? anchor.href : null) ||
        element.tagName.toLowerCase();

      trackEvent("click", {
        category,
        label,
        metadata: {
          tag: element.tagName.toLowerCase(),
          ...(explicit ? { custom: true } : {}),
        },
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Form submission tracking.
  useEffect(() => {
    if (!shouldTrack()) return;

    const onSubmit = (event: Event) => {
      const form = event.target instanceof HTMLFormElement ? event.target : null;
      if (!form) return;

      const label =
        form.getAttribute("data-track") ||
        form.name ||
        form.id ||
        form.getAttribute("action") ||
        "form";

      trackEvent("form_submit", { category: "conversion", label });
    };

    document.addEventListener("submit", onSubmit, true);
    return () => document.removeEventListener("submit", onSubmit, true);
  }, []);

  // Engagement heartbeat: powers session duration and bounce-rate metrics.
  useEffect(() => {
    if (!shouldTrack()) return;

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        trackEvent("engagement", {
          category: "engagement",
          value: ENGAGEMENT_INTERVAL_MS / 1000,
        });
      }
    }, ENGAGEMENT_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  return null;
}
