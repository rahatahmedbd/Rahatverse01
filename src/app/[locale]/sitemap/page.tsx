import { GlassCard } from "@/components/ui/card";
import { SectionTitle } from "@/components/sections/SectionTitle";
import { FadeInUp } from "@/components/animations/FadeIn";
import Link from "next/link";

// ── Sitemap Page ───────────────────────────────────────
interface SitemapPageProps {
  params: Promise<{ locale: string }>;
}

interface SitemapSection {
  title: string;
  titleBn: string;
  links: { label: string; labelBn: string; url: string }[];
}

const sitemapData: SitemapSection[] = [
  {
    title: "Main Pages",
    titleBn: "মূল পেজ",
    links: [
      { label: "Home", labelBn: "হোম", url: "/" },
      { label: "About", labelBn: "আমার সম্পর্কে", url: "/about" },
      { label: "Portfolio & Case Studies", labelBn: "পোর্টফোলিও ও কেস স্টাডি", url: "/portfolio" },
      { label: "Services", labelBn: "সেবাসমূহ", url: "/services" },
      { label: "Experience", labelBn: "অভিজ্ঞতা", url: "/experience" },
      { label: "Achievements", labelBn: "অর্জনসমূহ", url: "/achievements" },
      { label: "Gallery", labelBn: "গ্যালারি", url: "/gallery" },
    ],
  },
  {
    title: "Services",
    titleBn: "সার্ভিস",
    links: [
      { label: "Order Website", labelBn: "ওয়েবসাইট অর্ডার", url: "/order" },
      { label: "Contact", labelBn: "যোগাযোগ", url: "/contact" },
    ],
  },
  {
    title: "Resources",
    titleBn: "রিসোর্স",
    links: [
      { label: "Blog", labelBn: "ব্লগ", url: "/blog" },
      { label: "Link Hub", labelBn: "সংযুক্ত হোন", url: "/links" },
    ],
  },
  {
    title: "Admin",
    titleBn: "অ্যাডমিন",
    links: [
      { label: "Dashboard", labelBn: "ড্যাশবোর্ড", url: "/dashboard" },
      { label: "Manage Orders", labelBn: "অর্ডার ম্যানেজ", url: "/dashboard/orders" },
      { label: "Message Inbox", labelBn: "বার্তা ইনবক্স", url: "/dashboard/messages" },
    ],
  },
  {
    title: "Legal",
    titleBn: "আইনি",
    links: [
      { label: "Privacy Policy", labelBn: "প্রাইভেসি পলিসি", url: "/privacy-policy" },
      { label: "Terms of Service", labelBn: "সেবা শর্তাবলি", url: "/terms-of-service" },
    ],
  },
];

export default async function SitemapPage({ params }: SitemapPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <SectionTitle
        badge={isBn ? "🗺️ সাইটম্যাপ" : "🗺️ Sitemap"}
        title="Sitemap"
        titleBn="সাইটম্যাপ"
        subtitle={isBn ? "সম্পূর্ণ ওয়েবসাইটের মানচিত্র" : "Complete website navigation map"}
        locale={locale}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sitemapData.map((section, i) => (
          <FadeInUp key={i} delay={i * 0.1}>
            <GlassCard className="h-full">
              <h3 className="mb-4 text-lg font-bold border-b border-border pb-2 bn">
                {isBn ? section.titleBn : section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={`/${locale}${link.url}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors bn"
                    >
                      {isBn ? link.labelBn : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </FadeInUp>
        ))}
      </div>
    </div>
  );
}
