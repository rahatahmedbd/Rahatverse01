import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const CATEGORY_PATTERN = /^[a-z0-9-]{1,50}$/;

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
  try {
    const supabase = await createClient();
    
    if (!supabase) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabase.from("images").select("*");

    if (category) {
      query = query.eq("category", category);
    }

    const { data: images, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ images: images || [] });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
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