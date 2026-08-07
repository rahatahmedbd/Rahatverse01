-- Phase 8: Bilingual Blog CMS & Community Comment Moderation
-- Seeds the validated `blog_config` document in site_settings (blog section
-- headings, categories, author profile, comment-moderation settings and reading
-- speed) and adds the `admin_reply` / `reply_author` columns to blog_comments so
-- an admin can reply with a verified badge.
--
-- NOTE: The app code is resilient and uses DEFAULT_BLOG_CONFIG fallback and
-- tolerant column handling, so the site works even before this is applied.

-- Part B: admin reply columns for comments (idempotent)
alter table public.blog_comments add column if not exists admin_reply text;
alter table public.blog_comments add column if not exists reply_author text;

-- Part A: blog configuration
insert into public.site_settings (key, value)
values (
  'blog_config',
  $$
  {
    "visible": true,
    "section": {
      "badgeBn": "📝 ব্লগ",
      "badgeEn": "📝 Blog",
      "titleBn": "আমার লেখা",
      "titleEn": "Articles",
      "subtitleBn": "শিক্ষা, প্রযুক্তি ও সমাজসেবা নিয়ে আমার লেখা",
      "subtitleEn": "My writing on education, technology, and social service"
    },
    "categories": [
      { "id": "cat-science", "value": "science", "labelBn": "বিজ্ঞান", "labelEn": "Science", "visible": true },
      { "id": "cat-social", "value": "social", "labelBn": "সমাজসেবা", "labelEn": "Social", "visible": true },
      { "id": "cat-education", "value": "education", "labelBn": "শিক্ষা", "labelEn": "Education", "visible": true },
      { "id": "cat-tech", "value": "tech", "labelBn": "প্রযুক্তি", "labelEn": "Technology", "visible": true }
    ],
    "author": {
      "nameBn": "রাহাত আহমেদ",
      "nameEn": "Rahat Ahmed",
      "roleBn": "লেখক",
      "roleEn": "Author",
      "avatar": "",
      "bioBn": "শিক্ষা, প্রযুক্তি ও সমাজসেবা নিয়ে লেখা।",
      "bioEn": "Writing about education, technology, and social service."
    },
    "comments": {
      "requireApproval": true,
      "adminBadgeBn": "অ্যাডমিন / লেখক",
      "adminBadgeEn": "Admin / Author",
      "replyAuthorBn": "রাহাত আহমেদ",
      "replyAuthorEn": "Rahat Ahmed",
      "headingBn": "মন্তব্য",
      "headingEn": "Comments"
    },
    "readingWpm": 200
  }
  $$
)
on conflict (key) do nothing;
