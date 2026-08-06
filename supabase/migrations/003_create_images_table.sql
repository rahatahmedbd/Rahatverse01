-- Images table for storing Cloudinary image metadata
create table if not exists public.images (
  id uuid default uuid_generate_v4() primary key,
  public_id text not null unique,
  url text not null,
  category text not null,
  title text,
  title_bn text,
  description text,
  description_bn text,
  width integer,
  height integer,
  format text,
  size integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index for faster queries
create index if not exists idx_images_category on public.images(category);
create index if not exists idx_images_public_id on public.images(public_id);

-- Enable RLS
alter table public.images enable row level security;

-- Policies: Anyone can read, only admins can write
create policy "Images are viewable by everyone"
  on public.images for select
  using (true);

create policy "Only admins can insert images"
  on public.images for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can update images"
  on public.images for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Only admins can delete images"
  on public.images for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Insert predefined image records
insert into public.images (public_id, url, category, title, title_bn, description, description_bn) values
  ('rahatverse/profile', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/profile', 'profile', 'Profile Photo', 'প্রোফাইল ছবি', 'Rahat Ahmed profile photo', 'রাহাত আহমেদের প্রোফাইল ছবি'),
  ('rahatverse/shantichakra-logo', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/shantichakra-logo', 'logo', 'Shantichakra Logo', 'শান্তিচক্র লোগো', 'Shantichakra Blood Society logo', 'শান্তিচক্র ব্লাড সোসাইটির লোগো'),
  ('rahatverse/father-photo', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/father-photo', 'memorial', 'Father Photo', 'বাবার ছবি', 'Late Md. Farid Ahmed', 'মরহুম জনাব ফরিদ আহমেদ'),
  ('rahatverse/ssc-2025', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/ssc-2025', 'achievements', 'SSC 2025', 'এসএসসি ২০২৫', 'SSC 2025 GPA 5.00 A+ achievement', 'এসএসসি ২০২৫ জিপিএ ৫.০০ এ+ অর্জন'),
  ('rahatverse/ssc-songbordhona', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/ssc-songbordhona', 'achievements', 'Merit Ceremony', 'মেধা সংবর্ধনা', 'Meritorious Student Honor Ceremony', 'কৃতী শিক্ষার্থী সংবর্ধনা'),
  ('rahatverse/ssc-crest-shantichakra', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/ssc-crest-shantichakra', 'achievements', 'Shantichakra Crest', 'শান্তিচক্র ক্রেস্ট', 'Recognition crest from Shantichakra', 'শান্তিচক্র সম্মাননা ক্রেস্ট'),
  ('rahatverse/shantichakra-blood-society', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/shantichakra-blood-society', 'blood-donation', 'Blood Society', 'রক্ত সংগঠন', 'Shantichakra Blood Society activities', 'শান্তিচক্র ব্লাড সোসাইটি কার্যক্রম'),
  ('rahatverse/46-science-fair-2025', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/46-science-fair-2025', 'achievements', '46th Science Fair', '৪৬তম বিজ্ঞান মেলা', '46th National Science Fair 2025', '৪৬তম জাতীয় বিজ্ঞান মেলা ২০২৫'),
  ('rahatverse/srijonshil-medha-2024', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/srijonshil-medha-2024', 'achievements', 'Creative Talent', 'সৃজনশীল মেধা', 'Creative Talent Search 2024', 'সৃজনশীল মেধা অন্বেষণ ২০২৪'),
  ('rahatverse/44-science-fair-2024', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/44-science-fair-2024', 'achievements', '44th Science Fair', '৪৪তম বিজ্ঞান মেলা', '44th National Science Exhibition 2024', '৪৪তম বিজ্ঞান প্রদর্শনী ২০২৪'),
  ('rahatverse/45-science-fair-2023', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/45-science-fair-2023', 'achievements', '45th Science Fair', '৪৫তম বিজ্ঞান মেলা', '45th National Science Fair 2023', '৪৫তম জাতীয় বিজ্ঞান মেলা ২০২৩'),
  ('rahatverse/42-science-fair-2020', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/42-science-fair-2020', 'achievements', '42nd Science Fair', '৪২তম বিজ্ঞান মেলা', '42nd National Science Fair 2020', '৪২তম জাতীয় বিজ্ঞান মেলা ২০২০'),
  ('rahatverse/fs-coaching-center', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/fs-coaching-center', 'experience', 'FS Coaching', 'এফএস কোচিং', 'FS Coaching Center', 'এফএস কোচিং সেন্টার'),
  ('rahatverse/helping-hand-org', 'https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/helping-hand-org', 'social-service', 'Helping Hand', 'হেল্পিং হ্যান্ড', 'Helping Hand Organization', 'হেল্পিং হ্যান্ড অর্গানাইজেশন');
