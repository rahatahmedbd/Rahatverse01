"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface StorylineItem {
  id?: string;
  year: string;
  title: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  description: string;
  descriptionBn?: string;
  badge?: string;
  badgeType?:
    | "default"
    | "glow"
    | "outline"
    | "secondary"
    | "destructive"
    | "gradient"
    | "success"
    | "warning"
    | "info";
}

export interface ScrollStorylineProps {
  items: StorylineItem[];
  locale?: string;
  className?: string;
}

export function ScrollStoryline({
  items,
  locale = "bn",
  className,
}: ScrollStorylineProps) {
  const isBn = locale === "bn";
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      ref={containerRef}
      data-testid="scroll-storyline"
      className={cn("relative py-6", className)}
    >
      {/* Background track vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-1 rounded-full bg-border/40 md:left-1/2 md:-translate-x-1/2" />

      {/* Animated scroll storytelling progress beam */}
      <motion.div
        aria-hidden="true"
        style={{ scaleY, transformOrigin: "top" }}
        className="absolute left-4 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-primary via-accent to-cyan-500 shadow-md shadow-primary/40 md:left-1/2 md:-translate-x-1/2"
      />

      {/* Timeline cards */}
      <div className="space-y-12">
        {items.map((item, index) => {
          const isEven = index % 2 === 0;
          const titleText =
            isBn && item.titleBn ? item.titleBn : item.title;
          const subText =
            isBn && item.subtitleBn ? item.subtitleBn : item.subtitle;
          const descText =
            isBn && item.descriptionBn ? item.descriptionBn : item.description;

          return (
            <div
              key={item.id || item.year + index}
              data-testid="storyline-item"
              className={cn(
                "relative flex flex-col md:flex-row items-start",
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              )}
            >
              {/* Glowing milestone dot */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0.5 }}
                whileInView={{ scale: 1.25, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, type: "spring" }}
                className="absolute left-4 top-6 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-primary bg-background shadow-lg shadow-primary/50 md:left-1/2"
              />

              {/* Storytelling card content */}
              <div
                className={cn(
                  "ml-10 w-full md:ml-0 md:w-1/2",
                  isEven ? "md:pr-12" : "md:pl-12"
                )}
              >
                <GlassCard className="relative p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                  {/* Header badges */}
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant="glow" className="text-xs font-semibold">
                      {item.year}
                    </Badge>
                    {item.badge && (
                      <Badge
                        variant={item.badgeType || "outline"}
                        className="text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-foreground bn">
                    {titleText}
                  </h3>

                  {/* Subtitle / Institution */}
                  {subText && (
                    <p className="mt-1 text-xs sm:text-sm font-medium text-primary bn">
                      {subText}
                    </p>
                  )}

                  {/* Description */}
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground bn leading-relaxed">
                    {descText}
                  </p>
                </GlassCard>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
