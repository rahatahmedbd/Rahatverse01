-- Phase 15: Global Site Settings, Security, Auditing & One-Click Backups
-- Seeds the validated `global_config` document in site_settings (announcement
-- banner, header announcement, footer settings, maintenance mode).
--
-- NOTE: The app code is resilient and uses DEFAULT_GLOBAL_CONFIG fallback, so the
-- site works even before this is applied.

insert into public.site_settings (key, value)
values (
  'global_config',
  $$
  {
    "visible": true,
    "announcement": {
      "enabled": false,
      "textBn": "🚀 নতুন আপডেট!",
      "textEn": "🚀 New update!",
      "link": ""
    },
    "header": {
      "enabled": false,
      "textBn": "",
      "textEn": ""
    },
    "footer": {
      "copyrightBn": "© {year} RahatVerse. সর্বস্বত্ব সংরক্ষিত।",
      "copyrightEn": "© {year} RahatVerse. All rights reserved.",
      "madeWithBn": "ভালোবাসা দিয়ে তৈরি",
      "madeWithEn": "Made with",
      "businessPhone": "+880 1626-224878",
      "businessEmail": "rahatbd20505@gmail.com",
      "businessWhatsapp": "https://wa.me/8801626224878",
      "locationBn": "সুনামগঞ্জ, বাংলাদেশ",
      "locationEn": "Sunamganj, Bangladesh"
    },
    "maintenance": {
      "enabled": false,
      "messageBn": "আমরা শীঘ্রই ফিরে আসছি!",
      "messageEn": "We'll be back soon!",
      "allowAdmins": true
    }
  }
  $$
)
on conflict (key) do nothing;
