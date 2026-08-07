-- Phase 2: Hero Section & Visual Identity Control
-- Stores the hero configuration as JSON in site_settings under key `hero_config`.
-- Public read via existing site_settings_select_public policy, admin write only.
-- Seed defaults matching src/lib/hero/config.ts DEFAULT_HERO_CONFIG.

insert into public.site_settings (key, value)
values (
  'hero_config',
  jsonb_build_object(
    'intro', jsonb_build_object(
      'welcomeTextBn', 'স্বাগতম আমার ডিজিটাল জগতে',
      'welcomeTextEn', 'Welcome to my digital world',
      'greetingBn', 'বিসমিল্লাহির রাহমানির রাহিম',
      'greetingEn', 'Bismillahir Rahmanir Rahim',
      'durationMs', 3500
    ),
    'typewriter', jsonb_build_object(
      'bn', jsonb_build_array('ওয়েব ডেভেলপার','শিক্ষার্থী','গৃহশিক্ষক','রক্তদাতা','BNCC ক্যাডেট'),
      'en', jsonb_build_array('Web Developer','Student','Teacher','Blood Donor','BNCC Cadet')
    ),
    'badges', jsonb_build_array(
      jsonb_build_object('id','badge-1','labelBn','ওয়েব ডেভেলপার','labelEn','Web Developer'),
      jsonb_build_object('id','badge-2','labelBn','রক্তদাতা','labelEn','Blood Donor'),
      jsonb_build_object('id','badge-3','labelBn','BNCC ক্যাডেট','labelEn','BNCC Cadet')
    ),
    'counters', jsonb_build_array(
      jsonb_build_object('id','c-1','labelBn','অর্জন','labelEn','Achievements','value',9,'suffix',''),
      jsonb_build_object('id','c-2','labelBn','১ম স্থান','labelEn','1st Places','value',5,'suffix','×'),
      jsonb_build_object('id','c-3','labelBn','রক্তদান','labelEn','Blood Donations','value',4,'suffix',''),
      jsonb_build_object('id','c-4','labelBn','GPA 5.00','labelEn','GPA 5.00','value',2,'suffix','×')
    ),
    'ctas', jsonb_build_array(
      jsonb_build_object('id','cta-order','labelBn','ওয়েবসাইট অর্ডার করুন','labelEn','Order a Website','href','/order','variant','gradient','icon','Zap','pulse', true),
      jsonb_build_object('id','cta-portfolio','labelBn','প্রজেক্ট দেখুন','labelEn','View Projects','href','/portfolio','variant','glass','icon','Eye','pulse', false),
      jsonb_build_object('id','cta-contact','labelBn','যোগাযোগ','labelEn','Contact','href','/contact','variant','outline','icon','MessageCircle','pulse', false)
    ),
    'visible', true
  )
)
on conflict (key) do nothing;

-- Ensure audit for hero edits changes isoptional� - uses existing audit_logs
