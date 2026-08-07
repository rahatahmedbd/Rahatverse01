"use client";

import Link from "next/link";
import { Megaphone } from "lucide-react";
import { useGlobalConfig } from "@/hooks/useGlobalConfig";

interface AnnouncementBannerProps {
  locale?: string;
}

/** Renders the admin-controlled announcement banner at the top of the site. */
export function AnnouncementBanner({ locale = "bn" }: AnnouncementBannerProps) {
  const isBn = locale === "bn";
  const config = useGlobalConfig();
  const { announcement, header } = config;

  const active = announcement.enabled && (isBn ? announcement.textBn : announcement.textEn);
  const headerActive = header.enabled && (isBn ? header.textBn : header.textEn);

  if (!active && !headerActive) return null;

  const text = active ? (isBn ? announcement.textBn : announcement.textEn) : (isBn ? header.textBn : header.textEn);

  return (
    <div className="w-full bg-primary/10 py-2 text-center text-xs font-medium text-primary">
      {active && announcement.link ? (
        <Link href={announcement.link} target={announcement.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
          <Megaphone className="h-3 w-3" />
          {text}
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2">
          <Megaphone className="h-3 w-3" />
          {text}
        </span>
      )}
    </div>
  );
}
