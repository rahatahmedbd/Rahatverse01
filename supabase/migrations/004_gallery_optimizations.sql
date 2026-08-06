-- Add gallery-specific indexes and constraints
-- This migration enhances the images table for better gallery performance

-- Create index for faster category-based queries
CREATE INDEX IF NOT EXISTS idx_images_gallery_category ON public.images(category);

-- Create index for faster date-based sorting
CREATE INDEX IF NOT EXISTS idx_images_created_at ON public.images(created_at DESC);

-- Add check constraint for valid categories (optional, for data integrity)
-- Note: This is optional since categories can be extended
-- ALTER TABLE public.images ADD CONSTRAINT chk_valid_category 
-- CHECK (category IN ('profile', 'logo', 'memorial', 'achievements', 'blood-donation', 'experience', 'social-service'));

-- Add comments for documentation
COMMENT ON COLUMN public.images.category IS 'Category of the image for gallery organization';
COMMENT ON COLUMN public.images.title IS 'English title of the image';
COMMENT ON COLUMN public.images.title_bn IS 'Bengali title of the image';
COMMENT ON COLUMN public.images.description IS 'English description of the image';
COMMENT ON COLUMN public.images.description_bn IS 'Bengali description of the image';

-- Grant SELECT permission to authenticated users (already granted via RLS)
-- This ensures gallery images can be fetched efficiently
GRANT SELECT ON public.images TO authenticated;
