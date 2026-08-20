// ── Cloudinary Image Component — Phase 8 Performance & A11y ─
"use client";

import * as React from "react";
import { CldImage } from "next-cloudinary";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";
import { ImageSkeleton } from "@/components/ui/blur-image";
import { PUBLIC_ID_TO_GITHUB_URL_MAP } from "@/lib/cloudinary/utils";
import { RAHAT_PORTRAIT_FIT, RAHAT_PROFILE_PHOTO } from "@/lib/profile";
import { useMotionPreference } from "@/components/animations/motion-preferences";

export interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
  sizes?: string;
  showSkeleton?: boolean;
  fallbackType?: "profile" | "default";
  onLoad?: () => void;
  onError?: () => void;
}

export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  className,
  wrapperClassName,
  priority = false,
  sizes,
  showSkeleton = true,
  fallbackType,
  onLoad,
  onError,
}: CloudinaryImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const prefersReducedMotion = useMotionPreference();

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "kbc3dfnj";

  const handleLoad = React.useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = React.useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  // Compute aspect ratio for CLS stability
  const w = width || 800;
  const h = height || 600;
  const aspectRatio = `${w} / ${h}`;

  if (!cloudName || hasError) {
    const githubFallbackUrl = PUBLIC_ID_TO_GITHUB_URL_MAP[publicId];
    if (githubFallbackUrl) {
      return (
        <div
          role="img"
          aria-label={alt}
          data-testid="cloudinary-image-github-fallback"
          className={cn("relative inline-block overflow-hidden", wrapperClassName, className)}
          style={{ aspectRatio }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={githubFallbackUrl}
            alt={alt}
            width={w}
            height={h}
            className={cn(
              "h-full w-full transition-transform duration-500 hover:scale-105",
              publicId.includes("profile") ? RAHAT_PORTRAIT_FIT : "object-cover"
            )}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
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
          style={{ aspectRatio }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={RAHAT_PROFILE_PHOTO}
            alt={alt || "Rahat Ahmed"}
            width={w}
            height={h}
            className={cn("h-full w-full transition-transform duration-500 hover:scale-105", RAHAT_PORTRAIT_FIT)}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
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
        style={{ aspectRatio }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary" aria-hidden="true">
            <Camera className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-xs font-medium text-muted-foreground line-clamp-2">{alt}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden inline-block", wrapperClassName)}
      data-testid="cloudinary-image-container"
      style={{ aspectRatio, contain: "layout" }}
    >
      {isLoading && showSkeleton && <ImageSkeleton />}
      <CldImage
        src={publicId}
        alt={alt}
        width={w}
        height={h}
        config={{ cloud: { cloudName } }}
        {...(publicId.includes("profile") ? { crop: "fill" as const, gravity: "north" as const } : {})}
        className={cn(
          publicId.includes("profile") ? RAHAT_PORTRAIT_FIT : "object-cover",
          "transition-all duration-500 ease-out",
          isLoading
            ? prefersReducedMotion
              ? "opacity-0"
              : "scale-[1.02] blur-[6px] opacity-0"
            : prefersReducedMotion
              ? "opacity-100"
              : "scale-100 blur-0 opacity-100",
          className
        )}
        priority={priority}
        sizes={sizes || (priority ? "100vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw")}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
