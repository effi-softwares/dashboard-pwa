"use client"

import { useMutation } from "@tanstack/react-query"
import { upload } from "@vercel/blob/client"

import type { UploadOptions, UploadResult } from "@/types/api"

const MAX_FILE_SIZE = 50 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]
const BLUR_CANVAS_WIDTH = 10

function validateFile(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`)
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB (max 50MB)`)
  }
}

async function generateBlurDataURL(file: File): Promise<string | null> {
  if (!file.type.startsWith("image/")) return null

  return new Promise(resolve => {
    const reader = new FileReader()
    const timeout = setTimeout(() => {
      reader.abort()
      resolve(null)
    }, 5000)

    reader.onload = e => {
      const img = new Image()
      const imgTimeout = setTimeout(() => {
        resolve(null)
      }, 3000)

      img.onload = () => {
        clearTimeout(imgTimeout)
        clearTimeout(timeout)
        try {
          const canvas = document.createElement("canvas")
          const aspectRatio = img.width / img.height
          const width = BLUR_CANVAS_WIDTH
          const height = Math.round(width / aspectRatio)
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d", { alpha: false })
          if (!ctx) return resolve(null)

          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL("image/webp", 0.1))
        } catch {
          resolve(null)
        }
      }
      img.onerror = () => {
        clearTimeout(imgTimeout)
        clearTimeout(timeout)
        resolve(null)
      }
      img.src = e.target?.result as string
    }
    reader.onerror = () => {
      clearTimeout(timeout)
      resolve(null)
    }
    reader.readAsDataURL(file)
  })
}

async function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number } | undefined> {
  if (!file.type.startsWith("image/")) return undefined

  return new Promise(resolve => {
    const reader = new FileReader()
    const timeout = setTimeout(() => {
      reader.abort()
      resolve(undefined)
    }, 5000)

    reader.onload = e => {
      const img = new Image()
      const imgTimeout = setTimeout(() => {
        resolve(undefined)
      }, 3000)

      img.onload = () => {
        clearTimeout(imgTimeout)
        clearTimeout(timeout)
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => {
        clearTimeout(imgTimeout)
        clearTimeout(timeout)
        resolve(undefined)
      }
      img.src = e.target?.result as string
    }
    reader.onerror = () => {
      clearTimeout(timeout)
      resolve(undefined)
    }
    reader.readAsDataURL(file)
  })
}

async function retryFetch(url: string, options: RequestInit, maxRetries = 2): Promise<Response> {
  let lastError: Error | null = null

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000)

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })

      clearTimeout(timeout)
      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error")
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, i), 5000)))
      }
    }
  }

  throw lastError || new Error("Failed to fetch after retries")
}

export function useUploadMedia(options?: UploadOptions) {
  return useMutation({
    mutationFn: async (file: File): Promise<UploadResult> => {
      validateFile(file)

      const isImage = file.type.startsWith("image/")
      const [blurDataURL, dimensions] = isImage
        ? await Promise.all([generateBlurDataURL(file), getImageDimensions(file)])
        : [null, undefined]

      let blob
      try {
        blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/uploads/generate-url",
          onUploadProgress: event => {
            if (options?.onProgress && event.total) {
              options.onProgress((event.loaded / event.total) * 100)
            }
          },
        })
      } catch (error) {
        throw new Error(
          `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        )
      }

      const mediaRes = await retryFetch("/api/uploads/persist-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: isImage ? "image" : "video",
          url: blob.url,
          pathname: blob.pathname,
          mime: blob.contentType,
          size: file.size,
          width: dimensions?.width,
          height: dimensions?.height,
          blurDataURL,
        }),
      })

      if (!mediaRes.ok) {
        const errorText = await mediaRes.text()
        let errorMessage = "Failed to persist media"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorMessage
        } catch {}
        throw new Error(errorMessage)
      }

      const media = await mediaRes.json()

      return {
        id: media.id,
        url: media.url,
        blurDataURL: media.blurDataURL ?? null,
        width: media.width ?? dimensions?.width,
        height: media.height ?? dimensions?.height,
        mime: media.mime ?? blob.contentType,
        size: media.size ?? file.size,
        pathname: media.pathname ?? blob.pathname,
      }
    },
    retry: 1,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
  })
}
