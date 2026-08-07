import { GlassCard } from "@/components/ui/card";
import { FadeInUp } from "@/components/animations/FadeIn";

// ── Terms of Service Page ──────────────────────────────
interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  const isBn = locale === "bn";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <FadeInUp>
        <GlassCard>
          <h1 className="text-gradient text-3xl font-bold bn">{isBn ? "সেবার শর্তাবলী" : "Terms of Service"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isBn ? "সর্বশেষ আপডেট: আগস্ট ২০২৬" : "Last updated: August 2026"}
          </p>

          <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground bn">{isBn ? "১. সেবা গ্রহণ" : "1. Acceptance of Terms"}</h2>
              <p className="mt-2 bn">
                {isBn
                  ? "এই ওয়েবসাইট ব্যবহার করে আপনি এই শর্তাবলী মেনে চলতে সম্মত হচ্ছেন।"
                  : "By using this website, you agree to these terms and conditions."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground bn">{isBn ? "২. ওয়েবসাইট সেবা" : "2. Website Services"}</h2>
              <p className="mt-2 bn">
                {isBn
                  ? "RahatVerse ওয়েব ডেভেলপমেন্ট সেবা প্রদান করে। অর্ডার করার পর, আমরা আপনার প্রজেক্টের বিবরণ অনুযায়ী কাজ করব।"
                  : "RahatVerse provides web development services. After ordering, we will work according to your project description."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground bn">{isBn ? "৩. পেমেন্ট" : "3. Payment"}</h2>
              <p className="mt-2 bn">
                {isBn
                  ? "সকল পেমেন্ট অগ্রিম বা ধাপে ধাপে করতে হবে। মূল্য প্যাকেজ অনুযায়ী নির্ধারিত।"
                  : "All payments must be made in advance or in stages. Prices are determined by package."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground bn">{isBn ? "৪. ডেলিভারি" : "4. Delivery"}</h2>
              <p className="mt-2 bn">
                {isBn
                  ? "ওয়েবসাইট ডেলিভারি প্যাকেজ অনুযায়ী ১-৪ সপ্তাহের মধ্যে হবে। বিলম্ব হলে আগেই জানানো হবে।"
                  : "Website delivery will be within 1-4 weeks depending on package. Any delays will be communicated in advance."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground bn">{isBn ? "৫. রিফান্ড" : "5. Refund Policy"}</h2>
              <p className="mt-2 bn">
                {isBn
                  ? "কাজ শুরু হওয়ার আগে পূর্ণ রিফান্ড পাওয়া যায়। কাজ শুরু হওয়ার পর, আংশিক রিফান্ড আলোচনা সাপেক্ষে।"
                  : "Full refund available before work begins. After work starts, partial refund is negotiable."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground bn">{isBn ? "৬. মেধাস্বত্ব" : "6. Intellectual Property"}</h2>
              <p className="mt-2 bn">
                {isBn
                  ? "ডেলিভারির পর সকল কোড ও কন্টেন্টের মালিকানা ক্লায়েন্টের। RahatVerse পোর্টফোলিওতে দেখাতে পারে।"
                  : "After delivery, all code and content belongs to the client. RahatVerse may display work in portfolio."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground bn">{isBn ? "৭. যোগাযোগ" : "7. Contact"}</h2>
              <p className="mt-2 bn">
                {isBn
                  ? "কোনো প্রশ্ন থাকলে rahatbd20505@gmail.com এ যোগাযোগ করুন।"
                  : "For any questions, contact us at rahatbd20505@gmail.com."}
              </p>
            </section>
          </div>
        </GlassCard>
      </FadeInUp>
    </div>
  );
}
