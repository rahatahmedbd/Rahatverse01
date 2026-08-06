"use client";

import Link from "next/link";
import { WifiOff, RefreshCw } from "lucide-react";

// ── Offline Page ───────────────────────────────────────
// Shows when user is offline (PWA)
export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-void p-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
          <WifiOff className="h-10 w-10 text-amber-400" />
        </div>
        <h1 className="text-2xl font-bold bn">ইন্টারনেট সংযোগ নেই</h1>
        <p className="mt-2 text-sm text-amber-400/60">No Internet Connection</p>
        <p className="mt-4 text-muted-foreground bn">
          আপনার ইন্টারনেট সংযোগ চেক করুন এবং আবার চেষ্টা করুন।
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            আবার চেষ্টা করুন
          </button>
          <Link
            href="/bn"
            className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-foreground transition-all hover:border-primary/30"
          >
            হোম পেজে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
