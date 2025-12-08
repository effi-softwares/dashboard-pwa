import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { requireAdmin } from "@/lib/auth/get-session"

export async function DELETE(_request: Request, { params }: { params: { userId: string } }) {
  try {
    await requireAdmin()
    const userId = params.userId

    const result = await auth.api.revokeUserSessions({
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

    console.error("Error revoking sessions:", error)
    return NextResponse.json({ error: "Failed to revoke sessions" }, { status: 500 })
  }
}
