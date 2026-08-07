"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { Star, Quote, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  created_at: string;
}

interface TestimonialsSectionProps {
  locale?: string;
  limit?: number;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: "test-1",
    name: "Mahmudur Rahman",
    role: "CEO",
    company: "Dhaka Tech Hub",
    content:
      "রাহাত অসাধারণ কাজ করেছে! আমাদের ই-কমার্স ওয়েবসাইটের গতি ও ডিজাইন গ্রাহকদের খুব পছন্দ হয়েছে। Next.js 16 ও Supabase দিয়ে চমৎকার সমাধান দিয়েছে।",
    rating: 5,
    created_at: "2025-07-20",
  },
  {
    id: "test-2",
    name: "Dr. Arifur Rahman",
    role: "President",
    company: "Shantichakra Blood Society",
    content:
      "শান্তিচক্র ব্লাড সোসাইটির ডিজিটাল প্ল্যাটফর্ম তৈরিতে রাহাতের অবদান অতুলনীয়। রক্তদাতা অনুসন্ধান ও নোটিফিকেশন সিস্টেম খুবই ইউজার-ফ্রেন্ডলি।",
    rating: 5,
    created_at: "2025-06-15",
  },
  {
    id: "test-3",
    name: "Tanvir Ahmed",
    role: "Founder",
    company: "Startup Lab Bangladesh",
    content:
      "Rahat delivered our project ahead of schedule with remarkable code clarity, clean UI, and responsive animations. Highly recommended!",
    rating: 5,
    created_at: "2025-05-10",
  },
];

export default function TestimonialsSection({
  locale = "bn",
  limit = 6,
}: TestimonialsSectionProps) {
  const isBn = locale === "bn";
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();

      if (data.data && data.data.length > 0) {
        const sorted = data.data
          .sort((a: Testimonial, b: Testimonial) => b.rating - a.rating)
          .slice(0, limit);
        setTestimonials(sorted);
      } else {
        setTestimonials(fallbackTestimonials);
      }
    } catch {
      setTestimonials(fallbackTestimonials);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTestimonials();
  }, [fetchTestimonials]);

  const count = testimonials.length;

  const handleNext = useCallback(() => {
    if (count === 0) return;
    setCurrentIndex((prev) => (prev + 1) % count);
  }, [count]);

  const handlePrev = useCallback(() => {
    if (count === 0) return;
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  // Phase I Auto-playing carousel timer (5000ms)
  useEffect(() => {
    if (isPaused || count <= 1) return;
    timerRef.current = setInterval(handleNext, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [handleNext, isPaused, count]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const currentTestimonial = testimonials[currentIndex] || fallbackTestimonials[0];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4">
        <SectionTitle
          badge={isBn ? "💬 মতামত" : "💬 Testimonials"}
          title="Client Testimonials"
          titleBn="ক্লায়েন্টদের মতামত"
          subtitle="What my clients say about my work and collaboration"
          subtitleBn="আমার কাজের মান ও অভিজ্ঞতা নিয়ে ক্লায়েন্টদের প্রতিক্রিয়া"
          locale={locale}
        />

        {/* Phase I Glassmorphism Quote Carousel */}
        <div
          data-testid="testimonials-carousel"
          className="relative mx-auto mt-10 max-w-3xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Main Glass Quote Card */}
          <div className="relative overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="glass-interactive relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
                  {/* Decorative quote watermark icon in background */}
                  <Quote className="pointer-events-none absolute -bottom-6 -right-6 h-44 w-44 text-primary/5 rotate-12" />

                  {/* Top Quote Icon & Rating */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Quote className="h-6 w-6" />
                    </div>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={cn(
                            "h-4 w-4",
                            idx < currentTestimonial.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quote Content */}
                  <p className="relative z-10 mb-8 text-base sm:text-lg italic text-foreground/95 bn leading-relaxed">
                    &ldquo;{currentTestimonial.content}&rdquo;
                  </p>

                  {/* Author Meta */}
                  <div className="relative z-10 flex items-center justify-between border-t border-border/40 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-amber-500 text-white font-bold text-lg shadow-md">
                        {currentTestimonial.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground bn">
                          {currentTestimonial.name}
                        </p>
                        {(currentTestimonial.role || currentTestimonial.company) && (
                          <p className="text-xs sm:text-sm text-primary font-medium bn">
                            {currentTestimonial.role}
                            {currentTestimonial.role && currentTestimonial.company && " • "}
                            {currentTestimonial.company}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Pause/Play status button */}
                    <button
                      type="button"
                      onClick={() => setIsPaused((p) => !p)}
                      className="rounded-full p-2 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                      aria-label={isPaused ? "Play carousel" : "Pause carousel"}
                    >
                      {isPaused ? (
                        <Play className="h-4 w-4" />
                      ) : (
                        <Pause className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Navigation Controls */}
          {count > 1 && (
            <div className="mt-6 flex items-center justify-between">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300",
                      idx === currentIndex
                        ? "w-8 bg-primary shadow-sm shadow-primary/50"
                        : "w-2.5 bg-border/60 hover:bg-muted-foreground"
                    )}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full border-border bg-card/60 hover:border-primary/50 hover:bg-primary/10"
                  onClick={handlePrev}
                  aria-label={isBn ? "পূর্ববর্তী মতামত" : "Previous testimonial"}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full border-border bg-card/60 hover:border-primary/50 hover:bg-primary/10"
                  onClick={handleNext}
                  aria-label={isBn ? "পরবর্তী মতামত" : "Next testimonial"}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
