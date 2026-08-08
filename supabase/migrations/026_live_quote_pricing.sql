-- Phase 32: Live Price Estimator & Interactive Package Compare
-- Additive, idempotent JSON migration. Existing admin values win and no rows
-- outside the two relevant site_settings documents are touched.

-- Add configurable prices to order feature add-ons while preserving any value
-- already written by an administrator.
update public.site_settings as settings
set value = jsonb_set(
  settings.value,
  '{featureAddons}',
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'priceBdt', case addon->>'value'
            when 'seo' then 1500
            when 'blog' then 2500
            when 'contact_form' then 1000
            when 'map' then 500
            when 'payment' then 5000
            when 'auth' then 4000
            when 'admin' then 7000
            when 'multilang' then 2500
            when 'analytics' then 1500
            else 0
          end,
          'priceUsd', case addon->>'value'
            when 'seo' then 18
            when 'blog' then 30
            when 'contact_form' then 12
            when 'map' then 6
            when 'payment' then 60
            when 'auth' then 48
            when 'admin' then 84
            when 'multilang' then 30
            when 'analytics' then 18
            else 0
          end
        ) || addon
        order by ordinal
      )
      from jsonb_array_elements(coalesce(settings.value->'featureAddons', '[]'::jsonb))
        with ordinality as items(addon, ordinal)
    ),
    '[]'::jsonb
  ),
  true
)
where settings.key = 'orders_config';

-- Add the live-quote controls only when an older settings document does not
-- already contain them.
update public.site_settings
set value = jsonb_set(
  value,
  '{quote}',
  coalesce(
    value->'quote',
    jsonb_build_object(
      'enabled', true,
      'pagePriceBdt', 1000,
      'pagePriceUsd', 12,
      'rangePercent', 15,
      'titleBn', 'লাইভ আনুমানিক কোট',
      'titleEn', 'Live estimated quote',
      'disclaimerBn', 'এটি একটি প্রাথমিক আনুমানিক রেঞ্জ। চূড়ান্ত মূল্য প্রয়োজন যাচাই ও আলোচনার পর নিশ্চিত হবে।',
      'disclaimerEn', 'This is an initial estimate. The final price is confirmed after requirements review and consultation.'
    )
  ),
  true
)
where key = 'orders_config';

-- Connect public pricing tiers to order values and declare how many pages are
-- included in the package base price. A JSON value already present wins.
update public.site_settings as settings
set value = jsonb_set(
  settings.value,
  '{packages}',
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'orderValue', pkg->>'id',
          'includedPages', case pkg->>'id'
            when 'basic' then 3
            when 'standard' then 10
            else null
          end,
          'includedFeatureValues', case pkg->>'id'
            when 'basic' then '["responsive", "seo", "contact_form"]'::jsonb
            when 'standard' then '["responsive", "seo", "blog", "contact_form", "map"]'::jsonb
            when 'premium' then '["responsive", "seo", "blog", "contact_form", "map", "payment", "admin"]'::jsonb
            when 'enterprise' then '["responsive", "seo", "blog", "contact_form", "map", "payment", "auth", "admin", "multilang", "analytics"]'::jsonb
            else '[]'::jsonb
          end
        ) || pkg
        order by ordinal
      )
      from jsonb_array_elements(coalesce(settings.value->'packages', '[]'::jsonb))
        with ordinality as items(pkg, ordinal)
    ),
    '[]'::jsonb
  ),
  true
)
where settings.key = 'services_config';

-- Link featured service cards to their canonical priced tier so literal price
-- placeholders can be replaced safely without relying on array order.
update public.site_settings as settings
set value = jsonb_set(
  settings.value,
  '{featuredPackages}',
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'pricingPackageId', case featured->>'id'
            when 'featured-portfolio' then 'basic'
            when 'featured-ecommerce' then 'premium'
            when 'featured-custom' then 'enterprise'
            else ''
          end
        ) || featured
        order by ordinal
      )
      from jsonb_array_elements(coalesce(settings.value->'featuredPackages', '[]'::jsonb))
        with ordinality as items(featured, ordinal)
    ),
    '[]'::jsonb
  ),
  true
)
where settings.key = 'services_config';

-- Repair only the original seed placeholders. Admin-customized price text is
-- intentionally left untouched.
update public.site_settings as settings
set value = jsonb_set(
  settings.value,
  '{services}',
  coalesce(
    (
      select jsonb_agg(
        case
          when service->>'priceEn' = 'Starting from ৳X' then
            service || jsonb_build_object(
              'priceBn', case service->>'id'
                when 'ecommerce-website' then 'শুরু ৳৩০,০০০ থেকে'
                else 'শুরু ৳৫,০০০ থেকে'
              end,
              'priceEn', case service->>'id'
                when 'ecommerce-website' then 'Starting from ৳30,000'
                else 'Starting from ৳5,000'
              end
            )
          else service
        end
        order by ordinal
      )
      from jsonb_array_elements(coalesce(settings.value->'services', '[]'::jsonb))
        with ordinality as items(service, ordinal)
    ),
    '[]'::jsonb
  ),
  true
)
where settings.key = 'services_config';
