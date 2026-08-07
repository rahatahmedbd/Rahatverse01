/* eslint-disable */
/**
 * RahatVerse — Automatic Cloudinary Image Migration Script
 * 
 * This script uploads all 14 images from https://rahatahmedbd.github.io/
 * to your Cloudinary account (kbc3dfnj) under the exact public IDs
 * expected by the RahatVerse website.
 * 
 * Usage:
 *   node scripts/upload-to-cloudinary.js
 */

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'kbc3dfnj',
  api_key: process.env.CLOUDINARY_API_KEY || '313952973845476',
  api_secret: process.env.CLOUDINARY_API_SECRET || '3HOZ1VLD0ibbWjp1hoObAlOJo3c'
});

const IMAGES_TO_MIGRATE = [
  {
    url: 'https://rahatahmedbd.github.io/assets/images/profile.jpg',
    public_id: 'rahatverse/profile',
    title: 'রাহাত আহমেদের প্রোফাইল ছবি / Rahat Ahmed Profile',
  },
  {
    url: 'https://rahatahmedbd.github.io/assets/images/logo.png',
    public_id: 'rahatverse/shantichakra-logo',
    title: 'শান্তিচক্র ব্লাড সোসাইটি লোগো / Shantichakra Blood Society Logo',
  },
  {
    url: 'https://rahatahmedbd.github.io/assets/images/baba-farid-ahmed.jpg',
    public_id: 'rahatverse/father-photo',
    title: 'মরহুম জনাব ফরিদ আহমেদ / Late Md. Farid Ahmed',
  },
  {
    url: 'https://rahatahmedbd.github.io/assets/images/ssc-gpa5-2025.jpg',
    public_id: 'rahatverse/ssc-2025',
    title: 'SSC 2025 — GPA 5.00 (A+)',
  },
  {
    url: 'https://rahatahmedbd.github.io/assets/images/ssc-songbordhona-2025.jpg',
    public_id: 'rahatverse/ssc-songbordhona',
    title: 'কৃতী শিক্ষার্থী সংবর্ধনা ২০২৫ / Meritorious Student Honor 2025',
  },
  {
    url: 'https://rahatahmedbd.github.io/assets/images/ssc-crest-shantichakra.jpg',
    public_id: 'rahatverse/ssc-crest-shantichakra',
    title: 'শান্তিচক্র সম্মাননা ক্রেস্ট / Shantichakra Recognition Crest',
  },
  {
    url: 'https://rahatahmedbd.github.io/assets/images/shantichakra-blood-society.jpg',
    public_id: 'rahatverse/shantichakra-blood-society',
    title: 'শান্তিচক্র ব্লাড সোসাইটি কার্যক্রম / Shantichakra Blood Society Activities',
  },
  {
    url: 'https://rahatahmedbd.github.io/assets/images/46-science-fair-2025.jpg',
    public_id: 'rahatverse/46-science-fair-2025',
    title: '৪৬তম বিজ্ঞান মেলা ২০২৫ / 46th National Science Fair 2025',
  },
  {
    url: 'https://rahatahmedbd.github.io/assets/images/45-science-fair-2023.jpg',
    public_id: 'rahatverse/45-science-fair-2023',
    title: '৪৫তম বিজ্ঞান মেলা ২০২৩ / 45th National Science Fair 2023',
  },
  {
    url: 'https://rahatahmedbd.github.io/assets/images/44-science-fair-2024.jpg',
    public_id: 'rahatverse/44-science-fair-2024',
    title: '৪৪তম বিজ্ঞান প্রদর্শনী ২০২৪ / 44th National Science Exhibition 2024',
  },
  {
    url: 'https://rahatahmedbd.github.io/assets/images/42-science-fair-2020.jpg',
    public_id: 'rahatverse/42-science-fair-2020',
    title: '৪২তম বিজ্ঞান মেলা ২০২০ / 42nd National Science Fair 2020',
  },
  {
    url: 'https://rahatahmedbd.github.io/assets/images/srijonshil-medha-2024.jpg',
    public_id: 'rahatverse/srijonshil-medha-2024',
    title: 'সৃজনশীল মেধা অন্বেষণ ২০২৪ / Creative Talent Search 2024',
  },
  {
    url: 'https://rahatahmedbd.github.io/assets/images/fs-coaching-center.jpg',
    public_id: 'rahatverse/fs-coaching-center',
    title: 'FS কোচিং সেন্টার / FS Coaching Center',
  },
  {
    url: 'https://rahatahmedbd.github.io/assets/images/helping-hand-org.jpg',
    public_id: 'rahatverse/helping-hand-org',
    title: 'হেল্পিং হ্যান্ড অর্গানাইজেশন / Helping Hand Organization',
  },
];

async function migrateImages() {
  console.log('🚀 Starting Cloudinary migration for 14 images to cloud: kbc3dfnj...');
  let successCount = 0;

  for (const item of IMAGES_TO_MIGRATE) {
    try {
      console.log(`[Uploading] ${item.public_id} -> ${item.url}`);
      const res = await cloudinary.uploader.upload(item.url, {
        public_id: item.public_id,
        overwrite: true,
        resource_type: 'image',
      });
      console.log(`  ✅ SUCCESS: ${res.secure_url}`);
      successCount++;
    } catch (err) {
      console.error(`  ❌ ERROR uploading ${item.public_id}:`, err.message || err);
    }
  }

  console.log(`\n🎉 Migration finished! Successfully uploaded ${successCount} / ${IMAGES_TO_MIGRATE.length} images.`);
}

migrateImages();
