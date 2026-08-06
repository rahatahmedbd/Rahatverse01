"use client";

import { useEffect } from "react";

// ── Client Error Reporter ──────────────────────────────
// Captures runtime errors and unhandled promise rejections and reports them
// to /api/logs so they appear in the admin System Logs viewer. Best-effort;
// never blocks or breaks the UI.

export function ErrorReporter() {
  useEffect(() => {
    const report = (level: "warn" | "error", message: string, metadata?: unknown) => {
      try {
        fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            level,
            source: "client",
            message: message.slice(0, 2000),
            metadata: metadata && typeof metadata === "object"
              ? { ...(metadata as Record<string, unknown>) }
              : {},
          }),
          keepalive: true,
        }).catch(() => {});
      } catch {
        // Never break the app when logging fails.
      }
    };

    const onError = (event: ErrorEvent) => {
      report("error", event.message || "Uncaught error", {
        file: event.filename,
        line: event.lineno,
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      report("error", reason instanceof Error ? reason.message : String(reason));
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
