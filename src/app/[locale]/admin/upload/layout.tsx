import { getCurrentUserContext } from "@/lib/supabase/guards";
import { redirect } from "next/navigation";

interface AdminUploadLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/** Server-side access boundary — only the admin account can reach /admin/upload. */
export default async function AdminUploadLayout({
  children,
  params,
}: AdminUploadLayoutProps) {
  const { locale } = await params;
  const { isAdmin } = await getCurrentUserContext();

  if (!isAdmin) {
    redirect(`/${locale}/login?next=/${locale}/admin/upload`);
  }

  return <>{children}</>;
}
