import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { requireAdmin } from "@/lib/auth/get-session"

export async function POST(_request: Request, { params }: { params: { userId: string } }) {
  try {
    await requireAdmin()
    const userId = params.userId

    const result = await auth.api.unbanUser({
      headers: await headers(),
      body: { userId },
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (error.message.includes("Forbidden")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    console.error("Error unbanning user:", error)
    return NextResponse.json({ error: "Failed to unban user" }, { status: 500 })
  }
}
