import { UserManagement } from "@/components/admin/UserManagement";

interface UsersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function UsersPage({ params }: UsersPageProps) {
  const { locale } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <UserManagement locale={locale} />
    </div>
  );
}
