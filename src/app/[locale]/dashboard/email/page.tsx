import { EmailDeliveryViewer } from "@/components/admin/EmailDeliveryViewer";
export const metadata = { title: "Email Delivery", robots: { index: false, follow: false } };
export default async function EmailPage({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; return <EmailDeliveryViewer locale={locale} />; }
