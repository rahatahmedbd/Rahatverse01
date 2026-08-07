// ── Cloudinary Image Component ─────────────────────────
"use client";

import * as React from "react";
import { CldImage } from "next-cloudinary";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";
import { ImageSkeleton } from "@/components/ui/blur-image";
import { PUBLIC_ID_TO_GITHUB_URL_MAP } from "@/lib/cloudinary/utils";

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

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "kbc3dfnj";

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
    const githubFallbackUrl = PUBLIC_ID_TO_GITHUB_URL_MAP[publicId];
    if (githubFallbackUrl) {
      return (
        <div
          role="img"
          aria-label={alt}
          data-testid="cloudinary-image-github-fallback"
          className={cn("relative inline-block overflow-hidden", wrapperClassName, className)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={githubFallbackUrl}
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      );
    }

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
            "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-amber-500/10 via-card to-amber-950/20 select-none",
            wrapperClassName,
            className
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/rahat-avatar.svg"
            alt={alt || "Rahat Ahmed"}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
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
        // Always pass a cloud name so CldImage never throws when
        // NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is missing locally; the real
        // cloud is used whenever the env var is configured.
        config={{ cloud: { cloudName } }}
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
