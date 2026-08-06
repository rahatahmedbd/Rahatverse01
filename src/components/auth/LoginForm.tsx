"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LockKeyhole, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

interface LoginFormProps {
  locale: string;
}

export function LoginForm({ locale }: LoginFormProps) {
  const isBn = locale === "bn";
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const supabase = createClient();
    if (!supabase) {
      setError(isBn ? "লগইন সার্ভিস এখন কনফিগার করা নেই।" : "The login service is not configured.");
      setIsSubmitting(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(isBn ? "ইমেইল বা পাসওয়ার্ড সঠিক নয়।" : "The email or password is incorrect.");
      setIsSubmitting(false);
      return;
    }

    const requestedPath = searchParams.get("next");
    const safeDestination = requestedPath?.startsWith(`/${locale}/dashboard`)
      ? requestedPath
      : `/${locale}/dashboard`;

    router.replace(safeDestination);
    router.refresh();
  };

  return (
    <GlassCard className="w-full max-w-md">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <LockKeyhole className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold bn">{isBn ? "অ্যাডমিন লগইন" : "Admin sign in"}</h1>
        <p className="mt-2 text-sm text-muted-foreground bn">
          {isBn ? "ড্যাশবোর্ড ব্যবহারের জন্য লগইন করুন।" : "Sign in to access the dashboard."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="email">
            {isBn ? "ইমেইল" : "Email"}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-border bg-background p-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="password">
            {isBn ? "পাসওয়ার্ড" : "Password"}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border border-border bg-background p-3 text-sm"
          />
        </div>

        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          {isSubmitting ? (isBn ? "লগইন হচ্ছে..." : "Signing in...") : (isBn ? "লগইন করুন" : "Sign in")}
        </Button>
      </form>
    </GlassCard>
  );
}
