// ── Cloudinary Utilities ───────────────────────────────

/**
 * Generate a Cloudinary URL for an image
 */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: "auto" | number;
    format?: "auto" | "webp" | "avif";
  } = {}
): string {
  const { width, height, quality = "auto", format = "auto" } = options;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.warn("Cloudinary cloud name not configured");
    return "";
  }

  const transformations = [
    quality === "auto" ? "q_auto" : `q_${quality}`,
    format === "auto" ? "f_auto" : `f_${format}`,
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    "c_limit",
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
}

/**
 * Get a placeholder blur URL for Cloudinary images
 */
export function getBlurUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 20,
    quality: 1,
  });
}
