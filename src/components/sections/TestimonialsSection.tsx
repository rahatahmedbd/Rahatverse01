"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { Star, Quote, ChevronLeft, ChevronRight, Pause, Play, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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

const DEFAULT_TESTIMONIAL_ITEMS: Testimonial[] = [
  {
    id: "test-1",
    name: "Ahmed Raza",
    role: "Founder & CEO",
    company: "Sylhet Tech Hub",
    content:
      "Rahat built our company website with incredible speed and attention to detail. His full-stack skills and responsive UI design are outstanding!",
    rating: 5,
    created_at: "2025-06-15",
  },
  {
    id: "test-2",
    name: "Tanvir Chowdhury",
    role: "Project Director",
    company: "Shantichakra Blood Society",
    content:
      "Rahat's leadership and technical contribution to our organization have been transformational. Highly recommended for any web development or social initiative!",
    rating: 5,
    created_at: "2025-05-10",
  },
  {
    id: "test-3",
    name: "Mahmudul Hasan",
    role: "Academic Supervisor",
    company: "Jibdara Education Project",
    content:
      "A brilliant student and a dedicated teacher. His commitment to education and social service is an inspiration to young people across Bangladesh.",
    rating: 5,
    created_at: "2025-04-20",
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      const res = await fetch("/api/testimonials", { signal: controller.signal });
      const data = await res.json();

      if (data.data && data.data.length > 0) {
        const sorted = data.data
          .sort((a: Testimonial, b: Testimonial) => b.rating - a.rating)
          .slice(0, limit);
        setTestimonials(sorted);
      } else {
        setTestimonials(DEFAULT_TESTIMONIAL_ITEMS);
      }
    } catch {
      setTestimonials(DEFAULT_TESTIMONIAL_ITEMS);
    } finally {
      clearTimeout(timeoutId);
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

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-0 sm:px-4">
        <SectionTitle
          badge={isBn ? "💬 মতামত ও মূল্যায়ন" : "💬 Client Testimonials"}
          title="Client Testimonials"
          titleBn="ক্লায়েন্টদের মতামত"
          subtitle="What my clients say about my work and collaboration"
          subtitleBn="আমার কাজের মান ও অভিজ্ঞতা নিয়ে ক্লায়েন্টদের প্রতিক্রিয়া"
          locale={locale}
        />

        {count === 0 ? (
          /* Be Our First Client — Pioneer Partner Coming-Soon State */
          <div className="relative mx-auto mt-10 max-w-3xl">
            <div className="glass-interactive relative overflow-hidden rounded-3xl border border-primary/30 bg-card/70 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
              <Quote className="pointer-events-none absolute -bottom-6 -right-6 h-48 w-48 text-primary/5 rotate-12" />

              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 border border-primary/25 text-xs font-semibold text-primary uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isBn ? "আমাদের প্রথম ক্লায়েন্ট হন" : "Be Our First Client"}</span>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>

              {/* Placeholder Testimonial Quote */}
              <p className="relative z-10 mb-8 text-base sm:text-lg italic text-foreground/95 bn leading-relaxed">
                &ldquo;
                {isBn
                  ? "আপনার প্রজেক্টের অভিজ্ঞতা ও মতামত এখানে প্রদর্শিত হবে! আমাদের প্রথম ক্লায়েন্ট হিসেবে আপনি পাবেন সর্বোচ্চ অগ্রাধিকার, ডেডিকেটেড সাপোর্ট এবং প্রজেক্ট প্যাকেজে বিশেষ ছাড়।"
                  : "Your testimonial and collaboration story will be featured right here! As our pioneering client, you'll receive top-priority development, dedicated support, and an exclusive partner discount."}
                &rdquo;
              </p>

              {/* Client Card Layout: Avatar/initial, Client Name, Role */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/50 pt-5">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-base shadow-md">
                    ★
                  </div>
                  <div>
                    <p className="text-base font-bold text-foreground bn">
                      {isBn ? "আপনার নাম বা প্রতিষ্ঠানের নাম" : "Your Name / Company Here"}
                    </p>
                    <p className="text-xs sm:text-sm text-primary font-medium bn">
                      {isBn ? "প্রথম ক্লায়েন্ট • কাস্টম ওয়েব প্রজেক্ট" : "Pioneer Partner • Custom Web Project"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Button size="sm" variant="gradient" asChild className="rounded-xl shadow-sm">
                    <Link href={`/${locale}/contact`} className="inline-flex items-center gap-1.5">
                      <span>{isBn ? "প্রথম ক্লায়েন্ট হন" : "Be Our First Client"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild className="rounded-xl">
                    <Link href={`/${locale}/services`}>
                      {isBn ? "প্যাকেজ দেখুন" : "View Packages"}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Glassmorphism Quote Carousel for Real Testimonials */
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
                    <Quote className="pointer-events-none absolute -bottom-6 -right-6 h-44 w-44 text-primary/5 rotate-12" />

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

                    <p className="relative z-10 mb-8 text-base sm:text-lg italic text-foreground/95 bn leading-relaxed">
                      &ldquo;{currentTestimonial.content}&rdquo;
                    </p>

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
        )}
      </div>
    </section>
  );
}
