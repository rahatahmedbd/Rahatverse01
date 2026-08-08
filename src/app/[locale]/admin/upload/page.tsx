import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import UploadPanel from "@/components/admin/UploadPanel";

interface AdminUploadPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AdminUploadPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isBn = locale === "bn";
  return {
    title: isBn ? "মিডিয়া আপলোড" : "Media Upload",
    robots: { index: false, follow: false },
    alternates: localeAlternates(locale, "/admin/upload"),
  };
}

export default async function AdminUploadPage({ params }: AdminUploadPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">
            {isBn ? "অ্যাডমিন প্যানেল" : "Admin Panel"}
          </p>
          <h1 className="text-2xl font-bold tracking-tight">
            {isBn ? "মিডিয়া আপলোড" : "Media Upload"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isBn
              ? "নতুন ছবি সরাসরি Cloudinary-তে আপলোড করুন"
              : "Upload new images directly to Cloudinary"}
          </p>
        </div>
        <Link
          href={`/${locale}/dashboard`}
          className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {isBn ? "ড্যাশবোর্ড" : "Dashboard"}
        </Link>
      </div>

      <UploadPanel />
    </div>
  );
}
