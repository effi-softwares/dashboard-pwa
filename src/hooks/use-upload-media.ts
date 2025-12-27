"use client"

import { useMutation } from "@tanstack/react-query"
import { upload } from "@vercel/blob/client"

type UploadOptions = {
  onProgress?: (progress: number) => void
}

type UploadResult = {
  url: string
  pathname: string
  size: number
  contentType: string
  width?: number
  height?: number
  blurDataURL?: string | null
}

async function generateBlurDataURL(file: File): Promise<string | null> {
  if (!file.type.startsWith("image/")) return null

  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const aspectRatio = img.width / img.height
        const width = 10
        const height = Math.round(width / aspectRatio)
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          resolve(null)
          return
        }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL("image/webp", 0.1))
      }
      img.onerror = () => resolve(null)
      img.src = e.target?.result as string
    }
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(file)
  })
}

async function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number } | undefined> {
  if (!file.type.startsWith("image/")) return undefined

  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => resolve(undefined)
      img.src = e.target?.result as string
    }
    reader.onerror = () => resolve(undefined)
    reader.readAsDataURL(file)
  })
}

export function useUploadMedia(options?: UploadOptions) {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadResult> => {
      // Generate blur placeholder before upload
      const [blurDataURL, dimensions] = await Promise.all([
        generateBlurDataURL(file),
        getImageDimensions(file),
      ])

      // Upload to Vercel Blob via client SDK
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/uploads/generate-url",
        onUploadProgress: event => {
          if (options?.onProgress && event.total) {
            const progress = (event.loaded / event.total) * 100
            options.onProgress(progress)
          }
        },
      })

      return {
        url: blob.url,
        pathname: blob.pathname,
        size: file.size, // Use file size as blob.size may not exist
        contentType: blob.contentType,
        width: dimensions?.width,
        height: dimensions?.height,
        blurDataURL,
      }
    },
  })
}
