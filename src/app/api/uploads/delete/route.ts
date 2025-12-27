import { NextResponse } from "next/server"

import { z } from "zod"

import { requireAuth } from "@/lib/auth/get-session"
import { getStorage } from "@/lib/storage"

const deleteSchema = z.object({
  url: z.string().url("Invalid URL"),
})

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await requireAuth()
    const body = await request.json()
    const parsed = deleteSchema.parse(body)

    const storage = getStorage()
    const result = await storage.deleteByUrl(parsed.url)

    if (!result.success) {
      throw new Error("Failed to delete media")
    }

    // Future: also remove from `media` table
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Media deletion error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request", details: error.issues }, { status: 400 })
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete media" },
      { status: 500 },
    )
  }
}
