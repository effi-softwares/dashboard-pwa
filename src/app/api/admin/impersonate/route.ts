import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { z } from "zod"

import { auth } from "@/lib/auth/auth"
import { requireAdmin } from "@/lib/auth/get-session"

const impersonateSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
})

export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json()
    const { userId } = impersonateSchema.parse(body)

    const result = await auth.api.impersonateUser({
      headers: await headers(),
      body: { userId },
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 },
      )
    }

    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (error.message.includes("Forbidden")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    console.error("Error impersonating user:", error)
    return NextResponse.json({ error: "Failed to impersonate user" }, { status: 500 })
  }
}
