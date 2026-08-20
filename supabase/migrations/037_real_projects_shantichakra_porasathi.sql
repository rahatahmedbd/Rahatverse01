-- Real-project update: Shantichakra Blood Society is now LIVE and a new live
-- project, PoraSathi (tuition marketplace), is added to the portfolio.
--
-- Syncs the stored CMS documents with the new code defaults in:
--   src/lib/portfolio/config.ts  (Shantichakra → live; PoraSathi appended)
--   src/lib/content/config.ts    (faq-blood-org answer → live website)
--   src/lib/hero/config.ts       (projects counter: 4 live projects)
--
-- Idempotent: re-running never duplicates entries.

-- ── 1a. portfolio_config — replace the Shantichakra project entry ──────
update public.content_config as cc
set value = jsonb_set(
  cc.value,
  '{projects}',
  (
    select jsonb_agg(
      case
        when item->>'id' = 'proj-shantichakra' then $shanti${
          "id": "proj-shantichakra",
          "status": "live",
          "title": "Shantichakra Blood Society — Emergency Donor Directory",
          "titleBn": "শান্তিচক্র ব্লাড সোসাইটি — জরুরি রক্তদাতা ডিরেক্টরি",
          "description": "The live digital donor directory and emergency blood-request platform I built for Shantichakra Blood Society, the voluntary organization I co-founded in Sunamganj.",
          "descriptionBn": "আমার সহ-প্রতিষ্ঠিত স্বেচ্ছাসেবী সংগঠন শান্তিচক্র ব্লাড সোসাইটির জন্য তৈরি লাইভ ডিজিটাল রক্তদাতা ডিরেক্টরি ও জরুরি রক্ত-অনুরোধ প্ল্যাটফর্ম।",
          "longDescription": "Shantichakra Blood Society is a voluntary blood-donation organization I helped establish in Sunamganj in 2025, where I serve as General Secretary. This platform is now live and makes emergency donor discovery faster: registered donors searchable by blood group, district and upazila; emergency blood-request posting with request tracking; a blood-compatibility guide; SOS share messages for WhatsApp/SMS/Facebook; a donation eligibility checker and before/after donation guide; and a quick-assistance wizard that routes visitors to the right service in three questions. The society is active across Sylhet division with a goal of expanding nationwide — the site shows live coverage stats and a Bangladesh division map. Built with Next.js, React, Supabase and Tailwind CSS, with Cloudinary for donor photos.",
          "longDescriptionBn": "শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জে ২০২৫ সালে প্রতিষ্ঠিত একটি স্বেচ্ছাসেবী রক্তদান সংগঠন, যেখানে আমি সাধারণ সম্পাদক হিসেবে দাতা ব্যবস্থাপনা ও সমন্বয় করি। এই প্ল্যাটফর্মটি এখন লাইভ — জরুরি মুহূর্তে রক্তদাতা খুঁজতে: রক্তের গ্রুপ, জেলা ও উপজেলা দিয়ে নিবন্ধিত দাতা অনুসন্ধান; রোগীর তথ্যসহ জরুরি রক্তের অনুরোধ পোস্ট ও ট্র্যাকিং; রক্ত সামঞ্জস্যতা গাইড; WhatsApp/SMS/Facebook-এর জন্য প্রস্তুত SOS শেয়ার মেসেজ; রক্তদান যোগ্যতা যাচাই ও দানের আগে-পরে গাইড; আর ৩টি প্রশ্নে সঠিক সেবায় পৌঁছে দেওয়া দ্রুত সহায়তা উইজার্ড। সংগঠনটি সিলেট বিভাগ জুড়ে সক্রিয় এবং সারা দেশে সম্প্রসারণের লক্ষ্যে কাজ করছে — সাইটে লাইভ কভারেজ পরিসংখ্যান ও বাংলাদেশের বিভাগ-ম্যাপ রয়েছে। টেক স্ট্যাক: Next.js, React, Supabase ও Tailwind CSS; দাতাদের ছবি Cloudinary-তে।",
          "image": "/images/portfolio-shantichakra.png",
          "tags": ["Next.js", "React", "Supabase", "Tailwind CSS", "Cloudinary", "Emergency Requests"],
          "tagsBn": ["Next.js", "React", "Supabase", "Tailwind CSS", "Cloudinary", "জরুরি অনুরোধ"],
          "liveUrl": "https://shantichakrabloodsociety.rahatahmed.site/",
          "githubUrl": "https://github.com/rahatahmedbd",
          "category": "blood-donation",
          "featured": true,
          "visible": true,
          "completedAt": "2026"
        }$shanti$::jsonb
        else item
      end
      order by position
    )
    from jsonb_array_elements(cc.value->'projects') with ordinality as entries(item, position)
  ),
  false
)
where cc.key = 'portfolio_config'
  and jsonb_typeof(cc.value) = 'object'
  and jsonb_typeof(cc.value->'projects') = 'array'
  and (cc.value->'projects') @> $check$[{"id": "proj-shantichakra"}]$check$::jsonb;

-- ── 1b. portfolio_config — append the PoraSathi project (once) ─────────
update public.content_config as cc
set value = jsonb_set(
  cc.value,
  '{projects}',
  (
    select jsonb_agg(item order by position)
    from jsonb_array_elements(
      (cc.value->'projects')
        || $pora$[{
          "id": "proj-porasathi",
          "status": "live",
          "title": "PoraSathi — Tuition Marketplace for Teachers & Students",
          "titleBn": "পড়াসাথী — শিক্ষক ও শিক্ষার্থী খোঁজার টিউশন মার্কেটপ্লেস",
          "description": "A live tuition marketplace where students and guardians find verified teachers, and teachers find tuition opportunities — with requests, messaging and schedule management in one place.",
          "descriptionBn": "শিক্ষার্থী ও অভিভাবক যেখানে যাচাইকৃত শিক্ষক খোঁজেন, শিক্ষকরা পান টিউশন সুযোগ — অনুরোধ, মেসেজ ও সময়সূচি ব্যবস্থাপনা এক জায়গায়।",
          "longDescription": "PoraSathi (পড়াসাথী) is my live tuition-marketplace project for Bangladesh — born directly from my own experience as a private tutor since 2023. Students and guardians can browse teacher profiles without logging in, filter by class, subject, district and medium (online or in-person), then connect safely: controlled requests, messaging, and schedule/session management from a dashboard. Teachers publish profiles with subjects, fees, availability and verification badges, and discover tuition opportunities posted by students. The platform also includes a teacher leaderboard, free study resources, and a safety guide before contact. Built end-to-end with Next.js, React, TypeScript, Tailwind CSS and Supabase.",
          "longDescriptionBn": "পড়াসাথী বাংলাদেশের জন্য আমার তৈরি লাইভ টিউশন মার্কেটপ্লেস — ২০২৩ সাল থেকে নিজে গৃহশিক্ষক হিসেবে কাজ করার অভিজ্ঞতা থেকেই এর জন্ম। শিক্ষার্থী ও অভিভাবক লগইন ছাড়াই শিক্ষকদের প্রোফাইল দেখতে পারেন এবং ক্লাস, বিষয়, জেলা ও মাধ্যম (অনলাইন/সরাসরি) দিয়ে ফিল্টার করে যুক্ত হতে পারেন — নিয়ন্ত্রিত অনুরোধ, মেসেজ ও ড্যাশবোর্ড থেকে সময়সূচি/সেশন ব্যবস্থাপনা সব এক জায়গায়। শিক্ষকরা বিষয়, ফি, সুবিধা ও ভেরিফিকেশন ব্যাজসহ প্রোফাইল তৈরি করেন এবং শিক্ষার্থীদের পোস্ট করা টিউশন সুযোগ দেখেন। এছাড়া আছে শিক্ষক লিডারবোর্ড, ফ্রি শিক্ষা রিসোর্স এবং যোগাযোগের আগে পড়ার মতো নিরাপত্তা গাইড। শুরু থেকে শেষ পর্যন্ত Next.js, React, TypeScript, Tailwind CSS ও Supabase দিয়ে তৈরি।",
          "image": "/images/portfolio-porasathi.png",
          "tags": ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Marketplace"],
          "tagsBn": ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "মার্কেটপ্লেস"],
          "liveUrl": "https://porasathi.rahatahmed.site/",
          "githubUrl": "https://github.com/rahatahmedbd",
          "category": "education",
          "featured": true,
          "visible": true,
          "completedAt": "2026"
        }]$pora$::jsonb
    ) with ordinality as entries(item, position)
  ),
  false
)
where cc.key = 'portfolio_config'
  and jsonb_typeof(cc.value) = 'object'
  and jsonb_typeof(cc.value->'projects') = 'array'
  and not (cc.value->'projects') @> $check$[{"id": "proj-porasathi"}]$check$::jsonb;

-- ── 2. content_config (site_settings) — faq-blood-org now points to the live site ──
update public.site_settings as settings
set value = jsonb_set(
  settings.value,
  '{faqItems}',
  (
    select jsonb_agg(
      case
        when item->>'id' = 'faq-blood-org' then item || $faq${
          "answerBn": "আমি ২০২৫ সালে সুনামগঞ্জে শান্তিচক্র ব্লাড সোসাইটি সহ-প্রতিষ্ঠা করি এবং সাধারণ সম্পাদক হিসেবে দাতা ব্যবস্থাপনা করি — তাই দাতা ডিরেক্টরি ও জরুরি অনুরোধ ব্যবস্থার প্রয়োজন আমি প্রথম হাতে জানি। সংগঠনটির লাইভ ওয়েবসাইট (দাতা অনুসন্ধান, জরুরি অনুরোধ, ট্র্যাকিং, SOS শেয়ারসহ) আমিই ডিজাইন ও ডেভেলপ করেছি — shantichakrabloodsociety.rahatahmed.site-এ দেখুন।",
          "answerEn": "I co-founded Shantichakra Blood Society in Sunamganj in 2025 and manage donor coordination as its General Secretary, so I understand donor directories and emergency request workflows first-hand. I designed and built the society's live website myself — donor search, emergency requests, tracking and SOS sharing — see it at shantichakrabloodsociety.rahatahmed.site."
        }$faq$::jsonb
        else item
      end
      order by position
    )
    from jsonb_array_elements(settings.value->'faqItems') with ordinality as entries(item, position)
  )
)
where settings.key = 'content_config'
  and jsonb_typeof(settings.value) = 'object'
  and jsonb_typeof(settings.value->'faqItems') = 'array'
  and (settings.value->'faqItems') @> $check$[{"id": "faq-blood-org"}]$check$::jsonb;

-- ── 3. hero_config — projects counter reflects the live portfolio ──────
update public.site_settings
set value = jsonb_set(
  value,
  '{counters}',
  (
    select jsonb_agg(
      case
        when item->>'id' = 'c-1' then item || '{"labelBn": "লাইভ প্রজেক্ট", "labelEn": "Live Projects", "value": 4, "suffix": "+"}'::jsonb
        else item
      end
      order by position
    )
    from jsonb_array_elements(value->'counters') with ordinality as entries(item, position)
  ),
  false
)
where key = 'hero_config'
  and jsonb_typeof(value) = 'object'
  and jsonb_typeof(value->'counters') = 'array'
  and (value->'counters') @> $check$[{"id": "c-1"}]$check$::jsonb;
