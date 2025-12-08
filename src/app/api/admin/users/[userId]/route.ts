import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth/auth"
import { requireAdmin } from "@/lib/auth/get-session"

export async function DELETE(_request: Request, { params }: { params: { userId: string } }) {
  try {
    const session = await requireAdmin()
    const userId = params.userId

    if (session.user.id === userId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    const result = await auth.api.removeUser({
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

    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
