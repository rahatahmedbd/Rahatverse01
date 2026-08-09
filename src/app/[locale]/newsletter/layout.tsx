import type { Metadata } from "next";

// Functional newsletter flows (confirm / preferences / unsubscribe) must never
// be indexed or followed by search engines.
export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: false, follow: false },
  };
}

interface NewsletterLayoutProps {
  children: React.ReactNode;
}

export default function NewsletterLayout({ children }: NewsletterLayoutProps) {
  return <>{children}</>;
}
