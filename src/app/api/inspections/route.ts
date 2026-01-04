import { NextResponse } from "next/server"

import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db/db"
import { bookingsTable, inspectionReportsTable, user } from "@/db/schemas"
import { requireAuth } from "@/lib/auth/get-session"

const createInspectionSchema = z.object({
  bookingId: z.string().uuid(),
  inspectionType: z.enum(["exterior", "interior"]),
  frontStatus: z.enum(["OK", "Damage"]),
  rearStatus: z.enum(["OK", "Damage"]),
  leftStatus: z.enum(["OK", "Damage"]),
  rightStatus: z.enum(["OK", "Damage"]),
  dashboardStatus: z.enum(["OK", "Damage"]).optional(),
  seatsStatus: z.enum(["OK", "Damage"]).optional(),
  frontSeatsStatus: z.enum(["OK", "Damage"]).optional(),
  trunkStatus: z.enum(["OK", "Damage"]).optional(),
  notes: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    const authUserId = session.user.id

    const body = await request.json()
    const validatedData = createInspectionSchema.parse(body)

    const dbClient = db()

    // Verify booking exists
    const [booking] = await dbClient
      .select()
      .from(bookingsTable)
      .where(eq(bookingsTable.id, validatedData.bookingId))

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Create inspection report
    const [inspection] = await dbClient
      .insert(inspectionReportsTable)
      .values({
        bookingId: validatedData.bookingId,
        inspectionType: validatedData.inspectionType,
        frontStatus: validatedData.frontStatus,
        rearStatus: validatedData.rearStatus,
        leftStatus: validatedData.leftStatus,
        rightStatus: validatedData.rightStatus,
        dashboardStatus: validatedData.dashboardStatus || null,
        seatsStatus: validatedData.seatsStatus || null,
        frontSeatsStatus: validatedData.frontSeatsStatus || null,
        trunkStatus: validatedData.trunkStatus || null,
        inspectionTime: new Date(),
        inspectedBy: authUserId,
        notes: validatedData.notes || null,
      })
      .returning()

    // Fetch inspector name
    const [inspector] = await dbClient
      .select({ name: user.name })
      .from(user)
      .where(eq(user.id, authUserId))

    return NextResponse.json(
      {
        id: inspection.id,
        bookingId: inspection.bookingId,
        inspectionType: inspection.inspectionType,
        inspectionTime: inspection.inspectionTime,
        inspectorName: inspector?.name || "Unknown",
        message: "Inspection report created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[Inspection POST Error]", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid inspection data", details: error.issues },
        { status: 400 },
      )
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to create inspection report" }, { status: 500 })
  }
}
