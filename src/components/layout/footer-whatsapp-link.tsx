"use client";

import { Phone } from "lucide-react";
import { trackEvent } from "@/lib/analytics/tracker";

interface FooterWhatsAppLinkProps {
  href: string;
  phone: string;
  locale: string;
}

export function FooterWhatsAppLink({ href, phone, locale }: FooterWhatsAppLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackEvent("whatsapp_click", {
          category: "conversion",
          metadata: { location: "footer", locale },
        })
      }
      className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      <Phone className="h-4 w-4 shrink-0" />
      <span>{phone}</span>
    </a>
  );
}
