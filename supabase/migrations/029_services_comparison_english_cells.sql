-- Phase 4I: English cell text for the pricing comparison matrix
--
-- The comparison table stores Bengali cell text in `values`. The English
-- /en/order page therefore showed Bengali words/numerals in some cells
-- (e.g. "আনলিমিটেড", "১ সপ্তাহ"). This migration adds a parallel `valuesEn`
-- object to the known rows that need translation, WITHOUT touching `values`.
--
-- Additive and idempotent: rows that already carry `valuesEn` (e.g. saved by
-- an admin) are skipped entirely — existing values always win. Locale-neutral
-- rows (✓ / —) need no translation and are not modified.

do $$
declare
  cfg jsonb;
  rows jsonb;
  row jsonb;
  new_rows jsonb := '[]'::jsonb;
  row_id text;

  en_map jsonb := $P4I${
    "cmp-pages":    { "basic": "1-3",    "standard": "5-10",     "premium": "Unlimited", "enterprise": "Custom" },
    "cmp-seo":      { "basic": "Basic",  "standard": "Advanced", "premium": "Full",      "enterprise": "Full" },
    "cmp-support":  { "basic": "Limited","standard": "Standard", "premium": "Priority",  "enterprise": "Priority" },
    "cmp-delivery": { "basic": "1 week", "standard": "2 weeks",  "premium": "3 weeks",   "enterprise": "Custom" }
  }$P4I$;
begin
  select value into cfg from public.site_settings where key = 'services_config';
  if cfg is null then
    return;
  end if;

  rows := cfg->'comparisonRows';
  if rows is null or jsonb_typeof(rows) <> 'array' then
    return;
  end if;

  for row in select * from jsonb_array_elements(rows) loop
    row_id := row->>'id';
    if (en_map ? row_id) and not (row ? 'valuesEn') then
      row := row || jsonb_build_object('valuesEn', en_map->row_id);
    end if;
    new_rows := new_rows || jsonb_build_array(row);
  end loop;

  if new_rows <> rows then
    update public.site_settings
    set value = jsonb_set(cfg, '{comparisonRows}', new_rows)
    where key = 'services_config';
  end if;
end $$;
