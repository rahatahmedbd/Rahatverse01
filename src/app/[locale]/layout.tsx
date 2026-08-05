// ── Locale-based Layout ────────────────────────────────
// This layout wraps all locale-specific pages
// In Phase 09 (i18n), this will handle language switching

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <div lang={locale} className="flex min-h-screen flex-col">
      {/* Navigation placeholder - will be built in Phase 04 */}
      <main className="flex-1">{children}</main>
      {/* Footer placeholder - will be built in Phase 04 */}
    </div>
  );
}
