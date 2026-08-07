-- Phase 11: Newsletter Subscribers, Campaign Dispatcher & Email Deliverability
-- Seeds the validated `newsletter_config` document in site_settings (newsletter
-- section headings, topic preferences, campaign defaults).
--
-- NOTE: The app code is resilient and uses DEFAULT_NEWSLETTER_CONFIG fallback, so
-- the site works even before this is applied.

insert into public.site_settings (key, value)
values (
  'newsletter_config',
  $$
  {
    "visible": true,
    "section": {
      "badgeBn": "📰 নিউজলেটার",
      "badgeEn": "📰 Newsletter",
      "titleBn": "নিউজলেটারে যুক্ত হোন",
      "titleEn": "Join the newsletter",
      "subtitleBn": "শিক্ষা, প্রযুক্তি ও সমাজসেবা নিয়ে আমার নতুন লেখা এবং প্রজেক্ট আপডেট — সরাসরি ইনবক্সে। স্প্যাম নয়।",
      "subtitleEn": "New stories on education, tech & social service — plus project updates. No spam, unsubscribe anytime."
    },
    "topics": [
      { "id": "topic-tech", "value": "tech_updates", "labelBn": "টেক আপডেট", "labelEn": "Tech Updates", "visible": true },
      { "id": "topic-webdev", "value": "webdev_tips", "labelBn": "ওয়েব ডেভ টিপস", "labelEn": "Web Dev Tips", "visible": true },
      { "id": "topic-blood", "value": "blood_drives", "labelBn": "রক্তদান ড্রাইভ", "labelEn": "Blood Donation Drives", "visible": true }
    ],
    "campaignDefaults": {
      "fromNameBn": "রাহাত আহমেদ",
      "fromNameEn": "Rahat Ahmed",
      "fromEmail": "newsletter@rahatverse.dev",
      "defaultSubjectBn": "রাহাতভার্স আপডেট",
      "defaultSubjectEn": "RahatVerse Update",
      "personalizationHintBn": "{{name}} ট্যাগ ব্যবহার করে পাঠকের নাম বসান",
      "personalizationHintEn": "Use the {{name}} tag to personalize each reader's name"
    }
  }
  $$
)
on conflict (key) do nothing;
