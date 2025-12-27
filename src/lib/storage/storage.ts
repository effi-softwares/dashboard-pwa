export type StoredObject = {
  url: string
  pathname: string
  size: number
  contentType: string
  width?: number
  height?: number
  blurDataURL?: string | null
}

export type UploadTokenOptions = {
  allowedContentTypes?: string[]
  addRandomSuffix?: boolean
  access?: "public" | "private"
}

export interface StorageService {
  /** Returns a fully-qualified public URL for the given pathname */
  getPublicUrl(pathname: string): string
  /** Deletes a stored object by its public URL */
  deleteByUrl(url: string): Promise<{ success: boolean }>
}
