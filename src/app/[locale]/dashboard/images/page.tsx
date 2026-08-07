import ImageUploadManager from "@/components/admin/ImageUploadManager";

// ── Image Management Page ──────────────────────────────
export default function ImagesPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-heading-md font-bold">Image Management</h1>
        <p className="mt-2 text-muted-foreground">
          Upload and manage images for your portfolio
        </p>
      </div>
      <ImageUploadManager />
    </>
  );
}
