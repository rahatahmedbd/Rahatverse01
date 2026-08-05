"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Trophy,
  ShoppingCart,
  Phone,
} from "lucide-react";

// ── Bottom Navigation Items (Mobile) ───────────────────
const bottomNavItems = [
  { key: "home", path: "/", icon: Home, labelBn: "হোম", labelEn: "Home" },
  { key: "achievements", path: "/achievements", icon: Trophy, labelBn: "অর্জন", labelEn: "Awards" },
  { key: "order", path: "/order", icon: ShoppingCart, labelBn: "অর্ডার", labelEn: "Order" },
  { key: "contact", path: "/contact", icon: Phone, labelBn: "যোগাযোগ", labelEn: "Contact" },
];

// ── Bottom Navigation Bar (App-like) ───────────────────
export function BottomNavBar() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "bn";
  const basePath = `/${locale}`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div
        className={cn(
          "glass mx-4 mb-4 rounded-2xl px-2 py-2",
          "flex items-center justify-around",
          "shadow-xl shadow-black/30",
          "border border-border/50"
        )}
      >
        {bottomNavItems.map((item) => {
          const href = `${basePath}${item.path}`;
          const isActive = pathname === href;
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-300",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
                  isActive && "bg-primary/20 shadow-md shadow-primary/20"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
              </div>
              <span className="text-[10px] font-medium">
                {locale === "bn" ? item.labelBn : item.labelEn}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
