import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "bn" ? "অ্যাডমিন লগইন" : "Admin Sign In",
    // Auth page — never index.
    robots: { index: false, follow: false },
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <LoginForm locale={locale} />
    </div>
  );
}
