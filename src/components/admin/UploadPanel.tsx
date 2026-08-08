"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  Upload,
  UploadCloud,
  ImagePlus,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageData {
  id: string;
  public_id: string;
  url: string;
  category: string;
  title: string | null;
  description: string | null;
  width: number | null;
  height: number | null;
  format: string | null;
  size: number | null;
  created_at: string;
}

const CATEGORIES = [
  { value: "profile", label: "Profile" },
  { value: "logo", label: "Logo" },
  { value: "memorial", label: "Memorial" },
  { value: "achievements", label: "Achievements" },
  { value: "blood-donation", label: "Blood Donation" },
  { value: "experience", label: "Experience" },
  { value: "social-service", label: "Social Service" },
];

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export default function UploadPanel() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [category, setCategory] = useState("achievements");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      if (Array.isArray(data.images)) setImages(data.images);
    } catch {
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchImages();
  }, [fetchImages]);

  // Revoke the object URL when a new file replaces the old preview.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const selectFile = (candidate: File | null | undefined) => {
    if (!candidate) return;
    if (!ALLOWED_TYPES.has(candidate.type)) {
      setMessage({ type: "err", text: "Only JPEG, PNG, WebP, or AVIF images are allowed." });
      return;
    }
    if (candidate.size <= 0 || candidate.size > MAX_BYTES) {
      setMessage({ type: "err", text: "Image must be smaller than 10 MB." });
      return;
    }
    setFile(candidate);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(candidate));
    setMessage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    selectFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !category) return;
    setUploading(true);
    setMessage(null);
    try {
      // 1) Ask the server for a signed-upload payload (secret stays server-side).
      const sigRes = await fetch("/api/cloudinary/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      if (!sigRes.ok) {
        const err = await sigRes.json().catch(() => ({}));
        setMessage({ type: "err", text: err.error || "Failed to prepare upload." });
        return;
      }
      const sig = await sigRes.json();

      // 2) Upload the file DIRECTLY to Cloudinary using the signed payload.
      const form = new FormData();
      form.append("file", file);
      form.append("folder", sig.folder);
      form.append("public_id", sig.public_id);
      form.append("resource_type", sig.resource_type);
      form.append("timestamp", String(sig.timestamp));
      form.append("api_key", sig.api_key);
      form.append("signature", sig.signature);

      const upRes = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(sig.cloud_name)}/image/upload`,
        { method: "POST", body: form }
      );
      const uploaded = await upRes.json();
      if (!upRes.ok) {
        setMessage({ type: "err", text: uploaded.error?.message || "Cloudinary upload failed." });
        return;
      }

      // 3) Persist the returned metadata into the images table.
      const saveRes = await fetch("/api/cloudinary/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id: uploaded.public_id,
          url: uploaded.secure_url,
          category,
          title,
          description,
          width: uploaded.width,
          height: uploaded.height,
          format: uploaded.format,
          bytes: uploaded.bytes,
        }),
      });
      const saved = await saveRes.json();
      if (!saveRes.ok) {
        setMessage({ type: "err", text: saved.error || "Saved to Cloudinary but not to the site DB." });
        return;
      }

      setMessage({ type: "ok", text: "Image uploaded successfully." });
      await fetchImages();
      // Reset form
      setFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setTitle("");
      setDescription("");
    } catch {
      setMessage({ type: "err", text: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, publicId: string) => {
    if (!window.confirm("Delete this image from Cloudinary and the site?")) return;
    try {
      const res = await fetch(`/api/upload?id=${id}&public_id=${encodeURIComponent(publicId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await fetchImages();
      } else {
        setMessage({ type: "err", text: data.error || "Delete failed." });
      }
    } catch {
      setMessage({ type: "err", text: "Delete failed." });
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload form */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Upload New Image</h3>
            <p className="text-sm text-muted-foreground">
              Signed upload — the file goes straight to Cloudinary, your API secret never leaves the server.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={cn(
              "mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
              message.type === "ok"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                : "border-red-500/30 bg-red-500/10 text-red-600"
            )}
          >
            {message.type === "ok" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border/70 bg-card/40 hover:border-primary/40"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => selectFile(e.target.files?.[0])}
            />
            {previewUrl ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-40 w-40 overflow-hidden rounded-xl border border-border/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Upload preview" className="h-full w-full object-cover" />
                </div>
                <p className="text-xs text-muted-foreground">{file?.name}</p>
              </div>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ImagePlus className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Drag & drop an image here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">JPEG, PNG, WebP or AVIF · max 10 MB</p>
              </>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="upload-category">Category</Label>
              <select
                id="upload-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="upload-title">Title</Label>
              <Input
                id="upload-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional title"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="upload-desc">Description</Label>
            <Textarea
              id="upload-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={2}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={!file || uploading} className="gap-2">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading..." : "Upload to Cloudinary"}
            </Button>
            {file && !uploading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFile(null);
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Uploaded images list */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Uploaded Images</h3>
        {loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>
        ) : images.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card"
              >
                <div className="relative h-32 w-full overflow-hidden bg-muted/30">
                  <Image
                    src={img.url}
                    alt={img.title || img.category}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium">{img.title || img.category}</p>
                  <p className="truncate text-xs text-muted-foreground">{img.public_id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(img.id, img.public_id)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                  aria-label="Delete image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
