-- Phase 7: Cloudinary Media Library, Photo Gallery & Video Showcase CMS
-- Seeds validated `gallery_config` and `video_config` documents in site_settings.
-- Public reads use the existing site_settings_select_public policy; writes are
-- restricted by site_settings_admin_write and the admin settings API.
--
-- NOTE: The app code is resilient and uses DEFAULT_*_CONFIG fallbacks, so the
-- site works even before this is applied. Apply this migration (or your
-- equivalent) to unlock persisted admin control.

insert into public.site_settings (key, value)
values
(
  'gallery_config',
  $$
  {
    "visible": true,
    "section": {
      "badgeBn": "🖼️ মুহূর্তগুলো",
      "badgeEn": "🖼️ Moments",
      "titleBn": "গ্যালারি",
      "titleEn": "Photo Gallery",
      "subtitleBn": "আমার শিক্ষাজীবন, অর্জন, সামাজিক কার্যক্রম ও উদ্যোগের কিছু মুহূর্ত",
      "subtitleEn": "Moments from my academic journey, achievements, and social activities"
    },
    "defaultLayout": "mosaic",
    "albums": [
      { "id": "alb-achievements", "value": "achievements", "nameBn": "অর্জন", "nameEn": "Achievements", "descriptionBn": "প্রতিযোগিতা ও স্বীকৃতি", "descriptionEn": "Competitions & recognition", "featuredPublicId": "", "visible": true },
      { "id": "alb-blood", "value": "blood-donation", "nameBn": "রক্তদান", "nameEn": "Blood Donation", "descriptionBn": "শান্তিচক্র কার্যক্রম", "descriptionEn": "Shantichakra activities", "featuredPublicId": "", "visible": true },
      { "id": "alb-education", "value": "experience", "nameBn": "শিক্ষা ও অভিজ্ঞতা", "nameEn": "Education & Experience", "descriptionBn": "পাঠদান ও উদ্যোগ", "descriptionEn": "Teaching & initiatives", "featuredPublicId": "", "visible": true },
      { "id": "alb-social", "value": "social-service", "nameBn": "সমাজসেবা", "nameEn": "Social Service", "descriptionBn": "মানুষের পাশে", "descriptionEn": "Standing with people", "featuredPublicId": "", "visible": true },
      { "id": "alb-profile", "value": "profile", "nameBn": "প্রোফাইল", "nameEn": "Profile", "descriptionBn": "ব্যক্তিগত মুহূর্ত", "descriptionEn": "Personal moments", "featuredPublicId": "", "visible": true },
      { "id": "alb-memorial", "value": "memorial", "nameBn": "স্মৃতিচারণ", "nameEn": "Memorial", "descriptionBn": "শ্রদ্ধাঞ্জলি", "descriptionEn": "Tribute", "featuredPublicId": "", "visible": true }
    ],
    "note": {
      "bn": "📸 ছবিগুলো Cloudinary থেকে লোড হয়।",
      "en": "📸 Images are loaded from Cloudinary."
    }
  }
  $$
),
(
  'video_config',
  $$
  {
    "visible": true,
    "section": {
      "badgeBn": "🎬 ভিডিও পোর্টফোলিও",
      "badgeEn": "🎬 Video Portfolio",
      "titleBn": "ভিডিও কনটেন্ট",
      "titleEn": "Video Content",
      "subtitleBn": "শিক্ষা, প্রযুক্তি ও সামাজিক সচেতনতা নিয়ে তৈরি কনটেন্ট",
      "subtitleEn": "Content on education, technology, and social awareness"
    },
    "videos": [
      { "id": "vid-youtube", "titleBn": "YouTube চ্যানেল", "titleEn": "YouTube Channel", "descriptionBn": "শিক্ষামূলক কনটেন্ট ও সামাজিক সচেতনতা", "descriptionEn": "Educational content and social awareness", "platform": "youtube", "url": "https://www.youtube.com/@RahatAhmedOfficial0", "videoId": "", "categoryBn": "শিক্ষা", "categoryEn": "Education", "thumbnail": "", "visible": true },
      { "id": "vid-tiktok", "titleBn": "TikTok কনটেন্ট", "titleEn": "TikTok Content", "descriptionBn": "ছোট শিক্ষামূলক ও সচেতনতামূলক ভিডিও", "descriptionEn": "Short educational and awareness videos", "platform": "youtube", "url": "https://www.tiktok.com/@rahatvives", "videoId": "", "categoryBn": "সচেতনতা", "categoryEn": "Awareness", "thumbnail": "", "visible": true }
    ],
    "socialFollowBn": "আমার সোশ্যাল মিডিয়া অনুসরণ করুন:",
    "socialFollowEn": "Follow me on social media:",
    "socialLinks": [
      { "id": "soc-yt", "label": "YouTube", "url": "https://www.youtube.com/@RahatAhmedOfficial0" },
      { "id": "soc-tt", "label": "TikTok", "url": "https://www.tiktok.com/@rahatvives" },
      { "id": "soc-fb", "label": "Facebook", "url": "https://www.facebook.com/rahat.ahmed.948943" },
      { "id": "soc-ig", "label": "Instagram", "url": "https://www.instagram.com/rahatahm6d/" }
    ]
  }
  $$
)
on conflict (key) do nothing;
