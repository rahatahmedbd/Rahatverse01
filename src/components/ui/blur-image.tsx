"use client";

import * as React from "react";
import Image, { ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";
import { useMotionPreference } from "@/components/animations/motion-preferences";

export interface BlurImageProps extends Omit<NextImageProps, "onLoad" | "onError"> {
  fallbackText?: string;
  showSkeleton?: boolean;
  wrapperClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function ImageSkeleton({ className }: { className?: string }) {
  return (
    <div
      data-testid="image-skeleton"
      className={cn(
        "absolute inset-0 z-0 overflow-hidden rounded-[inherit] bg-muted/60",
        "motion-reduce:animate-none",
        className
      )}
      aria-hidden="true"
    >
      <div className="animate-shimmer absolute inset-0 h-full w-full motion-reduce:hidden" />
    </div>
  );
}

export function BlurImage({
  src,
  alt,
  className,
  wrapperClassName,
  fallbackText,
  showSkeleton = true,
  priority = false,
  onLoad,
  onError,
  ...props
}: BlurImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const prefersReducedMotion = useMotionPreference();

  const handleLoad = React.useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = React.useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  const isSrcEmpty = !src || src === "";

  if (isSrcEmpty || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        data-testid="blur-image-fallback"
        className={cn(
          "flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4 text-center text-muted-foreground",
          wrapperClassName,
          className
        )}
        style={{ contain: "layout" }}
      >
        <Camera className="mb-2 h-8 w-8 text-primary/40" aria-hidden="true" />
        <span className="text-xs font-medium text-muted-foreground line-clamp-2">
          {fallbackText || alt || "Image preview"}
        </span>
      </div>
    );
  }

  // Determine if fill or fixed size; preserve aspect for CLS
  const hasFixedSize = typeof props.width === "number" && typeof props.height === "number";

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        props.fill ? "h-full w-full" : hasFixedSize ? "inline-block" : "relative w-full",
        wrapperClassName
      )}
      data-testid="blur-image-container"
      style={{ contain: hasFixedSize ? "layout" : undefined }}
    >
      {isLoading && showSkeleton && <ImageSkeleton />}
      <Image
        src={src}
        alt={alt}
        priority={priority}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        sizes={props.sizes || (priority ? "100vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw")}
        className={cn(
          "object-cover transition-all duration-500 ease-out",
          isLoading
            ? prefersReducedMotion
              ? "opacity-0"
              : "scale-[1.02] blur-[6px] opacity-0"
            : prefersReducedMotion
              ? "opacity-100"
              : "scale-100 blur-0 opacity-100",
          className
        )}
        onLoad={handleLoad as unknown as () => void}
        onError={handleError as unknown as () => void}
        {...props}
      />
    </div>
  );
}
