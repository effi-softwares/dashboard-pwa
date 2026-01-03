/**
 * Storage service related types
 */

export type StoredObject = {
  type: "image" | "document" | "media"
  url: string
  pathname?: string
  mime?: string
  size?: number
  width?: number
  height?: number
  blurDataURL?: string | null
}

export type UploadTokenOptions = {
  expiresIn?: number
}

export interface StorageService {
  upload(file: File): Promise<StoredObject>
  delete(path: string): Promise<void>
  generateUploadToken(options?: UploadTokenOptions): Promise<string>
}
