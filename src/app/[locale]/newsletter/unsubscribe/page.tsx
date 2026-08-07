"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function NewsletterUnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const isBn = typeof window !== "undefined" ? window.location.pathname.split("/")[1] === "bn" : true;

  const [status, setStatus] = useState<"loading" | "success" | "error" | "already">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (token) params.set("token", token);
    if (email) params.set("email", email);
    params.set("locale", isBn ? "bn" : "en");

    if (!token && !email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      setMessage(isBn ? "টোকেন পাওয়া যায়নি" : "No token");
      return;
    }

    fetch(`/api/newsletter/unsubscribe?${params.toString()}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          if (data.already) setStatus("already");
          else setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.error || "Failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage(isBn ? "নেটওয়ার্ক সমস্যা" : "Network error");
      });
  }, [token, email, isBn]);

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <GlassCard className="p-8 text-center">
        {status === "loading" ? (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-muted-foreground" />
            <h1 className="mt-4 text-heading-sm font-bold bn">{isBn ? "আনসাবস্ক্রাইব করা হচ্ছে..." : "Unsubscribing..."}</h1>
          </>
        ) : status === "success" || status === "already" ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="mt-4 text-heading-sm font-bold bn">{status === "already" ? (isBn ? "ইতিমধ্যে আনসাবস্ক্রাইবড" : "Already unsubscribed") : isBn ? "আনসাবস্ক্রাইব সম্পন্ন" : "Unsubscribed"}</h1>
            <p className="mt-2 text-muted-foreground bn">{message || (isBn ? "আপনাকে নিউজলেটার থেকে সরানো হয়েছে।" : "You have been removed from the newsletter.")}</p>
            <p className="mt-2 text-xs text-muted-foreground bn">{isBn ? "আবার যুক্ত হতে চাইলে হোমপেজ থেকে সাবস্ক্রাইব করুন।" : "To rejoin, subscribe again from the homepage."}</p>
            <div className="mt-6">
              <Link href={`/${isBn ? "bn" : "en"}`}>
                <Button variant="outline">{isBn ? "হোমে ফিরুন" : "Back to home"}</Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="mt-4 text-heading-sm font-bold bn">{isBn ? "সমস্যা হয়েছে" : "Failed"}</h1>
            <p className="mt-2 text-muted-foreground">{message}</p>
            <div className="mt-6">
              <Link href={`/${isBn ? "bn" : "en"}`}>
                <Button variant="outline">{isBn ? "হোম" : "Home"}</Button>
              </Link>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
}
