"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Upload } from "lucide-react"

interface ImageData {
  id: string
  public_id: string
  url: string
  category: string
  title: string | null
  description: string | null
  width: number | null
  height: number | null
  format: string | null
  size: number | null
  created_at: string
  updated_at: string
}

export default function ImageUploadManager() {
  const [images, setImages] = useState<ImageData[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Upload form state
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const fetchImages = async () => {
    setLoading(true)
    try {
      const url = selectedCategory === "all" 
        ? "/api/upload"
        : `/api/upload?category=${selectedCategory}`
      
      const res = await fetch(url)
      const data = await res.json()
      
      if (data.images) {
        setImages(data.images)
      }
    } catch (error) {
      console.error("Failed to fetch images:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchImages()
  }, [selectedCategory])

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!file || !category) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("category", category)
      formData.append("title", title)
      formData.append("description", description)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        await fetchImages()

        // Reset form
        setFile(null)
        setCategory("")
        setTitle("")
        setDescription("")
      } else {
        console.error("Upload failed:", data.error)
      }
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, publicId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const res = await fetch(`/api/upload?id=${id}&public_id=${encodeURIComponent(publicId)}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (data.success) {
        await fetchImages()
      } else {
        console.error("Delete failed:", data.error)
      }
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const categories = [
    { value: "profile", label: "Profile" },
    { value: "logo", label: "Logo" },
    { value: "memorial", label: "Memorial" },
    { value: "achievements", label: "Achievements" },
    { value: "blood-donation", label: "Blood Donation" },
    { value: "experience", label: "Experience" },
    { value: "social-service", label: "Social Service" },
  ]

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Upload New Image</h3>
        <p className="text-sm text-muted-foreground mb-4">Upload images to Cloudinary for use in your portfolio</p>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <Label htmlFor="file">Image File</Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Image title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Image description"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={uploading}>
            {uploading ? (
              <>Uploading...</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Image Gallery */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Image Gallery</h3>
            <p className="text-sm text-muted-foreground">Manage your uploaded images</p>
          </div>
          <select
            value={selectedCategory}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
            className="flex h-10 w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No images found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg border bg-card"
              >
                <Image
                  src={image.url}
                  alt={image.title || image.public_id}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div>
                    <p className="text-white text-sm font-medium truncate">
                      {image.title || image.public_id}
                    </p>
                    <p className="text-white/70 text-xs">{image.category}</p>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(image.id, image.public_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
