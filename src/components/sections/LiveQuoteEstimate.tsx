"use client";

import { Badge } from "@/components/ui/badge";
import { Calculator, Info, ReceiptText, Sparkles } from "lucide-react";
import { formatQuoteAmount, type LiveQuoteEstimate as QuoteEstimate } from "@/lib/orders/quote";
import type { OrdersQuoteConfig } from "@/types/orders";

interface LiveQuoteEstimateProps {
  estimate: QuoteEstimate | null;
  config: OrdersQuoteConfig;
  locale?: string;
}

export function LiveQuoteEstimate({ estimate, config, locale = "bn" }: LiveQuoteEstimateProps) {
  if (!estimate) return null;
  const isBn = locale === "bn";
  const packageName = isBn ? estimate.package.nameBn : estimate.package.nameEn;

  return (
    <aside
      className="mt-6 overflow-hidden rounded-2xl border border-primary/25 bg-primary/[0.04]"
      aria-live="polite"
      aria-label={isBn ? "লাইভ আনুমানিক কোট" : "Live estimated quote"}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/15 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Calculator className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold bn">{isBn ? config.titleBn : config.titleEn}</p>
            <p className="text-xs text-muted-foreground bn">{packageName}</p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1 border-primary/30 text-primary">
          <Sparkles className="h-3 w-3" />
          {isBn ? "রিয়েল-টাইম" : "Real-time"}
        </Badge>
      </div>

      {estimate.customQuote ? (
        <div className="px-4 py-5 text-center sm:px-5">
          <p className="text-lg font-bold text-primary bn">
            {isBn ? "প্রয়োজন অনুযায়ী কাস্টম কোট" : "Custom quote based on your requirements"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground bn">
            {isBn
              ? "এই প্যাকেজের মূল্য প্রজেক্টের পরিধি পর্যালোচনার পর নির্ধারণ করা হবে।"
              : "Pricing for this package is confirmed after reviewing the project scope."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 px-4 py-5 sm:grid-cols-[1fr_auto] sm:px-5">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground bn">{isBn ? "প্যাকেজ মূল্য" : "Package base"}</span>
              <span className="font-medium tabular-nums">
                {formatQuoteAmount(estimate.bdt.base, "BDT", locale)}
              </span>
            </div>
            {estimate.extraPages > 0 && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground bn">
                  {isBn
                    ? `অতিরিক্ত ${estimate.extraPages} পেজ`
                    : `${estimate.extraPages} extra page${estimate.extraPages === 1 ? "" : "s"}`}
                </span>
                <span className="font-medium tabular-nums">
                  +{formatQuoteAmount(estimate.bdt.pages, "BDT", locale)}
                </span>
              </div>
            )}
            {estimate.selectedAddons.length > 0 && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground bn">
                  {isBn
                    ? `${estimate.selectedAddons.length}টি ফিচার অ্যাড-অন`
                    : `${estimate.selectedAddons.length} feature add-on${estimate.selectedAddons.length === 1 ? "" : "s"}`}
                </span>
                <span className="font-medium tabular-nums">
                  +{formatQuoteAmount(estimate.bdt.addons, "BDT", locale)}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-52 rounded-xl border border-primary/20 bg-background/60 p-3 text-center">
            <div className="mb-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ReceiptText className="h-3.5 w-3.5" />
              <span className="bn">{isBn ? "আনুমানিক রেঞ্জ" : "Estimated range"}</span>
            </div>
            <p className="text-lg font-bold text-primary tabular-nums">
              {formatQuoteAmount(estimate.bdt.minimum, "BDT", locale)}–
              {formatQuoteAmount(estimate.bdt.maximum, "BDT", locale)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground tabular-nums">
              {formatQuoteAmount(estimate.usd.minimum, "USD", "en")}–
              {formatQuoteAmount(estimate.usd.maximum, "USD", "en")}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-start gap-2 border-t border-primary/15 bg-background/30 px-4 py-3 text-xs text-muted-foreground sm:px-5">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="bn">{isBn ? config.disclaimerBn : config.disclaimerEn}</span>
      </div>
    </aside>
  );
}
