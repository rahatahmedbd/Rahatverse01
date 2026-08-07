import { Wrench } from "lucide-react";

interface MaintenanceScreenProps {
  locale: string;
  messageBn: string;
  messageEn: string;
}

/** Rendered in place of the site when maintenance mode is enabled. */
export function MaintenanceScreen({ locale, messageBn, messageEn }: MaintenanceScreenProps) {
  const isBn = locale === "bn";
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Wrench className="h-8 w-8 text-primary" />
      </div>
      <h1 className="mt-6 text-heading-lg font-bold bn">
        {isBn ? "মেইনটেন্যান্স চলছে" : "Maintenance in progress"}
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground bn">
        {isBn ? messageBn : messageEn}
      </p>
      <p className="mt-6 text-xs text-muted-foreground">
        {isBn ? "শীঘ্রই ফিরে আসছি। ধন্যবাদ!" : "We'll be right back. Thank you!"}
      </p>
    </main>
  );
}
