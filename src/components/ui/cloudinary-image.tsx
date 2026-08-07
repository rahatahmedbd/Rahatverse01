// ── Cloudinary Image Component ─────────────────────────
"use client";

import * as React from "react";
import { CldImage } from "next-cloudinary";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";
import { ImageSkeleton } from "@/components/ui/blur-image";

export interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
  showSkeleton?: boolean;
  fallbackType?: "profile" | "default";
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Cloudinary Image Component
 * Optimized image component using Cloudinary with Blur-up and Skeleton shimmer
 */
export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  className,
  wrapperClassName,
  priority = false,
  showSkeleton = true,
  fallbackType,
  onLoad,
  onError,
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches);
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Local previews and deployments without media credentials must remain
  // renderable. The real Cloudinary image is used whenever it is configured.
  if (!cloudName || hasError) {
    const isProfile =
      fallbackType === "profile" ||
      publicId.includes("profile") ||
      alt.includes("রাহাত") ||
      alt.toLowerCase().includes("rahat");

    if (isProfile) {
      return (
        <div
          role="img"
          aria-label={alt}
          data-testid="cloudinary-image-fallback"
          className={cn(
            "flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-amber-500/20 via-primary/30 to-amber-600/10 p-4 text-center select-none",
            wrapperClassName,
            className
          )}
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-3xl font-bold tracking-wider text-primary drop-shadow-md sm:text-4xl">
              RA
            </span>
            <span className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/90">
              Rahat Ahmed
            </span>
          </div>
        </div>
      );
    }

    return (
      <div
        role="img"
        aria-label={alt}
        data-testid="cloudinary-image-fallback"
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-card to-primary/5 p-4 text-center text-muted-foreground",
          wrapperClassName,
          className
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Camera className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-muted-foreground line-clamp-2">
            {alt}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden inline-block",
        wrapperClassName
      )}
      data-testid="cloudinary-image-container"
    >
      {isLoading && showSkeleton && <ImageSkeleton />}
      <CldImage
        src={publicId}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className={cn(
          "object-cover transition-all duration-700 ease-out",
          isLoading
            ? prefersReducedMotion
              ? "opacity-0"
              : "scale-105 blur-md opacity-0"
            : prefersReducedMotion
              ? "opacity-100"
              : "scale-100 blur-0 opacity-100",
          className
        )}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
