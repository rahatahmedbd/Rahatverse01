// ── Cloudinary Image Component ─────────────────────────
"use client";

import { CldImage } from 'next-cloudinary';

interface CloudinaryImageProps {
  publicId: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Cloudinary Image Component
 * Optimized image component using Cloudinary
 */
export function CloudinaryImage({
  publicId,
  alt,
  width,
  height,
  className,
  priority = false,
}: CloudinaryImageProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  // Local previews and deployments without media credentials must remain
  // renderable. The real Cloudinary image is used whenever it is configured.
  if (!cloudName) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className || ""} flex items-center justify-center bg-muted text-muted-foreground`}
      >
        <span aria-hidden="true">{alt.slice(0, 1)}</span>
      </div>
    );
  }

  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
    />
  );
}
