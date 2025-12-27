"use client"

import { useState } from "react"
import { UseFormReturn } from "react-hook-form"

import { Camera } from "lucide-react"

import { BlobImage } from "@/components/ui/blob-image"
import { FileUploadWithProgress } from "@/components/ui/file-upload"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useUploadMedia } from "@/hooks/use-upload-media"
import { persistMediaRecord } from "@/server/vehicle-action"
import { VehicleImagesInput } from "@/zod/vehicle-form"

type ImageUploadSectionProps = {
  label: string
  imageUrl?: string
  blurDataURL?: string | null
  onUploadComplete: (mediaId: string, url: string, blurDataURL?: string | null) => void
  isUploading: boolean
}

function ImageUploadSection({
  label,
  imageUrl,
  blurDataURL,
  onUploadComplete,
  isUploading,
}: ImageUploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)

  const uploadMutation = useUploadMedia({
    onProgress: setProgress,
  })

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    setProgress(0)
    try {
      const result = await uploadMutation.mutateAsync(file)
      const mediaRecord = await persistMediaRecord({
        type: "image",
        url: result.url,
        pathname: result.pathname,
        mime: result.contentType,
        size: result.size,
        width: result.width,
        height: result.height,
        blurDataURL: result.blurDataURL,
      })

      onUploadComplete(mediaRecord.id, mediaRecord.url, mediaRecord.blurDataURL)
      setSelectedFile(null)
      setProgress(0)
    } catch (error) {
      console.error("Upload failed:", error)
      setSelectedFile(null)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Camera className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">{label}</h3>
      </div>

      {imageUrl ? (
        <div className="space-y-2">
          <div className="relative rounded-lg border overflow-hidden bg-muted">
            <BlobImage
              src={imageUrl}
              blurDataURL={blurDataURL ?? undefined}
              alt={label}
              width={400}
              height={300}
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
          <p className="text-sm text-muted-foreground">✓ Image uploaded</p>
        </div>
      ) : (
        <FileUploadWithProgress
          onFileSelect={handleFileSelect}
          progress={progress}
          isUploading={uploadMutation.isPending || isUploading}
          accept="image/jpeg,image/png,image/webp,image/avif"
          maxSize={10 * 1024 * 1024} // 10MB
        />
      )}
    </div>
  )
}

type ImagesFormProps = {
  form: UseFormReturn<VehicleImagesInput>
}

function ImagesForm({ form }: ImagesFormProps) {
  const [uploadingCount, setUploadingCount] = useState(0)
  const [uploadedImages, setUploadedImages] = useState<{
    front?: { mediaId: string; url: string; blurDataURL?: string | null }
    back?: { mediaId: string; url: string; blurDataURL?: string | null }
    interior?: { mediaId: string; url: string; blurDataURL?: string | null }
  }>({})

  const handleUploadComplete = (
    type: "front" | "back" | "interior",
    mediaId: string,
    url: string,
    blurDataURL?: string | null,
  ) => {
    setUploadedImages(prev => ({
      ...prev,
      [type]: { mediaId, url, blurDataURL },
    }))

    if (type === "front") {
      form.setValue("frontImageUrl", url)
      form.setValue("frontImageId", mediaId)
    }
    if (type === "back") {
      form.setValue("backImageUrl", url)
      form.setValue("backImageId", mediaId)
    }
    if (type === "interior") {
      form.setValue("interiorImageUrl", url)
      form.setValue("interiorImageId", mediaId)
    }

    setUploadingCount(prev => Math.max(0, prev - 1))
  }

  return (
    <Form {...form}>
      <div className="my-4 drawer-container space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Vehicle Images</h2>
          <p className="text-sm text-muted-foreground">
            Upload high-quality images of the vehicle from different angles. These will be displayed
            to customers.
          </p>
        </div>

        <FormField
          control={form.control}
          name="frontImageUrl"
          render={() => (
            <FormItem>
              <FormLabel>Front View</FormLabel>
              <ImageUploadSection
                label="Front View"
                imageUrl={uploadedImages.front?.url}
                blurDataURL={uploadedImages.front?.blurDataURL}
                onUploadComplete={(id, url, blur) => handleUploadComplete("front", id, url, blur)}
                isUploading={uploadingCount > 0}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="backImageUrl"
          render={() => (
            <FormItem>
              <FormLabel>Back View</FormLabel>
              <ImageUploadSection
                label="Back View"
                imageUrl={uploadedImages.back?.url}
                blurDataURL={uploadedImages.back?.blurDataURL}
                onUploadComplete={(id, url, blur) => handleUploadComplete("back", id, url, blur)}
                isUploading={uploadingCount > 0}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interiorImageUrl"
          render={() => (
            <FormItem>
              <FormLabel>Interior View</FormLabel>
              <ImageUploadSection
                label="Interior View"
                imageUrl={uploadedImages.interior?.url}
                blurDataURL={uploadedImages.interior?.blurDataURL}
                onUploadComplete={(id, url, blur) =>
                  handleUploadComplete("interior", id, url, blur)
                }
                isUploading={uploadingCount > 0}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}

export default ImagesForm
