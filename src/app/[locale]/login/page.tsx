import { LoginForm } from "@/components/auth/LoginForm";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <LoginForm locale={locale} />
    </div>
  );
}
