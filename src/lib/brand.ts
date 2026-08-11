// ── Brand assets ───────────────────────────────────────
// Single source of truth for the RahatVerse badge logo. The artwork lives in
// Cloudinary (public_id below) and is delivered as a circular PNG via
// Cloudinary's own transforms — `c_pad` letterboxes onto a square canvas
// without touching the artwork, `r_max` rounds that square into a circle,
// and `f_png` preserves transparency in the corners. No pixels are altered.

export const BRAND_CLOUD_NAME = "kbc3dfnj";
export const BRAND_LOGO_PUBLIC_ID = "file_00000000ae388207be40b5dcd3c9a81b_jygogn";
export const BRAND_LOGO_VERSION = "v1786455518";

function cloudinaryUrl(transformation: string): string {
  return `https://res.cloudinary.com/${BRAND_CLOUD_NAME}/image/upload/${transformation}/${BRAND_LOGO_VERSION}/${BRAND_LOGO_PUBLIC_ID}.png`;
}

/** Circular badge PNG with transparent corners — use everywhere. */
export function brandLogoCircleUrl(size = 1200): string {
  return cloudinaryUrl(`c_pad,w_${size},h_${size},b_transparent,r_max,f_png,q_auto`);
}

/** Square opaque variant — Apple touch icons flatten transparency anyway. */
export function brandLogoSquareUrl(size = 180): string {
  return cloudinaryUrl(`c_pad,w_${size},h_${size},b_black,f_png,q_auto`);
}

/** Default high-res circular logo (1200px). */
export const BRAND_LOGO_URL = brandLogoCircleUrl(1200);

export const BRAND_LOGO_ALT = "RahatVerse logo";
