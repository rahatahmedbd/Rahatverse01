-- Client-focused homepage update: hero, services, process & FAQ refresh.
--
-- Updates the stored CMS documents so the deployed site (which reads from
-- site_settings) matches the new code defaults in:
--   src/lib/hero/config.ts     (typewriter, badges, counters, CTAs)
--   src/lib/services/config.ts (4 core services, why-me features, 5-step
--                               Discover→Plan→Design→Develop→Launch process,
--                               4 featured packages)
--   src/lib/content/config.ts  (technical FAQ category + 4 client questions:
--                               responsive, backend, deployment, maintenance)
--
-- Admins can still customize everything afterwards from the dashboard; this
-- only replaces the fields listed below, preserving the rest of each document.

-- ── 1. hero_config — web-developer focus ───────────────
update public.site_settings
set value = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        value,
        '{typewriter}',
        $tw${"bn": ["ওয়েব ডেভেলপার", "Next.js ডেভেলপার", "রিঅ্যাক্ট ডেভেলপার", "ফ্রিল্যান্সার"], "en": ["Web Developer", "Next.js Developer", "React Developer", "Freelancer"]}$tw$::jsonb,
        false
      ),
      '{badges}',
      $badges$[
        {"id": "badge-1", "labelBn": "ওয়েব ডেভেলপার", "labelEn": "Web Developer"},
        {"id": "badge-2", "labelBn": "Next.js • React • TypeScript", "labelEn": "Next.js • React • TypeScript"},
        {"id": "badge-3", "labelBn": "ফ্রিল্যান্স কাজের জন্য উন্মুক্ত", "labelEn": "Available for Freelance Work"}
      ]$badges$::jsonb,
      false
    ),
    '{counters}',
    $counters$[
      {"id": "c-1", "labelBn": "প্রজেক্ট", "labelEn": "Projects", "value": 3, "suffix": "+"},
      {"id": "c-2", "labelBn": "টেকনোলজি", "labelEn": "Technologies", "value": 8, "suffix": "+"},
      {"id": "c-3", "labelBn": "জাতীয় পুরস্কার", "labelEn": "National Awards", "value": 5, "suffix": "×"},
      {"id": "c-4", "labelBn": "রেসপন্স টাইম", "labelEn": "Response Time", "value": 24, "suffix": "h"}
    ]$counters$::jsonb,
    false
  ),
  '{ctas}',
  $ctas$[
    {
      "id": "cta-start-project",
      "labelBn": "প্রজেক্ট শুরু করুন",
      "labelEn": "Start a Project",
      "href": "/contact",
      "variant": "gradient",
      "icon": "Rocket",
      "pulse": true
    },
    {
      "id": "cta-portfolio",
      "labelBn": "কাজ দেখুন",
      "labelEn": "View Work",
      "href": "/portfolio",
      "variant": "glass",
      "icon": "Eye",
      "pulse": false
    }
  ]$ctas$::jsonb,
  false
)
where key = 'hero_config'
  and jsonb_typeof(value) = 'object'
  and jsonb_typeof(value->'ctas') = 'array';

-- ── 2. services_config — 4 core services, why-me features, 5-step process ──
update public.site_settings
set value = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        value,
        '{services}',
        $services$[
          {
            "id": "business-website", "visible": true, "icon": "Building2",
            "titleBn": "বিজনেস ওয়েবসাইট", "titleEn": "Business Website",
            "descriptionBn": "আপনার ব্যবসার জন্য প্রফেশনাল, আস্থা-জাগানো ওয়েবসাইট",
            "descriptionEn": "A professional, trust-building online home for your business",
            "featuresBn": ["কোম্পানি প্রোফাইল ও সার্ভিস পেজ", "লিড জেনারেশন ফর্ম", "মোবাইল-ফার্স্ট রেসপনসিভ ডিজাইন", "SEO-রেডি কাঠামো", "অ্যানালিটিক্স সেটআপ"],
            "featuresEn": ["Company profile & service pages", "Lead generation forms", "Mobile-first responsive design", "SEO-ready structure", "Analytics setup"],
            "priceBn": "৳১০,০০০ থেকে শুরু", "priceEn": "Starting from ৳10,000",
            "deliveryBn": "১-৩ সপ্তাহ ডেলিভারি", "deliveryEn": "1-3 week delivery"
          },
          {
            "id": "landing-page", "visible": true, "icon": "Rocket",
            "titleBn": "ল্যান্ডিং পেজ", "titleEn": "Landing Page",
            "descriptionBn": "ক্যাম্পেইন বা প্রোডাক্টের জন্য হাই-কনভার্সন ল্যান্ডিং পেজ",
            "descriptionEn": "High-converting landing page for campaigns and products",
            "featuresBn": ["কনভার্সন-ফোকাসড কপি লেআউট", "স্পষ্ট CTA ও লিড ফর্ম", "দ্রুত লোডিং (৯০+ পারফরম্যান্স টার্গেট)", "A/B টেস্টের জন্য প্রস্তুত সেকশন", "মেটা/Google Ads-এ লিংক করার উপযোগী"],
            "featuresEn": ["Conversion-focused copy layout", "Clear CTAs & lead forms", "Fast loading (90+ performance target)", "Sections ready for A/B testing", "Ready to link from Meta / Google Ads"],
            "priceBn": "৳৫,০০০ থেকে শুরু", "priceEn": "Starting from ৳5,000",
            "deliveryBn": "১-২ সপ্তাহ ডেলিভারি", "deliveryEn": "1-2 week delivery"
          },
          {
            "id": "ecommerce-website", "visible": true, "icon": "ShoppingBag",
            "titleBn": "ই-কমার্স সাইট", "titleEn": "E-Commerce Website",
            "descriptionBn": "অনলাইনে পণ্য বিক্রির জন্য সম্পূর্ণ ই-কমার্স সমাধান",
            "descriptionEn": "Complete e-commerce solution for selling products online",
            "featuresBn": ["পণ্য ক্যাটালগ ও সার্চ", "শপিং কার্ট ও চেকআউট", "পেমেন্ট ইন্টিগ্রেশন", "অর্ডার ম্যানেজমেন্ট ড্যাশবোর্ড", "ইনভেন্টরি ট্র্যাকিং"],
            "featuresEn": ["Product catalog & search", "Shopping cart & checkout", "Payment integration", "Order management dashboard", "Inventory tracking"],
            "priceBn": "৳৩০,০০০ থেকে শুরু", "priceEn": "Starting from ৳30,000",
            "deliveryBn": "২-৪ সপ্তাহ ডেলিভারি", "deliveryEn": "2-4 week delivery"
          },
          {
            "id": "web-application", "visible": true, "icon": "Code",
            "titleBn": "ওয়েব অ্যাপ্লিকেশন", "titleEn": "Web Application",
            "descriptionBn": "কাস্টম ফিচার, ড্যাশবোর্ড ও ডেটাবেসসহ ওয়েব অ্যাপ",
            "descriptionEn": "Custom web apps with dashboards, auth and databases",
            "featuresBn": ["ইউজার অ্যাকাউন্ট ও রোল-ভিত্তিক পারমিশন", "কাস্টম ড্যাশবোর্ড ও রিপোর্ট", "Supabase ডেটাবেস ও API", "অ্যাডমিন প্যানেল", "স্কেলেবল আর্কিটেকচার"],
            "featuresEn": ["User accounts & role-based access", "Custom dashboards & reports", "Supabase database & APIs", "Admin panel", "Scalable architecture"],
            "priceBn": "কাস্টম কোটেশন", "priceEn": "Custom quote",
            "deliveryBn": "স্কোপ অনুযায়ী সময়রেখা", "deliveryEn": "Timeline depends on scope"
          }
        ]$services$::jsonb,
        false
      ),
      '{features}',
      $features$[
        {"id": "feat-responsive", "visible": true, "icon": "Smartphone", "titleBn": "সম্পূর্ণ রেসপনসিভ", "titleEn": "Fully Responsive", "descriptionBn": "মোবাইল, ট্যাব ও ডেস্কটপ — সব স্ক্রিনে নিখুঁত অভিজ্ঞতা", "descriptionEn": "Pixel-perfect on mobile, tablet and every desktop size"},
        {"id": "feat-speed", "visible": true, "icon": "Zap", "titleBn": "দ্রুতগতির পারফরম্যান্স", "titleEn": "Blazing Fast", "descriptionBn": "অপটিমাইজড কোড, ছবি ও CDN — দ্রুত লোডিং ও ভালো Core Web Vitals", "descriptionEn": "Optimized code, images and CDN for great Core Web Vitals"},
        {"id": "feat-seo", "visible": true, "icon": "Search", "titleBn": "SEO-রেডি", "titleEn": "SEO-Ready", "descriptionBn": "মেটাডেটা, সাইটম্যাপ ও স্ট্রাকচার্ড ডেটাসহ সার্চ-বান্ধব কাঠামো", "descriptionEn": "Search-friendly structure with metadata, sitemap and schema"},
        {"id": "feat-clean-code", "visible": true, "icon": "Code2", "titleBn": "পরিষ্কার কোড", "titleEn": "Clean Code", "descriptionBn": "TypeScript, পরিষ্কার আর্কিটেকচার — ভবিষ্যতে সহজে মেইনটেইন ও এক্সটেন্ড করা যায়", "descriptionEn": "TypeScript and clean architecture that is easy to maintain"},
        {"id": "feat-modern-ui", "visible": true, "icon": "Sparkles", "titleBn": "মডার্ন UI", "titleEn": "Modern UI", "descriptionBn": "আজকের মানের পরিষ্কার, আধুনিক ও ইউজার-কেন্দ্রিক ডিজাইন", "descriptionEn": "Clean, contemporary, user-centred design that converts"},
        {"id": "feat-support", "visible": true, "icon": "CheckCircle2", "titleBn": "সাপোর্ট", "titleEn": "Real Support", "descriptionBn": "ডেলিভারির পরও সাপোর্ট — প্রশ্ন থাকলে সরাসরি আমার সাথে যোগাযোগ", "descriptionEn": "Support after delivery — you talk directly to the developer"}
      ]$features$::jsonb,
      false
    ),
    '{processSteps}',
    $steps$[
      {"id": "step-discover", "stepBn": "০১", "stepEn": "01", "titleBn": "ডিসকভার", "titleEn": "Discover", "descriptionBn": "আপনার লক্ষ্য, অডিয়েন্স ও প্রয়োজন বুঝে নেওয়া", "descriptionEn": "I understand your goals, audience and requirements"},
      {"id": "step-plan", "stepBn": "০২", "stepEn": "02", "titleBn": "প্ল্যান", "titleEn": "Plan", "descriptionBn": "স্কোপ, পেজ স্ট্রাকচার, সময়রেখা ও বাজেট নির্ধারণ", "descriptionEn": "We fix scope, page structure, timeline and budget"},
      {"id": "step-design", "stepBn": "০৩", "stepEn": "03", "titleBn": "ডিজাইন", "titleEn": "Design", "descriptionBn": "আপনার ব্র্যান্ডের সাথে মানানসই আধুনিক UI ডিজাইন", "descriptionEn": "A modern UI design that fits your brand"},
      {"id": "step-develop", "stepBn": "০৪", "stepEn": "04", "titleBn": "ডেভেলপ", "titleEn": "Develop", "descriptionBn": "কোড লেখা, কনটেন্ট বসানো ও প্রতিটি ফিচার টেস্ট করা", "descriptionEn": "Clean code, real content and every feature tested"},
      {"id": "step-launch", "stepBn": "০৫", "stepEn": "05", "titleBn": "লঞ্চ", "titleEn": "Launch", "descriptionBn": "ডিপ্লয়, ডোমেইন কনেক্ট ও ডেলিভারির পর সাপোর্ট", "descriptionEn": "Deploy, connect your domain, and support afterwards"}
    ]$steps$::jsonb,
    false
  ),
  '{featuredPackages}',
  $packages$[
    {
      "id": "featured-business", "visible": true, "icon": "Building2",
      "titleBn": "বিজনেস ওয়েবসাইট", "titleEn": "Business Website",
      "subtitleBn": "কোম্পানি প্রোফাইল, সার্ভিস পেজ ও লিড ফর্মসহ পেশাদার ওয়েবসাইট।",
      "subtitleEn": "Company profile, service pages and lead forms — a professional online home.",
      "badgeBn": "জনপ্রিয়", "badgeEn": "Popular", "badgeVariant": "glow",
      "featuresBn": ["৫-১০ পেজ পর্যন্ত কাস্টম ডিজাইন", "লিড জেনারেশন ও যোগাযোগ ফর্ম", "মোবাইল-ফার্স্ট রেসপনসিভ লেআউট", "SEO-রেডি মেটাডেটা ও সাইটম্যাপ"],
      "featuresEn": ["Custom design, up to 5-10 pages", "Lead generation & contact forms", "Mobile-first responsive layout", "SEO-ready metadata & sitemap"],
      "pricingPackageId": "standard"
    },
    {
      "id": "featured-landing", "visible": true, "icon": "Rocket",
      "titleBn": "ল্যান্ডিং পেজ", "titleEn": "Landing Page",
      "subtitleBn": "ক্যাম্পেইন বা প্রোডাক্ট লঞ্চের জন্য এক পেজের হাই-কনভার্সন সাইট।",
      "subtitleEn": "A one-page, high-converting site for campaigns and product launches.",
      "badgeBn": "দ্রুততম", "badgeEn": "Fastest", "badgeVariant": "outline",
      "featuresBn": ["কনভার্সন-ফোকাসড সেকশন লেআউট", "স্পষ্ট CTA ও লিড ক্যাপচার", "অতিরিক্ত দ্রুত লোডিং", "Ads ক্যাম্পেইনে সরাসরি ব্যবহারযোগ্য"],
      "featuresEn": ["Conversion-focused section layout", "Clear CTAs & lead capture", "Extremely fast loading", "Ready to plug into ad campaigns"],
      "pricingPackageId": "basic"
    },
    {
      "id": "featured-ecommerce", "visible": true, "icon": "ShoppingBag",
      "titleBn": "ই-কমার্স সাইট", "titleEn": "E-Commerce Website",
      "subtitleBn": "পণ্য ক্যাটালগ, কার্ট, পেমেন্ট ও অর্ডার ম্যানেজমেন্টসহ অনলাইন শপ।",
      "subtitleEn": "Catalog, cart, payments and order management — a complete online shop.",
      "badgeBn": "প্রফেশনাল", "badgeEn": "Professional", "badgeVariant": "secondary",
      "featuresBn": ["পণ্য ক্যাটালগ ও সার্চ", "পেমেন্ট গেটওয়ে ইন্টিগ্রেশন", "অর্ডার ম্যানেজমেন্ট ড্যাশবোর্ড", "কাস্টমার নোটিফিকেশন"],
      "featuresEn": ["Product catalog & search", "Payment gateway integration", "Order management dashboard", "Customer notifications"],
      "pricingPackageId": "premium"
    },
    {
      "id": "featured-webapp", "visible": true, "icon": "Code2",
      "titleBn": "ওয়েব অ্যাপ্লিকেশন", "titleEn": "Web Application",
      "subtitleBn": "অথ, ড্যাশবোর্ড ও ডেটাবেসসহ কাস্টম ওয়েব অ্যাপ — আপনার প্রয়োজন অনুযায়ী।",
      "subtitleEn": "Custom web apps with auth, dashboards and databases — scoped to your needs.",
      "badgeBn": "এন্টারপ্রাইজ", "badgeEn": "Enterprise", "badgeVariant": "gradient",
      "featuresBn": ["ইউজার রোল ও সিকিউরিটি পারমিশন", "কাস্টম ডেটাবেস স্কিমা ও API", "অ্যাডমিন কমান্ড সেন্টার", "স্কেলেবল আর্কিটেকচার"],
      "featuresEn": ["User roles & security permissions", "Custom database schema & APIs", "Admin command center", "Scalable architecture"],
      "pricingPackageId": "enterprise"
    }
  ]$packages$::jsonb,
  false
)
where key = 'services_config'
  and jsonb_typeof(value) = 'object'
  and jsonb_typeof(value->'services') = 'array';

-- ── 3. content_config — technical FAQ category + 4 client questions ────
-- Idempotent: only appends when faq-responsive is missing.
update public.site_settings as settings
set value = jsonb_set(
  jsonb_set(
    settings.value,
    '{faqCategories}',
    (settings.value->'faqCategories')
      || $cats$[{"id": "faq-cat-technical", "value": "technical", "labelBn": "টেকনিক্যাল", "labelEn": "Technical", "visible": true}]$cats$::jsonb
  ),
  '{faqItems}',
  (settings.value->'faqItems')
    || $items$[
      {"id": "faq-responsive", "category": "technical", "questionBn": "ওয়েবসাইটটি কি সব ডিভাইসে ঠিকঠাক দেখাবে?", "questionEn": "Will the website work properly on all devices?", "answerBn": "হ্যাঁ — প্রতিটি সাইট মোবাইল-ফার্স্টভাবে তৈরি হয় এবং ৩২০px থেকে বড় ডেস্কটপ পর্যন্ত প্রতিটি স্ক্রিন সাইজে টেস্ট করা হয়। বেশিরভাগ ভিজিটর মোবাইল থেকে আসে, তাই মোবাইল অভিজ্ঞতাই আমার প্রথম প্রায়োরিটি।", "answerEn": "Yes — every site is built mobile-first and tested from 320px phones up to large desktops. Most visitors arrive on mobile, so the mobile experience is always my first priority.", "visible": true},
      {"id": "faq-backend", "category": "technical", "questionBn": "ব্যাকএন্ড বা ডেটাবেস দরকার হলে কী হবে?", "questionEn": "What if my project needs a backend or database?", "answerBn": "Supabase (PostgreSQL) দিয়ে ইউজার অ্যাকাউন্ট, ফর্ম সাবমিশন, অর্ডার, কনটেন্ট ম্যানেজমেন্ট — সব ধরনের ব্যাকএন্ড ফিচার তৈরি করা যায়। এই রাহাতভার্স সাইটেই অ্যাডমিন CMS, ব্লগ, অর্ডার উইজার্ড ও মেসেজ সিস্টেম Supabase-ভিত্তিক। প্রয়োজন অনুযায়ী কাস্টম API-ও তৈরি করি।", "answerEn": "Supabase (PostgreSQL) powers user accounts, form submissions, orders and content management — this RahatVerse site itself runs its admin CMS, blog, order wizard and messaging on Supabase. Custom APIs can be built when your project needs them.", "visible": true},
      {"id": "faq-deployment", "category": "technical", "questionBn": "ডোমেইন ও হোস্টিং কীভাবে সাজাবো?", "questionEn": "How do domain and hosting work?", "answerBn": "সাইট Vercel-এ ডিপ্লয় করা হয় (HTTPS ও গ্লোবাল CDN সহ)। আপনার নিজের ডোমেইন থাকলে আমি DNS কনফিগার করে সংযুক্ত করে দেব; না থাকলে ডোমেইন কেনা ও সেটআপেও গাইড করব। ডিপ্লয়মেন্ট পুরোপুরি আমার দায়িত্বে সম্পন্ন হয়।", "answerEn": "Sites deploy on Vercel (with HTTPS and a global CDN). If you already own a domain, I configure the DNS and connect it; if not, I guide you through buying and setting one up. Deployment is handled end-to-end by me.", "visible": true},
      {"id": "faq-maintenance", "category": "technical", "questionBn": "লঞ্চের পর মেইনটেন্যান্স বা আপডেট পাবো?", "questionEn": "Do you offer maintenance after launch?", "answerBn": "হ্যাঁ। চুক্তিভুক্ত ওয়ারেন্টি সময়ে বাগ ফ্রি-তে ঠিক হয়। এর পরে ছোট আপডেট (কনটেন্ট/টেক্সট বদল) সাধারণত সামান্য ফি-তে করা হয়, আর নিয়মিত মেইনটেন্যান্স (কনটেন্ট আপডেট, নিরাপত্তা প্যাচ, নতুন ফিচার) চাইলে মাসিক ভিত্তিতেও নেওয়া যায় — প্রজেক্ট শুরুর আগেই সব লিখিতভাবে ঠিক হয়।", "answerEn": "Yes. Bugs within the agreed warranty period are fixed free. Small updates (content/text changes) afterwards are usually handled for a small fee, and ongoing maintenance (content updates, security patches, new features) can be arranged monthly — everything is agreed in writing before the project starts.", "visible": true}
    ]$items$::jsonb
)
where key = 'content_config'
  and jsonb_typeof(value) = 'object'
  and jsonb_typeof(value->'faqItems') = 'array'
  and not (value->'faqItems') @> $check$[{"id": "faq-responsive"}]$check$::jsonb;

-- ── 4. content_config — refresh the process FAQ answer to the 5 new steps ──
update public.site_settings as settings
set value = jsonb_set(
  settings.value,
  '{faqItems}',
  (
    select jsonb_agg(
      case
        when item->>'id' = 'faq-process' then item || $process${
          "answerBn": "পাঁচটি ধাপে কাজ সম্পন্ন হয়: ডিসকভার (প্রয়োজন বোঝা), প্ল্যান (স্কোপ ও সময়রেখা), ডিজাইন, ডেভেলপ এবং লঞ্চ। অর্ডার বা প্রজেক্ট রিকোয়েস্ট জমা দেওয়ার পর আমি ইমেইল বা হোয়াটসঅ্যাপে যোগাযোগ করে বিস্তারিত চূড়ান্ত করি।",
          "answerEn": "Work moves through five steps: Discover (understanding your needs), Plan (scope & timeline), Design, Develop and Launch. After you submit an order or a project request, I contact you by email or WhatsApp to finalize the details."
        }$process$::jsonb
        else item
      end
      order by position
    )
    from jsonb_array_elements(settings.value->'faqItems') with ordinality as entries(item, position)
  )
)
where key = 'content_config'
  and jsonb_typeof(value) = 'object'
  and jsonb_typeof(value->'faqItems') = 'array'
  and (value->'faqItems') @> $check$[{"id": "faq-process"}]$check$::jsonb;
