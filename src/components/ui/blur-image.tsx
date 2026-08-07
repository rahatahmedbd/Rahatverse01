"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ── Blur-Up Image — Phase F "ইমেজ এনহ্যান্সমেন্ট" ──
// Shows a shimmer skeleton placeholder until the image has loaded, then
// crossfades the real image in with a subtle blur-to-sharp reveal. Wraps
// next/image so it inherits all of its optimisations (lazy loading, srcset).

export interface BlurUpImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Class for the wrapped image element (e.g. object-cover). */
  imgClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

export function BlurUpImage({
  src,
  alt,
  className,
  imgClassName,
  fill = true,
  width,
  height,
  priority = false,
  sizes,
}: BlurUpImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Shimmer skeleton placeholder */}
      <div
        aria-hidden="true"
        className={cn(
          "animate-shimmer absolute inset-0 bg-muted/60 transition-opacity duration-500",
          loaded && "opacity-0"
        )}
      />
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        priority={priority}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-all duration-700",
          loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105",
          imgClassName
        )}
      />
    </div>
  );
}
