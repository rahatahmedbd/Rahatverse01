"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { StaggerContainer, StaggerItem } from "@/components/animations/Stagger";
import { Star, Quote, Send, Loader2, CheckCircle2 } from "lucide-react";

// ── Testimonials Section ───────────────────────────────
interface TestimonialsSectionProps {
  locale?: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  created_at: string;
}

export function TestimonialsSection({ locale = "bn" }: TestimonialsSectionProps) {
  const isBn = locale === "bn";
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
  });

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => {
        if (data.data) setTestimonials(data.data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setForm({ name: "", role: "", company: "", content: "", rating: 5 });
        setTimeout(() => {
          setShowForm(false);
          setIsSubmitted(false);
        }, 3000);
      }
    } catch {
      // silent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "⭐ মতামত" : "⭐ Testimonials"}
          title="What People Say"
          titleBn="মানুষ কী বলছে"
          subtitle={
            isBn
              ? "আমার সাথে কাজ করা মানুষদের অভিজ্ঞতা ও মতামত"
              : "Experiences and feedback from people who worked with me"
          }
          locale={locale}
        />

        {/* Existing testimonials */}
        {testimonials.length > 0 ? (
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.id}>
                <GlassCard className="h-full">
                  <Quote className="mb-3 h-6 w-6 text-primary/40" />
                  <p className="text-sm text-muted-foreground bn">{t.content}</p>
                  <div className="mt-4 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-border"}`}
                      />
                    ))}
                  </div>
                  <div className="mt-3 border-t border-border/50 pt-3">
                    <p className="font-semibold bn">{t.name}</p>
                    {t.role && (
                      <p className="text-xs text-muted-foreground bn">
                        {t.role}{t.company ? ` — ${t.company}` : ""}
                      </p>
                    )}
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        ) : (
          <FadeInUp>
            <div className="text-center py-8 text-muted-foreground">
              <p className="bn">{isBn ? "এখনো কোনো মতামত নেই। প্রথম হোন!" : "No testimonials yet. Be the first!"}</p>
            </div>
          </FadeInUp>
        )}

        {/* Submit button or form */}
        <FadeInUp delay={0.2}>
          <div className="mt-8 text-center">
            {!showForm ? (
              <Button variant="glass" onClick={() => setShowForm(true)}>
                <Star className="h-4 w-4" />
                {isBn ? "আপনার মতামত দিন" : "Leave a Testimonial"}
              </Button>
            ) : (
              <GlassCard className="mx-auto max-w-lg mt-4">
                {isSubmitted ? (
                  <div className="py-6 text-center">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-400" />
                    <p className="mt-3 font-semibold bn">
                      {isBn ? "ধন্যবাদ! আপনার মতামত জমা হয়েছে।" : "Thank you! Your testimonial has been submitted."}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-bold bn">{isBn ? "আপনার মতামত" : "Your Testimonial"}</h3>

                    <div>
                      <label className="mb-1 block text-sm font-medium bn">{isBn ? "নাম *" : "Name *"}</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background p-3 text-sm"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium bn">{isBn ? "পদবি" : "Role"}</label>
                        <input
                          type="text"
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          placeholder={isBn ? "যেমন: ছাত্র" : "e.g., Student"}
                          className="w-full rounded-lg border border-border bg-background p-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium bn">{isBn ? "কোম্পানি" : "Company"}</label>
                        <input
                          type="text"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                          className="w-full rounded-lg border border-border bg-background p-3 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium bn">{isBn ? "রেটিং" : "Rating"}</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setForm({ ...form, rating: star })}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-6 w-6 ${star <= form.rating ? "text-amber-400 fill-amber-400" : "text-border"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium bn">{isBn ? "আপনার মতামত *" : "Your Feedback *"}</label>
                      <textarea
                        required
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-border bg-background p-3 text-sm resize-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" variant="gradient" disabled={isSubmitting} className="flex-1">
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {isBn ? "জমা দিন" : "Submit"}
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                        {isBn ? "বাতিল" : "Cancel"}
                      </Button>
                    </div>
                  </form>
                )}
              </GlassCard>
            )}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
