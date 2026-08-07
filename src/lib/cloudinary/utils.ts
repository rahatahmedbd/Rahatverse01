// ── Cloudinary Utilities ───────────────────────────────

/**
 * Get Cloudinary URL for an image
 */
export function getCloudinaryUrl(publicId: string, options?: {
  width?: number;
  height?: number;
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'avif';
}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "kbc3dfnj";
  const { width, height, quality = 'auto', format = 'auto' } = options || {};
  
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  
  const transformString = transformations.length > 0 
    ? transformations.join(',') + '/' 
    : '';
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${publicId}`;
}

/**
 * Direct fallback mapping from Cloudinary Public IDs to real photos on rahatahmedbd.github.io
 */
export const PUBLIC_ID_TO_GITHUB_URL_MAP: Record<string, string> = {
  'rahatverse/profile': 'https://rahatahmedbd.github.io/assets/images/profile.jpg',
  'rahatverse/shantichakra-logo': 'https://rahatahmedbd.github.io/assets/images/logo.png',
  'rahatverse/father-photo': 'https://rahatahmedbd.github.io/assets/images/baba-farid-ahmed.jpg',
  'rahatverse/ssc-2025': 'https://rahatahmedbd.github.io/assets/images/ssc-gpa5-2025.jpg',
  'rahatverse/ssc-songbordhona': 'https://rahatahmedbd.github.io/assets/images/ssc-songbordhona-2025.jpg',
  'rahatverse/ssc-crest-shantichakra': 'https://rahatahmedbd.github.io/assets/images/ssc-crest-shantichakra.jpg',
  'rahatverse/shantichakra-blood-society': 'https://rahatahmedbd.github.io/assets/images/shantichakra-blood-society.jpg',
  'rahatverse/46-science-fair-2025': 'https://rahatahmedbd.github.io/assets/images/46-science-fair-2025.jpg',
  'rahatverse/45-science-fair-2023': 'https://rahatahmedbd.github.io/assets/images/45-science-fair-2023.jpg',
  'rahatverse/44-science-fair-2024': 'https://rahatahmedbd.github.io/assets/images/44-science-fair-2024.jpg',
  'rahatverse/42-science-fair-2020': 'https://rahatahmedbd.github.io/assets/images/42-science-fair-2020.jpg',
  'rahatverse/srijonshil-medha-2024': 'https://rahatahmedbd.github.io/assets/images/srijonshil-medha-2024.jpg',
  'rahatverse/fs-coaching-center': 'https://rahatahmedbd.github.io/assets/images/fs-coaching-center.jpg',
  'rahatverse/helping-hand-org': 'https://rahatahmedbd.github.io/assets/images/helping-hand-org.jpg',
};

/**
 * Pre-configured image IDs
 */
export const IMAGE_IDS = {
  PROFILE: 'rahatverse/profile',
  SHANTICHAKRA_LOGO: 'rahatverse/shantichakra-logo',
  FATHER_PHOTO: 'rahatverse/father-photo',
  SSC_2025: 'rahatverse/ssc-2025',
  SSC_SONGBORDHONA: 'rahatverse/ssc-songbordhona',
  SSC_CREST: 'rahatverse/ssc-crest-shantichakra',
  SHANTICHAKRA_ACTIVITIES: 'rahatverse/shantichakra-blood-society',
  SCIENCE_FAIR_46: 'rahatverse/46-science-fair-2025',
  SCIENCE_FAIR_45: 'rahatverse/45-science-fair-2023',
  SCIENCE_FAIR_44: 'rahatverse/44-science-fair-2024',
  SCIENCE_FAIR_42: 'rahatverse/42-science-fair-2020',
  SRIJONSHIL_MEDHA: 'rahatverse/srijonshil-medha-2024',
  FS_COACHING: 'rahatverse/fs-coaching-center',
  HELPING_HAND: 'rahatverse/helping-hand-org',
} as const;
