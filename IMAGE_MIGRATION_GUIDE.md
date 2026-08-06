# 📸 Image Migration Guide

## Phase 19: Image Migration Infrastructure

This phase sets up the Cloudinary infrastructure for managing images.

## ✅ What's Been Done:

1. ✅ Installed `next-cloudinary` package
2. ✅ Created Cloudinary utilities (`src/lib/cloudinary/images.ts`)
3. ✅ Created image data configuration (`scripts/image-data.js`)
4. ✅ Updated `ProfileImage` component to use Cloudinary
5. ✅ Added Cloudinary credentials to `.env.local`

## 📋 What You Need to Do:

### Step 1: Upload Images to Cloudinary

You need to manually upload 14 images to your Cloudinary account:

1. **Go to Cloudinary Dashboard**: https://cloudinary.com/console
2. **Upload images** with the following public IDs (in `rahatverse` folder):

| Image | Public ID | Source |
|-------|-----------|--------|
| Profile Photo | `rahatverse/profile` | Download from old site |
| Shantichakra Logo | `rahatverse/shantichakra-logo` | Download from old site |
| Father's Photo | `rahatverse/father-photo` | Download from old site |
| SSC 2025 | `rahatverse/ssc-2025` | Download from old site |
| SSC Songbordhona | `rahatverse/ssc-songbordhona` | Download from old site |
| SSC Crest | `rahatverse/ssc-crest-shantichakra` | Download from old site |
| Shantichakra Activities | `rahatverse/shantichakra-blood-society` | Download from old site |
| 46th Science Fair | `rahatverse/46-science-fair-2025` | Download from old site |
| 45th Science Fair | `rahatverse/45-science-fair-2023` | Download from old site |
| 44th Science Fair | `rahatverse/44-science-fair-2024` | Download from old site |
| 42nd Science Fair | `rahatverse/42-science-fair-2020` | Download from old site |
| Srijonshil Medha | `rahatverse/srijonshil-medha-2024` | Download from old site |
| FS Coaching Center | `rahatverse/fs-coaching-center` | Download from old site |
| Helping Hand Org | `rahatverse/helping-hand-org` | Download from old site |

### Step 2: Download Images from Old Site

Download these images from: https://rahatahmedbd.github.io/

- Profile: https://rahatahmedbd.github.io/assets/images/profile.jpg
- Logo: https://rahatahmedbd.github.io/assets/images/logo.png
- Father: https://rahatahmedbd.github.io/assets/images/baba-farid-ahmed.jpg
- Gallery images: All images from the gallery section

### Step 3: Verify Upload

After uploading, test that images are accessible:
- Visit: https://res.cloudinary.com/kbc3dfnj/image/upload/rahatverse/profile.jpg
- Should show your profile image

## 🔧 Technical Details:

### Cloudinary Configuration:
- **Cloud Name**: kbc3dfnj
- **Upload Preset**: rahatverse
- **Folder**: rahatverse

### Image URLs Format:
```
https://res.cloudinary.com/{cloud-name}/image/upload/{transformations}/{public-id}
```

### Example:
```
https://res.cloudinary.com/kbc3dfnj/image/upload/w_400,h_400,c_fill/rahatverse/profile.jpg
```

## 📦 Next Steps:

After uploading images:
1. Test the live site to verify images load
2. Update gallery component to use Cloudinary images (Phase 21)
3. Update memorial section with father's photo (Phase 20)

## 🎯 Phase 19 Completion Criteria:

- [x] Cloudinary infrastructure set up
- [x] Image utilities created
- [x] ProfileImage component updated
- [ ] Images uploaded to Cloudinary (manual step)
- [ ] Build validation passed
- [ ] Deployed to Vercel
- [ ] Live site verified

---

**Note**: This phase focuses on infrastructure. The actual image uploads are a manual step that requires access to the old website images.
