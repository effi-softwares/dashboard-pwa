import { BlobStorage } from "./providers/blob"
import type { StorageService } from "./storage"

export function getStorage(): StorageService {
  // Future: switch on env STORAGE_PROVIDER
  return new BlobStorage()
}
