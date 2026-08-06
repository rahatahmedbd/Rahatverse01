"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { SectionTitle } from "@/components/sections/SectionTitle";

// ── Export Data Functionality ──────────────────────────
// Exports any admin entity as CSV (UTF-8 BOM) or JSON.

interface ExportPanelProps {
  locale?: string;
}

const entities = [
  { value: "orders", labelBn: "অর্ডার", labelEn: "Orders" },
  { value: "messages", labelBn: "বার্তা", labelEn: "Messages" },
  { value: "users", labelBn: "ইউজার", labelEn: "Users" },
  { value: "subscribers", labelBn: "নিউজলেটার সাবস্ক্রাইবার", labelEn: "Newsletter subscribers" },
  { value: "comments", labelBn: "ব্লগ কমেন্ট", labelEn: "Blog comments" },
  { value: "testimonials", labelBn: "মতামত", labelEn: "Testimonials" },
  { value: "images", labelBn: "ছবি", labelEn: "Images" },
];

export function ExportPanel({ locale = "bn" }: ExportPanelProps) {
  const isBn = locale === "bn";
  const [selected, setSelected] = useState("orders");
  const [exporting, setExporting] = useState<"csv" | "json" | null>(null);

  const exportData = (format: "csv" | "json") => {
    setExporting(format);
    // Small delay so the loading state is visible; the browser handles the download.
    setTimeout(() => {
      window.open(`/api/admin/export?entity=${selected}&format=${format}`, "_blank");
      setExporting(null);
    }, 150);
  };

  return (
    <section className="py-4">
      <SectionTitle
        badge="📤"
        title="Export Data"
        titleBn="ডেটা এক্সপোর্ট"
        locale={locale}
      />

      <GlassCard className="max-w-2xl p-6">
        <h3 className="mb-1 font-bold bn">{isBn ? "কোন ডেটা এক্সপোর্ট করবেন?" : "What would you like to export?"}</h3>
        <p className="mb-4 text-sm text-muted-foreground bn">
          {isBn
            ? "সর্বশেষ ৫,০০০ রেকর্ড CSV বা JSON ফরম্যাটে ডাউনলোড হবে।"
            : "Exports up to 5,000 of the most recent records as CSV or JSON."}
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          {entities.map((entity) => (
            <button
              key={entity.value}
              onClick={() => setSelected(entity.value)}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-all ${
                selected === entity.value
                  ? "border-primary/40 bg-primary/10"
                  : "border-border/60 hover:border-primary/25"
              }`}
            >
              <span className="bn">{isBn ? entity.labelBn : entity.labelEn}</span>
              {selected === entity.value && <Badge variant="glow">✓</Badge>}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={() => exportData("csv")} disabled={exporting !== null}>
            {exporting === "csv" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => exportData("json")} disabled={exporting !== null}>
            {exporting === "json" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileJson className="h-4 w-4" />}
            JSON
          </Button>
        </div>
      </GlassCard>
    </section>
  );
}
