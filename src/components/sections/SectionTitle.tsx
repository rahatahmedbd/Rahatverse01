"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Section Title Component ────────────────────────────
interface SectionTitleProps {
  badge?: string;
  kicker?: string;
  title: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  className?: string;
  align?: "left" | "center" | "right";
  locale?: string;
  underline?: boolean;
}

export function SectionTitle({
  badge,
  kicker,
  title,
  titleBn,
  subtitle,
  subtitleBn,
  className,
  align = "center",
  locale = "bn",
  underline = true,
}: SectionTitleProps) {
  const displayTitle = locale === "bn" && titleBn ? titleBn : title;
  const displaySubtitle = locale === "bn" && subtitleBn ? subtitleBn : subtitle;

  const alignMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const underlineAlignMap = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
  };

  return (
    <motion.div
      className={cn("mb-12", alignMap[align], className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      {kicker && (
        <motion.p
          className={cn("type-kicker mb-2", locale === "bn" && "bn")}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          {kicker}
        </motion.p>
      )}

      {badge && (
        <motion.span
          className="gradient-badge gradient-border heading-kicker mb-3 inline-block rounded-full border border-transparent px-3 py-1"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {badge}
        </motion.span>
      )}

      <motion.h2
        className={cn(
          "font-display text-h2",
          locale === "bn" && "bn",
          underline && cn("gradient-underline", align === "center" && "gradient-underline-center")
        )}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {displayTitle}
      </motion.h2>

      {/* Animated gradient accent underline */}
      <motion.span
        aria-hidden="true"
        className={cn("heading-underline", underlineAlignMap[align])}
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
        style={{ transformOrigin: align === "right" ? "right" : align === "left" ? "left" : "center" }}
      />

      {displaySubtitle && (
        <motion.p
          className={cn("mt-3 text-lead text-muted-foreground", locale === "bn" && "bn")}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {displaySubtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
