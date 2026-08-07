import { GlassCard } from "@/components/ui/card";
import { getContentConfig } from "@/lib/content/server";

// ── Legal Policy Page (DB-driven via content_config) ───
interface LegalContentProps {
  locale: string;
  pageKey: "privacy" | "terms" | "cookie" | "refund" | "privacy-policy" | "terms-of-service";
}

/** Renders a legal policy page from the `content_config.legalPages` entry. */
export async function LegalContent({ locale, pageKey }: LegalContentProps) {
  const isBn = locale === "bn";
  const config = await getContentConfig();
  const page =
    config.legalPages.find((p) => p.key === pageKey && p.visible) ||
    config.legalPages.find(
      (p) =>
        p.visible &&
        ((pageKey === "privacy-policy" && p.key === "privacy") ||
          (pageKey === "terms-of-service" && p.key === "terms"))
    );

  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center text-muted-foreground">
        {isBn ? "পেজটি পাওয়া যায়নি।" : "Page not found."}
      </div>
    );
  }

  const body = isBn ? page.bodyBn : page.bodyEn;
  const sections = body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <GlassCard className="p-6 md:p-8">
        <h1 className="text-gradient text-display-lg font-bold bn">
          {isBn ? page.titleBn : page.titleEn}
        </h1>
        {(isBn ? page.updatedAtBn : page.updatedAtEn) && (
          <p className="mt-2 text-sm text-muted-foreground">
            {isBn ? "সর্বশেষ আপডেট: " : "Last updated: "}
            {isBn ? page.updatedAtBn : page.updatedAtEn}
          </p>
        )}

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          {sections.map((section, index) => {
            const [heading, ...bodyLines] = section.split("\n");
            const cleanHeading = heading.replace(/^#+\s*/, "").trim();
            const bodyText = bodyLines.join(" ").trim();
            return (
              <section key={index}>
                {cleanHeading && (
                  <h2 className="text-heading-sm mb-2 font-semibold text-foreground bn">{cleanHeading}</h2>
                )}
                {bodyText && <p className="bn">{bodyText}</p>}
              </section>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
