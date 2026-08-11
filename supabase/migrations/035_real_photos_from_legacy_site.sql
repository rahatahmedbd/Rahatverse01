-- Phase 6C: Point the profile and memorial portraits at the real photographs
--
-- The two portraits on the public site (Rahat's profile photo in the Hero /
-- About sections, and the photograph of his late father in the Tribute
-- section) were configured as Cloudinary public IDs only. When that Cloudinary
-- asset is missing or the CDN is unreachable, the site fell back to a generic
-- SVG avatar and the tribute rendered without a portrait at all.
--
-- The genuine photographs are now committed to this repository under
-- `public/images/legacy/`, carried over from the original static profile site
-- (rahatahmedbd.github.io):
--   * /images/legacy/rahat-profile.jpg  — Rahat Ahmed
--   * /images/legacy/farid-ahmed.jpg    — Late Md. Farid Ahmed
--
-- This migration fills in the matching `url` / `imageUrl` fields so the stored
-- documents serve the same images as the code defaults. The components already
-- prefer an explicit URL over the Cloudinary public ID, and the public ID is
-- left in place so an admin can still upload to Cloudinary later.
--
-- Guards ("existing admin values win"):
--   * Each field is written ONLY when it is still empty or still equal to one
--     of the previously shipped values (the empty seed value or the old
--     Cloudinary URL). Anything an admin has set is left untouched.
--   * If a config row does not exist the block exits quietly and the app keeps
--     serving the (already updated) code defaults.
--   * Re-running the migration is a no-op.

-- ── about_config.profileImage.url ──────────────────────
do $$
declare
  cfg      jsonb;
  current  text;
  target   text := '/images/legacy/rahat-profile.jpg';
begin
  select value into cfg from public.site_settings where key = 'about_config';
  if cfg is null then
    return;
  end if;

  current := cfg #>> '{profileImage,url}';

  if current is null
     or current = ''
     or current = 'https://res.cloudinary.com/kbc3dfnj/image/upload/v1786125213/rahatverse/profile/1786125213546.jpg'
  then
    update public.site_settings
    set value = jsonb_set(cfg, '{profileImage,url}', to_jsonb(target))
    where key = 'about_config';
  end if;
end $$;

-- ── experience_config.memorial.imageUrl ────────────────
do $$
declare
  cfg      jsonb;
  current  text;
  target   text := '/images/legacy/farid-ahmed.jpg';
begin
  select value into cfg from public.site_settings where key = 'experience_config';
  if cfg is null then
    return;
  end if;

  if cfg -> 'memorial' is null then
    return;
  end if;

  current := cfg #>> '{memorial,imageUrl}';

  if current is null
     or current = ''
     or current = 'https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/father-photo'
  then
    update public.site_settings
    set value = jsonb_set(cfg, '{memorial,imageUrl}', to_jsonb(target))
    where key = 'experience_config';
  end if;
end $$;
