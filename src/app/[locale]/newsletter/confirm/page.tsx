"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";

export default function NewsletterConfirmPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const locale = searchParams.get("locale") === "en" ? "en" : "bn";
  // derive locale from path as fallback
  const pathLocale = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "bn";
  const isBn = (locale === "bn" && pathLocale !== "en") || pathLocale === "bn";

  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      setMessage(isBn ? "টোকেন পাওয়া যায়নি।" : "No token provided.");
      return;
    }

    fetch(`/api/newsletter/confirm?token=${encodeURIComponent(token)}&locale=${isBn ? "bn" : "en"}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
        } else if (data.code === "TOKEN_EXPIRED") {
          setStatus("expired");
          setMessage(data.error);
        } else {
          setStatus("error");
          setMessage(data.error || "Failed to confirm");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage(isBn ? "নেটওয়ার্ক সমস্যা" : "Network error");
      });
  }, [token, isBn]);

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <GlassCard className="p-8 text-center">
        {status === "loading" ? (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-amber-400" />
            <h1 className="mt-4 text-heading-sm font-bold bn">{isBn ? "নিশ্চিত করা হচ্ছে..." : "Confirming..."}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{isBn ? "অনুগ্রহ করে অপেক্ষা করুন" : "Please wait"}</p>
          </>
        ) : status === "success" ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="mt-4 text-heading-md font-bold bn">{isBn ? "ধন্যবাদ! 🎉" : "Thank you! 🎉"}</h1>
            <p className="mt-2 text-muted-foreground bn">{message || (isBn ? "আপনার ইমেইল সফলভাবে নিশ্চিত হয়েছে।" : "Your email has been confirmed.")}</p>
            <p className="mt-2 text-sm text-muted-foreground bn">
              {isBn ? "এখন থেকে নতুন আপডেট সরাসরি পাবেন।" : "You'll now receive updates."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href={`/${isBn ? "bn" : "en"}`}>
                <Button variant="gradient">{isBn ? "হোমে ফিরুন" : "Back to home"}</Button>
              </Link>
              <Link href={`/${isBn ? "bn" : "en"}/blog`}>
                <Button variant="outline">{isBn ? "ব্লগ দেখুন" : "View blog"}</Button>
              </Link>
            </div>
          </>
        ) : status === "expired" ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15">
              <AlertCircle className="h-8 w-8 text-amber-400" />
            </div>
            <h1 className="mt-4 text-heading-sm font-bold bn">{isBn ? "লিংক মেয়াদোত্তীর্ণ" : "Link expired"}</h1>
            <p className="mt-2 text-muted-foreground bn">{message}</p>
            <p className="mt-2 text-sm text-muted-foreground bn">{isBn ? "আবার সাবস্ক্রাইব করে নতুন লিংক নিন।" : "Subscribe again to get a new link."}</p>
            <div className="mt-6">
              <Link href={`/${isBn ? "bn" : "en"}/#newsletter`}>
                <Button variant="gradient">
                  <Mail className="h-4 w-4" /> {isBn ? "পুনরায় সাবস্ক্রাইব" : "Resubscribe"}
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="mt-4 text-heading-sm font-bold bn">{isBn ? "নিশ্চিত করা যায়নি" : "Confirmation failed"}</h1>
            <p className="mt-2 text-muted-foreground bn">{message}</p>
            <div className="mt-6 flex justify-center gap-3">
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
