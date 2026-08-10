import { getCurrentUserContext } from "@/lib/supabase/guards";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import type { Metadata } from "next";

// Every dashboard route is excluded from indexing at the layout level, in
// addition to the server-side auth boundary below (defense in depth: a single
// page forgetting its own robots metadata can never leak an admin screen).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/** Server-side access boundary for every administrative route. */
export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;
  const { isAdmin } = await getCurrentUserContext();

  if (!isAdmin) {
    redirect(`/${locale}/login?next=/${locale}/dashboard`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <AdminNav locale={locale} />
      {children}
    </div>
  );
}
