"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Profile Image with Glowing Frame ───────────────────
interface ProfileImageProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProfileImage({
  src,
  alt = "রাহাত আহমেদ",
  size = "lg",
  className,
}: ProfileImageProps) {
  const sizeMap = {
    sm: "h-24 w-24",
    md: "h-36 w-36",
    lg: "h-44 w-44",
  };

  const ringSizeMap = {
    sm: "h-28 w-28",
    md: "h-40 w-40",
    lg: "h-48 w-48",
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Animated glow ring */}
      <motion.div
        className={cn(
          "absolute rounded-full",
          ringSizeMap[size],
          "border-2 border-amber-500/30"
        )}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Second ring */}
      <motion.div
        className={cn(
          "absolute rounded-full",
          ringSizeMap[size],
          "border border-amber-500/10"
        )}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Image container */}
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-full",
          sizeMap[size],
          "border-2 border-amber-500/50",
          "shadow-2xl shadow-amber-500/20",
          "bg-gradient-to-br from-amber-500/20 to-orange-600/20"
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : (
          // Placeholder with initials
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500/30 to-orange-600/30">
            <span className="text-4xl font-bold text-white">RA</span>
          </div>
        )}
      </motion.div>

      {/* Status indicator */}
      <motion.div
        className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-void bg-green-500"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        title="Available"
      />
    </div>
  );
}
