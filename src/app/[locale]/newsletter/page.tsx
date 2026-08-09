import { redirect } from "next/navigation";

// ── /[locale]/newsletter ──
// There is no standalone newsletter page — only the signup section on the
// home page plus the confirm/preferences/unsubscribe utility routes. Redirect
// the bare URL to the on-page section instead of serving a 404 (audit L2).
interface NewsletterIndexProps {
  params: Promise<{ locale: string }>;
}

export default async function NewsletterIndexPage({ params }: NewsletterIndexProps) {
  const { locale } = await params;
  redirect(`/${locale}#newsletter`);
}
