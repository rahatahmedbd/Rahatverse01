# Image migration guide

## Purpose

RahatVerse serves portfolio media from Cloudinary and stores image metadata in Supabase. The gallery, profile image, and memorial image use the public IDs declared in:

`src/lib/cloudinary/utils.ts`

## Required Cloudinary uploads

Upload the following assets to the `rahatverse` folder in Cloudinary using these exact public IDs:

| Asset | Public ID |
|---|---|
| Profile photo | `rahatverse/profile` |
| Shantichakra logo | `rahatverse/shantichakra-logo` |
| Late Md. Farid Ahmed’s photo | `rahatverse/father-photo` |
| SSC 2025 achievement | `rahatverse/ssc-2025` |
| SSC honour ceremony | `rahatverse/ssc-songbordhona` |
| Shantichakra crest | `rahatverse/ssc-crest-shantichakra` |
| Shantichakra activities | `rahatverse/shantichakra-blood-society` |
| 46th Science Fair | `rahatverse/46-science-fair-2025` |
| Creative Talent Search | `rahatverse/srijonshil-medha-2024` |
| 44th Science Exhibition | `rahatverse/44-science-fair-2024` |
| 45th Science Fair | `rahatverse/45-science-fair-2023` |
| 42nd Science Fair | `rahatverse/42-science-fair-2020` |
| FS Coaching Center | `rahatverse/fs-coaching-center` |
| Helping Hand Organization | `rahatverse/helping-hand-org` |

## Source material

The legacy public site contains the approved historic media:

- https://rahatahmedbd.github.io/assets/images/profile.jpg
- https://rahatahmedbd.github.io/assets/images/logo.png
- https://rahatahmedbd.github.io/assets/images/baba-farid-ahmed.jpg

Only upload media that you own or have permission to use.

## Vercel configuration

Set the following environment variables for **Production**, **Preview**, and local development as appropriate:

```text
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Without a Cloudinary cloud name, RahatVerse now renders an accessible fallback instead of failing the page. The actual media will appear only after Cloudinary is configured and the public ID exists.

## Verification

1. Deploy after setting the variables.
2. Open `/bn`, `/bn/experience`, and `/bn/gallery`.
3. Verify the profile image, memorial portrait, and gallery assets load.
4. As an admin, upload one test image smaller than 10 MB in JPEG, PNG, WebP, or AVIF format.
5. Confirm a non-admin cannot upload or delete media.
