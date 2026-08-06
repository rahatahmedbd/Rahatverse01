#!/usr/bin/env node

/**
 * Pre-populated Image Data
 * These are the Cloudinary URLs that will be used
 * User needs to manually upload images to Cloudinary with these public IDs
 */

const imageData = [
  {
    id: 'profile',
    public_id: 'rahatverse/profile',
    description: 'Profile photo of Rahat Ahmed',
    category: 'profile',
    alt_bn: 'রাহাত আহমেদের প্রোফাইল ছবি',
    alt_en: 'Profile photo of Rahat Ahmed'
  },
  {
    id: 'shantichakra-logo',
    public_id: 'rahatverse/shantichakra-logo',
    description: 'Shantichakra Blood Society logo',
    category: 'logo',
    alt_bn: 'শান্তিচক্র ব্লাড সোসাইটির লোগো',
    alt_en: 'Shantichakra Blood Society logo'
  },
  {
    id: 'father-photo',
    public_id: 'rahatverse/father-photo',
    description: 'Late Md. Farid Ahmed - Father',
    category: 'memorial',
    alt_bn: 'মরহুম জনাব ফরিদ আহমেদ - পিতা',
    alt_en: 'Late Md. Farid Ahmed - Father'
  },
  {
    id: 'ssc-2025',
    public_id: 'rahatverse/ssc-2025',
    description: 'SSC 2025 GPA 5.00 A+ achievement',
    category: 'achievements',
    alt_bn: 'SSC ২০২৫ — জিপিএ ৫.০০ (A+) অর্জন',
    alt_en: 'SSC 2025 GPA 5.00 A+ achievement'
  },
  {
    id: 'ssc-songbordhona',
    public_id: 'rahatverse/ssc-songbordhona',
    description: 'Meritorious Student Honor Ceremony',
    category: 'achievements',
    alt_bn: 'কৃতী শিক্ষার্থী সংবর্ধনা',
    alt_en: 'Meritorious Student Honor Ceremony'
  },
  {
    id: 'ssc-crest-shantichakra',
    public_id: 'rahatverse/ssc-crest-shantichakra',
    description: 'Recognition crest from Shantichakra Blood Society',
    category: 'achievements',
    alt_bn: 'শান্তিচক্র সম্মাননা ক্রেস্ট',
    alt_en: 'Recognition crest from Shantichakra Blood Society'
  },
  {
    id: 'shantichakra-blood-society',
    public_id: 'rahatverse/shantichakra-blood-society',
    description: 'Shantichakra Blood Society activities',
    category: 'blood-donation',
    alt_bn: 'শান্তিচক্র ব্লাড সোসাইটি কার্যক্রম',
    alt_en: 'Shantichakra Blood Society activities'
  },
  {
    id: '46-science-fair-2025',
    public_id: 'rahatverse/46-science-fair-2025',
    description: '46th National Science Fair 2025',
    category: 'achievements',
    alt_bn: '৪৬তম বিজ্ঞান মেলা ২০২৫',
    alt_en: '46th National Science Fair 2025'
  },
  {
    id: 'srijonshil-medha-2024',
    public_id: 'rahatverse/srijonshil-medha-2024',
    description: 'Creative Talent Search Competition 2024',
    category: 'achievements',
    alt_bn: 'সৃজনশীল মেধা অন্বেষণ ২০২৪',
    alt_en: 'Creative Talent Search Competition 2024'
  },
  {
    id: '44-science-fair-2024',
    public_id: 'rahatverse/44-science-fair-2024',
    description: '44th National Science Exhibition 2024',
    category: 'achievements',
    alt_bn: '৪৪তম বিজ্ঞান প্রদর্শনী ২০২৪',
    alt_en: '44th National Science Exhibition 2024'
  },
  {
    id: '45-science-fair-2023',
    public_id: 'rahatverse/45-science-fair-2023',
    description: '45th National Science Fair 2023',
    category: 'achievements',
    alt_bn: '৪৫তম বিজ্ঞান মেলা ২০২৩',
    alt_en: '45th National Science Fair 2023'
  },
  {
    id: '42-science-fair-2020',
    public_id: 'rahatverse/42-science-fair-2020',
    description: '42nd National Science Fair 2020',
    category: 'achievements',
    alt_bn: '৪২তম বিজ্ঞান মেলা ২০২০',
    alt_en: '42nd National Science Fair 2020'
  },
  {
    id: 'fs-coaching-center',
    public_id: 'rahatverse/fs-coaching-center',
    description: 'FS Coaching Center at Jibdara Bazar',
    category: 'experience',
    alt_bn: 'জীবদাড়া বাজারে FS কোচিং সেন্টার',
    alt_en: 'FS Coaching Center at Jibdara Bazar'
  },
  {
    id: 'helping-hand-org',
    public_id: 'rahatverse/helping-hand-org',
    description: 'Helping Hand Organization activities',
    category: 'social-service',
    alt_bn: 'হেল্পিং হ্যান্ড অর্গানাইজেশন কার্যক্রম',
    alt_en: 'Helping Hand Organization activities'
  }
];

console.log('📸 Image Migration Data');
console.log('=======================\n');
console.log('Upload these images to Cloudinary with the following public IDs:\n');

imageData.forEach((img, index) => {
  console.log(`${index + 1}. ${img.id}`);
  console.log(`   Public ID: ${img.public_id}`);
  console.log(`   Description: ${img.description}`);
  console.log(`   Category: ${img.category}`);
  console.log('');
});

console.log(`\nTotal images: ${imageData.length}`);
console.log('\nInstructions:');
console.log('1. Go to Cloudinary Dashboard');
console.log('2. Upload each image to the "rahatverse" folder');
console.log('3. Use the public_id format: rahatverse/{image-id}');
console.log('4. After uploading, update components to use Cloudinary URLs');

// Export for use in other scripts
module.exports = imageData;
