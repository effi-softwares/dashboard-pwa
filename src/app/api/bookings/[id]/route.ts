import { NextResponse } from "next/server"

import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import {
  bookingsTable,
  bookingStatusTable,
  inspectionReportsTable,
  user,
  vehicleTable,
} from "@/db/schemas"
import { requireAuth } from "@/lib/auth/get-session"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth()

    const { id } = await params
    const dbClient = db()

    // Fetch booking
    const [booking] = await dbClient.select().from(bookingsTable).where(eq(bookingsTable.id, id))

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Fetch vehicle details
    const [vehicle] = await dbClient
      .select({
        id: vehicleTable.id,
        brand: vehicleTable.brand,
        model: vehicleTable.model,
        licensePlate: vehicleTable.licensePlate,
        vehicleType: vehicleTable.vehicleType,
        year: vehicleTable.year,
      })
      .from(vehicleTable)
      .where(eq(vehicleTable.id, booking.vehicleId))

    // Fetch status history with user details
    const statusHistory = await dbClient
      .select({
        id: bookingStatusTable.id,
        status: bookingStatusTable.status,
        statusUpdatedAt: bookingStatusTable.statusUpdatedAt,
        note: bookingStatusTable.note,
        changedBy: bookingStatusTable.changedBy,
        changedByName: user.name,
        changedByEmail: user.email,
      })
      .from(bookingStatusTable)
      .leftJoin(user, eq(bookingStatusTable.changedBy, user.id))
      .where(eq(bookingStatusTable.bookingId, id))
      .orderBy(bookingStatusTable.statusUpdatedAt)

    // Fetch inspection reports
    const inspections = await dbClient
      .select({
        id: inspectionReportsTable.id,
        bookingId: inspectionReportsTable.bookingId,
        inspectionType: inspectionReportsTable.inspectionType,
        frontStatus: inspectionReportsTable.frontStatus,
        rearStatus: inspectionReportsTable.rearStatus,
        leftStatus: inspectionReportsTable.leftStatus,
        rightStatus: inspectionReportsTable.rightStatus,
        dashboardStatus: inspectionReportsTable.dashboardStatus,
        seatsStatus: inspectionReportsTable.seatsStatus,
        frontSeatsStatus: inspectionReportsTable.frontSeatsStatus,
        trunkStatus: inspectionReportsTable.trunkStatus,
        inspectionTime: inspectionReportsTable.inspectionTime,
        inspectedBy: inspectionReportsTable.inspectedBy,
        inspectorName: user.name,
        notes: inspectionReportsTable.notes,
        createdAt: inspectionReportsTable.createdAt,
      })
      .from(inspectionReportsTable)
      .leftJoin(user, eq(inspectionReportsTable.inspectedBy, user.id))
      .where(eq(inspectionReportsTable.bookingId, id))
      .orderBy(inspectionReportsTable.createdAt)

    return NextResponse.json(
      {
        ...booking,
        vehicle,
        statusHistory,
        inspections,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[Booking GET Error]", error)

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 })
  }
}
