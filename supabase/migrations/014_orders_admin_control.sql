-- Phase 5: Client Orders, Kanban Pipeline & Payment Tracking
-- Part A: seeds the order-intake wizard configuration (`orders_config`) in site_settings.
-- Part B: adds the extended admin-only columns to the `orders` table that power the
--         Kanban board, private project links, communication log and payment tracking.
--
-- NOTE: The app code is resilient and uses the DEFAULT_ORDERS_CONFIG fallback and
-- tolerant column handling, so the site works even before these are applied. Apply
-- this migration (or your equivalent) to unlock persisted admin control.

-- ── Part B: extended order columns (idempotent) ───────────────────────────
alter table public.orders add column if not exists design_style text;
alter table public.orders add column if not exists project_links jsonb not null default '{}'::jsonb;
alter table public.orders add column if not exists payment jsonb not null default '{}'::jsonb;
alter table public.orders add column if not exists communication_log jsonb not null default '[]'::jsonb;

-- ── Part A: order intake wizard configuration ─────────────────────────────
insert into public.site_settings (key, value)
values (
  'orders_config',
  $$
  {
    "visible": true,
    "section": {
      "badgeBn": "🛒 ওয়েবসাইট অর্ডার",
      "badgeEn": "🛒 Order Website",
      "titleBn": "আপনার ওয়েবসাইট অর্ডার করুন",
      "titleEn": "Order Your Website",
      "subtitleBn": "কয়েকটি সহজ ধাপে আপনার স্বপ্নের ওয়েবসাইট অর্ডার করুন",
      "subtitleEn": "Order your dream website in a few simple steps"
    },
    "steps": {
      "packageBn": "প্যাকেজ",
      "packageEn": "Package",
      "designBn": "ডিজাইন",
      "designEn": "Design",
      "detailsBn": "বিস্তারিত",
      "detailsEn": "Details",
      "contactBn": "যোগাযোগ",
      "contactEn": "Contact",
      "reviewBn": "রিভিউ",
      "reviewEn": "Review"
    },
    "packages": [
      { "id": "pkg-basic", "value": "basic", "labelBn": "বেসিক", "labelEn": "Basic", "visible": true },
      { "id": "pkg-standard", "value": "standard", "labelBn": "স্ট্যান্ডার্ড", "labelEn": "Standard", "visible": true },
      { "id": "pkg-premium", "value": "premium", "labelBn": "প্রিমিয়াম", "labelEn": "Premium", "visible": true },
      { "id": "pkg-enterprise", "value": "enterprise", "labelBn": "এন্টারপ্রাইজ", "labelEn": "Enterprise", "visible": true }
    ],
    "websiteTypes": [
      { "id": "wt-portfolio", "value": "portfolio", "labelBn": "পোর্টফোলিও", "labelEn": "Portfolio", "visible": true },
      { "id": "wt-business", "value": "business", "labelBn": "ব্যবসায়িক", "labelEn": "Business", "visible": true },
      { "id": "wt-ecommerce", "value": "ecommerce", "labelBn": "ই-কমার্স", "labelEn": "E-Commerce", "visible": true },
      { "id": "wt-education", "value": "education", "labelBn": "শিক্ষা প্রতিষ্ঠান", "labelEn": "Education", "visible": true },
      { "id": "wt-blood", "value": "blood_org", "labelBn": "রক্ত সংগঠন", "labelEn": "Blood Organization", "visible": true },
      { "id": "wt-news", "value": "news_portal", "labelBn": "নিউজ পোর্টাল", "labelEn": "News Portal", "visible": true },
      { "id": "wt-landing", "value": "landing_page", "labelBn": "ল্যান্ডিং পেজ", "labelEn": "Landing Page", "visible": true },
      { "id": "wt-custom", "value": "custom", "labelBn": "কাস্টম", "labelEn": "Custom", "visible": true }
    ],
    "featureAddons": [
      { "id": "feat-responsive", "value": "responsive", "labelBn": "রেসপনসিভ ডিজাইন", "labelEn": "Responsive Design", "visible": true },
      { "id": "feat-seo", "value": "seo", "labelBn": "SEO অপটিমাইজেশন", "labelEn": "SEO Optimization", "visible": true },
      { "id": "feat-blog", "value": "blog", "labelBn": "ব্লগ সেকশন", "labelEn": "Blog Section", "visible": true },
      { "id": "feat-contact", "value": "contact_form", "labelBn": "কন্টাক্ট ফর্ম", "labelEn": "Contact Form", "visible": true },
      { "id": "feat-map", "value": "map", "labelBn": "Google Maps", "labelEn": "Google Maps", "visible": true },
      { "id": "feat-payment", "value": "payment", "labelBn": "পেমেন্ট ইন্টিগ্রেশন", "labelEn": "Payment Integration", "visible": true },
      { "id": "feat-auth", "value": "auth", "labelBn": "লগইন/সাইনআপ", "labelEn": "Login/Signup", "visible": true },
      { "id": "feat-admin", "value": "admin", "labelBn": "অ্যাডমিন প্যানেল", "labelEn": "Admin Panel", "visible": true },
      { "id": "feat-multilang", "value": "multilang", "labelBn": "মাল্টি-ল্যাংগুয়েজ", "labelEn": "Multi-Language", "visible": true },
      { "id": "feat-analytics", "value": "analytics", "labelBn": "অ্যানালিটিক্স", "labelEn": "Analytics", "visible": true }
    ],
    "designStyles": [
      { "id": "style-modern", "value": "modern", "labelBn": "মডার্ন", "labelEn": "Modern", "descriptionBn": "পরিষ্কার, মিনিমাল এবং পেশাদার লুক", "descriptionEn": "Clean, minimal and professional look", "visible": true },
      { "id": "style-glass", "value": "glassmorphism", "labelBn": "গ্লাসমর্ফিজম", "labelEn": "Glassmorphism", "descriptionBn": "ফ্রস্টেড গ্লাস ও গ্রেডিয়েন্ট ইফেক্ট", "descriptionEn": "Frosted glass and gradient effects", "visible": true },
      { "id": "style-dark", "value": "dark", "labelBn": "ডার্ক", "labelEn": "Dark", "descriptionBn": "ডার্ক থিম, নিয়ন অ্যাকসেন্ট", "descriptionEn": "Dark theme with neon accents", "visible": true },
      { "id": "style-playful", "value": "playful", "labelBn": "প্লে ফুল", "labelEn": "Playful", "descriptionBn": "রঙিন ও প্রাণবন্ত ডিজাইন", "descriptionEn": "Colorful and lively design", "visible": true }
    ],
    "pageIncrements": [1, 3, 5, 10, 20, 50],
    "budgetRanges": [
      { "id": "budget-1", "value": "5k-10k", "label": "৳5,000 - ৳10,000", "visible": true },
      { "id": "budget-2", "value": "10k-20k", "label": "৳10,000 - ৳20,000", "visible": true },
      { "id": "budget-3", "value": "20k-35k", "label": "৳20,000 - ৳35,000", "visible": true },
      { "id": "budget-4", "value": "35k-50k", "label": "৳35,000 - ৳50,000", "visible": true },
      { "id": "budget-5", "value": "50k+", "label": "৳50,000+", "visible": true }
    ],
    "timelineOptions": [
      { "id": "time-1w", "value": "1-week", "labelBn": "১ সপ্তাহ", "labelEn": "1 Week", "visible": true },
      { "id": "time-2w", "value": "2-weeks", "labelBn": "২ সপ্তাহ", "labelEn": "2 Weeks", "visible": true },
      { "id": "time-1m", "value": "1-month", "labelBn": "১ মাস", "labelEn": "1 Month", "visible": true },
      { "id": "time-flex", "value": "flexible", "labelBn": "ফ্লেক্সিবল", "labelEn": "Flexible", "visible": true }
    ],
    "cta": {
      "nextBn": "পরবর্তী",
      "nextEn": "Next",
      "backBn": "পিছনে",
      "backEn": "Back",
      "submitBn": "অর্ডার জমা দিন",
      "submitEn": "Submit Order",
      "submittingBn": "জমা হচ্ছে...",
      "submittingEn": "Submitting...",
      "successTitleBn": "অর্ডার সফলভাবে জমা হয়েছে!",
      "successTitleEn": "Order Submitted Successfully!",
      "successMessageBn": "আপনার অর্ডার পাওয়া গেছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
      "successMessageEn": "We received your order. We will contact you shortly."
    }
  }
  $$
)
on conflict (key) do nothing;
