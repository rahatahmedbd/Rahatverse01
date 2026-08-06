import { GlassCard } from "@/components/ui/card";
import { FadeInUp } from "@/components/animations/FadeIn";

// ── Privacy Policy Page ────────────────────────────────
interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <FadeInUp>
        <GlassCard>
          <h1 className="text-3xl font-bold bn">{isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isBn ? "সর্বশেষ আপডেট: আগস্ট ২০২৬" : "Last updated: August 2026"}
          </p>

          <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground bn">{isBn ? "১. সংগ্রহ করা তথ্য" : "1. Information We Collect"}</h2>
              <p className="mt-2 bn">
                {isBn
                  ? "আমরা শুধুমাত্র সেই তথ্য সংগ্রহ করি যা আপনি স্বেচ্ছায় প্রদান করেন, যেমন: নাম, ইমেইল, ফোন নম্বর, এবং ওয়েবসাইট অর্ডার সংক্রান্ত তথ্য।"
                  : "We only collect information you voluntarily provide, such as: name, email, phone number, and website order details."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground bn">{isBn ? "২. তথ্যের ব্যবহার" : "2. How We Use Information"}</h2>
              <p className="mt-2 bn">
                {isBn
                  ? "সংগৃহীত তথ্য শুধুমাত্র আপনার সাথে যোগাযোগ, অর্ডার প্রসেসিং, এবং সেবা উন্নত করতে ব্যবহার করা হয়।"
                  : "Collected information is only used to communicate with you, process orders, and improve our services."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground bn">{isBn ? "৩. তথ্য সুরক্ষা" : "3. Data Security"}</h2>
              <p className="mt-2 bn">
                {isBn
                  ? "আমরা Supabase ব্যবহার করি যা industry-standard সুরক্ষা প্রদান করে। আপনার তথ্য এনক্রিপ্টেড এবং সুরক্ষিত।"
                  : "We use Supabase which provides industry-standard security. Your data is encrypted and protected."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground bn">{isBn ? "৪. কুকিজ" : "4. Cookies"}</h2>
              <p className="mt-2 bn">
                {isBn
                  ? "এই ওয়েবসাইট শুধুমাত্র প্রয়োজনীয় কুকিজ ব্যবহার করে যা সাইট সঠিকভাবে চলতে প্রয়োজন।"
                  : "This website only uses essential cookies required for the site to function properly."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground bn">{isBn ? "৫. তৃতীয় পক্ষ" : "5. Third Parties"}</h2>
              <p className="mt-2 bn">
                {isBn
                  ? "আমরা কোনো তৃতীয় পক্ষের সাথে আপনার ব্যক্তিগত তথ্য শেয়ার করি না, আইনি বাধ্যবাধকতা ছাড়া।"
                  : "We do not share your personal information with third parties, except when legally required."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground bn">{isBn ? "৬. যোগাযোগ" : "6. Contact"}</h2>
              <p className="mt-2 bn">
                {isBn
                  ? "গোপনীয়তা সম্পর্কিত কোনো প্রশ্ন থাকলে rahatbd20505@gmail.com এ যোগাযোগ করুন।"
                  : "For any privacy-related questions, contact us at rahatbd20505@gmail.com."}
              </p>
            </section>
          </div>
        </GlassCard>
      </FadeInUp>
    </div>
  );
}
