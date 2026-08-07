// ── First-Party Analytics Tracker (client) ─────────────
// Collects page views and interaction events, batches them in memory, and
// flushes to /api/analytics. Events are mirrored to GA4 (gtag) when Google
// Analytics is configured, so both systems receive identical data.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export interface TrackEventOptions {
  category?: string;
  label?: string | null;
  value?: number | null;
  metadata?: Record<string, unknown>;
}

interface QueuedPageView {
  path: string;
  referrer: string | null;
  screenWidth: number | null;
  ts: number;
}

interface QueuedEvent {
  name: string;
  category: string;
  label: string | null;
  path: string;
  value: number | null;
  metadata: Record<string, unknown>;
  ts: number;
}

const SESSION_ID_KEY = "rv_session_id";
const SESSION_SEEN_KEY = "rv_session_seen";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity ends a session
const MAX_QUEUE_SIZE = 40;
const FLUSH_INTERVAL_MS = 15_000;
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;

let queue: { pageViews: QueuedPageView[]; events: QueuedEvent[] } = {
  pageViews: [],
  events: [],
};
let memorySessionId: string | null = null;
let flushTimer: number | null = null;
let initialized = false;

function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/** Whether the current visitor should be tracked (skips bots and DNT). */
let telemetryEnabledGlobal = true;

/** Programmatically enable/disable first-party telemetry (admin control). */
export function setTelemetryEnabled(enabled: boolean): void {
  telemetryEnabledGlobal = enabled;
}

export function shouldTrack(): boolean {
  if (!telemetryEnabledGlobal) return false;
  if (typeof window === "undefined") return false;
  if (typeof navigator !== "undefined" && navigator.webdriver) return false;

  const doNotTrack =
    (window as Window & { doNotTrack?: string }).doNotTrack ||
    (typeof navigator !== "undefined"
      ? (navigator as Navigator & { doNotTrack?: string }).doNotTrack
      : undefined);
  if (doNotTrack === "1" || doNotTrack === "yes") return false;

  return true;
}

/** Stable per-tab session id, regenerated after 30 minutes of inactivity. */
export function getSessionId(): string {
  const now = Date.now();

  try {
    const storage = window.sessionStorage;
    const existing = storage.getItem(SESSION_ID_KEY);
    const lastSeen = Number(storage.getItem(SESSION_SEEN_KEY) || 0);

    if (!existing || !SESSION_ID_PATTERN.test(existing) || now - lastSeen > SESSION_TIMEOUT_MS) {
      const id = randomId();
      storage.setItem(SESSION_ID_KEY, id);
      storage.setItem(SESSION_SEEN_KEY, String(now));
      return id;
    }

    storage.setItem(SESSION_SEEN_KEY, String(now));
    return existing;
  } catch {
    if (!memorySessionId) memorySessionId = randomId();
    return memorySessionId;
  }
}

function forwardToGa4(event: string, params: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}

function flushIfFull(): void {
  if (queue.pageViews.length + queue.events.length >= MAX_QUEUE_SIZE) {
    flushAnalyticsQueue();
  }
}

/** Sends every queued page view / event to the analytics endpoint. */
export function flushAnalyticsQueue(): void {
  if (typeof window === "undefined") return;
  if (queue.pageViews.length === 0 && queue.events.length === 0) return;

  const payload = {
    sessionId: getSessionId(),
    pageViews: queue.pageViews,
    events: queue.events,
  };
  queue = { pageViews: [], events: [] };

  const body = JSON.stringify(payload);

  // Prefer sendBeacon while the page is unloading so data is not lost.
  if (
    document.visibilityState === "hidden" &&
    typeof navigator.sendBeacon === "function"
  ) {
    try {
      const sent = navigator.sendBeacon(
        "/api/analytics",
        new Blob([body], { type: "application/json" })
      );
      if (sent) return;
    } catch {
      // Fall through to fetch below.
    }
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Analytics must never break the user experience; drop on failure.
  });
}

/** Records a page view for the given path (also mirrored to GA4). */
export function trackPageView(path: string): void {
  if (!shouldTrack()) return;

  queue.pageViews.push({
    path,
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
    screenWidth:
      typeof window !== "undefined" && Number.isInteger(window.screen?.width)
        ? window.screen.width
        : null,
    ts: Date.now(),
  });

  forwardToGa4("page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });

  flushIfFull();
}

/** Records a custom analytics event (also mirrored to GA4). */
export function trackEvent(name: string, options: TrackEventOptions = {}): void {
  if (!shouldTrack()) return;

  const event: QueuedEvent = {
    name,
    category: options.category ?? "general",
    label: options.label ?? null,
    path: window.location.pathname,
    value: typeof options.value === "number" && Number.isFinite(options.value) ? options.value : null,
    metadata: options.metadata ?? {},
    ts: Date.now(),
  };
  queue.events.push(event);

  forwardToGa4(name, {
    event_category: event.category,
    event_label: event.label ?? undefined,
    value: event.value ?? undefined,
  });

  flushIfFull();
}

/**
 * Starts periodic flushing plus flush-on-hide/unload listeners.
 * Safe to call multiple times; only the first call registers listeners.
 */
export function initAnalyticsQueue(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  flushTimer = window.setInterval(flushAnalyticsQueue, FLUSH_INTERVAL_MS);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushAnalyticsQueue();
  });
  window.addEventListener("pagehide", flushAnalyticsQueue);
}

/** Stops the periodic flush timer (used by tests / hot reload). */
export function stopAnalyticsQueue(): void {
  if (flushTimer !== null) {
    window.clearInterval(flushTimer);
    flushTimer = null;
  }
  initialized = false;
}
