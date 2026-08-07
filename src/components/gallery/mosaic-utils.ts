export type GalleryLayoutMode = "grid" | "mosaic";

/**
 * Returns Tailwind grid span classes for mosaic / bento-grid layouts.
 * - In "grid" mode: every card is 1 column, aspect-square.
 * - In "mosaic" mode: creates an alternating 6-item bento grid pattern
 *   where featured moments span 2x2 or 2x1.
 */
export function getMosaicSpanClass(
  index: number,
  mode: GalleryLayoutMode = "mosaic"
): string {
  if (mode === "grid") {
    return "col-span-1 aspect-square";
  }

  const patternIndex = index % 6;

  switch (patternIndex) {
    case 0:
      // 2x2 Focal hero bento block
      return "col-span-1 sm:col-span-2 sm:row-span-2 aspect-square";
    case 3:
      // 2x1 Horizontal panorama bento block
      return "col-span-1 sm:col-span-2 aspect-[2/1]";
    default:
      // 1x1 standard square block
      return "col-span-1 aspect-square";
  }
}
