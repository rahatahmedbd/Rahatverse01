-- Phase 6 final production fix: normalize only site_settings.hero_config.ctas.
--
-- This migration deliberately preserves every top-level hero_config field and
-- every existing visual property on the two retained CTA objects. It changes
-- only the required localized labels and removes all other/legacy CTA entries.

with hero as (
  select
    settings.id,
    settings.value,
    (
      select entry.cta
      from jsonb_array_elements(settings.value->'ctas') with ordinality as entry(cta, position)
      where entry.cta->>'id' = 'cta-order'
      order by entry.position
      limit 1
    ) as order_cta,
    (
      select entry.cta
      from jsonb_array_elements(settings.value->'ctas') with ordinality as entry(cta, position)
      where entry.cta->>'id' = 'cta-portfolio'
      order by entry.position
      limit 1
    ) as portfolio_cta
  from public.site_settings as settings
  where settings.key = 'hero_config'
    and jsonb_typeof(settings.value) = 'object'
    and jsonb_typeof(settings.value->'ctas') = 'array'
), normalized as (
  select
    hero.id,
    jsonb_set(
      hero.value,
      '{ctas}',
      jsonb_build_array(
        hero.order_cta || jsonb_build_object(
          'id', 'cta-order',
          'labelEn', 'Order a Website',
          'labelBn', 'ওয়েবসাইট অর্ডার করুন'
        ),
        hero.portfolio_cta || jsonb_build_object(
          'id', 'cta-portfolio',
          'labelEn', 'View Work & Proof',
          'labelBn', 'কাজ ও প্রমাণ দেখুন'
        )
      ),
      false
    ) as value
  from hero
  where hero.order_cta is not null
    and hero.portfolio_cta is not null
)
update public.site_settings as settings
set value = normalized.value
from normalized
where settings.id = normalized.id;

-- Fail loudly instead of silently accepting a missing/malformed configuration.
do $phase6$
declare
  stored_ctas jsonb;
begin
  select value->'ctas'
  into stored_ctas
  from public.site_settings
  where key = 'hero_config';

  if stored_ctas is null
    or jsonb_typeof(stored_ctas) <> 'array'
    or jsonb_array_length(stored_ctas) <> 2
    or stored_ctas->0->>'id' <> 'cta-order'
    or stored_ctas->0->>'labelEn' <> 'Order a Website'
    or stored_ctas->0->>'labelBn' <> 'ওয়েবসাইট অর্ডার করুন'
    or stored_ctas->1->>'id' <> 'cta-portfolio'
    or stored_ctas->1->>'labelEn' <> 'View Work & Proof'
    or stored_ctas->1->>'labelBn' <> 'কাজ ও প্রমাণ দেখুন'
  then
    raise exception 'Phase 6 hero CTA normalization did not produce the required configuration';
  end if;
end
$phase6$;
