-- Phase 4B & 4E: Substantive, factual blog content
--
-- 1) Rewrites the thin welcome post (slug 'welcome-to-rahatverse-blog') into a
--    proper introductory article, fixes its category ('General' never matched
--    the listing's category tabs) and reading time.
-- 2) Seeds three genuine articles written from Rahat Ahmed's real, already
--    published facts only (no invented metrics, clients or outcomes):
--      - building-rahatverse-nextjs-supabase-cloudinary (technology)
--      - shantichakra-digital-donor-discovery        (social-service)
--      - balancing-hsc-teaching-web-development      (education)
--    Categories deliberately match the blog listing's filter tabs so every
--    article is discoverable beyond the "All" view.
--
-- Every post ships bilingual content (content / content_bn) with natural
-- internal links to /portfolio, /services, /experience, /about and /gallery.
-- INSERT ... ON CONFLICT (slug) DO NOTHING keeps any admin edits safe; the
-- welcome-post UPDATE matches only that exact slug. Idempotent.

-- ── 1) Welcome post rewrite ───────────────────────────
update public.blog_posts
set
  title = 'Welcome to the RahatVerse Blog',
  title_bn = 'রাহাতভার্স ব্লগে স্বাগতম',
  content = $BLOG$Welcome to the RahatVerse blog. This is where I write about the things I actually build and do — web development with Next.js and Supabase, the story of this website itself, and the community work I am part of in Sunamganj.

## What you will find here
Three kinds of posts. Build notes — honest breakdowns of how something was made, starting with [how RahatVerse works](/en/blog/building-rahatverse-nextjs-supabase-cloudinary). Community — updates on [Shantichakra Blood Society](/en/experience) and our effort to digitize emergency donor discovery. And study life — how I balance HSC science, teaching and web development.

I write everything in both Bengali and English, and I link to real work — projects in my [portfolio](/en/portfolio), the [services](/en/services) I offer, and the moments in my [gallery](/en/gallery) — rather than writing generic advice.

## Where to start
New here? The fastest tour: the [about page](/en/about) for who I am, the portfolio for what I have built, and this blog for the how and why. Subscribe to the newsletter if you want new articles in your inbox.

Thanks for reading — the next post is already on my desk.$BLOG$,
  content_bn = $BLOG$রাহাতভার্স ব্লগে স্বাগতম। এখানে আমি সেই বিষয়গুলো নিয়ে লিখি যা আমি নিজে বাস্তবে করি — Next.js ও Supabase দিয়ে ওয়েব ডেভেলপমেন্ট, এই ওয়েবসাইটটি নির্মাণের গল্প, এবং সুনামগঞ্জে আমার সম্পৃক্ত সমাজসেবামূলক কাজ।

## এখানে কী কী পাবেন
তিন ধরনের লেখা। প্রথমত, বিল্ড নোট — কীভাবে কিছু তৈরি হয়েছে তার সৎ বিশ্লেষণ, যার শুরু [রাহাতভার্স কীভাবে কাজ করে](/bn/blog/building-rahatverse-nextjs-supabase-cloudinary) লেখাটি দিয়ে। দ্বিতীয়ত, সমাজসেবা — [শান্তিচক্র ব্লাড সোসাইটি](/bn/experience) ও জরুরি মুহূর্তে রক্তদাতা খোঁজার ব্যবস্থা ডিজিটাল করার আমাদের প্রচেষ্টা। তৃতীয়ত, পড়াশোনার জীবন — এইচএসসি বিজ্ঞান, পড়ানো এবং ওয়েব ডেভেলপমেন্ট কীভাবে একসাথে সামলাই।

প্রতিটি লেখা বাংলা ও ইংরেজি দুই ভাষাতেই লিখি, এবং তত্ত্বীয় উপদেশের বদলে বাস্তব কাজের লিংক দিই — [পোর্টফোলিওর](/bn/portfolio) প্রজেক্ট, আমার [সার্ভিসসমূহ](/bn/services), আর [গ্যালারির](/bn/gallery) মুহূর্তগুলো।

## কোথা থেকে শুরু করবেন
নতুন হলে দ্রুত ভূমিকা: [আমার সম্পর্কে](/bn/about) পেজে আমি কে, পোর্টফোলিওতে আমি কী বানিয়েছি, আর এই ব্লগে কীভাবে ও কেন। নতুন লেখা ইনবক্সে চাইলে নিউজলেটারে সাবস্ক্রাইব করতে পারেন।

পড়ার জন্য ধন্যবাদ — পরের লেখাটি ইতিমধ্যে লেখা শুরু হয়ে গেছে।$BLOG$,
  excerpt = 'The first post on RahatVerse — what this blog covers, and the fastest way to explore the site.',
  excerpt_bn = 'রাহাতভার্সের প্রথম লেখা — এই ব্লগে কী পাবেন এবং সাইটটি ঘোরার সহজ পথ।',
  category = 'technology',
  tags = array['rahatverse', 'blog', 'web development'],
  author = 'Rahat Ahmed',
  reading_time = 3,
  is_published = true,
  published_at = coalesce(published_at, now())
where slug = 'welcome-to-rahatverse-blog';

-- ── 2) Build log: RahatVerse ──────────────────────────
insert into public.blog_posts (
  title, title_bn, slug, content, content_bn, excerpt, excerpt_bn,
  cover_image, category, tags, author, reading_time, is_published, published_at
) values (
  'How I Built RahatVerse with Next.js, Supabase and Cloudinary',
  'Next.js, Supabase ও Cloudinary দিয়ে রাহাতভার্স তৈরির গল্প',
  'building-rahatverse-nextjs-supabase-cloudinary',
  $BLOG$RahatVerse did not start as a product idea. It started as a frustration: my work was scattered across profiles, files and chat threads, and none of it felt like a home. During my HSC studies I set out to build one website that could hold everything — my portfolio, my writing, my photos, and the web development service I run — and let me change any of it without touching code.

This post is the honest build log of that project.

## The stack, and why
The site is a Next.js 16 application on the App Router, written in TypeScript and styled with Tailwind CSS. I chose Next.js because server-side rendering matters to me: when someone — or a search crawler — opens a page, the real content must already be in the HTML, not behind a loading spinner. TypeScript keeps a growing codebase honest, and Tailwind keeps the design system consistent.

The backend is Supabase: PostgreSQL for data and authentication for the admin area. Images live on Cloudinary, whose automatic format and quality optimization keeps a heavy photo gallery fast even on a slow village connection.

Everything is bilingual — Bengali and English — handled with next-intl. Not just the paragraphs: routes, metadata, Open Graph tags and structured data all carry both locales, with canonical URLs and hreflang marking the two versions as the same page.

## The admin CMS behind it
Almost everything you see is controlled from a private admin dashboard: the hero, the about page, the experience timeline, the gallery, services and pricing, portfolio projects, the FAQ, legal pages, and the blog itself. Every section is validated against a schema on the server and in the API, so a malformed config can never break the public site — it simply falls back to safe defaults.

There are a few extras I rely on daily: a live order wizard that computes package pricing, an analytics view built on my own event tracking, a newsletter system, and Nuva — the AI assistant in the corner that answers questions about me and my work.

## Decisions that paid off
Three choices mattered most. First, SSR everywhere it counts: portfolio, experience and blog content render on the server, so pages are crawlable and quick. Second, one source of truth: every public page reads the same validated config that the admin panel writes. Third, honest structured data — a single Person entity and a single WebSite entity in JSON-LD, referenced by ID everywhere, so nothing contradicts itself.

## What I learned
Building a system while studying for exams teaches brutal prioritization: ship the smallest useful version of each feature, then improve it in passes. I also learned that content is harder than code — writing real descriptions of real projects in two languages takes longer than wiring a database.

RahatVerse is a living project. See how it fits together in the [portfolio case studies](/en/portfolio), try the [order wizard](/en/order) that powers my service work, or browse the code on [GitHub](https://github.com/rahatahmedbd/Rahatverse01). If you spot a bug, tell me — that is how it gets better.$BLOG$,
  $BLOG$রাহাতভার্স কোনো প্রোডাক্ট আইডিয়া হিসেবে শুরু হয়নি। শুরু হয়েছিল একটা বিরক্তি থেকে: আমার কাজ ছড়িয়ে-ছিটিয়ে ছিল নানা প্রোফাইল, ফাইল আর চ্যাটে — কোনোটাই মনে হচ্ছিল না নিজের ঠিকানা। এইচএসসিতে পড়তে পড়তেই ঠিক করলাম একটা ওয়েবসাইট বানাবো, যেখানে সবকিছু থাকবে — পোর্টফোলিও, লেখা, ছবি, আর আমার ওয়েব ডেভেলপমেন্ট সার্ভিস — এবং কোড ছোঁয়া ছাড়াই যেকোনো কিছু বদলাতে পারবো।

এই লেখাটি সেই প্রজেক্টের সৎ বিল্ড লগ।

## টেক স্ট্যাক, এবং কেন
সাইটটি Next.js 16-এর App Router ব্যবহার করে তৈরি, ভাষা TypeScript, আর ডিজাইনে Tailwind CSS। Next.js বেছে নেওয়ার প্রধান কারণ সার্ভার-সাইড রেন্ডারিং: কেউ — কিংবা কোনো সার্চ ক্রলার — পেজ খুললে আসল কনটেন্ট যেন HTML-এই আগে থেকেই থাকে, লোডিং স্পিনারের আড়ালে নয়। TypeScript বড় কোডবেসকে সুষ্ঠু রাখে, আর Tailwind ডিজাইন সিস্টেমকে সামঞ্জস্যপূর্ণ রাখে।

ব্যাকএন্ডে Supabase — ডেটার জন্য PostgreSQL, অ্যাডমিন এরিয়ার জন্য অথেনটিকেশন। ছবি থাকে Cloudinary-তে; স্বয়ংক্রিয় ফরম্যাট ও কোয়ালিটি অপটিমাইজেশনের কারণে ভারী ফটো গ্যালারিও ধীরগতির সংযোগে দ্রুত খোলে।

পুরো সাইট দ্বিভাষিক — বাংলা ও ইংরেজি — next-intl দিয়ে। শুধু অনুচ্ছেদ নয়: রুট, মেটাডেটা, Open Graph ট্যাগ ও স্ট্রাকচার্ড ডেটা — সবই দুই ভাষায় থাকে; ক্যানোনিক্যাল URL ও hreflang দুটি সংস্করণকে একই পেজ হিসেবে চিহ্নিত করে।

## পেছনের অ্যাডমিন CMS
আপনি যা দেখছেন তার প্রায় সবই একটি ব্যক্তিগত অ্যাডমিন ড্যাশবোর্ড থেকে নিয়ন্ত্রিত: হিরো সেকশন, অ্যাবাউট পেজ, এক্সপেরিয়েন্স টাইমলাইন, গ্যালারি, সার্ভিস ও প্রাইসিং, পোর্টফোলিও প্রজেক্ট, FAQ, লিগ্যাল পেজ, এমনকি এই ব্লগও। প্রতিটি সেকশন সার্ভার ও API — দুই জায়গাতেই স্কিমা যাচাই হয়, তাই ভুল কনফিগ কখনোই পাবলিক সাইট ভাঙতে পারে না — তখন নিরাপদ ডিফল্টে ফিরে যায়।

কয়েকটি ফিচার আমি প্রতিদিন ব্যবহার করি: প্যাকেজ মূল্য হিসাব করা লাইভ অর্ডার উইজার্ড, নিজস্ব ইভেন্ট ট্র্যাকিংয়ে তৈরি অ্যানালিটিক্স ভিউ, নিউজলেটার সিস্টেম, এবং Nuva — কর্নারে থাকা AI অ্যাসিস্ট্যান্ট, যে আমার ও আমার কাজের প্রশ্নের উত্তর দেয়।

## যে সিদ্ধান্তগুলো কাজে লেগেছে
তিনটি পছন্দ সবচেয়ে বেশি কাজ দিয়েছে। প্রথম, যেখানে দরকার সেখানে SSR: পোর্টফোলিও, এক্সপেরিয়েন্স ও ব্লগ সার্ভারেই রেন্ডার হয়, তাই পেজ ক্রলযোগ্য ও দ্রুত। দ্বিতীয়, কনটেন্টের একটিমাত্র উৎস: প্রতিটি পাবলিক পেজ সেই একই যাচাইকৃত কনফিগ পড়ে যা অ্যাডমিন প্যানেল লেখে। তৃতীয়, সৎ স্ট্রাকচার্ড ডেটা — JSON-LD-তে একটিমাত্র Person ও একটি WebSite এন্টিটি, সবখানে আইডি দিয়ে রেফারেন্স করা, ফলে কোনো তথ্যের দ্বন্দ্ব নেই।

## যা শিখলাম
পরীক্ষার পাশাপাশি সিস্টেম বানাতে গিয়ে শেখা হয় নির্মম অগ্রাধিকার: প্রতিটি ফিচারের সবচেয়ে ছোট কার্যকর সংস্করণ আগে দাও, পরে ধাপে ধাপে উন্নত করো। আরেকটা শিক্ষা — কোডের চেয়ে কনটেন্ট কঠিন: বাস্তব প্রজেক্টের বাস্তব বর্ণনা দুই ভাষায় লিখতে ডেটাবেস বাঁধার চেয়ে বেশি সময় লাগে।

রাহাতভার্স একটি চলমান প্রজেক্ট। পুরো কাঠামোটা দেখুন [পোর্টফোলিও কেস স্টাডিতে](/bn/portfolio), চালিয়ে দেখুন আমার সার্ভিস কাজের [অর্ডার উইজার্ড](/bn/order), অথবা ঘুরে দেখুন [GitHub](https://github.com/rahatahmedbd/Rahatverse01)-এর কোড। কোনো বাগ চোখে পড়লে জানাবেন — এভাবেই এটি আরও ভালো হয়।$BLOG$,
  'An honest build log of this website: the Next.js 16 stack, the admin CMS, the SEO decisions, and what building while studying taught me.',
  'এই ওয়েবসাইট নির্মাণের সৎ বিল্ড লগ: Next.js 16 স্ট্যাক, অ্যাডমিন CMS, SEO সিদ্ধান্ত — আর পড়াশোনার পাশাপাশি বানানোর শিক্ষা।',
  null,
  'technology',
  array['Next.js', 'Supabase', 'Cloudinary', 'TypeScript', 'RahatVerse'],
  'Rahat Ahmed',
  6,
  true,
  now()
)
on conflict (slug) do nothing;

-- ── 3) Shantichakra donor discovery ───────────────────
insert into public.blog_posts (
  title, title_bn, slug, content, content_bn, excerpt, excerpt_bn,
  cover_image, category, tags, author, reading_time, is_published, published_at
) values (
  'Inside Shantichakra: Digitizing Emergency Donor Discovery in Sunamganj',
  'শান্তিচক্রের ভেতরের গল্প: সুনামগঞ্জে জরুরি রক্তদাতা খোঁজার ডিজিটাল রূপান্তর',
  'shantichakra-digital-donor-discovery',
  $BLOG$## A phone call that should not take an hour
When someone in our area needs blood urgently, the search still runs through phone calls and Facebook messages: find a matching group, find someone nearby, find someone available today. Each step burns time the patient may not have. Shantichakra Blood Society exists to shorten that chain — and its digital donor directory is the next step in that work.

## Where we are today
Shantichakra Blood Society is a voluntary organization founded in Sunamganj in 2025. I serve as its General Secretary, coordinating donor management and volunteer activities alongside my studies. Our coverage currently spans six areas: Sunamganj Sadar, Shantiganj, Jamalganj, Tahirpur, Derai and Dowarabazar.

Today, coordination runs on two channels: our Facebook group, where members respond to requests, and a WhatsApp emergency hotline. It works — but it depends on whoever happens to be online, and on manually scrolling lists while every minute counts.

## What the directory will do
The portal I am building is designed around the moment of need, not around a feature list:

- Blood-group filtering first. The first question is always the group, so compatible donors surface before everything else.
- Area-wise donor search. A donor two upazilas away may not arrive in time; search is organized around the six coverage areas we actually serve.
- A clear emergency contact flow. One tap from a search result to a call or WhatsApp — no accounts, no forms in the way.

The stack is the one I know best — Next.js, React, Supabase and Tailwind CSS — chosen so the society never depends on tools it cannot afford. Progress is tracked openly on my [portfolio page](/en/portfolio).

## Why it is taking time
I could launch a thin demo tomorrow. But a donor directory holds personal information about volunteers, and it will be used in stressful moments. Getting the data model, privacy and the emergency flow right matters more than shipping early. The status badge on the portfolio card honestly says "in development" — the features are being shaped carefully, discussed with the team, and will open to the community when they are genuinely ready.

## How you can help right now
You do not need the portal to be part of this. Join the [Shantichakra Facebook group](https://www.facebook.com/share/g/192g4S4brD/) to see and respond to requests, and read about the wider work on my [experience page](/en/experience). In an emergency, call or message the hotline: +880 1626-224878.

Every request answered through this small network is a real person getting another chance. That is worth building carefully for.$BLOG$,
  $BLOG$## এক ঘণ্টা বিলম্বের যে ফোনকলটি হওয়া উচিত নয়
আমাদের এলাকায় কারো জরুরি রক্ত প্রয়োজন হলে খোঁজা এখনো চলে ফোনকল আর ফেসবুক বার্তায়: মিলবে এমন গ্রুপ খুঁজুন, কাছাকাছি কেউ আছে কি না দেখুন, আজই কে পারবে জেনে নিন। প্রতিটি ধাপে নষ্ট হয় এমন সময় যা রোগীর হয়তো নেই। শান্তিচক্র ব্লাড সোসাইটি এই শৃঙ্খল সংক্ষিপ্ত করার জন্যই — আর সংগঠনের ডিজিটাল রক্তদাতা ডিরেক্টরি সেই কাজের পরবর্তী ধাপ।

## আজ আমরা কোথায় দাঁড়িয়ে
শান্তিচক্র ব্লাড সোসাইটি ২০২৫ সালে সুনামগঞ্জে প্রতিষ্ঠিত একটি স্বেচ্ছাসেবী সংগঠন। আমি এর সাধারণ সম্পাদক হিসেবে পড়াশোনার পাশাপাশি রক্তদাতা ব্যবস্থাপনা ও স্বেচ্ছাসেবক সমন্বয়ের দায়িত্বে আছি। আমাদের সেবা এলাকা বর্তমানে ছয়টি — সুনামগঞ্জ সদর, শান্তিগঞ্জ, জামালগঞ্জ, তাহিরপুর, দিরাই ও দোয়ারাবাজার।

আজকের সমন্বয় চলে দুটি মাধ্যমে: আমাদের ফেসবুক গ্রুপ, যেখানে সদস্যরা অনুরোধে সাড়া দেন, এবং একটি হোয়াটসঅ্যাপ জরুরি হটলাইন। এটি কাজ করে — তবে নির্ভর করে মুহূর্তে কে অনলাইনে আছে তার ওপর, এবং তালিকা ঘেঁটে দাতা খোঁজার ওপর — যখন প্রতিটি মিনিট গুরুত্বপূর্ণ।

## ডিরেক্টরিটি যা করবে
আমি যে পোর্টালটি নির্মাণ করছি, সেটি ফিচার তালিকা নয়, প্রয়োজনের মুহূর্তটিকে কেন্দ্র করে ডিজাইন করা:

- আগে ব্লাড-গ্রুপ ফিল্টার। প্রথম প্রশ্ন সবসময় গ্রুপ নিয়ে — তাই সবার আগে উঠে আসবে উপযুক্ত দাতারা।
- এলাকাভিত্তিক দাতা সন্ধান। দুই উপজেলা দূরের দাতা সময়ে পৌঁছাতে নাও পারেন; অনুসন্ধান সাজানো আমাদের ছয়টি প্রকৃত সেবা এলাকা ঘিরে।
- সহজ জরুরি যোগাযোগ ব্যবস্থা। সার্চ রেজাল্ট থেকে সরাসরি কল বা হোয়াটসঅ্যাপে এক ট্যাপ — কোনো অ্যাকাউন্ট নয়, পথে কোনো ফর্ম নয়।

টেক স্ট্যাক আমার পরিচিতটিই — Next.js, React, Supabase ও Tailwind CSS — যেন সংগঠনকে এমন কোনো টুলের ওপর নির্ভর করতে না হয় যা বহন করা তার পক্ষে কঠিন। অগ্রগতি খোলামেলাভাবে দেখা যায় আমার [পোর্টফোলিও পেজে](/bn/portfolio)।

## সময় কেন লাগছে
চাইলে আগামীকালই একটা হালকা ডেমো চালু করে দিতে পারি। কিন্তু রক্তদাতা ডিরেক্টরিতে থাকে স্বেচ্ছাসেবকদের ব্যক্তিগত তথ্য, আর ব্যবহার হবে চাপের মুহূর্তে। ডেটা মডেল, গোপনীয়তা ও জরুরি ফ্লো ঠিকভাবে করা তাড়াতাড়ি চালু করার চেয়ে জরুরি। পোর্টফোলিও কার্ডের স্ট্যাটাস ব্যাজ সৎভাবেই লেখা "ডেভেলপমেন্ট চলছে" — ফিচারগুলো যত্নে গড়া হচ্ছে, দলের সঙ্গে আলোচনা হচ্ছে, আর সত্যিকারে প্রস্তুত হলেই কমিউনিটির জন্য খুলে দেওয়া হবে।

## এখনই আপনি যেভাবে পাশে থাকতে পারেন
এই কাজের অংশ হতে পোর্টালের জন্য অপেক্ষা করতে হবে না। অনুরোধ দেখতে ও সাড়া দিতে যোগ দিন [শান্তিচক্র ফেসবুক গ্রুপে](https://www.facebook.com/share/g/192g4S4brD/), আর ব্যাপকভাবে আমাদের কাজ জানতে পড়ুন আমার [এক্সপেরিয়েন্স পেজ](/bn/experience)। জরুরি প্রয়োজনে কল বা মেসেজ করুন হটলাইনে: +880 1626-224878।

এই ছোট নেটওয়ার্কের মাধ্যমে সাড়া পাওয়া প্রতিটি অনুরোধই কারো নতুন জীবনের সুযোগ। এজন্যই যত্ন নিয়ে বানানোটা সার্থক।$BLOG$,
  'How emergency blood requests are handled today across six Sunamganj areas, and the careful donor-directory platform being built to make it faster.',
  'সুনামগঞ্জের ছয় এলাকায় আজ যেভাবে জরুরি রক্তের অনুরোধ সামলানো হয়, এবং সেটি দ্রুত করার জন্য যত্নে নির্মিত ডিরেক্টরি প্ল্যাটফর্মের গল্প।',
  null,
  'social-service',
  array['Shantichakra', 'blood donation', 'Sunamganj', 'volunteering'],
  'Rahat Ahmed',
  6,
  true,
  now()
)
on conflict (slug) do nothing;

-- ── 4) Balancing study, teaching and development ──────
insert into public.blog_posts (
  title, title_bn, slug, content, content_bn, excerpt, excerpt_bn,
  cover_image, category, tags, author, reading_time, is_published, published_at
) values (
  'Balancing HSC Science, Teaching and Web Development',
  'এইচএসসি বিজ্ঞান, পড়ানো ও ওয়েব ডেভেলপমেন্ট — একসাথে সামলানোর গল্প',
  'balancing-hsc-teaching-web-development',
  $BLOG$## Three roles, one alarm clock
People often ask how I manage college, teaching and web development at once. The honest answer: a timetable, imperfectly kept, and a clear reason for each thing. This post is what that balance actually looks like from the inside.

## Role one: science student
I am in my second year of HSC at Sunamganj Government College, in the science group. Physics, chemistry and higher mathematics do not negotiate — falling behind compounds fast. College classes and exam preparation hold the centre of my day, and everything else must fit around them. I am also an active BNCC cadet, so drills and duties claim some weekends as well.

## Role two: teacher
I started tutoring while in class 9 myself, teaching students of classes 7 to 9. That grew into something bigger: FS Coaching Center at Jibdara Bazar, which I founded so underprivileged students in my village could get quality lessons at an affordable price. Teaching is not a compromise I make for income — it is the work that explains all the other work.

Teaching also rewired how I learn. Explaining algebra to a class 7 student forces you to truly own the idea — exactly the skill you need when reading documentation and building software.

## Role three: web developer
I learned web development alongside all of this, by building real projects instead of only following tutorials — most visibly this site, [RahatVerse](/en/portfolio), a bilingual ecosystem with an admin CMS, blog, gallery and an order system. When I take on work through my [services page](/en/services), it runs on the same stack I built my own project with.

## The structure that holds it together
None of this runs on motivation; it runs on structure. Fixed blocks: college first, tuition batches in the afternoon, development at night and on Fridays. Small scopes: ship the smallest useful version of a feature, then improve it, instead of waiting for a perfect free week that never comes. And honest limits: some weeks, exams win and the code waits.

## What teaching taught me about code
- Break a problem down until it is explainable — students and APIs both reward that.
- Names matter. A confusing label wastes everyone's time, in Bengali or in TypeScript.
- Feedback loops are everything: a student's wrong answer and a failing test are the same gift.

## Why I keep all three
Each role pays for the others in a different currency. Teaching keeps me rooted in my community and funds my tools. College gives me the science foundation. Development gives the first two a louder voice — a coaching center needs a website, a blood society needs a donor directory, and I can build both.

If you are a student somewhere in Bangladesh trying to build something alongside your studies: start smaller than you think, stay useful to the people around you, and let consistency do what free time cannot. The full journey is on my [about page](/en/about).$BLOG$,
  $BLOG$## তিনটি ভূমিকা, একটি অ্যালার্ম ঘড়ি
অনেকেই জিজ্ঞেস করে — কলেজ, পড়ানো আর ওয়েব ডেভেলপমেন্ট একসাথে চালাই কীভাবে? সৎ উত্তর: একটা সময়সূচি দিয়ে, মাঝে মাঝে ভেঙেও যায় এমনভাবে, আর প্রতিটি কাজের জন্য স্পষ্ট একটি কারণ নিয়ে। এই লেখায় সেই ভারসাম্যের ভেতরের চিত্র।

## প্রথম ভূমিকা: বিজ্ঞান বিভাগের শিক্ষার্থী
আমি সুনামগঞ্জ সরকারি কলেজে এইচএসসি দ্বিতীয় বর্ষে, বিজ্ঞান বিভাগে পড়ি। পদার্থবিজ্ঞান, রসায়ন আর উচ্চতর গণিত কোনো ছাড় দেয় না — একবার পিছিয়ে পড়লে তা দ্রুত গাদায় গাদা হয়। কলেজের ক্লাস আর পরীক্ষার প্রস্তুতি দিনের কেন্দ্রে থাকে, বাকি সবকিছু তার চারপাশে গুঁজতে হয়। আমি একজন সক্রিয় বিএনসিসি ক্যাডেটও — ড্রিল আর দায়িত্ব কখনো কখনো সাপ্তাহিক ছুটিও কেড়ে নেয়।

## দ্বিতীয় ভূমিকা: শিক্ষক
নবম শ্রেণিতে পড়তে পড়তেই সপ্তম–নবম শ্রেণির শিক্ষার্থীদের পড়ানো শুরু করি। সেই কাজ বড় রূপ নিয়েছে: জীবদাড়া বাজারে FS কোচিং সেন্টার, যা প্রতিষ্ঠা করেছি গ্রামের অসহায় মেধাবী শিক্ষার্থীরা যেন সুলভ মূল্যে মানসম্মত পাঠ পায়। পড়ানো আমার কাছে আয়ের জন্য আপস নয় — এটিই সেই কাজ যা বাকি সব কাজের ব্যাখ্যা দেয়।

পড়ানো আমার শেখার ধরনও বদলে দিয়েছে। সপ্তম শ্রেণির একটা ছেলেকে বীজগণিত বুঝাতে গেলে ধারণাটা নিজের সম্পূর্ণ আয়ত্তে আনতে হয় — ডকুমেন্টেশন পড়ে সফটওয়্যার বানাতেও ঠিক সেই ক্ষমতা লাগে।

## তৃতীয় ভূমিকা: ওয়েব ডেভেলপার
এই সবকিছুর পাশাপাশিই ওয়েব ডেভেলপমেন্ট শিখেছি — শুধু টিউটোরিয়াল দেখে নয়, বাস্তব প্রজেক্ট বানিয়ে। সবচেয়ে দৃশ্যমান উদাহরণ এই সাইটটি, [রাহাতভার্স](/bn/portfolio) — অ্যাডমিন CMS, ব্লগ, গ্যালারি ও অর্ডার সিস্টেমসহ একটি দ্বিভাষিক ইকোসিস্টেম। [সার্ভিস পেজ](/bn/services)-এর মাধ্যমে ক্লায়েন্ট-কাজ নিলেও চলে সেই একই স্ট্যাকে।

## যে কাঠামোটা সবকিছু ধরে রাখে
এই সব চলে প্রেরণায় নয়, চলে রুটিনে। নির্ধারিত ব্লক: আগে কলেজ, বিকেলে টিউশনি ব্যাচ, রাতে ও শুক্রবারে ডেভেলপমেন্ট। ছোট স্কোপ: প্রতিটি ফিচারের সবচেয়ে ছোট কার্যকর সংস্করণ আগে, পরে উন্নতি — পুরো একটা ফাঁকা সপ্তাহের আশায় বসে থাকা নয়, যা কখনোই আসে না। আর সৎ সীমা: কোনো কোনো সপ্তাহে পরীক্ষাই জেতে, কোড তখন অপেক্ষা করে।

## পড়ানো থেকে কোডিংয়ে যা শিখলাম
- সমস্যা ভাঙতে হবে যতক্ষণ না ব্যাখ্যা করা যায় — শিক্ষার্থী হোক বা API, উভয়েই এর পুরস্কার দেয়।
- নামকরণ গুরুত্বপূর্ণ; একটা দ্ব্যর্থক লেবেল সবার সময় নষ্ট করে — বাংলায় হোক বা TypeScript-এ।
- ফিডব্যাক লুপ সবকিছু: শিক্ষার্থীর ভুল উত্তর আর টেস্টের লাল বাতি — একই উপহার।

## তিনটিই কেন রাখি
প্রতিটি ভূমিকা অন্যটির জন্য আলাদা মুদ্রায় পরিশোধ দেয়। পড়ানো আমাকে কমিউনিটির সঙ্গে বাঁধা রাখে আর টুলসের খরচ জোগায়। কলেজ দেয় বিজ্ঞানের ভিত্তি। আর ডেভেলপমেন্ট প্রথম দুটোকে দেয় বড় কণ্ঠ — একটা কোচিং সেন্টারের ওয়েবসাইট দরকার, একটা ব্লাড সোসাইটির দাতা ডিরেক্টরি দরকার, আর দুটোই আমি বানাতে পারি।

বাংলাদেশের কোথাও যদি পড়াশোনার পাশাপাশি কিছু বানানোর ভাবনা থাকে — ভাবনার চেয়ে ছোট দিয়ে শুরু করুন, চারপাশের মানুষের কাজে লাগুন, আর ধারাবাহিকতাকে দিন যা ফাঁকা সময় দিতে পারে না। পুরো যাত্রাটা পড়ুন আমার [অ্যাবাউট পেজে](/bn/about)।$BLOG$,
  'Second-year HSC science, tuition batches at FS Coaching Center, BNCC drills — and shipping real software at night. An honest look at the routine.',
  'এইচএসসি দ্বিতীয় বর্ষ, FS কোচিং সেন্টারের ব্যাচ, বিএনসিসি ড্রিল — আর রাতে বাস্তব সফটওয়্যার। দৈনন্দিন রুটিনের সৎ চিত্র।',
  null,
  'education',
  array['student life', 'teaching', 'web development', 'FS Coaching Center'],
  'Rahat Ahmed',
  6,
  true,
  now()
)
on conflict (slug) do nothing;
