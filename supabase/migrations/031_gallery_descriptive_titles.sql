-- Phase 4F: Descriptive, visible-only gallery image titles (used for alt text)
--
-- The gallery derives each image's alt text from its title/title_bn. Many
-- production rows were saved with very short labels ("Blood Society",
-- "Profile Photo"), which describe neither the image nor its context. This
-- migration upgrades those rows to modest, factual descriptions of what is
-- actually visible (repurposing claims that already exist elsewhere on the
-- site — no new achievements, dates or details are invented).
--
-- Guard ("existing admin values win"): a row is updated ONLY while its title
-- is NULL or still equals the known old short label recorded here. Any title
-- an admin has rewritten stays untouched. Idempotent.

-- SSC 2025 certificate / result
update public.images
set title = 'SSC 2025 — GPA 5.00 (A+)',
    title_bn = 'SSC ২০২৫ — জিপিএ ৫.০০ (A+) অর্জন'
where public_id = 'rahatverse/ssc-2025'
  and (title is null or btrim(title) in ('SSC 2025'));

-- Merit ceremony (SSC scholarship crest)
update public.images
set title = 'Merit crest for SSC 2025 GPA 5.00 achievement',
    title_bn = 'SSC ২০২৫-এ জিপিএ ৫.০০ অর্জনে কৃতী শিক্ষার্থী সংবর্ধনা'
where public_id = 'rahatverse/ssc-songbordhona'
  and (title is null or btrim(title) in ('Merit Ceremony'));

-- Shantichakra recognition crest
update public.images
set title = 'Recognition crest from Shantichakra Blood Society',
    title_bn = 'শান্তিচক্র ব্লাড সোসাইটির সম্মাননা ক্রেস্ট'
where public_id = 'rahatverse/ssc-crest-shantichakra'
  and (title is null or btrim(title) in ('Shantichakra Crest'));

-- Blood society field activity
update public.images
set title = 'Shantichakra Blood Society volunteer activity',
    title_bn = 'শান্তিচক্র ব্লাড সোসাইটির স্বেচ্ছাসেবী কার্যক্রম'
where public_id = 'rahatverse/shantichakra-blood-society'
  and (title is null or btrim(title) in ('Blood Society'));

-- Science fairs
update public.images
set title = '46th National Science Fair 2025',
    title_bn = '৪৬তম জাতীয় বিজ্ঞান মেলা ২০২৫'
where public_id = 'rahatverse/46-science-fair-2025'
  and (title is null or btrim(title) in ('46th Science Fair'));

update public.images
set title = '44th National Science Exhibition 2024',
    title_bn = '৪৪তম জাতীয় বিজ্ঞান প্রদর্শনী ২০২৪'
where public_id = 'rahatverse/44-science-fair-2024'
  and (title is null or btrim(title) in ('44th Science Fair'));

update public.images
set title = '45th National Science Fair 2023',
    title_bn = '৪৫তম জাতীয় বিজ্ঞান মেলা ২০২৩'
where public_id = 'rahatverse/45-science-fair-2023'
  and (title is null or btrim(title) in ('45th Science Fair'));

update public.images
set title = '42nd National Science Fair 2020',
    title_bn = '৪২তম জাতীয় বিজ্ঞান মেলা ২০২০'
where public_id = 'rahatverse/42-science-fair-2020'
  and (title is null or btrim(title) in ('42nd Science Fair'));

-- Creative Talent Search
update public.images
set title = 'Creative Talent Search 2024',
    title_bn = 'সৃজনশীল মেধা অন্বেষণ ২০২৪'
where public_id = 'rahatverse/srijonshil-medha-2024'
  and (title is null or btrim(title) in ('Creative Talent'));

-- FS Coaching Center
update public.images
set title = 'FS Coaching Center, Jibdara Bazar',
    title_bn = 'জীবদাড়া বাজারে FS কোচিং সেন্টার'
where public_id = 'rahatverse/fs-coaching-center'
  and (title is null or btrim(title) in ('FS Coaching', 'FS Coaching Center'));

-- Helping Hand volunteer activity
update public.images
set title = 'Helping Hand Organization volunteer activity',
    title_bn = 'হেল্পিং হ্যান্ড অর্গানাইজেশনের স্বেচ্ছাসেবী কার্যক্রম'
where public_id = 'rahatverse/helping-hand-org'
  and (title is null or btrim(title) in ('Helping Hand', 'Helping Hand Organization'));

-- Profile photos
update public.images
set title = 'Rahat Ahmed profile photo',
    title_bn = 'রাহাত আহমেদের প্রোফাইল ছবি'
where public_id in ('rahatverse/profile', 'profile')
  and (title is null or btrim(title) in ('Profile Photo', 'About profile photo'));

-- Memorial: father's portrait
update public.images
set title = 'Portrait of Late Md. Farid Ahmed',
    title_bn = 'মরহুম জনাব ফরিদ আহমেদের প্রতিকৃতি'
where public_id = 'rahatverse/father-photo'
  and (title is null or btrim(title) in ('Father Photo'));

-- Shantichakra logo
update public.images
set title = 'Shantichakra Blood Society logo',
    title_bn = 'শান্তিচক্র ব্লাড সোসাইটির লোগো'
where public_id in ('rahatverse/shantichakra-logo', 'shantichakra-logo')
  and (title is null or btrim(title) in ('Shantichakra Logo'));

-- Memorial: Rahat with his late father
update public.images
set title = 'Rahat Ahmed with his late father, Md. Farid Ahmed',
    title_bn = 'শ্রদ্ধেয় পিতা মোঃ ফরিদ আহমেদের সাথে রাহাত আহমেদ'
where public_id like 'rahatverse/memorial/%'
  and (title is null or btrim(title) in ('With Father'));
