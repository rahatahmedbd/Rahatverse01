"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X, FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: string;
  type: "blog" | "project" | "page";
  title: string;
  titleBn?: string;
  excerpt?: string;
  excerptBn?: string;
  slug: string;
  category?: string;
  url: string;
  publishedAt?: string;
}

interface SearchDialogProps {
  locale?: string;
}

export function SearchDialog({ locale = "bn" }: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const isBn = locale === "bn";

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length === 0) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, performSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
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

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">
          {isBn ? "খুঁজুন..." : "Search..."}
        </span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              {isBn ? "খুঁজুন" : "Search"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 pt-2">
            <div className="relative">
              <Input
                type="text"
                placeholder={isBn ? "ব্লগ পোস্ট খুঁজুন..." : "Search blog posts..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-4 pt-0">
            {isSearching ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : results.length === 0 && query.length > 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {isBn
                  ? "আপনার অনুসন্ধানের সাথে কোনো তথ্য মেলেনি। অন্য কি-ওয়ার্ড চেষ্টা করুন অথবা সরাসরি যোগাযোগ করুন।"
                  : "No matching articles, services, or case studies found. Try another keyword or contact us directly."}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {isBn
                  ? "ব্লগ, সেবা, প্রজেক্ট বা গ্যালারি খুঁজতে টাইপ করুন..."
                  : "Start typing to search articles, services, case studies, or gallery..."}
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/${locale}${result.url}`}
                    onClick={handleResultClick}
                    className="block rounded-lg border border-border p-3 hover:bg-accent hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm truncate">
                            {isBn && result.titleBn ? result.titleBn : result.title}
                          </h3>
                          {result.category && (
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {result.category}
                            </Badge>
                          )}
                        </div>
                        {(isBn ? result.excerptBn : result.excerpt) && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {isBn ? result.excerptBn : result.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
