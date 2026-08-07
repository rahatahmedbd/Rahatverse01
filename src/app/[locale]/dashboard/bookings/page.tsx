import { BookingCalendarManager } from "@/components/admin/BookingCalendarManager";

interface BookingsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BookingsPage({ params }: BookingsPageProps) {
  const { locale } = await params;
  return <BookingCalendarManager locale={locale} />;
}
