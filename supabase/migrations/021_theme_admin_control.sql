-- Phase 12: Interactive Themes, Gamification (XP) & Audio Controls
-- Seeds the validated `theme_config` document in site_settings (theme presets,
-- defaults, XP rules/levels, ambient audio playlist and background-effect toggles).
--
-- NOTE: The app code is resilient and uses DEFAULT_THEME_CONFIG fallback, so the
-- site works even before this is applied.

insert into public.site_settings (key, value)
values (
  'theme_config',
  $$
  {
    "visible": true,
    "section": {
      "badgeBn": "🎨 থিম ও ইন্টারঅ্যাক্টিভিটি",
      "badgeEn": "🎨 Theme & Interactivity",
      "titleBn": "থিম কাস্টমাইজার",
      "titleEn": "Theme Customizer",
      "subtitleBn": "অ্যাকসেন্ট কালার, ডে/নাইট ও ইন্টারঅ্যাকটিভ ইফেক্ট",
      "subtitleEn": "Accent colors, day/night and interactive effects"
    },
    "presets": [
      { "id": "cyberpunk", "nameBn": "সাইবারপাঙ্ক", "nameEn": "Cyberpunk", "primary": "#f0abfc", "primaryForeground": "#170b1f", "ring": "#f0abfc", "gradientStart": "#d946ef", "gradientMiddle": "#8b5cf6", "gradientEnd": "#06b6d4", "selectionBg": "rgba(217,70,239,0.35)", "visible": true },
      { "id": "aurora", "nameBn": "অরোরা", "nameEn": "Aurora", "primary": "#34d399", "primaryForeground": "#020817", "ring": "#34d399", "gradientStart": "#10b981", "gradientMiddle": "#06b6d4", "gradientEnd": "#3b82f6", "selectionBg": "rgba(16,185,129,0.35)", "visible": true },
      { "id": "sunset", "nameBn": "সানসেট", "nameEn": "Sunset", "primary": "#fbbf24", "primaryForeground": "#020817", "ring": "#fbbf24", "gradientStart": "#f59e0b", "gradientMiddle": "#f97316", "gradientEnd": "#ef4444", "selectionBg": "rgba(245,158,11,0.35)", "visible": true },
      { "id": "ocean", "nameBn": "ওশান", "nameEn": "Ocean", "primary": "#38bdf8", "primaryForeground": "#020817", "ring": "#38bdf8", "gradientStart": "#3b82f6", "gradientMiddle": "#06b6d4", "gradientEnd": "#14b8a6", "selectionBg": "rgba(59,130,246,0.35)", "visible": true },
      { "id": "voidgold", "nameBn": "ভয়েড গোল্ড", "nameEn": "Void Gold", "primary": "#fde047", "primaryForeground": "#020817", "ring": "#fde047", "gradientStart": "#eab308", "gradientMiddle": "#f59e0b", "gradientEnd": "#a3e635", "selectionBg": "rgba(234,179,8,0.35)", "visible": true }
    ],
    "defaults": {
      "defaultAccent": "aurora",
      "defaultTheme": "dark",
      "allowCustomAccent": true
    },
    "xp": {
      "rules": [
        { "id": "xp-read-blog", "action": "read_blog", "points": 10, "labelBn": "ব্লগ পড়া", "labelEn": "Read a blog post", "enabled": true },
        { "id": "xp-explore", "action": "explore_all", "points": 25, "labelBn": "সব সেকশন ঘুরে দেখা", "labelEn": "Explore all sections", "enabled": true },
        { "id": "xp-form", "action": "submit_form", "points": 15, "labelBn": "ফর্ম জমা", "labelEn": "Submit a form", "enabled": true },
        { "id": "xp-easter", "action": "easter_egg", "points": 50, "labelBn": "ইস্টার এগ খোঁজা", "labelEn": "Find an easter egg", "enabled": true }
      ],
      "levels": [
        { "id": "lvl-1", "minXp": 0, "nameBn": "নবীন", "nameEn": "Beginner", "rewardMessageBn": "স্বাগতম!", "rewardMessageEn": "Welcome!" },
        { "id": "lvl-2", "minXp": 50, "nameBn": "এক্সপ্লোরার", "nameEn": "Explorer", "rewardMessageBn": "অনেক কিছু আবিষ্কার করছেন!", "rewardMessageEn": "Exploring a lot!" },
        { "id": "lvl-3", "minXp": 150, "nameBn": "মাস্টার", "nameEn": "Master", "rewardMessageBn": "চমৎকার!", "rewardMessageEn": "Excellent!" }
      ]
    },
    "audio": {
      "enabled": false,
      "defaultVolume": 50,
      "tracks": [
        { "id": "track-1", "titleBn": "অ্যাম্বিয়েন্ট ১", "titleEn": "Ambient 1", "url": "", "visible": true }
      ]
    },
    "effects": {
      "particleField": true,
      "particleIntensity": 50,
      "auroraMesh": true,
      "customCursor": true,
      "sparkleTrail": false,
      "intensity": 50
    }
  }
  $$
)
on conflict (key) do nothing;
