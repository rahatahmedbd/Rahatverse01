-- Phase 4B: Legal policy completeness + expanded factual FAQ set
--
-- Two additive, idempotent changes to site_settings.content_config:
--   1) Legal pages (privacy / terms / cookie / refund): replace ONLY thin or
--      legacy default bodies with the Phase 4B complete versions. "Thin" means
--      under 200 characters or missing a markdown "## " heading — exactly the
--      check the app already applies at render time (fillThinLegalPages), so
--      this migration aligns storage with what visitors already saw. Any body
--      an admin has expanded beyond the old defaults (rich, headed text) is
--      left untouched — existing admin values win.
--   2) FAQ items: append the eight Phase 4B factual questions ONLY when no
--      item with the same id already exists. Existing items (including admin
--      edits to faq-cost / faq-delivery) are never modified.
--
-- Safe to run multiple times. Does nothing when the content_config row is
-- missing (the app falls back to the built-in Phase 4B defaults, and
-- migration 022 seeds fresh installs).

-- ── 1) Legal page bodies ──────────────────────────────
do $$
declare
  cfg jsonb;
  pages jsonb;
  entry jsonb;
  new_pages jsonb := '[]'::jsonb;
  page_key text;
  body_bn text;
  body_en text;
  new_body_bn text;
  new_body_en text;
  changed boolean := false;

  privacy_bn text := $P4B$## ১. আমরা কোন তথ্য সংগ্রহ করি (Information We Collect)
এই ওয়েবসাইটের বিভিন্ন ফিচার ব্যবহার করলে আপনি স্বেচ্ছায় যে তথ্য দেন, তা সংগ্রহ করা হয়: যোগাযোগ ফর্ম (নাম, ইমেইল, ফোন/হোয়াটসঅ্যাপ নম্বর, বার্তা), অর্ডার উইজার্ড (আপনার প্রজেক্টের ধরন, ফিচার ও বিবরণ এবং যোগাযোগের তথ্য), নিউজলেটার সাইনআপ (ইমেইল ঠিকানা) এবং ব্লগ কমেন্ট (নাম, ইমেইল ও মন্তব্য)। এছাড়া রক্তদান জরুরি অনুরোধ ফর্মে প্রদত্ত তথ্য শুধুমাত্র রক্তদাতা খোঁজার কাজে ব্যবহৃত হয়।

## ২. কমেন্ট মডারেশন (Comment Moderation)
ব্লগে দেওয়া প্রতিটি কমেন্ট প্রকাশের আগে প্রশাসকের অনুমোদনের অপেক্ষায় থাকে। কমেন্টের সাথে দেওয়া আপনার ইমেইল ঠিকানা কখনোই সাইটে প্রকাশ্যে দেখানো হয় না এবং বিজ্ঞাপনের কাজে ব্যবহার করা হয় না — শুধু প্রয়োজনে আপনার সাথে যোগাযোগের জন্য ব্যবহৃত হয়।

## ৩. তথ্যের ব্যবহার (How We Use Your Data)
সংগৃহীত তথ্য শুধুমাত্র আপনার সাথে যোগাযোগ, প্রজেক্ট কোটেশন প্রদান, কারিগরি সহায়তা এবং আপনার সম্মতিতে নিউজলেটার বা আর্টিকেলের আপডেট পাঠানোর কাজে ব্যবহার করা হয়। আমরা কখনোই কোনো তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বিক্রয় বা হস্তান্তর করি না।

## ৪. AI অ্যাসিস্ট্যান্ট (Nuva) ও চ্যাট সেশন
সাইটের এমবেড করা AI চ্যাট অ্যাসিস্ট্যান্টে (Nuva) আপনার লেখা বার্তা উত্তর তৈরির জন্য প্রক্রিয়া করা হয় এবং চ্যাট প্রদানকারী পরিষেবা (যেমন Groq/xAI) সার্ভারে প্রেরণ করা হতে পারে। চ্যাটে কোনো সংবেদনশীল ব্যক্তিগত তথ্য, পাসওয়ার্ড বা পেমেন্টের বিবরণ না দেওয়ার অনুরোধ করা হচ্ছে। চ্যাটের লগ দীর্ঘমেয়াদে সংরক্ষণ করা হয় না।

## ৫. অ্যানালিটিক্স ও পারফরম্যান্স (Analytics & Performance)
ওয়েবসাইটের ব্যবহার বোঝার জন্য আমরা Google Analytics এবং আমাদের নিজস্ব বেনামী ইভেন্ট ট্র্যাকিং (পেজ ভিউ, ফিচার ব্যবহার) ব্যবহার করি। এই তথ্য সমষ্টিগতভাবে বিশ্লেষণ করা হয়; এর মাধ্যমে কোনো ব্যক্তিকে সনাক্ত করার চেষ্টা করা হয় না।

## ৬. কুকি ও ট্র্যাকিং প্রযুক্তি (Cookies & Tracking)
সাইটটি থিম (ডার্ক/লাইট), ভাষা পছন্দ এবং সেশন রক্ষার মতো মৌলিক ফাংশনের জন্য ব্রাউজার স্টোরেজ ব্যবহার করে। অ্যানালিটিক্স টুল প্রমিত কুকি ব্যবহার করতে পারে। আপনি ব্রাউজার সেটিংস থেকে যেকোনো সময় কুকি ব্লক বা মুছে দিতে পারেন; মূল কনটেন্ট তখনও ব্যবহারযোগ্য থাকবে।

## ৭. তৃতীয় পক্ষের সেবা (Third-Party Services)
সাইট পরিচালনায় আমরা নির্ভরযোগ্য প্রদানকারী ব্যবহার করি: Supabase (ডেটাবেস ও নিরাপত্তা), Cloudinary (ছবি অপটিমাইজেশন), Vercel (হোস্টিং ও SSL এনক্রিপশন), Google Analytics (পরিসংখ্যান) এবং Google Fonts (টাইপোগ্রাফি)। AI চ্যাটের উত্তরে প্রদানকারী হিসেবে Groq বা xAI ব্যবহৃত হতে পারে। প্রতিটি প্রদানকারীর নিজস্ব প্রাইভেসি নীতিমালা প্রযোজ্য।

## ৮. পেমেন্ট সংক্রান্ত তথ্য (Payment-Related Information)
এই ওয়েবসাইটে কোনো অনলাইন কার্ড পেমেন্ট প্রসেস করা হয় না। অর্ডারের পর পেমেন্ট নির্দেশনা আলোচনার মাধ্যমে দেওয়া হয় এবং লেনদেন হয় bKash, Nagad বা ব্যাংক ট্রান্সফারের মতো বহিরাগত মাধ্যমে। ফলে আমাদের সার্ভারে আপনার কার্ড বা মোবাইল ব্যাংকিং পিন কখনোই সংরক্ষিত হয় না।

## ৯. ডেটা সংরক্ষণ ও নিরাপত্তা (Retention & Security)
প্রজেক্ট ও যোগাযোগ সংক্রান্ত রেকর্ড চলমান সেবা ও রেফারেন্সের প্রয়োজনে সীমিত সময়ের জন্য সংরক্ষণ করা হয় এবং প্রয়োজন শেষ হলে মুছে ফেলা হয়। সংক্রমণকালীন সব তথ্য এনক্রিপ্ট করা থাকে। তবে মনে রাখবেন — ইন্টারনেটে কোনো পদ্ধতিই ১০০% নিরাপদ নয়; তাই চ্যাট বা ফর্মে অত্যন্ত সংবেদনশীল তথ্য না দেওয়াই নিরাপদ।

## ১০. আপনার অধিকার ও যোগাযোগ (Your Rights & Contact)
আপনার সংরক্ষিত যেকোনো তথ্য দেখতে, সংশোধন করতে বা মুছে ফেলার অনুরোধ করতে সরাসরি ইমেইল করুন rahatbd20505@gmail.com অথবা হোয়াটসঅ্যাপে যোগাযোগ করুন +880 1626-224878 নম্বরে। নিউজলেটার থেকে যেকোনো সময় আনসাবস্ক্রাইব করা যায়।$P4B$;

  privacy_en text := $P4B$## 1. Information We Collect
We collect the information you voluntarily provide when you use features of this website: the contact form (name, email, phone/WhatsApp number, message), the order wizard (your project type, features, description and contact details), the newsletter signup (email address), and blog comments (name, email and comment). Information submitted through the blood-donation request form is used solely to help find a donor.

## 2. Comment Moderation
Every blog comment is held for administrator approval before it appears publicly. The email address you submit with a comment is never displayed on the site and is never used for advertising — only to reach you if a response is needed.

## 3. How We Use Your Data
Your information is used strictly to communicate regarding project requirements, provide price estimates, deliver customer support, and (with your explicit consent) send newsletter articles and updates. We never sell, trade, or share your personal data with third-party advertisers.

## 4. AI Assistant (Nuva) & Chat Sessions
Messages you type into the embedded AI chat assistant (Nuva) are processed to generate a reply and may be sent to the chat provider's servers (for example Groq/xAI) when an AI provider is active. Please do not share sensitive personal information, passwords, or payment details inside the chat. Chat conversations are not stored long-term for profiling.

## 5. Analytics & Performance
We use Google Analytics together with our own anonymised event tracking (page views, feature usage) to understand how the site is used and to keep it fast. This data is analysed in aggregate; we do not attempt to identify individual visitors from it.

## 6. Cookies & Tracking Technologies
The site uses browser storage for essential functions — theme preference (dark/light), language choice, and session continuity. Analytics tools may set standard cookies. You can block or delete cookies at any time in your browser settings; the core content remains usable without them.

## 7. Third-Party Services
To operate the site we rely on established providers: Supabase (database & security), Cloudinary (image optimization), Vercel (hosting & SSL encryption), Google Analytics (statistics) and Google Fonts (typography). AI chat responses may use Groq or xAI as the provider. Each provider processes data under its own privacy policy.

## 8. Payment-Related Information
No online card payment is processed on this website. After an order is discussed, payment instructions are shared personally and handled through external channels such as bKash, Nagad or bank transfer — so your card number or mobile-banking PIN is never stored on our servers.

## 9. Data Retention & Security
Project and communication records are kept for a limited period to provide ongoing service and reference, and are removed when no longer needed. Data in transit is encrypted. No method of transmission over the internet is 100% secure, however — so please avoid sending highly sensitive information through forms or chat.

## 10. Your Rights & Contact
You may inspect, update, or request the permanent deletion of your data at any time by emailing rahatbd20505@gmail.com or contacting WhatsApp +880 1626-224878. You can unsubscribe from the newsletter at any time.$P4B$;

  terms_bn text := $P4B$## ১. কাজের পরিধি ও চুক্তি (Freelance Engagement & Scope)
রাহাতভার্স (রাহাত আহমেদ) বাংলাদেশ-ভিত্তিক কাস্টম ওয়েব ডেভেলপমেন্ট, পোর্টফোলিও ডিজাইন এবং ই-কমার্স সলিউশন প্রদান করে। প্রতিটি প্রজেক্ট শুরু হওয়ার পূর্বে ইমেইল বা হোয়াটসঅ্যাপের মাধ্যমে কাজের পরিধি, মূল্য এবং সময়সীমা লিখিতভাবে নির্ধারণ করা হয়।

## ২. পেমেন্ট পদ্ধতি ও শর্তাবলি (Payment Terms & Methods - Bangladesh Context)
**পেমেন্ট মাধ্যম:** আমরা বাংলাদেশী মোবাইল ফিন্যান্সিয়াল সার্ভিস (bKash, Nagad) এবং সরাসরি ব্যাংক ট্রান্সফার (Direct Bank Transfer / EFT) এর মাধ্যমে বাংলাদেশি টাকা (৳) বা মার্কিন ডলারে ($) পেমেন্ট গ্রহণ করি।
**পেমেন্ট শিডিউল:** প্রজেক্ট শুরু করার পূর্বে মোট মূল্যের ৫০% অগ্রিম (Advance Deposit) প্রদান করতে হবে। অবশিষ্ট ৫০% কাজ সম্পন্ন হওয়ার পর এবং ফাইনাল কোড/সাইট ডেলিভারির পূর্বে পরিশোধযোগ্য।

## ৩. রিভিশন পলিসি (Revision & Modification Policy)
প্রতিটি ওয়েবসাইট প্যাকেজের সাথে কাজের চলাকালীন সর্বোচ্চ ৩ বার বিনামূল্যে রিভিশন (UI পরিবর্তন, টেক্সট বা লেআউট সমন্বয়) প্রদান করা হয়। মূল চুক্তির বাইরের কোনো নতুন ফিচার বা অতিরিক্ত কাজের জন্য আলোচনা সাপেক্ষে আলাদা ফি প্রযোজ্য হবে।

## ৪. রিফান্ড ও বাতিল পলিসি (Refund & Cancellation Policy)
প্রজেক্টের কাজ শুরু হওয়ার পূর্বে কোনো কারণে চুক্তি বাতিল করা হলে প্রদত্ত অগ্রিম ১০০% ফেরতযোগ্য। কাজ শুরু হওয়ার পর প্রজেক্ট বাতিল করা হলে সম্পন্ন কাজের অংশ কেটে অবশিষ্ট অর্থ ফেরত দেওয়া হবে। ফাইনাল কোড বা প্রজেক্ট ডেলিভারি সম্পন্ন হওয়ার পর কোনো রিফান্ড প্রযোজ্য হবে না।

## ৫. কোড মালিকানা ও স্বত্বাধিকার (Intellectual Property & Ownership)
সম্পূর্ণ পেমেন্ট পরিশোধের পর প্রজেক্টের সমস্ত কাস্টম সোর্স কোড এবং ডিজাইন অ্যাসেটের পূর্ণ স্বত্বাধিকার ক্লায়েন্টকে হস্তান্তর করা হয়। রাহাতভার্স প্রজেক্টটিকে নিজের পোর্টফোলিও এবং কেস স্টাডিতে প্রদর্শনের অধিকার সংরক্ষণ করে (যদি না প্রজেক্ট শুরুর পূর্বে কোনো NDA বা গোপনীয়তা চুক্তি স্বাক্ষরিত হয়)।

## ৬. ক্লায়েন্টের দায়িত্ব (Client Responsibilities)
সফল ও সময়মতো ডেলিভারির জন্য ক্লায়েন্টকে প্রয়োজনীয় তথ্য (কনটেন্ট, ছবি, লোগো, টেক্সট), সিদ্ধান্ত গ্রহণ এবং নির্ধারিত সময়ে ফিডব্যাক প্রদান করতে হবে। বিলম্বিত ফিডব্যাক বা প্রয়োজনীয় সামগ্রীর অভাবে ডেলিভারির সময়সূচি পেছাতে পারে। ক্লায়েন্টকে নিশ্চিত করতে হবে যে সরবরাহকৃত যেকোনো কনটেন্ট, ছবি বা ট্রেডমার্কের ব্যবহারের বৈধ অধিকার তার রয়েছে।

## ৭. দায় সীমাবদ্ধতা (Limitation of Liability)
রাহাতভার্স শুধুমাত্র চুক্তির আওতায় প্রদত্ত কাজের জন্য দায়ী থাকবে এবং কোনো ক্ষেত্রেই প্রকল্পের চুক্তিমূল্যের বেশি ক্ষতিপূরণের জন্য দায়বদ্ধ নয়। তৃতীয় পক্ষের সেবা (যেমন হোস্টিং, পেমেন্ট গেটওয়ে, ডোমেইন) ব্যবহারে কোনো ত্রুটি, ডাউনটাইম বা ডেটা ক্ষতির জন্য সরাসরি দায়বদ্ধতা রাহাতভার্স বহন করবে না। সর্বোচ্চ প্রচেষ্টা সত্ত্বেও কোনো গ্যারান্টি নেই যে প্রজেক্টটি সম্পূর্ণ বাগমুক্ত হবে; পাওয়া গেলে বাগগুলো চুক্তিভুক্ত সময়ের মধ্যে বিনামূল্যে ঠিক করা হবে।

## ৮. ওয়েবসাইট ব্যবহার ও নিষিদ্ধ কার্যক্রম (Acceptable Use)
এই ওয়েবসাইট শুধুমাত্র বৈধ উদ্দেশ্যে ব্যবহার করার শর্তে আপনাকে অনুমতি দেওয়া হচ্ছে। নিষিদ্ধ থাকবে: সাইটের নিরাপত্তা ব্যবস্থা বা সার্ভারে অনুপ্রবেশের চেষ্টা; স্প্যাম, ক্ষতিকর কোড বা অটোমেটেড স্ক্র্যাপিং চালানো; ফর্ম বা কমেন্টে ভুয়া, বিভ্রান্তিকর, অপমানজনক, ঘৃণামূলক বা বেআইনি কনটেন্ট জমা দেওয়া; অন্যের নাম বা পরিচয় ভাড়া করা; এবং সাইটের কনটেন্ট, কোড বা ডিজাইন অনুমতি ছাড়া বাণিজ্যিকভাবে পুনঃপ্রকাশ করা। এই শর্ত লঙ্ঘন করলে সংশ্লিষ্ট ব্যবহারকারীর অ্যাক্সেস সীমিত বা বন্ধ করা হতে পারে।

## ৯. ব্যবহারকারী-জমাকৃত কনটেন্ট ও কমেন্ট (User Submissions & Comments)
আপনি কমেন্ট, ফর্ম বা অন্য কোনো মাধ্যমে যে কনটেন্ট জমা দেন, তার দায়িত্ব সম্পূর্ণ আপনার। জমা দেওয়ার মাধ্যমে আপনি নিশ্চিত করছেন যে কনটেন্টটি আপনার নিজের এবং তা আইন ও তৃতীয় পক্ষের অধিকার লঙ্ঘন করে না। সব কমেন্ট প্রকাশের আগে মডারেশনের মধ্য দিয়ে যায়; আপত্তিকর বা স্প্যাম কনটেন্ট প্রশাসক যেকোনো সময় সরিয়ে দিতে পারেন। প্রকাশিত জমার ক্ষেত্রে আপনি রাহাতভার্সকে সেটি সাইটে প্রদর্শনের সীমিত অনুমতি দিচ্ছেন।

## ১০. AI ফিচার ও নির্ভুলতার সীমা (AI Features)
সাইটের AI চ্যাট অ্যাসিস্ট্যান্ট (Nuva) সাধারণ তথ্য প্রদানের জন্য তৈরি — এর উত্তর ভুল, অসম্পূর্ণ বা পুরনো হতে পারে। এটি পেশাদার, আইনি, চিকিৎসা বা আর্থিক পরামর্শের বিকল্প নয়। গুরুত্বপূর্ণ সিদ্ধান্তের আগে কোটেশন, মূল্য ও সেবা-সংক্রান্ত তথ্য সরাসরি যোগাযোগ করে নিশ্চিত হোন।

## ১১. কনটেন্টের নির্ভুলতা ও তৃতীয় পক্ষের লিংক (Content Accuracy & External Links)
ব্লগ, টিউটোরিয়াল ও অন্যান্য তথ্যগত কনটেন্ট সর্বোত্তম জ্ঞানমতে লেখা হয়, তবে ত্রুটিমুক্ত বা সর্বদা হালনাগাদ — এমন গ্যারান্টি দেওয়া হয় না। সাইটে থাকা বহিরাগত লিংকের নিজস্ব শর্ত ও নীতিমালা রয়েছে, যার জন্য রাহাতভার্স দায়ী নয়। কোনো ভুল তথ্য চোখে পড়লে জানানোর অনুরোধ করা হচ্ছে।

## ১২. সেবা পরিবর্তন, বাতিল ও যোগাযোগ (Service Changes, Termination & Contact)
রাহাতভার্স যেকোনো সময় সাইটের কোনো ফিচার বা সেবা পরিবর্তন, স্থগিত বা বন্ধ করার অধিকার সংরক্ষণ করে। অপব্যবহারের ক্ষেত্রে কমেন্ট বা চ্যাটের অ্যাক্সেস বাতিল করা হতে পারে। এই শর্তাবলি যেকোনো সময় হালনাগাদ হতে পারে; পাতার শুরুতেই সর্বশেষ হালনাগাদের তারিখ উল্লেখ করা থাকে। শর্তাবলি সংক্রান্ত যেকোনো প্রশ্নে ইমেইল করুন rahatbd20505@gmail.com অথবা হোয়াটসঅ্যাপ +880 1626-224878।$P4B$;

  terms_en text := $P4B$## 1. Freelance Engagement & Scope
RahatVerse (Rahat Ahmed) operates as a Bangladesh-based professional web development and software engineering studio. Every project commences upon written confirmation (email or WhatsApp) outlining feature specifications, timeline, and package costs.

## 2. Payment Terms & Methods (Bangladesh Context)
**Accepted Methods:** We accept payments via Bangladeshi Mobile Financial Services (**bKash**, **Nagad**) and Direct Bank Transfer / Electronic Fund Transfer in BDT (৳) or USD ($).
**Payment Schedule:** A 50% upfront advance deposit is required prior to initiating design and development. The remaining 50% balance is payable upon satisfactory completion of User Acceptance Testing (UAT) and prior to production deployment or source code handover.

## 3. Revision & Modification Policy
All web development packages include up to **3 rounds of complimentary revisions** during the active development phase (covering layout refinements, text modifications, and minor UI adjustments). Substantial scope expansions or new architectural features outside the original agreement will be billed separately at an agreed rate.

## 4. Refund & Cancellation Policy
**Before Project Start:** Upfront advance deposits are 100% refundable if cancellation is requested prior to code or design commencement.
**During Active Development:** If a project is cancelled while underway, refunds are calculated proportionally based on completed deliverables. No refunds are issued after final delivery and codebase transfer.

## 5. Intellectual Property & Code Ownership
Upon receipt of full 100% payment, total ownership of all custom-developed source code, graphics, and project assets transfers to the client. RahatVerse retains the right to display the completed work in our public portfolio and case studies unless a Non-Disclosure Agreement (NDA) has been signed.

## 6. Client Responsibilities
For a smooth, on-time delivery, the client agrees to provide all required materials (text content, images, logos, and branding assets), respond to questions promptly, and review deliverables within the agreed feedback windows. Delays in feedback or missing materials may extend the delivery timeline. The client warrants that they have the legal right to use any content, images, or trademarks they supply for the project.

## 7. Limitation of Liability & Disclaimers
RahatVerse's liability is limited to the scope of work defined in the signed agreement and shall in no event exceed the total contract value paid for the project. We are not directly liable for outages, downtime, or data loss arising from third-party services (hosting, payment gateways, domain registrars) used to operate the delivered website. While we make every effort to ship robust code, the project is provided on an "as-is" basis with no guarantee that it is entirely bug-free; any bugs reported after delivery are fixed free of charge within the agreed warranty period.

## 8. Website Use & Prohibited Misuse
You are granted permission to use this website for lawful purposes only. You must not: attempt to breach site security or access servers without authorization; run spam, harmful code, or automated scraping against the site; submit false, misleading, defamatory, hateful or unlawful content through forms or comments; impersonate another person; or commercially republish the site's content, code or design without written permission. Violating these terms may result in your access being limited or revoked.

## 9. User Submissions & Comments
You are solely responsible for any content you submit via comments, forms or other channels. By submitting, you confirm the content is yours and does not violate the law or any third party's rights. All comments pass through moderation before being published, and administrators may remove objectionable or spam content at any time. For published submissions, you grant RahatVerse a limited licence to display that content on the site.

## 10. AI Features & Accuracy Limits
The site's AI chat assistant (Nuva) is provided for general information — its answers may be wrong, incomplete, or out of date. It is not a substitute for professional, legal, medical or financial advice. Before making important decisions, confirm quotations, pricing, and service-specific details by contacting us directly.

## 11. Content Accuracy & External Links
Blog posts, tutorials and other informational content are written to the best of our knowledge, but we do not guarantee they are error-free or always current. External links on the site are governed by their own terms and policies, for which RahatVerse is not responsible. If you spot an inaccuracy, please let us know.

## 12. Service Changes, Termination & Contact
RahatVerse reserves the right to modify, suspend or discontinue any feature or service of the site at any time. Access to commenting or chat may be revoked for misuse. These terms may be updated at any time; the last-updated date is always shown at the top of this page. For any questions about these terms, email rahatbd20505@gmail.com or contact WhatsApp +880 1626-224878.$P4B$;

  cookie_bn text := $P4B$## কুকি ও ব্রাউজার স্টোরেজ (Cookies & Browser Storage)
এই ওয়েবসাইট দুটি ধরনের প্রযুক্তি ব্যবহার করে:

- **অপরিহার্য স্টোরেজ:** থিম (ডার্ক/লাইট মোড), ভাষা পছন্দ (বাংলা/ইংরেজি) এবং সেশন সংক্রান্ত মৌলিক তথ্য — যেগুলো ছাড়া সাইট ঠিকভাবে কাজ করবে না।
- **অ্যানালিটিক্স কুকি:** Google Analytics ও নিজস্ব বেনামী ইভেন্ট ট্র্যাকিং সাইটের ব্যবহার পরিমাপ করে; এতে বিজ্ঞাপন-ভিত্তিক প্রোফাইল তৈরি হয় না।

## আপনার নিয়ন্ত্রণ (Your Control)
আপনার ব্রাউজার সেটিংস থেকে যেকোনো সময় কুকি ব্লক, সীমিত বা মুছে দিতে পারেন। কুকি বন্ধ করলেও সাইটের মূল কনটেন্ট ব্যবহারযোগ্য থাকবে; তবে থিম বা ভাষার মতো পছন্দ সংরক্ষণ নাও হতে পারে। এখানে কোনো তৃতীয় পক্ষের বিজ্ঞাপন কুকি ব্যবহার করা হয় না।$P4B$;

  cookie_en text := $P4B$## Cookies & Browser Storage
This website uses two kinds of technology:

- **Essential storage:** theme preference (dark/light mode), language choice (Bengali/English) and basic session continuity — the site cannot function properly without these.
- **Analytics cookies:** Google Analytics and our own anonymised event tracking measure site usage; no advertising profile is built from them.

## Your Control
You can block, limit, or delete cookies at any time from your browser settings. The core content stays usable without cookies, though preferences such as theme or language may not be remembered. No third-party advertising cookies are used here.$P4B$;

  refund_bn text := $P4B$## রিফান্ড ও বাতিল পলিসি (Refund & Cancellation)
- **কাজ শুরুর আগে:** প্রজেক্টের ডিজাইন বা ডেভেলপমেন্ট শুরু হওয়ার আগে বাতিল করলে প্রদত্ত ৫০% অগ্রিম সম্পূর্ণ (১০০%) ফেরত দেওয়া হয়।
- **কাজ চলমান অবস্থায়:** প্রজেক্ট চলাকালে বাতিল করলে ইতিমধ্যে সম্পন্ন কাজের আনুপাতিক অংশ কেটে অবশিষ্ট অর্থ ফেরতযোগ্য।
- **ডেলিভারির পরে:** ফাইনাল কোড বা ওয়েবসাইট হস্তান্তর সম্পন্ন হওয়ার পর কোনো রিফান্ড প্রযোজ্য নয়।

## প্রক্রিয়া (Process)
রিফান্ডের অনুরোধ সরাসরি ইমেইল (rahatbd20505@gmail.com) বা হোয়াটসঅ্যাপ (+880 1626-224878) করে জানাতে হবে। অনুমোদিত রিফান্ড সাধারণত ৭ কর্মদিবসের মধ্যে একই মাধ্যমে (bKash, Nagad বা ব্যাংক ট্রান্সফার) ফেরত পাঠানো হয়। তৃতীয় পক্ষের ফি (ডোমেইন, হোস্টিং) ইতিমধ্যে প্রদান হয়ে গেলে তা রিফান্ড-যোগ্য নয়।$P4B$;

  refund_en text := $P4B$## Refund & Cancellation Policy
- **Before work starts:** the 50% advance is fully (100%) refundable if you cancel before design or development begins.
- **During development:** if you cancel mid-project, the proportional value of completed work is deducted and the remainder is refunded.
- **After delivery:** no refunds apply once the final code or website has been handed over.

## Process
Send refund requests directly by email (rahatbd20505@gmail.com) or WhatsApp (+880 1626-224878). Approved refunds are returned via the same channel (bKash, Nagad or bank transfer), typically within 7 working days. Third-party costs already paid (domain, hosting) are non-refundable.$P4B$;

begin
  select value into cfg from public.site_settings where key = 'content_config';
  if cfg is null then
    return; -- app fallbacks cover this; nothing to upgrade in storage
  end if;

  pages := cfg->'legalPages';
  if pages is null or jsonb_typeof(pages) <> 'array' then
    return;
  end if;

  for entry in select * from jsonb_array_elements(pages) loop
    page_key := entry->>'key';
    body_bn := coalesce(entry->>'bodyBn', '');
    body_en := coalesce(entry->>'bodyEn', '');
    new_body_bn := null;
    new_body_en := null;

    if page_key in ('privacy', 'privacy-policy') then
      new_body_bn := privacy_bn;
      new_body_en := privacy_en;
    elsif page_key in ('terms', 'terms-of-service') then
      new_body_bn := terms_bn;
      new_body_en := terms_en;
    elsif page_key = 'cookie' then
      new_body_bn := cookie_bn;
      new_body_en := cookie_en;
    elsif page_key = 'refund' then
      new_body_bn := refund_bn;
      new_body_en := refund_en;
    end if;

    -- Replace ONLY thin/legacy bodies (same rule the app applies at render
    -- time): under 200 chars, or no markdown "## " heading anywhere.
    if new_body_bn is not null
       and (
         length(btrim(body_bn)) < 200
         or position('## ' in body_bn) = 0
         or length(btrim(body_en)) < 200
         or position('## ' in body_en) = 0
       ) then
      entry := entry
        || jsonb_build_object(
             'bodyBn', new_body_bn,
             'bodyEn', new_body_en,
             'updatedAtBn', '৯ আগস্ট, ২০২৬',
             'updatedAtEn', 'August 9, 2026'
           );
      changed := true;
    end if;

    new_pages := new_pages || jsonb_build_array(entry);
  end loop;

  if changed then
    update public.site_settings
    set value = jsonb_set(cfg, '{legalPages}', new_pages)
    where key = 'content_config';
  end if;
end $$;

-- ── 2) FAQ items (append-missing only) ────────────────
do $$
declare
  cfg jsonb;
  items jsonb;
  existing_ids text[];
  additions jsonb := $P4B$[
    { "id": "faq-payment", "category": "payments", "questionBn": "পেমেন্ট কীভাবে করবো?", "questionEn": "How do payments work?", "answerBn": "প্রজেক্ট শুরুর আগে ৫০% অগ্রিম এবং ডেলিভারির পূর্বে অবশিষ্ট ৫০%। bKash, Nagad বা সরাসরি ব্যাংক ট্রান্সফারে বাংলাদেশি টাকা (৳) অথবা মার্কিন ডলারে ($) পেমেন্ট করা যায়।", "answerEn": "50% advance before the project starts and the remaining 50% before final delivery. Payments are accepted in BDT (৳) or USD ($) via bKash, Nagad, or direct bank transfer.", "visible": true },
    { "id": "faq-process", "category": "ordering", "questionBn": "অর্ডার করার পর কাজ কীভাবে এগিয়ে যায়?", "questionEn": "What happens after I place an order?", "answerBn": "পাঁচটি ধাপে কাজ সম্পন্ন হয়: প্রয়োজন আলোচনা, ডিজাইন, ডেভেলপমেন্ট, টেস্টিং এবং ডেলিভারি। অর্ডার উইজার্ড জমা দেওয়ার পর আমি ইমেইল বা হোয়াটসঅ্যাপে যোগাযোগ করে বিস্তারিত চূড়ান্ত করি।", "answerEn": "Work moves through five steps: requirements discussion, design, development, testing and delivery. After you submit the order wizard, I contact you by email or WhatsApp to finalize the details.", "visible": true },
    { "id": "faq-tech", "category": "general", "questionBn": "কোন প্রযুক্তি দিয়ে ওয়েবসাইট তৈরি হয়?", "questionEn": "Which technologies do you build with?", "answerBn": "Next.js (App Router), React ও TypeScript দিয়ে ফ্রন্টএন্ড, Tailwind CSS দিয়ে ডিজাইন, Supabase দিয়ে ডেটাবেস ও অথেনটিকেশন, Cloudinary দিয়ে ছবি অপটিমাইজেশন এবং Vercel-এ হোস্টিং — এই সাইটটিও একই স্ট্যাকে তৈরি।", "answerEn": "Next.js (App Router), React and TypeScript on the front end, Tailwind CSS for design, Supabase for database and authentication, Cloudinary for image optimization, hosted on Vercel — this very site runs on the same stack.", "visible": true },
    { "id": "faq-support", "category": "general", "questionBn": "ডেলিভারির পরে কি সাপোর্ট পাবো?", "questionEn": "Do I get support after delivery?", "answerBn": "হ্যাঁ। ডেলিভারির পরও সাপোর্ট পাবেন; ডেভেলপমেন্ট চলাকালে ৩ বার বিনামূল্যে রিভিশন এবং চুক্তিভুক্ত ওয়ারেন্টি সময়ের মধ্যে পাওয়া বাগ বিনামূল্যে ঠিক করে দেওয়া হয়।", "answerEn": "Yes. Support continues after delivery — up to 3 complimentary revision rounds during development, and bugs found within the agreed warranty period are fixed free of charge.", "visible": true },
    { "id": "faq-blood-org", "category": "blood", "questionBn": "রক্তদান সংগঠনের ওয়েবসাইট বানাতে আপনার অভিজ্ঞতা কী?", "questionEn": "What is your experience with blood-donation organization websites?", "answerBn": "আমি ২০২৫ সালে সুনামগঞ্জে শান্তিচক্র ব্লাড সোসাইটি সহ-প্রতিষ্ঠা করি এবং সাধারণ সম্পাদক হিসেবে দাতা ব্যবস্থাপনা করি — তাই দাতা ডিরেক্টরি ও জরুরি অনুরোধ ব্যবস্থার প্রয়োজন আমি প্রথম হাতে জানি। সংগঠনটির জন্য ডিজিটাল ডিরেক্টরি বর্তমানে ডেভেলপমেন্টের পর্যায়ে আছে।", "answerEn": "I co-founded Shantichakra Blood Society in Sunamganj in 2025 and manage donor coordination as its General Secretary, so I understand donor directories and emergency request workflows first-hand. A digital directory for the organization is currently in development.", "visible": true },
    { "id": "faq-rahatverse", "category": "general", "questionBn": "রাহাতভার্স কী?", "questionEn": "What is RahatVerse?", "answerBn": "রাহাতভার্স হলো রাহাত আহমেদের নিজের তৈরি দ্বিভাষিক (বাংলা–ইংরেজি) পার্সোনাল ইকোসিস্টেম — পোর্টফোলিও, ব্লগ, গ্যালারি, সার্ভিস অর্ডারিং এবং সম্পূর্ণ অ্যাডমিন CMS একসাথে। ওয়েব ডেভেলপমেন্ট সার্ভিসও এখান থেকেই পরিচালিত হয়।", "answerEn": "RahatVerse is the personal ecosystem Rahat Ahmed built himself — a bilingual (Bengali–English) portfolio with a blog, gallery, service ordering and a full admin CMS. All web development services are managed from here.", "visible": true },
    { "id": "faq-portfolio", "category": "ordering", "questionBn": "অর্ডারের আগে আপনার কাজ কোথায় দেখবো?", "questionEn": "Where can I see your work before ordering?", "answerBn": "পোর্টফোলিও পেজে বাস্তব প্রজেক্ট ও কেস স্টাডি দেখুন — প্রতিটির সাথে বর্তমান অবস্থা (লাইভ, ডেভেলপমেন্ট চলছে, বা কনসেপ্ট) স্পষ্টভাবে উল্লেখ আছে। এই রাহাতভার্স সাইটটিও একটি লাইভ নমুনা।", "answerEn": "Browse the portfolio page for real projects and case studies — each one is clearly labelled with its current status (live, in development, or concept). This RahatVerse site itself is a live example.", "visible": true },
    { "id": "faq-custom", "category": "ordering", "questionBn": "প্যাকেজের বাইরে কাস্টম ফিচার দরকার হলে?", "questionEn": "What if I need features beyond a package?", "answerBn": "এন্টারপ্রাইজ বা সম্পূর্ণ কাস্টম প্রয়োজনের জন্য আলাদা করে কোটেশন দেওয়া হয়। যোগাযোগ ফর্ম বা হোয়াটসঅ্যাপে আপনার ধারণাটি জানান — আলোচনার পর নির্ধারিত পরিধি ও মূল্য লিখিতভাবে জানিয়ে দেওয়া হবে।", "answerEn": "Enterprise or fully custom requirements are quoted individually. Share your idea through the contact form or WhatsApp — after a discussion, the agreed scope and price are confirmed in writing.", "visible": true }
  ]$P4B$;
  item jsonb;
begin
  select value into cfg from public.site_settings where key = 'content_config';
  if cfg is null then
    return;
  end if;

  items := cfg->'faqItems';
  if items is null or jsonb_typeof(items) <> 'array' then
    return;
  end if;

  select coalesce(array_agg(e->>'id') filter (where e->>'id' is not null), '{}')
    into existing_ids
    from jsonb_array_elements(items) e;

  for item in select * from jsonb_array_elements(additions) loop
    if not (item->>'id' = any(existing_ids)) then
      items := items || jsonb_build_array(item);
    end if;
  end loop;

  if items <> cfg->'faqItems' then
    update public.site_settings
    set value = jsonb_set(cfg, '{faqItems}', items)
    where key = 'content_config';
  end if;
end $$;
