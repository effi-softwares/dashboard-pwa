"use client"

import { useState } from "react"

import { Camera } from "lucide-react"

import { BlobImage } from "@/components/ui/blob-image"
import { FileUploadWithProgress } from "@/components/ui/file-upload"
import { useUploadMedia } from "@/hooks/use-upload-media"

export type onUploadCompleteOptions = {
  id: string
  url: string
  file: File
  blurDataURL?: string | null
}

type SingleImageUploaderProps = {
  label: string
  imageUrl?: string
  blurDataURL?: string | null
  onUploadComplete: ({ id, url, file, blurDataURL }: onUploadCompleteOptions) => void
  isUploading: boolean
}

function SingleImageUploader({
  label,
  imageUrl,
  blurDataURL,
  onUploadComplete,
  isUploading,
}: SingleImageUploaderProps) {
  const [progress, setProgress] = useState(0)

  const uploadMutation = useUploadMedia({
    onProgress: setProgress,
  })

  const handleFileSelect = async (file: File) => {
    setProgress(0)
    try {
      const media = await uploadMutation.mutateAsync(file)
      onUploadComplete({
        id: media.id,
        url: media.url,
        file,
        blurDataURL: media.blurDataURL,
      })
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
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

export default SingleImageUploader
