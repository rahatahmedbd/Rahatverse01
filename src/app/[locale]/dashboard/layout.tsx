import { getCurrentUserContext } from "@/lib/supabase/guards";
import { redirect } from "next/navigation";

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

  return children;
}
