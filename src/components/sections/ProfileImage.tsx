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

// Per-frame premium styling: soft rim, gradient ring, shadow & ambient glow
const frameStyles: Record<
  AboutFrameStyle,
  { rim: string; gradient: string; shadow: string; glow: string }
> = {
  amber: {
    rim: "border-amber-400/30",
    gradient: "from-amber-300/90 via-amber-500/70 to-purple-500/80",
    shadow: "shadow-amber-500/25",
    glow: "bg-amber-500/20",
  },
  blue: {
    rim: "border-blue-400/30",
    gradient: "from-blue-300/90 via-blue-500/70 to-cyan-400/80",
    shadow: "shadow-blue-500/25",
    glow: "bg-blue-500/20",
  },
  emerald: {
    rim: "border-emerald-400/30",
    gradient: "from-emerald-300/90 via-emerald-500/70 to-teal-400/80",
    shadow: "shadow-emerald-500/25",
    glow: "bg-emerald-500/20",
  },
  purple: {
    rim: "border-purple-400/30",
    gradient: "from-purple-300/90 via-purple-500/70 to-fuchsia-400/80",
    shadow: "shadow-purple-500/25",
    glow: "bg-purple-500/20",
  },
  rose: {
    rim: "border-rose-400/30",
    gradient: "from-rose-300/90 via-rose-500/70 to-pink-400/80",
    shadow: "shadow-rose-500/25",
    glow: "bg-rose-500/20",
  },
};

// Accent color used for the rotating conic "rim light" ring
const conicColors: Record<AboutFrameStyle, string> = {
  amber: "rgba(245, 158, 11, 0.6)",
  blue: "rgba(59, 130, 246, 0.6)",
  emerald: "rgba(16, 185, 129, 0.6)",
  purple: "rgba(139, 92, 246, 0.6)",
  rose: "rgba(244, 63, 94, 0.6)",
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
      {/* Gentle idle float — gives the avatar a light "product" 3D presence */}
      <motion.div
        className="relative inline-flex items-center justify-center"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.04 }}
      >
        {/* Ambient Halo */}
        <motion.div
          className={cn("absolute rounded-full blur-2xl", ringSizeMap[size], styles.glow)}
          animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />

        {/* Rotating Conic Rim Light (premium arc ring) */}
        <motion.div
          className={cn("absolute rounded-full", ringSizeMap[size])}
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, ${conicColors[frame]} 65deg, transparent 150deg, ${conicColors[frame]} 240deg, transparent 310deg, ${conicColors[frame]} 355deg, transparent 360deg)`,
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px))",
            }}
          />
        </motion.div>

        {/* Soft Static Ring */}
        <div
          className={cn(
            "absolute rounded-full border",
            ringSizeMap[size],
            styles.rim,
            "opacity-50"
          )}
          aria-hidden="true"
        />

        {/* Gradient Rim + Circular Image */}
        <div
          className={cn(
            "relative rounded-full bg-gradient-to-br p-[3px]",
            sizeMap[size],
            styles.gradient,
            "shadow-2xl",
            styles.shadow
          )}
        >
          <div className="relative h-full w-full overflow-hidden rounded-full bg-brand-gradient-soft">
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
          </div>
        </div>

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
      </motion.div>
    </div>
  );
}
