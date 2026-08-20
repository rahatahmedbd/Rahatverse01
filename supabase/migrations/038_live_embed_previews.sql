-- Live previews & honest portfolio: replace static/AI images with live site
-- embeds and remove projects that have no live website link.
--
-- 1. portfolio_config (content_config table):
--    a) proj-educare removed (concept project, no live website)
--    b) proj-shantichakra / proj-porasathi: image cleared, embedUrl set — the
--       card now renders the real website in a lazy iframe (click = open site)
-- 2. hero_config: live-projects counter 4 → 3
--
-- Idempotent: safe to re-run.

-- ── 1a. Remove proj-educare (and any other project whose liveUrl is dead) ──
update public.content_config as cc
set value = jsonb_set(
  cc.value,
  '{projects}',
  (
    select coalesce(jsonb_agg(item order by position), '[]'::jsonb)
    from jsonb_array_elements(cc.value->'projects') with ordinality as entries(item, position)
    where item->>'id' <> 'proj-educare'
      and coalesce(item->>'liveUrl', '#') <> '#'
  ),
  false
)
where cc.key = 'portfolio_config'
  and jsonb_typeof(cc.value) = 'object'
  and jsonb_typeof(cc.value->'projects') = 'array';

-- ── 1b. Switch Shantichakra & PoraSathi to live embeds (no static image) ──
update public.content_config as cc
set value = jsonb_set(
  cc.value,
  '{projects}',
  (
    select jsonb_agg(
      case
        when item->>'id' = 'proj-shantichakra' then item || '{"image": "", "embedUrl": "https://shantichakrabloodsociety.rahatahmed.site/"}'::jsonb
        when item->>'id' = 'proj-porasathi' then item || '{"image": "", "embedUrl": "https://porasathi.rahatahmed.site/"}'::jsonb
        else item
      end
      order by position
    )
    from jsonb_array_elements(cc.value->'projects') with ordinality as entries(item, position)
  ),
  false
)
where cc.key = 'portfolio_config'
  and jsonb_typeof(cc.value) = 'object'
  and jsonb_typeof(cc.value->'projects') = 'array';

-- ── 2. hero_config — live project count is now 3 ───────────────────────
update public.site_settings
set value = jsonb_set(
  value,
  '{counters}',
  (
    select jsonb_agg(
      case
        when item->>'id' = 'c-1' then item || '{"labelBn": "লাইভ প্রজেক্ট", "labelEn": "Live Projects", "value": 3, "suffix": "+"}'::jsonb
        else item
      end
      order by position
    )
    from jsonb_array_elements(value->'counters') with ordinality as entries(item, position)
  ),
  false
)
where key = 'hero_config'
  and jsonb_typeof(value) = 'object'
  and jsonb_typeof(value->'counters') = 'array'
  and (value->'counters') @> $check$[{"id": "c-1"}]$check$::jsonb;
