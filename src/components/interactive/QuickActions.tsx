"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionPreference } from "@/components/animations/motion-preferences";
import { MessageCircle, ShoppingCart, ArrowUp, Mail, Plus } from "lucide-react";
import Link from "next/link";

// ── Quick Actions (Premium Expandable Floating FAB Menu) ───────────────────

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const prefersReducedMotion = useMotionPreference();
  const locale = pathname.startsWith("/en") ? "en" : "bn";
  const basePath = `/${locale}`;

  const menuItems = [
    {
      id: "whatsapp",
      label: locale === "en" ? "WhatsApp Chat" : "হোয়াটসঅ্যাপ চ্যাট",
      icon: MessageCircle,
      href: "https://wa.me/8801626224878",
      external: true,
      color: "bg-green-500 text-white shadow-lg shadow-green-500/20",
    },
    {
      id: "order",
      label: locale === "en" ? "Order Website" : "অর্ডার করুন",
      icon: ShoppingCart,
      href: `${basePath}/order`,
      external: false,
      color: "bg-amber-500 text-white shadow-lg shadow-amber-500/20",
    },
    {
      id: "contact",
      label: locale === "en" ? "Contact Me" : "যোগাযোগ করুন",
      icon: Mail,
      href: `${basePath}/contact`,
      external: false,
      color: "bg-blue-500 text-white shadow-lg shadow-blue-500/20",
    },
    {
      id: "scroll-top",
      label: locale === "en" ? "Scroll to Top" : "উপরে যান",
      icon: ArrowUp,
      onClick: () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        setIsOpen(false);
      },
      color: "glass glass-interactive text-primary border-primary/20 shadow-md shadow-primary/10",
    },
  ];

  return (
    <div
      className={cn(
        "fixed right-4 z-40 flex flex-col items-center gap-3",
        "bottom-24 lg:bottom-8",
        className
      )}
    >
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-center gap-3 mb-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const content = (
                <div className="flex h-11 w-11 items-center justify-center rounded-full">
                  <Icon className="h-5 w-5" />
                </div>
              );

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                    delay: (menuItems.length - 1 - index) * 0.05,
                  }}
                  className="group relative"
                >
                  {/* Tooltip Label - Frosted Glass */}
                  <span className="absolute right-14 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg glass border border-border/40 text-xs font-semibold text-foreground whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {item.label}
                  </span>

                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-110 active:scale-95",
                        item.color
                      )}
                      aria-label={item.label}
                    >
                      {content}
                    </button>
                  ) : item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-110 active:scale-95",
                        item.color
                      )}
                      onClick={() => setIsOpen(false)}
                      aria-label={item.label}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      href={item.href!}
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-110 active:scale-95",
                        item.color
                      )}
                      onClick={() => setIsOpen(false)}
                      aria-label={item.label}
                    >
                      {content}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Floating Action Button Trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-13 w-13 items-center justify-center rounded-full cursor-pointer",
          "glass glass-interactive text-primary border-primary/30 shadow-lg shadow-primary/20",
          "hover:border-primary/50"
        )}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle Quick Actions Menu"
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          <Plus className="h-6 w-6" />
        </motion.div>
      </motion.button>
    </div>
  );
}
