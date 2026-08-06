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
  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}
