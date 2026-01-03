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
  getPublicUrl(pathname: string): string
  deleteByUrl(url: string): Promise<{ success: boolean }>
}
