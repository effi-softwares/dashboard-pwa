import { NextResponse } from "next/server"

import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"

import { requireAuth } from "@/lib/auth/get-session"

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await requireAuth()
    const body = (await request.json()) as HandleUploadBody

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (/* pathname, clientPayload */) => {
        // Generate client upload token with allowed MIME types and size limit
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
            "image/gif",
            "video/mp4",
            "video/webm",
            "video/quicktime",
          ],
          addRandomSuffix: true,
          // Optional: set max file size via env
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
          tokenPayload: JSON.stringify({
            userId: session.user.id,
          }),
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Upload token generation error:", error)
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate upload URL" },
      { status: 400 },
    )
  }
}
