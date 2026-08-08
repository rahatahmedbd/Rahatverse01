import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const CATEGORY_PATTERN = /^[a-z0-9-]{1,50}$/;

const DEFAULT_GALLERY_IMAGES = [
  {
    id: "default-1",
    public_id: "rahatverse/ssc-2025",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/ssc-2025",
    category: "achievements",
    title: "SSC 2025 — GPA 5.00 (A+)",
    title_bn: "SSC ২০২৫ — জিপিএ ৫.০০ (A+) অর্জন",
    description: "SSC 2025 GPA 5.00 A+ achievement",
    description_bn: "বিজ্ঞান বিভাগ থেকে জিপিএ ৫.০০ (A+) অর্জন",
  },
  {
    id: "default-2",
    public_id: "rahatverse/ssc-songbordhona",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/ssc-songbordhona",
    category: "achievements",
    title: "Meritorious Student Honor Ceremony",
    title_bn: "কৃতী শিক্ষার্থী সংবর্ধনা",
    description: "Meritorious Student Honor Ceremony",
    description_bn: "কৃতী শিক্ষার্থী সংবর্ধনা ও সম্মাননা স্মারক",
  },
  {
    id: "default-3",
    public_id: "rahatverse/ssc-crest-shantichakra",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/ssc-crest-shantichakra",
    category: "achievements",
    title: "Shantichakra Blood Society Recognition Crest",
    title_bn: "শান্তিচক্র সম্মাননা ক্রেস্ট",
    description: "Recognition crest from Shantichakra Blood Society",
    description_bn: "শান্তিচক্র ব্লাড সোসাইটি কর্তৃক বিশেষ সম্মাননা",
  },
  {
    id: "default-4",
    public_id: "rahatverse/shantichakra-blood-society",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/shantichakra-blood-society",
    category: "blood-donation",
    title: "Shantichakra Blood Society Activities",
    title_bn: "শান্তিচক্র ব্লাড সোসাইটি কার্যক্রম",
    description: "Shantichakra Blood Society activities",
    description_bn: "শান্তিচক্র ব্লাড সোসাইটির স্বেচ্ছাসেবী কার্যক্রম",
  },
  {
    id: "default-5",
    public_id: "rahatverse/46-science-fair-2025",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/46-science-fair-2025",
    category: "achievements",
    title: "46th National Science Fair 2025",
    title_bn: "৪৬তম বিজ্ঞান মেলা ২০২৫",
    description: "46th National Science Fair 2025",
    description_bn: "৪৬তম জাতীয় বিজ্ঞান মেলা ২০২৫-এ অংশগ্রহণ ও পুরস্কার অর্জন",
  },
  {
    id: "default-6",
    public_id: "rahatverse/44-science-fair-2024",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/44-science-fair-2024",
    category: "achievements",
    title: "44th National Science Exhibition 2024",
    title_bn: "৪৪তম বিজ্ঞান প্রদর্শনী ২০২৪",
    description: "44th National Science Exhibition 2024",
    description_bn: "৪৪তম বিজ্ঞান প্রদর্শনী ২০২৪-এ ১ম স্থান অর্জন",
  },
  {
    id: "default-7",
    public_id: "rahatverse/srijonshil-medha-2024",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/srijonshil-medha-2024",
    category: "achievements",
    title: "Creative Talent Search 2024",
    title_bn: "সৃজনশীল মেধা অন্বেষণ ২০২৪",
    description: "Creative Talent Search 2024",
    description_bn: "সৃজনশীল মেধা অন্বেষণ প্রতিযোগিতায় বিজ্ঞান বিভাগে ১ম স্থান",
  },
  {
    id: "default-8",
    public_id: "rahatverse/45-science-fair-2023",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/45-science-fair-2023",
    category: "achievements",
    title: "45th National Science Fair 2023",
    title_bn: "৪৫তম বিজ্ঞান মেলা ২০২৩",
    description: "45th National Science Fair 2023",
    description_bn: "৪৫তম জাতীয় বিজ্ঞান মেলায় ১ম স্থান অর্জন",
  },
  {
    id: "default-9",
    public_id: "rahatverse/42-science-fair-2020",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/42-science-fair-2020",
    category: "achievements",
    title: "42nd National Science Fair 2020",
    title_bn: "৪২তম বিজ্ঞান মেলা ২০২০",
    description: "42nd National Science Fair 2020",
    description_bn: "৪২তম জাতীয় বিজ্ঞান মেলায় ১ম স্থান অর্জন",
  },
  {
    id: "default-10",
    public_id: "rahatverse/fs-coaching-center",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/fs-coaching-center",
    category: "experience",
    title: "FS Coaching Center",
    title_bn: "FS কোচিং সেন্টার",
    description: "FS Coaching Center at Jibdara Bazar",
    description_bn: "জীবদাড়া বাজারে FS কোচিং সেন্টার পরিচালনা",
  },
  {
    id: "default-11",
    public_id: "rahatverse/helping-hand-org",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/helping-hand-org",
    category: "social-service",
    title: "Helping Hand Organization",
    title_bn: "হেল্পিং হ্যান্ড অর্গানাইজেশন",
    description: "Helping Hand Organization activities",
    description_bn: "হেল্পিং হ্যান্ড অর্গানাইজেশনের স্বেচ্ছাসেবী কার্যক্রম",
  },
  {
    id: "default-12",
    public_id: "rahatverse/father-photo",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/father-photo",
    category: "memorial",
    title: "Late Md. Farid Ahmed — Beloved Father",
    title_bn: "মরহুম জনাব ফরিদ আহমেদ — শ্রদ্ধেয় পিতা",
    description: "Late Md. Farid Ahmed",
    description_bn: "মরহুম জনাব ফরিদ আহমেদ — আমার শ্রদ্ধেয় পিতা",
  },
  {
    id: "default-13",
    public_id: "rahatverse/shantichakra-logo",
    url: "https://res.cloudinary.com/kbc3dfnj/image/upload/q_auto,f_auto/rahatverse/shantichakra-logo",
    category: "logo",
    title: "Shantichakra Blood Society Logo",
    title_bn: "শান্তিচক্র ব্লাড সোসাইটির লোগো",
    description: "Shantichakra Blood Society official logo",
    description_bn: "শান্তিচক্র ব্লাড সোসাইটির অফিসিয়াল লোগো",
  },
];

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;
    const title = formData.get("title") as string;
    const titleBn = formData.get("title_bn") as string;
    const description = formData.get("description") as string;
    const descriptionBn = formData.get("description_bn") as string;

    if (!(file instanceof File) || !category) {
      return NextResponse.json(
        { error: "File and category are required" },
        { status: 400 }
      );
    }

    if (!CATEGORY_PATTERN.test(category)) {
      return NextResponse.json({ error: "Invalid image category" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type) || file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Upload a JPEG, PNG, WebP, or AVIF image smaller than 10 MB" },
        { status: 400 }
      );
    }

    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json({ error: "Media service unavailable" }, { status: 503 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    interface CloudinaryUploadResult {
      public_id: string;
      secure_url: string;
      width: number;
      height: number;
      format: string;
      bytes: number;
    }

    const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "rahatverse",
            public_id: `${category}/${Date.now()}`,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        )
        .end(buffer);
    });

    // Save to database
    const { data: image, error: dbError } = await supabase
      .from("images")
      .insert({
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
        category,
        title,
        title_bn: titleBn,
        description,
        description_bn: descriptionBn,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.bytes,
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.json(
        { error: "Failed to save image to database", details: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image,
      cloudinary: uploadResult,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const getFallbackImages = () => {
    if (!category || category === "all") return DEFAULT_GALLERY_IMAGES;
    return DEFAULT_GALLERY_IMAGES.filter((img) => img.category === category);
  };

  try {
    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json({ images: getFallbackImages() });
    }

    let query = supabase.from("images").select("*");

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data: images, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error || !images || images.length === 0) {
      return NextResponse.json({ images: getFallbackImages() });
    }

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: getFallbackImages() });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const publicId = searchParams.get("public_id");

    if (!id && !publicId) {
      return NextResponse.json(
        { error: "Image ID or public_id is required" },
        { status: 400 }
      );
    }

    // Get image from database
    let imageId = id;
    if (!imageId && publicId) {
      const { data: image } = await supabase
        .from("images")
        .select("id, public_id")
        .eq("public_id", publicId)
        .single();

      if (!image) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }
      imageId = image.id;
    }

    // Get image details for Cloudinary deletion
    const { data: image } = await supabase
      .from("images")
      .select("public_id")
      .eq("id", imageId)
      .single();

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete from Cloudinary
    if (publicId || image.public_id) {
      await cloudinary.uploader.destroy(publicId || image.public_id);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from("images")
      .delete()
      .eq("id", imageId);

    if (dbError) {
      return NextResponse.json(
        { error: "Failed to delete image from database" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}