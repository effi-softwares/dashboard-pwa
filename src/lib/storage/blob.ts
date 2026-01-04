import { del } from "@vercel/blob"

import type { StorageService } from "../storage"

export class BlobStorage implements StorageService {
  getPublicUrl(pathname: string): string {
    const host = process.env.NEXT_PUBLIC_BLOB_HOST
    if (!host) throw new Error("Missing NEXT_PUBLIC_BLOB_HOST")
    const normalized = pathname.startsWith("/") ? pathname.slice(1) : pathname
    return `https://${host}/${normalized}`
  }

  async deleteByUrl(url: string): Promise<{ success: boolean }> {
    await del(url)
    return { success: true }
  }
}
