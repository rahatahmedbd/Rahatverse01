"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Section Title Component ────────────────────────────
interface SectionTitleProps {
  badge?: string;
  title: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  className?: string;
  align?: "left" | "center" | "right";
  locale?: string;
  /** HTML heading level. Defaults to "h2". Use "h1" only for the page's single primary heading. */
  as?: "h1" | "h2";
}

export function SectionTitle({
  badge,
  title,
  titleBn,
  subtitle,
  subtitleBn,
  className,
  align = "center",
  locale = "bn",
  as = "h2",
}: SectionTitleProps) {
  const HeadingTag = motion[as];
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
      className={cn("mb-7 sm:mb-8", alignMap[align], className)}
      initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    >
      {badge && (
        <motion.span
          className="gradient-badge gradient-border heading-kicker mb-3 inline-block rounded-full border border-transparent px-3 py-1"
          initial={{ opacity: 0, scale: 0.85, y: 6 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 22, delay: 0.08 }}
        >
          {badge}
        </motion.span>
      )}

      <HeadingTag
        className={cn(
          "text-gradient text-heading-lg font-bold",
          locale === "bn" && "bn"
        )}
        initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ delay: 0.16, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {displayTitle}
      </HeadingTag>

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
