"use client"

import { useState } from "react"

import { BlobImage } from "@/components/ui/blob-image"
import { Button } from "@/components/ui/button"
import { FileUploadWithProgress } from "@/components/ui/file-upload"
import { useUploadMedia } from "@/hooks/use-upload-media"
import { linkVehicleMedia, persistMediaRecord } from "@/server/vehicle-action"

type VehicleImageUploadProps = {
  vehicleId?: string // optional for editing existing vehicles
  onMediaLinked?: (mediaId: string) => void
}

export function VehicleImageUpload({ vehicleId, onMediaLinked }: VehicleImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedMedia, setUploadedMedia] = useState<{
    url: string
    blurDataURL?: string | null
  } | null>(null)
  const [progress, setProgress] = useState(0)

  const uploadMutation = useUploadMedia({
    onProgress: setProgress,
  })

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      // Upload to Blob
      const result = await uploadMutation.mutateAsync(selectedFile)

      // Persist metadata to DB
      const mediaRecord = await persistMediaRecord({
        type: result.contentType.startsWith("video") ? "video" : "image",
        url: result.url,
        pathname: result.pathname,
        mime: result.contentType,
        size: result.size,
        width: result.width,
        height: result.height,
        blurDataURL: result.blurDataURL,
      })

      // Link to vehicle if vehicleId provided
      if (vehicleId) {
        await linkVehicleMedia(vehicleId, mediaRecord.id, "gallery")
        onMediaLinked?.(mediaRecord.id)
      }

      setUploadedMedia({
        url: result.url,
        blurDataURL: result.blurDataURL,
      })
      setSelectedFile(null)
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }

  return (
    <div className="space-y-4">
      <FileUploadWithProgress
        onFileSelect={setSelectedFile}
        progress={progress}
        isUploading={uploadMutation.isPending}
        accept="image/jpeg,image/png,image/webp,image/avif"
        maxSize={10 * 1024 * 1024} // 10MB
      />

      {selectedFile && !uploadedMedia && (
        <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
          {uploadMutation.isPending ? "Uploading..." : "Upload"}
        </Button>
      )}

      {uploadedMedia && (
        <div className="rounded-lg border p-4">
          <p className="mb-2 text-sm font-medium">Uploaded successfully!</p>
          <BlobImage
            src={uploadedMedia.url}
            blurDataURL={uploadedMedia.blurDataURL ?? undefined}
            alt="Uploaded vehicle image"
            width={400}
            height={300}
            className="rounded-md"
          />
        </div>
      )}
    </div>
  )
}
