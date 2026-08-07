"use client";

import { useSearchParams } from "next/navigation";
import { GlassCard } from "@/components/ui/card";
import { NewsletterPreferences } from "@/components/newsletter/NewsletterPreferences";
import { AlertCircle } from "lucide-react";

export default function PreferencesPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const isBn = typeof window !== "undefined" ? window.location.pathname.split("/")[1] === "bn" : true;

  if (!token) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <GlassCard className="p-8 text-center border-red-500/20">
          <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
          <h1 className="mt-3 text-heading-sm font-bold bn">{isBn ? "টোকেন পাওয়া যায়নি" : "No token"}</h1>
          <p className="mt-2 text-sm text-muted-foreground bn">
            {isBn ? "ইমেইলের লিংক থেকে এই পেজে আসুন।" : "Open this page from the link in your email."}
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-heading-md font-bold bn text-center mb-6">{isBn ? "পছন্দ পরিচালনা" : "Manage preferences"}</h1>
      <NewsletterPreferences token={token} locale={isBn ? "bn" : "en"} />
    </div>
  );
}
