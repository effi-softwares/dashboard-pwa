import { NextResponse } from "next/server"

import { z } from "zod"

import { db } from "@/db/db"
import { mediaTable } from "@/db/schemas"
import { requireAuth } from "@/lib/auth/get-session"

const persistMediaSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.url(),
  pathname: z.string(),
  mime: z.string(),
  size: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  blurDataURL: z.string().nullable().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    const rawData = await request.json()

    const parsed = persistMediaSchema.safeParse(rawData)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid media data", details: parsed.error.issues },
        { status: 400 },
      )
    }

    const dbClient = db()
    const [media] = await dbClient
      .insert(mediaTable)
      .values({
        ...parsed.data,
        createdBy: session.user.id,
      })
      .returning()

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error("Error persisting media", error)
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to persist media" }, { status: 500 })
  }
}
