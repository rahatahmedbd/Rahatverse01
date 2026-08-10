-- Phase 4C: Portfolio case-study depth + honest status labels
--
-- Enriches content_config.portfolio_config so the portfolio page shows real
-- case-study context and an accurate lifecycle status per project:
--   proj-rahatverse    → live           (this website — a personal project)
--   proj-shantichakra  → in-development (donor directory being built)
--   proj-educare       → concept        (design-stage blueprint, NOT delivered)
--
-- Guards ("existing admin values win"):
--   * longDescription/longDescriptionBn are replaced ONLY when absent or when
--     they still equal the old short code defaults. Any admin-written custom
--     description is left untouched.
--   * `status` is only added when missing or outside the valid set
--     (live | in-development | concept).
-- Safe to re-run. If the portfolio_config row does not exist yet, the full
-- Phase 4 defaults are seeded (matching the built-in code defaults).
-- The `content_config` table is created if this environment lacks it
-- (production has had it since Phase 10).

create table if not exists public.content_config (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.content_config (key, value)
values (
  'portfolio_config',
  $P4C${
    "visible": true,
    "section": {
      "badgeBn": "🚀 আমার প্রজেক্ট ও কেস স্টাডি",
      "badgeEn": "🚀 Projects & Case Studies",
      "titleBn": "বাস্তব প্রজেক্ট ও সমাধান",
      "titleEn": "Featured Work & Case Studies",
      "subtitleBn": "আধুনিক ওয়েব প্রযুক্তি, পরিষ্কার কোড ও ইউজার-কেন্দ্রিক ডিজাইনের মাধ্যমে তৈরি বাস্তব প্রজেক্টসমূহ",
      "subtitleEn": "Real-world web solutions built with modern technology, clean architecture, and user-centric design"
    },
    "categories": [
      { "id": "pcat-all", "value": "all", "labelBn": "সব প্রজেক্ট", "labelEn": "All Work", "visible": true },
      { "id": "pcat-portfolio", "value": "portfolio", "labelBn": "পোর্টফোলিও", "labelEn": "Portfolio", "visible": true },
      { "id": "pcat-blood", "value": "blood-donation", "labelBn": "রক্তদান ও সমাজসেবা", "labelEn": "Blood Donation", "visible": true },
      { "id": "pcat-education", "value": "education", "labelBn": "শিক্ষা ও এডুটেক", "labelEn": "Education", "visible": true },
      { "id": "pcat-ecommerce", "value": "ecommerce", "labelBn": "ই-কমার্স ও ব্যবসা", "labelEn": "E-Commerce", "visible": true }
    ],
    "projects": [
      {
        "id": "proj-rahatverse",
        "status": "live",
        "title": "RahatVerse — Complete Personal Ecosystem & CMS",
        "titleBn": "রাহাতভার্স — সম্পূর্ণ ব্যক্তিগত ইকোসিস্টেম ও CMS",
        "description": "A production-grade multilingual portfolio and CMS built with Next.js 16, TypeScript, Tailwind CSS, Supabase, and Cloudinary.",
        "descriptionBn": "Next.js 16, TypeScript, Tailwind CSS, Supabase ও Cloudinary দিয়ে তৈরি মাল্টি-ল্যাংগুয়েজ পোর্টফোলিও এবং অ্যাডমিন ড্যাশবোর্ড।",
        "longDescription": "My own digital home, designed and built end-to-end as a personal project. RahatVerse is a bilingual (Bengali–English) portfolio with a full admin CMS behind it: blog publishing, a dynamic photo gallery with Cloudinary image optimization, service packages with a live order wizard, FAQ and newsletter management, and an on-site AI assistant. The stack is Next.js 16 App Router with server-side rendering, TypeScript, Tailwind CSS, Supabase (PostgreSQL, authentication and file storage) and next-intl for localization, plus automated technical SEO — canonical URLs, hreflang, sitemap, robots.txt and a linked JSON-LD entity graph. Deployed on Vercel. The site you are browsing right now is the live demo.",
        "longDescriptionBn": "আমার নিজের ডিজিটাল ঠিকানা — শুরু থেকে শেষ পর্যন্ত সম্পূর্ণ নিজে ডিজাইন ও ডেভেলপ করা ব্যক্তিগত প্রজেক্ট। রাহাতভার্স একটি দ্বিভাষিক (বাংলা–ইংরেজি) পোর্টফোলিও, যার পেছনে রয়েছে সম্পূর্ণ অ্যাডমিন CMS: ব্লগ পাবলিশিং, Cloudinary ইমেজ অপটিমাইজেশনসহ ডাইনামিক ফটো গ্যালারি, লাইভ অর্ডার উইজার্ডসহ সার্ভিস প্যাকেজ, FAQ ও নিউজলেটার ব্যবস্থাপনা এবং সাইটে সংযুক্ত AI অ্যাসিস্ট্যান্ট। টেক স্ট্যাক — সার্ভার-সাইড রেন্ডারিংসহ Next.js 16 App Router, TypeScript, Tailwind CSS, Supabase (PostgreSQL, অথেনটিকেশন ও স্টোরেজ) এবং next-intl লোকালাইজেশন; সাথে স্বয়ংক্রিয় টেকনিক্যাল SEO — ক্যানোনিক্যাল URL, hreflang, সাইটম্যাপ, robots.txt ও JSON-LD এন্টিটি গ্রাফ। Vercel-এ ডিপ্লয় করা। আপনি যে সাইটটি ঘুরছেন, সেটিই এই প্রজেক্টের লাইভ ডেমো।",
        "image": "/images/gallery-web.svg",
        "tags": ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase", "Cloudinary", "i18n"],
        "tagsBn": ["Next.js 16", "TypeScript", "Tailwind CSS", "Supabase", "Cloudinary", "i18n"],
        "liveUrl": "https://rahatahmed.site",
        "githubUrl": "https://github.com/rahatahmedbd/Rahatverse01",
        "category": "portfolio",
        "featured": true,
        "visible": true,
        "completedAt": "2026"
      },
      {
        "id": "proj-shantichakra",
        "status": "in-development",
        "title": "Shantichakra Blood Society — Digital Donor Directory",
        "titleBn": "শান্তিচক্র ব্লাড সোসাইটি — ডিজিটাল রক্তদাতা ডিরেক্টরি",
        "description": "A digital donor directory and emergency blood-request platform I am building for Shantichakra Blood Society, the voluntary organization I co-founded in Sunamganj.",
        "descriptionBn": "আমার সহ-প্রতিষ্ঠিত স্বেচ্ছাসেবী সংগঠন শান্তিচক্র ব্লাড সোসাইটির জন্য নির্মাণাধীন ডিজিটাল রক্তদাতা ডিরেক্টরি ও জরুরি রক্ত-অনুরোধ প্ল্যাটফর্ম।",
        "longDescription": "Shantichakra Blood Society is a voluntary blood-donation organization I helped establish in Sunamganj in 2025, where I serve as General Secretary coordinating donors, volunteers and awareness activities. This platform — currently in active development — is designed to make emergency donor discovery faster across our six coverage areas: Sunamganj Sadar, Shantiganj, Jamalganj, Tahirpur, Derai and Dowarabazar. Planned features include blood-group filtering, area-wise donor search and a clear emergency contact flow, built with Next.js, React, Supabase and Tailwind CSS. Until the full portal ships, donor coordination runs through the society's Facebook group and WhatsApp emergency hotline — both linked from my Experience page.",
        "longDescriptionBn": "শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জে ২০২৫ সালে প্রতিষ্ঠিত একটি স্বেচ্ছাসেবী রক্তদান সংগঠন, যেখানে আমি সাধারণ সম্পাদক হিসেবে রক্তদাতা ব্যবস্থাপনা, স্বেচ্ছাসেবক সমন্বয় ও সচেতনতামূলক কার্যক্রম পরিচালনা করি। এই প্ল্যাটফর্মটি — বর্তমানে সক্রিয় ডেভেলপমেন্টের পর্যায়ে — তৈরি করা হচ্ছে আমাদের ছয়টি সেবা এলাকা (সুনামগঞ্জ সদর, শান্তিগঞ্জ, জামালগঞ্জ, তাহিরপুর, দিরাই ও দোয়ারাবাজার) জুড়ে জরুরি মুহূর্তে রক্তদাতা খোঁজা দ্রুত করতে। পরিকল্পিত ফিচারের মধ্যে রয়েছে ব্লাড-গ্রুপ ফিল্টারিং, এলাকাভিত্তিক দাতা সন্ধান ও সহজ জরুরি যোগাযোগ ব্যবস্থা; টেক স্ট্যাক Next.js, React, Supabase ও Tailwind CSS। পূর্ণ পোর্টাল চালু হওয়ার আগ পর্যন্ত দাতা সমন্বয় চলছে সংগঠনের ফেসবুক গ্রুপ ও হোয়াটসঅ্যাপ হটলাইনের মাধ্যমে — দুটোর লিংকই আমার এক্সপেরিয়েন্স পেজে রয়েছে।",
        "image": "/images/gallery-blood.svg",
        "tags": ["Next.js", "React", "Supabase", "Tailwind CSS", "Real-time Alerts"],
        "tagsBn": ["Next.js", "React", "Supabase", "Tailwind CSS", "Real-time Alerts"],
        "liveUrl": "https://rahatahmed.site/bn/experience",
        "githubUrl": "https://github.com/rahatahmedbd",
        "category": "blood-donation",
        "featured": true,
        "visible": true,
        "completedAt": "2025"
      },
      {
        "id": "proj-educare",
        "status": "concept",
        "title": "EduCare — Interactive Tutoring & Student Management",
        "titleBn": "এডুকেয়ার — ইন্টারঅ্যাক্টিভ টিউটরিং ও স্টুডেন্ট ট্র্যাকার",
        "description": "A concept-stage tutoring management design for private tutors to organize batch schedules, student progress, and lecture notes.",
        "descriptionBn": "গৃহশিক্ষকদের ব্যাচ শিডিউল, উপস্থিতি ও পরীক্ষার অগ্রগতি সহজে গুছিয়ে রাখার জন্য ডিজাইন-পর্যায়ের ধারণা (কনসেপ্ট) প্রজেক্ট।",
        "longDescription": "EduCare is a concept project grounded in my everyday work: I teach class 7–9 students as a private tutor, and I founded FS Coaching Center at Jibdara Bazar to make quality lessons affordable for underprivileged students in my village. Running batches by hand showed me exactly what a tutoring-management tool should solve — batch schedules, attendance tracking, exam-progress visualization and study-material distribution. EduCare is the design-stage blueprint for that tool: a personal project that is not yet a deployed product, planned around React, TypeScript, Node.js and PostgreSQL.",
        "longDescriptionBn": "এডুকেয়ার আমার দৈনন্দিন কাজের অভিজ্ঞতা থেকে জন্ম নেওয়া একটি কনসেপ্ট প্রজেক্ট: আমি গৃহশিক্ষক হিসেবে সপ্তম–নবম শ্রেণির শিক্ষার্থীদের পড়াই এবং গ্রামের অসহায় মেধাবী শিক্ষার্থীদের সুলভ মূল্যে মানসম্মত পাঠদানের লক্ষ্যে জীবদাড়া বাজারে FS কোচিং সেন্টার প্রতিষ্ঠা করি। হাতে-কলমে ব্যাচ চালাতে গিয়েই বুঝেছি একটা টিউটরিং-ম্যানেজমেন্ট টুলে আসলে কী কী দরকার — ব্যাচ শিডিউল, উপস্থিতি ট্র্যাকিং, পরীক্ষার অগ্রগতির চিত্র এবং স্টাডি ম্যাটেরিয়াল বিতরণ। এডুকেয়ার সেই টুলের ডিজাইন-পর্যায়ের খসড়া; এটি এখনো ডিপ্লয় করা প্রোডাক্ট নয়, পরিকল্পিত স্ট্যাক React, TypeScript, Node.js ও PostgreSQL।",
        "image": "/images/gallery-science.svg",
        "tags": ["React", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"],
        "tagsBn": ["React", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"],
        "liveUrl": "#",
        "githubUrl": "https://github.com/rahatahmedbd",
        "category": "education",
        "featured": true,
        "visible": true,
        "completedAt": "2025"
      }
    ]
  }$P4C$
)
on conflict (key) do nothing;

-- Guarded enrichment of an EXISTING stored config (admin values win).
do $$
declare
  cfg jsonb;
  projects jsonb;
  p jsonb;
  new_projects jsonb := '[]'::jsonb;
  pid text;
  cur text;
  status text;

  rv_en text := $TXT$My own digital home, designed and built end-to-end as a personal project. RahatVerse is a bilingual (Bengali–English) portfolio with a full admin CMS behind it: blog publishing, a dynamic photo gallery with Cloudinary image optimization, service packages with a live order wizard, FAQ and newsletter management, and an on-site AI assistant. The stack is Next.js 16 App Router with server-side rendering, TypeScript, Tailwind CSS, Supabase (PostgreSQL, authentication and file storage) and next-intl for localization, plus automated technical SEO — canonical URLs, hreflang, sitemap, robots.txt and a linked JSON-LD entity graph. Deployed on Vercel. The site you are browsing right now is the live demo.$TXT$;
  rv_bn text := $TXT$আমার নিজের ডিজিটাল ঠিকানা — শুরু থেকে শেষ পর্যন্ত সম্পূর্ণ নিজে ডিজাইন ও ডেভেলপ করা ব্যক্তিগত প্রজেক্ট। রাহাতভার্স একটি দ্বিভাষিক (বাংলা–ইংরেজি) পোর্টফোলিও, যার পেছনে রয়েছে সম্পূর্ণ অ্যাডমিন CMS: ব্লগ পাবলিশিং, Cloudinary ইমেজ অপটিমাইজেশনসহ ডাইনামিক ফটো গ্যালারি, লাইভ অর্ডার উইজার্ডসহ সার্ভিস প্যাকেজ, FAQ ও নিউজলেটার ব্যবস্থাপনা এবং সাইটে সংযুক্ত AI অ্যাসিস্ট্যান্ট। টেক স্ট্যাক — সার্ভার-সাইড রেন্ডারিংসহ Next.js 16 App Router, TypeScript, Tailwind CSS, Supabase (PostgreSQL, অথেনটিকেশন ও স্টোরেজ) এবং next-intl লোকালাইজেশন; সাথে স্বয়ংক্রিয় টেকনিক্যাল SEO — ক্যানোনিক্যাল URL, hreflang, সাইটম্যাপ, robots.txt ও JSON-LD এন্টিটি গ্রাফ। Vercel-এ ডিপ্লয় করা। আপনি যে সাইটটি ঘুরছেন, সেটিই এই প্রজেক্টের লাইভ ডেমো।$TXT$;
  sc_en text := $TXT$Shantichakra Blood Society is a voluntary blood-donation organization I helped establish in Sunamganj in 2025, where I serve as General Secretary coordinating donors, volunteers and awareness activities. This platform — currently in active development — is designed to make emergency donor discovery faster across our six coverage areas: Sunamganj Sadar, Shantiganj, Jamalganj, Tahirpur, Derai and Dowarabazar. Planned features include blood-group filtering, area-wise donor search and a clear emergency contact flow, built with Next.js, React, Supabase and Tailwind CSS. Until the full portal ships, donor coordination runs through the society's Facebook group and WhatsApp emergency hotline — both linked from my Experience page.$TXT$;
  sc_bn text := $TXT$শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জে ২০২৫ সালে প্রতিষ্ঠিত একটি স্বেচ্ছাসেবী রক্তদান সংগঠন, যেখানে আমি সাধারণ সম্পাদক হিসেবে রক্তদাতা ব্যবস্থাপনা, স্বেচ্ছাসেবক সমন্বয় ও সচেতনতামূলক কার্যক্রম পরিচালনা করি। এই প্ল্যাটফর্মটি — বর্তমানে সক্রিয় ডেভেলপমেন্টের পর্যায়ে — তৈরি করা হচ্ছে আমাদের ছয়টি সেবা এলাকা (সুনামগঞ্জ সদর, শান্তিগঞ্জ, জামালগঞ্জ, তাহিরপুর, দিরাই ও দোয়ারাবাজার) জুড়ে জরুরি মুহূর্তে রক্তদাতা খোঁজা দ্রুত করতে। পরিকল্পিত ফিচারের মধ্যে রয়েছে ব্লাড-গ্রুপ ফিল্টারিং, এলাকাভিত্তিক দাতা সন্ধান ও সহজ জরুরি যোগাযোগ ব্যবস্থা; টেক স্ট্যাক Next.js, React, Supabase ও Tailwind CSS। পূর্ণ পোর্টাল চালু হওয়ার আগ পর্যন্ত দাতা সমন্বয় চলছে সংগঠনের ফেসবুক গ্রুপ ও হোয়াটসঅ্যাপ হটলাইনের মাধ্যমে — দুটোর লিংকই আমার এক্সপেরিয়েন্স পেজে রয়েছে।$TXT$;
  ed_en text := $TXT$EduCare is a concept project grounded in my everyday work: I teach class 7–9 students as a private tutor, and I founded FS Coaching Center at Jibdara Bazar to make quality lessons affordable for underprivileged students in my village. Running batches by hand showed me exactly what a tutoring-management tool should solve — batch schedules, attendance tracking, exam-progress visualization and study-material distribution. EduCare is the design-stage blueprint for that tool: a personal project that is not yet a deployed product, planned around React, TypeScript, Node.js and PostgreSQL.$TXT$;
  ed_bn text := $TXT$এডুকেয়ার আমার দৈনন্দিন কাজের অভিজ্ঞতা থেকে জন্ম নেওয়া একটি কনসেপ্ট প্রজেক্ট: আমি গৃহশিক্ষক হিসেবে সপ্তম–নবম শ্রেণির শিক্ষার্থীদের পড়াই এবং গ্রামের অসহায় মেধাবী শিক্ষার্থীদের সুলভ মূল্যে মানসম্মত পাঠদানের লক্ষ্যে জীবদাড়া বাজারে FS কোচিং সেন্টার প্রতিষ্ঠা করি। হাতে-কলমে ব্যাচ চালাতে গিয়েই বুঝেছি একটা টিউটরিং-ম্যানেজমেন্ট টুলে আসলে কী কী দরকার — ব্যাচ শিডিউল, উপস্থিতি ট্র্যাকিং, পরীক্ষার অগ্রগতির চিত্র এবং স্টাডি ম্যাটেরিয়াল বিতরণ। এডুকেয়ার সেই টুলের ডিজাইন-পর্যায়ের খসড়া; এটি এখনো ডিপ্লয় করা প্রোডাক্ট নয়, পরিকল্পিত স্ট্যাক React, TypeScript, Node.js ও PostgreSQL।$TXT$;

  old_rv text := 'Designed and engineered as a central digital presence featuring blog management, dynamic photo gallery with Cloudinary optimization, SEO automation, client order wizard, and role-based administration.';
  old_sc text := 'Features real-time blood group filtering, district-wise donor search, automated notification dispatch, and community awareness blog articles.';
  old_ed text := 'Includes attendance tracking, exam performance visualization, PDF resource distribution, and direct parent communication channels.';
begin
  select value into cfg from public.content_config where key = 'portfolio_config';
  if cfg is null then
    return; -- nothing stored; code defaults already carry the Phase 4 content
  end if;

  projects := cfg->'projects';
  if projects is null or jsonb_typeof(projects) <> 'array' then
    return;
  end if;

  for p in select * from jsonb_array_elements(projects) loop
    pid := p->>'id';
    cur := p->>'longDescription';
    status := p->>'status';

    if pid = 'proj-rahatverse' then
      if cur is null or cur = old_rv then
        p := p || jsonb_build_object('longDescription', rv_en, 'longDescriptionBn', rv_bn);
      end if;
      if status is null or status not in ('live', 'in-development', 'concept') then
        p := p || jsonb_build_object('status', 'live');
      end if;
    elsif pid = 'proj-shantichakra' then
      if cur is null or cur = old_sc then
        p := p || jsonb_build_object('longDescription', sc_en, 'longDescriptionBn', sc_bn);
      end if;
      if status is null or status not in ('live', 'in-development', 'concept') then
        p := p || jsonb_build_object('status', 'in-development');
      end if;
    elsif pid = 'proj-educare' then
      if cur is null or cur = old_ed then
        p := p || jsonb_build_object('longDescription', ed_en, 'longDescriptionBn', ed_bn);
      end if;
      if status is null or status not in ('live', 'in-development', 'concept') then
        p := p || jsonb_build_object('status', 'concept');
      end if;
    end if;

    new_projects := new_projects || jsonb_build_array(p);
  end loop;

  if new_projects <> projects then
    update public.content_config
    set value = jsonb_set(cfg, '{projects}', new_projects)
    where key = 'portfolio_config';
  end if;
end $$;
