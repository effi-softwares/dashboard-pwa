import { BlobStorage } from "./blob"
export interface StorageService {
  getPublicUrl(pathname: string): string
  deleteByUrl(url: string): Promise<{ success: boolean }>
}

export function getStorage(): StorageService {
  return new BlobStorage()
}
