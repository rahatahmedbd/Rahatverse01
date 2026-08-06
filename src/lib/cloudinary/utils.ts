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
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
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
