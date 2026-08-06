"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "./SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

// ── Gallery Section ────────────────────────────────────
interface GallerySectionProps {
  locale?: string;
}

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  altBn: string;
  category: "achievements" | "blood" | "education" | "social";
  date: string;
  caption: string;
  captionBn: string;
}

// Demo gallery images (placeholders — will be replaced with Cloudinary)
const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: "",
    alt: "SSC 2025 GPA 5.00 A+ Achievement",
    altBn: "SSC ২০২৫ — জিপিএ ৫.০০ (A+) অর্জন",
    category: "achievements",
    date: "১০ জুলাই, ২০২৫",
    caption: "SSC 2025 — GPA 5.00 (A+)",
    captionBn: "SSC ২০২৫ — জিপিএ ৫.০০ (A+)",
  },
  {
    id: "2",
    src: "",
    alt: "Meritorious Student Honor Ceremony",
    altBn: "কৃতী শিক্ষার্থী সংবর্ধনা",
    category: "achievements",
    date: "২০২৫",
    caption: "Merit Student Honor",
    captionBn: "কৃতী শিক্ষার্থী সংবর্ধনা",
  },
  {
    id: "3",
    src: "",
    alt: "Shantichakra Blood Society Crest",
    altBn: "শান্তিচক্র সম্মাননা ক্রেস্ট",
    category: "blood",
    date: "২০২৫",
    caption: "Shantichakra Honor Crest",
    captionBn: "শান্তিচক্র সম্মাননা ক্রেস্ট",
  },
  {
    id: "4",
    src: "",
    alt: "46th National Science Fair 2025",
    altBn: "৪৬তম বিজ্ঞান মেলা ২০২৫",
    category: "achievements",
    date: "২০২৫",
    caption: "46th Science Fair — 1st Place",
    captionBn: "৪৬তম বিজ্ঞান মেলা — ১ম স্থান",
  },
  {
    id: "5",
    src: "",
    alt: "Creative Talent Search 2024",
    altBn: "সৃজনশীল মেধা অন্বেষণ ২০২৪",
    category: "achievements",
    date: "২০২৪",
    caption: "Creative Talent — 1st in Science",
    captionBn: "সৃজনশীল মেধা — বিজ্ঞানে ১ম",
  },
  {
    id: "6",
    src: "",
    alt: "44th Science Exhibition 2024",
    altBn: "৪৪তম বিজ্ঞান প্রদর্শনী ২০২৪",
    category: "achievements",
    date: "২ মে, ২০২৪",
    caption: "44th Science Exhibition — 1st Place",
    captionBn: "৪৪তম বিজ্ঞান প্রদর্শনী — ১ম স্থান",
  },
  {
    id: "7",
    src: "",
    alt: "45th National Science Fair 2023",
    altBn: "৪৫তম বিজ্ঞান মেলা ২০২৩",
    category: "achievements",
    date: "৩১ আগস্ট, ২০২৩",
    caption: "45th Science Fair",
    captionBn: "৪৫তম বিজ্ঞান মেলা",
  },
  {
    id: "8",
    src: "",
    alt: "42nd National Science Fair 2020",
    altBn: "৪২তম বিজ্ঞান মেলা ২০২০",
    category: "achievements",
    date: "২৬ নভেম্বর, ২০২০",
    caption: "42nd Science Fair — First Win",
    captionBn: "৪২তম বিজ্ঞান মেলা — প্রথম জয়",
  },
  {
    id: "9",
    src: "",
    alt: "FS Coaching Center",
    altBn: "FS কোচিং সেন্টার",
    category: "education",
    date: "৩১ ডিসেম্বর, ২০২৪",
    caption: "FS Coaching Center",
    captionBn: "FS কোচিং সেন্টার",
  },
  {
    id: "10",
    src: "",
    alt: "Helping Hand Organization",
    altBn: "হেল্পিং হ্যান্ড অর্গানাইজেশন",
    category: "social",
    date: "২০২৩",
    caption: "Helping Hand Organization",
    captionBn: "হেল্পিং হ্যান্ড অর্গানাইজেশন",
  },
  {
    id: "11",
    src: "",
    alt: "Shantichakra Blood Society Activities",
    altBn: "শান্তিচক্র ব্লাড সোসাইটি কার্যক্রম",
    category: "blood",
    date: "২০২৫",
    caption: "Shantichakra Blood Society",
    captionBn: "শান্তিচক্র ব্লাড সোসাইটি",
  },
  {
    id: "12",
    src: "",
    alt: "Teaching Students",
    altBn: "শিক্ষার্থীদের পাঠদান",
    category: "education",
    date: "২০২৩ — বর্তমান",
    caption: "Teaching",
    captionBn: "শিক্ষকতা",
  },
];

// ── Gallery Component ──────────────────────────────────
export function GallerySection({ locale = "bn" }: GallerySectionProps) {
  const isBn = locale === "bn";
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filters = [
    { key: "all", label: isBn ? "সব" : "All" },
    { key: "achievements", label: isBn ? "🏆 অর্জন" : "🏆 Achievements" },
    { key: "blood", label: isBn ? "🩸 রক্তদান" : "🩸 Blood Donation" },
    { key: "education", label: isBn ? "📚 শিক্ষা" : "📚 Education" },
    { key: "social", label: isBn ? "🤝 সমাজসেবা" : "🤝 Social" },
  ];

  const filteredImages = activeFilter === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeFilter);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <SectionTitle
          badge={isBn ? "🖼️ মুহূর্তগুলো" : "🖼️ Moments"}
          title="Photo Gallery"
          titleBn="গ্যালারি"
          subtitle={
            isBn
              ? "আমার শিক্ষাজীবন, অর্জন, সামাজিক কার্যক্রম ও উদ্যোগের কিছু মুহূর্ত"
              : "Moments from my academic journey, achievements, and social activities"
          }
          locale={locale}
        />

        {/* Filter Tabs */}
        <FadeInUp>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </FadeInUp>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedImage(image)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-card">
                  {image.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.src}
                      alt={isBn ? image.altBn : image.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4 text-center">
                      <Camera className="mb-2 h-8 w-8 text-primary/40" />
                      <p className="text-xs text-muted-foreground bn">
                        {isBn ? image.captionBn : image.caption}
                      </p>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-xs font-medium text-white bn">
                      {isBn ? image.captionBn : image.caption}
                    </p>
                    <p className="text-[10px] text-white/60">{image.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredImages.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            {isBn ? "এই ক্যাটাগরিতে কোনো ছবি নেই" : "No images in this category"}
          </div>
        )}

        {/* Note about Cloudinary */}
        <FadeInUp delay={0.3}>
          <GlassCard className="mt-8 text-center">
            <p className="text-sm text-muted-foreground bn">
              {isBn
                ? "📸 ছবিগুলো শীঘ্রই Cloudinary থেকে লোড হবে। বর্তমানে placeholder দেখানো হচ্ছে।"
                : "📸 Images will be loaded from Cloudinary soon. Currently showing placeholders."}
            </p>
          </GlassCard>
        </FadeInUp>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <Lightbox
            image={selectedImage}
            locale={locale}
            onClose={() => setSelectedImage(null)}
            onPrev={() => {
              const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
              const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
              setSelectedImage(filteredImages[prevIndex]);
            }}
            onNext={() => {
              const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id);
              const nextIndex = (currentIndex + 1) % filteredImages.length;
              setSelectedImage(filteredImages[nextIndex]);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Lightbox Component ─────────────────────────────────
interface LightboxProps {
  image: GalleryImage;
  locale: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ image, locale, onClose, onPrev, onNext }: LightboxProps) {
  const isBn = locale === "bn";

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Navigation */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Image content */}
      <motion.div
        className="max-h-[80vh] max-w-3xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
      >
        {image.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.src}
            alt={isBn ? image.altBn : image.alt}
            className="max-h-[70vh] rounded-lg object-contain"
          />
        ) : (
          <div className="flex h-64 w-96 flex-col items-center justify-center rounded-lg bg-card/50 p-8 text-center">
            <Camera className="mb-4 h-16 w-16 text-primary/40" />
            <p className="text-lg font-medium bn">
              {isBn ? image.captionBn : image.caption}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{image.date}</p>
            <Badge variant="glow" className="mt-4">
              {isBn ? "ছবি শীঘ্রই আসছে" : "Image coming soon"}
            </Badge>
          </div>
        )}

        {/* Caption */}
        <div className="mt-4 text-center">
          <p className="text-white font-medium bn">
            {isBn ? image.captionBn : image.caption}
          </p>
          <p className="text-sm text-white/60">{image.date}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
