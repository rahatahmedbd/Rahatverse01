-- Phase 10: Link Hub, Tool Recommendations & Resume/CV Manager
-- Seeds the validated `links_config` document in site_settings (link hub cards
-- with click counts, tool recommendations, resume/CV settings and profile).
--
-- NOTE: The app code is resilient and uses DEFAULT_LINKS_CONFIG fallback, so the
-- site works even before this is applied.

insert into public.site_settings (key, value)
values (
  'links_config',
  $$
  {
    "visible": true,
    "section": {
      "badgeBn": "🔗 সব লিংক",
      "badgeEn": "🔗 All Links",
      "titleBn": "সংযুক্ত হোন",
      "titleEn": "Link Hub",
      "subtitleBn": "সব সোশ্যাল মিডিয়া ও যোগাযোগ এক জায়গায়",
      "subtitleEn": "All social media and contact links in one place"
    },
    "profile": {
      "initials": "RA",
      "nameBn": "রাহাত আহমেদ",
      "nameEn": "Rahat Ahmed",
      "taglineBn": "শিক্ষার্থী • শিক্ষক • ওয়েব ডেভেলপার",
      "taglineEn": "Student • Teacher • Web Developer",
      "avatar": ""
    },
    "links": [
      { "id": "link-fb", "labelBn": "ফেসবুক", "labelEn": "Facebook", "url": "https://www.facebook.com/rahat.ahmed.948943", "icon": "Facebook", "color": "text-blue-400", "bgColor": "bg-blue-500/10", "visible": true, "clicks": 0 },
      { "id": "link-ig", "labelBn": "ইনস্টাগ্রাম", "labelEn": "Instagram", "url": "https://www.instagram.com/rahatahm6d/", "icon": "Instagram", "color": "text-pink-400", "bgColor": "bg-pink-500/10", "visible": true, "clicks": 0 },
      { "id": "link-yt", "labelBn": "ইউটিউব", "labelEn": "YouTube", "url": "https://www.youtube.com/@RahatAhmedOfficial0", "icon": "Youtube", "color": "text-red-400", "bgColor": "bg-red-500/10", "visible": true, "clicks": 0 },
      { "id": "link-tt", "labelBn": "টিকটক", "labelEn": "TikTok", "url": "https://www.tiktok.com/@rahatvives", "icon": "TikTok", "color": "text-white", "bgColor": "bg-white/10", "visible": true, "clicks": 0 },
      { "id": "link-wa", "labelBn": "হোয়াটসঅ্যাপ", "labelEn": "WhatsApp", "url": "https://wa.me/8801626224878", "icon": "MessageCircle", "color": "text-green-400", "bgColor": "bg-green-500/10", "visible": true, "clicks": 0 },
      { "id": "link-mail", "labelBn": "ইমেইল", "labelEn": "Email", "url": "mailto:rahatbd20505@gmail.com", "icon": "Mail", "color": "text-amber-400", "bgColor": "bg-amber-500/10", "visible": true, "clicks": 0 },
      { "id": "link-phone", "labelBn": "ফোন", "labelEn": "Phone", "url": "tel:+8801626224878", "icon": "Phone", "color": "text-blue-400", "bgColor": "bg-blue-500/10", "visible": true, "clicks": 0 },
      { "id": "link-gh", "labelBn": "গিটহাব", "labelEn": "GitHub", "url": "https://github.com/rahatahmedbd", "icon": "Github", "color": "text-gray-300", "bgColor": "bg-gray-500/10", "visible": true, "clicks": 0 }
    ],
    "toolsSectionTitleBn": "আমার টুলস",
    "toolsSectionTitleEn": "Tools I Use",
    "toolsSectionSubtitleBn": "ডেভেলপমেন্ট, ডিজাইন ও প্রোডাক্টিভিটি টুল",
    "toolsSectionSubtitleEn": "Development, design and productivity tools",
    "tools": [
      { "id": "tool-vscode", "nameBn": "VS Code", "nameEn": "VS Code", "category": "development", "descriptionBn": "কোড এডিটর", "descriptionEn": "Code editor", "url": "https://code.visualstudio.com/", "visible": true },
      { "id": "tool-figma", "nameBn": "Figma", "nameEn": "Figma", "category": "design", "descriptionBn": "UI ডিজাইন", "descriptionEn": "UI design", "url": "https://www.figma.com/", "visible": true },
      { "id": "tool-notion", "nameBn": "Notion", "nameEn": "Notion", "category": "productivity", "descriptionBn": "নোট ও প্রোডাক্টিভিটি", "descriptionEn": "Notes & productivity", "url": "https://www.notion.so/", "visible": true }
    ],
    "resume": {
      "sectionBadgeBn": "📄 রিজিউম",
      "sectionBadgeEn": "📄 Resume",
      "sectionTitleBn": "রিজিউম ডাউনলোড",
      "sectionTitleEn": "Download Resume",
      "sectionSubtitleBn": "আমার CV PDF ফরম্যাটে",
      "sectionSubtitleEn": "My CV in PDF format",
      "cvBnUrl": "",
      "cvEnUrl": "",
      "previewInBrowser": false,
      "downloadLabelBn": "ডাউনলোড",
      "downloadLabelEn": "Download",
      "comingSoonBn": "শীঘ্রই আসছে...",
      "comingSoonEn": "Coming soon..."
    }
  }
  $$
)
on conflict (key) do nothing;
