"use client";

import { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/card";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";

// ── Site Search Component ──────────────────────────────
interface SearchDialogProps {
  locale?: string;
}

interface SearchItem {
  title: string;
  titleBn: string;
  url: string;
  category: string;
  categoryBn: string;
}

const siteContent: SearchItem[] = [
  { title: "Home", titleBn: "হোম", url: "/", category: "Page", categoryBn: "পেজ" },
  { title: "About Me", titleBn: "আমার সম্পর্কে", url: "/about", category: "Page", categoryBn: "পেজ" },
  { title: "Education", titleBn: "শিক্ষাজীবন", url: "/about", category: "Page", categoryBn: "পেজ" },
  { title: "Achievements", titleBn: "অর্জনসমূহ", url: "/achievements", category: "Page", categoryBn: "পেজ" },
  { title: "SSC GPA 5.00", titleBn: "SSC জিপিএ ৫.০০", url: "/achievements", category: "Achievement", categoryBn: "অর্জন" },
  { title: "Science Fair", titleBn: "বিজ্ঞান মেলা", url: "/achievements", category: "Achievement", categoryBn: "অর্জন" },
  { title: "Experience", titleBn: "অভিজ্ঞতা", url: "/experience", category: "Page", categoryBn: "পেজ" },
  { title: "FS Coaching Center", titleBn: "FS কোচিং সেন্টার", url: "/experience", category: "Experience", categoryBn: "অভিজ্ঞতা" },
  { title: "Shantichakra Blood Society", titleBn: "শান্তিচক্র ব্লাড সোসাইটি", url: "/experience", category: "Organization", categoryBn: "সংগঠন" },
  { title: "Memorial - Late Md. Farid Ahmed", titleBn: "শ্রদ্ধাঞ্জলি - ফরিদ আহমেদ", url: "/experience", category: "Page", categoryBn: "পেজ" },
  { title: "Gallery", titleBn: "গ্যালারি", url: "/gallery", category: "Page", categoryBn: "পেজ" },
  { title: "Order a Website", titleBn: "ওয়েবসাইট অর্ডার", url: "/order", category: "Service", categoryBn: "সার্ভিস" },
  { title: "Pricing - Basic ৳5,000", titleBn: "বেসিক প্যাকেজ ৳৫,০০০", url: "/order", category: "Pricing", categoryBn: "প্যাকেজ" },
  { title: "Pricing - Standard ৳15,000", titleBn: "স্ট্যান্ডার্ড প্যাকেজ ৳১৫,০০০", url: "/order", category: "Pricing", categoryBn: "প্যাকেজ" },
  { title: "Pricing - Premium ৳30,000", titleBn: "প্রিমিয়াম প্যাকেজ ৳৩০,০০০", url: "/order", category: "Pricing", categoryBn: "প্যাকেজ" },
  { title: "Contact", titleBn: "যোগাযোগ", url: "/contact", category: "Page", categoryBn: "পেজ" },
  { title: "Blog", titleBn: "ব্লগ", url: "/blog", category: "Page", categoryBn: "পেজ" },
  { title: "Link Hub", titleBn: "সংযুক্ত হোন", url: "/links", category: "Page", categoryBn: "পেজ" },
  { title: "Web Development", titleBn: "ওয়েব ডেভেলপমেন্ট", url: "/order", category: "Service", categoryBn: "সার্ভিস" },
  { title: "Portfolio Website", titleBn: "পোর্টফোলিও ওয়েবসাইট", url: "/order", category: "Service", categoryBn: "সার্ভিস" },
  { title: "E-Commerce", titleBn: "ই-কমার্স", url: "/order", category: "Service", categoryBn: "সার্ভিস" },
  { title: "Blood Donation", titleBn: "রক্তদান", url: "/contact", category: "Topic", categoryBn: "বিষয়" },
  { title: "Tutoring", titleBn: "টিউশন / পড়াশোনা", url: "/contact", category: "Service", categoryBn: "সার্ভিস" },
  { title: "BNCC Cadet", titleBn: "BNCC ক্যাডেট", url: "/about", category: "Achievement", categoryBn: "অর্জন" },
];

export function SearchDialog({ locale = "bn" }: SearchDialogProps) {
  const isBn = locale === "bn";
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === "k") || (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName))) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filtered = query.length > 0
    ? siteContent.filter((item) => {
        const searchIn = isBn ? item.titleBn : item.title;
        return searchIn.toLowerCase().includes(query.toLowerCase());
      })
    : [];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-all hover:border-primary/30"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline bn">{isBn ? "খুঁজুন..." : "Search..."}</span>
        <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-xs sm:inline">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 pt-20" onClick={() => setIsOpen(false)}>
      <GlassCard className="w-full max-w-lg mx-4" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isBn ? "কী খুঁজছেন..." : "What are you looking for?"}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-3 max-h-80 overflow-y-auto">
          {query.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground bn">
              {isBn ? "টাইপ করে খুঁজুন..." : "Start typing to search..."}
            </p>
          ) : filtered.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground bn">
              {isBn ? "কিছু পাওয়া যায়নি" : "No results found"}
            </p>
          ) : (
            <div className="space-y-1">
              {filtered.map((item, i) => (
                <Link
                  key={i}
                  href={`/${locale}${item.url}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-lg p-3 transition-all hover:bg-accent/50"
                >
                  <div>
                    <p className="text-sm font-medium bn">{isBn ? item.titleBn : item.title}</p>
                    <p className="text-xs text-muted-foreground bn">{isBn ? item.categoryBn : item.category}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
