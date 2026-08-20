import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  RAHAT_PORTRAIT_FIT,
  RAHAT_PROFILE_ALT_BN,
  RAHAT_PROFILE_ALT_EN,
  RAHAT_PROFILE_PHOTO,
} from "@/lib/profile";

interface RahatPortraitProps {
  alt?: string;
  locale?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  rounded?: "full" | "xl" | "2xl" | "3xl";
  src?: string;
}

const roundedMap = {
  full: "rounded-full",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
};

/**
 * Local portrait that always shows Rahat's face (upper-third crop).
 * Use anywhere a person-avatar is needed instead of initials or icons.
 */
export function RahatPortrait({
  alt,
  locale = "bn",
  className,
  sizes = "96px",
  priority = false,
  rounded = "full",
  src,
}: RahatPortraitProps) {
  const resolvedAlt = alt ?? (locale === "bn" ? RAHAT_PROFILE_ALT_BN : RAHAT_PROFILE_ALT_EN);

  return (
    <span
      className={cn("relative inline-block overflow-hidden", roundedMap[rounded], className)}
      data-testid="rahat-portrait"
    >
      <Image
        src={src || RAHAT_PROFILE_PHOTO}
        alt={resolvedAlt}
        fill
        sizes={sizes}
        priority={priority}
        className={RAHAT_PORTRAIT_FIT}
      />
    </span>
  );
}
