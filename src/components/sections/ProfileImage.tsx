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
    lg: "h-48 w-48 sm:h-52 sm:w-52",
  };

  const ringSizeMap = {
    sm: "h-28 w-28",
    md: "h-40 w-40",
    lg: "h-56 w-56 sm:h-60 sm:w-60",
  };

  const styles = frameStyles[frame];
  const resolvedPublicId = publicId || IMAGE_IDS.PROFILE;
  const useCloudinary = !src;

  return (
    <div className={cn("relative inline-flex items-center justify-center pb-3", className)}>
      {/* Outer Ambient Halo */}
      <motion.div
        className={cn("absolute rounded-full blur-2xl bg-amber-500/15", ringSizeMap[size])}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rotating Dashed Tech Ring */}
      <motion.div
        className={cn("absolute rounded-full border border-dashed border-amber-500/40", ringSizeMap[size])}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Counter-rotating Subtle Accent Ring */}
      <motion.div
        className={cn("absolute rounded-full border border-amber-500/20", ringSizeMap[size])}
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
            width={size === "lg" ? 220 : size === "md" ? 144 : 96}
            height={size === "lg" ? 220 : size === "md" ? 220 : 96}
            className="h-full w-full object-cover"
            priority
            fallbackType="profile"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        )}
      </motion.div>

      {/* Premium Status Pill */}
      {showStatus && (
        <motion.div
          className="absolute -bottom-1 z-20 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-card/95 px-3 py-1 text-[11px] font-medium text-emerald-400 shadow-xl backdrop-blur-md"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          title={statusLabel}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="bn">{statusLabel}</span>
        </motion.div>
      )}
    </div>
  );
}
