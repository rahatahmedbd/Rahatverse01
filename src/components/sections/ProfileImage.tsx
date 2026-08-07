"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CloudinaryImage } from "@/components/ui/cloudinary-image";
import { IMAGE_IDS } from "@/lib/cloudinary/utils";
import type { AboutFrameStyle } from "@/types/about";

// ── Profile Image with configurable glowing frame ───────
interface ProfileImageProps {
  src?: string;
  publicId?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  frame?: AboutFrameStyle;
  showStatus?: boolean;
  statusLabel?: string;
  className?: string;
}

const frameStyles: Record<AboutFrameStyle, { ring: string; inner: string; shadow: string }> = {
  amber: {
    ring: "border-amber-500/30",
    inner: "border-amber-500/50",
    shadow: "shadow-amber-500/20",
  },
  blue: {
    ring: "border-blue-500/30",
    inner: "border-blue-500/50",
    shadow: "shadow-blue-500/20",
  },
  emerald: {
    ring: "border-emerald-500/30",
    inner: "border-emerald-500/50",
    shadow: "shadow-emerald-500/20",
  },
  purple: {
    ring: "border-purple-500/30",
    inner: "border-purple-500/50",
    shadow: "shadow-purple-500/20",
  },
  rose: {
    ring: "border-rose-500/30",
    inner: "border-rose-500/50",
    shadow: "shadow-rose-500/20",
  },
};

export function ProfileImage({
  src,
  publicId,
  alt = "রাহাত আহমেদ",
  size = "lg",
  frame = "amber",
  showStatus = true,
  statusLabel = "Available",
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

  const styles = frameStyles[frame];
  const resolvedPublicId = publicId || IMAGE_IDS.PROFILE;
  const useCloudinary = !src;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Animated glow ring */}
      <motion.div
        className={cn("absolute rounded-full", ringSizeMap[size], "border-2", styles.ring)}
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Second ring */}
      <motion.div
        className={cn("absolute rounded-full", ringSizeMap[size], "border", styles.ring)}
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Image container */}
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-full",
          sizeMap[size],
          "border-2",
          styles.inner,
          "shadow-2xl",
          styles.shadow,
          "bg-brand-gradient-soft"
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {useCloudinary ? (
          <CloudinaryImage
            publicId={resolvedPublicId}
            alt={alt}
            width={size === "lg" ? 176 : size === "md" ? 144 : 96}
            height={size === "lg" ? 176 : size === "md" ? 144 : 96}
            className="h-full w-full object-cover"
            priority
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        )}
      </motion.div>

      {/* Status indicator */}
      {showStatus && (
        <motion.div
          className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-void bg-green-500"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          title={statusLabel}
          aria-label={statusLabel}
        />
      )}
    </div>
  );
}
