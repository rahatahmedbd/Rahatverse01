-- Phase 14: Analytics, Real-Time Visitor Telemetry & Performance Vitals
-- Seeds the validated `analytics_config` document in site_settings (dashboard
-- panel toggles, telemetry switch, conversion goal label, vitals thresholds).
--
-- NOTE: The app code is resilient and uses DEFAULT_ANALYTICS_CONFIG fallback, so
-- the site works even before this is applied.

insert into public.site_settings (key, value)
values (
  'analytics_config',
  $$
  {
    "visible": true,
    "section": {
      "badgeBn": "📊 অ্যানালিটিক্স",
      "badgeEn": "📊 Analytics",
      "titleBn": "ট্রাফিক ও পারফরম্যান্স",
      "titleEn": "Traffic & Performance",
      "subtitleBn": "ভিজিটর টেলিমেট্রি, ডিভাইস এবং কোর ওয়েব ভাইটাল",
      "subtitleEn": "Visitor telemetry, devices and Core Web Vitals"
    },
    "settings": {
      "telemetryEnabled": true,
      "showDemographics": true,
      "showDevices": true,
      "showGeo": true,
      "showVitals": true,
      "conversionGoalBn": "সম্পন্ন অর্ডার",
      "conversionGoalEn": "Completed Orders",
      "vitals": {
        "lcpTargetMs": 2500,
        "inpTargetMs": 200,
        "clsTarget": 0.1
      }
    }
  }
  $$
)
on conflict (key) do nothing;
