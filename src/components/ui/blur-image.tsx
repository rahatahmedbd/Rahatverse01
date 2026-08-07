"use client";

import * as React from "react";
import Image, { ImageProps as NextImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";

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
        "absolute inset-0 z-0 overflow-hidden rounded-inherit bg-muted/60",
        className
      )}
    >
      <div className="animate-shimmer absolute inset-0 h-full w-full" />
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
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

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
      >
        <Camera className="mb-2 h-8 w-8 text-primary/40" />
        {fallbackText ? (
          <span className="text-xs font-medium text-muted-foreground">
            {fallbackText}
          </span>
        ) : (
          <span className="text-xs font-medium text-muted-foreground">
            {alt || "Image preview"}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        props.fill ? "h-full w-full" : "inline-block",
        wrapperClassName
      )}
      data-testid="blur-image-container"
    >
      {isLoading && showSkeleton && <ImageSkeleton />}
      <Image
        src={src}
        alt={alt}
        priority={priority}
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
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
}
