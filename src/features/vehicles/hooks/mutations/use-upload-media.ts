"use client"

import { useMutation } from "@tanstack/react-query"
import { upload } from "@vercel/blob/client"

import { persistMediaRecord } from "@/server/vehicle-action"

type UploadOptions = {
  onProgress?: (progress: number) => void
}

type UploadResult = {
  id: string
  url: string
  blurDataURL?: string | null
  width?: number
  height?: number
  mime?: string
  size?: number
  pathname?: string
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
        if (!ctx) return resolve(null)

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
      img.onload = () => resolve({ width: img.width, height: img.height })
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
      const [blurDataURL, dimensions] = await Promise.all([
        generateBlurDataURL(file),
        getImageDimensions(file),
      ])

      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/uploads/generate-url",
        onUploadProgress: event => {
          if (options?.onProgress && event.total) {
            options.onProgress((event.loaded / event.total) * 100)
          }
        },
      })

      const media = await persistMediaRecord({
        type: "image",
        url: blob.url,
        pathname: blob.pathname,
        mime: blob.contentType,
        size: file.size,
        width: dimensions?.width,
        height: dimensions?.height,
        blurDataURL,
      })

      return {
        id: media.id,
        url: media.url,
        blurDataURL: media.blurDataURL,
        width: media.width ?? dimensions?.width,
        height: media.height ?? dimensions?.height,
        mime: media.mime ?? blob.contentType,
        size: media.size ?? file.size,
        pathname: media.pathname ?? blob.pathname,
      }
    },
  })
}
