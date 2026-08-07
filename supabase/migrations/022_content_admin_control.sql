-- Phase 13: Site-Wide Search, FAQ Accordion & Legal Policies
-- Seeds the validated `content_config` document in site_settings (FAQ categories
-- & items, search scope & weights, legal policy pages).
--
-- NOTE: The app code is resilient and uses DEFAULT_CONTENT_CONFIG fallback, so the
-- site works even before this is applied.

insert into public.site_settings (key, value)
values (
  'content_config',
  $$
  {
    "visible": true,
    "faqSectionTitleBn": "প্রশ্নোত্তর",
    "faqSectionTitleEn": "Frequently Asked Questions",
    "faqSectionSubtitleBn": "সাধারণ প্রশ্নের উত্তর খুঁজুন",
    "faqSectionSubtitleEn": "Find answers to common questions",
    "faqCategories": [
      { "id": "faq-cat-ordering", "value": "ordering", "labelBn": "অর্ডারিং", "labelEn": "Ordering", "visible": true },
      { "id": "faq-cat-payments", "value": "payments", "labelBn": "পেমেন্ট", "labelEn": "Payments", "visible": true },
      { "id": "faq-cat-timeline", "value": "timeline", "labelBn": "টাইমলাইন", "labelEn": "Timeline", "visible": true },
      { "id": "faq-cat-blood", "value": "blood", "labelBn": "রক্তদান", "labelEn": "Blood Donation", "visible": true },
      { "id": "faq-cat-general", "value": "general", "labelBn": "সাধারণ", "labelEn": "General", "visible": true }
    ],
    "faqItems": [
      { "id": "faq-cost", "category": "ordering", "questionBn": "একটি ওয়েবসাইটের খরচ কত?", "questionEn": "How much does a website cost?", "answerBn": "ওয়েবসাইট প্যাকেজ ৳৫,০০০ (বেসিক) থেকে ৳৩০,০০০+ (প্রিমিয়াম) পর্যন্ত। এন্টারপ্রাইজ সলিউশনের জন্য কাস্টম প্রাইসিং পাওয়া যায়।", "answerEn": "Website packages start from ৳5,000 (Basic) to ৳30,000+ (Premium). Custom pricing available for enterprise solutions.", "visible": true },
      { "id": "faq-delivery", "category": "timeline", "questionBn": "কত সময়ে ওয়েবসাইট ডেলিভারি করা হয়?", "questionEn": "How long does delivery take?", "answerBn": "প্যাকেজ অনুযায়ী ১–৩ সপ্তাহ। বড় প্রজেক্টে সময় আরও বাড়তে পারে।", "answerEn": "Delivery takes 1–3 weeks depending on the package. Larger projects may take longer.", "visible": true }
    ],
    "searchScope": [
      { "id": "search-blog", "value": "blog", "labelBn": "ব্লগ পোস্ট", "labelEn": "Blog posts", "weight": 10, "enabled": true },
      { "id": "search-services", "value": "services", "labelBn": "সেবা", "labelEn": "Services", "weight": 8, "enabled": true },
      { "id": "search-portfolio", "value": "portfolio", "labelBn": "পোর্টফোলিও", "labelEn": "Portfolio", "weight": 6, "enabled": true },
      { "id": "search-gallery", "value": "gallery", "labelBn": "গ্যালারি", "labelEn": "Gallery", "weight": 4, "enabled": true }
    ],
    "searchPlaceholderBn": "সাইটে খুঁজুন...",
    "searchPlaceholderEn": "Search the site...",
    "legalPages": [
      { "key": "privacy", "titleBn": "প্রাইভেসি পলিসি", "titleEn": "Privacy Policy", "bodyBn": "## আপনার তথ্য\nআমরা আপনার যোগাযোগের তথ্য শুধুমাত্র আপনার সাথে যোগাযোগের জন্য ব্যবহার করি।", "bodyEn": "## Your data\nWe only use your contact information to communicate with you.", "updatedAtBn": "১ জানুয়ারি, ২০২৬", "updatedAtEn": "January 1, 2026", "visible": true },
      { "key": "terms", "titleBn": "সার্ভিস শর্তাবলি", "titleEn": "Terms of Service", "bodyBn": "## শর্তাবলি\nআমাদের সেবা ব্যবহার করে আপনি এই শর্তাবলিতে সম্মত হচ্ছেন।", "bodyEn": "## Terms\nBy using our services you agree to these terms.", "updatedAtBn": "১ জানুয়ারি, ২০২৬", "updatedAtEn": "January 1, 2026", "visible": true },
      { "key": "cookie", "titleBn": "কুকি নোটিশ", "titleEn": "Cookie Notice", "bodyBn": "## কুকি\nআমরা অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করি।", "bodyEn": "## Cookies\nWe use cookies to improve your experience.", "updatedAtBn": "১ জানুয়ারি, ২০২৬", "updatedAtEn": "January 1, 2026", "visible": true },
      { "key": "refund", "titleBn": "রিফান্ড পলিসি", "titleEn": "Refund Policy", "bodyBn": "## রিফান্ড\nপ্রজেক্ট শুরু হওয়ার আগে জমা দেওয়া অগ্রিম সম্পূর্ণ ফেরত দেওয়া হয়।", "bodyEn": "## Refunds\nAdvances paid before project start are fully refundable.", "updatedAtBn": "১ জানুয়ারি, ২০২৬", "updatedAtEn": "January 1, 2026", "visible": true }
    ]
  }
  $$
)
on conflict (key) do nothing;
