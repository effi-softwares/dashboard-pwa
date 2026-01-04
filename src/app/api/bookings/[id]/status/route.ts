import { NextResponse } from "next/server"

import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db/db"
import { bookingsTable, bookingStatusTable } from "@/db/schemas"
import { bookingStatusEnum } from "@/db/schemas/booking-schema"
import { requireAuth } from "@/lib/auth/get-session"

const statusUpdateSchema = z.object({
  status: z.enum(bookingStatusEnum.enumValues as [string, ...string[]]),
  note: z.string().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth()
    const authUserId = session.user.id

    const { id } = await params
    const body = await request.json()
    const { status, note } = statusUpdateSchema.parse(body)

    const dbClient = db()

    // Verify booking exists
    const [booking] = await dbClient.select().from(bookingsTable).where(eq(bookingsTable.id, id))

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Create new status entry
    const [statusEntry] = await dbClient
      .insert(bookingStatusTable)
      .values({
        bookingId: id,
        status: status as (typeof bookingStatusEnum.enumValues)[number],
        changedBy: authUserId,
        note: note || null,
      })
      .returning()

    return NextResponse.json(
      {
        id: statusEntry.id,
        bookingId: id,
        status,
        statusUpdatedAt: statusEntry.statusUpdatedAt,
        message: "Booking status updated successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[Booking Status PATCH Error]", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid status data", details: error.issues },
        { status: 400 },
      )
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 })
  }
}
