import "./globals.css";

// ── Root Layout ────────────────────────────────────────
// Just passes children through - the [locale] layout handles html/body

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
