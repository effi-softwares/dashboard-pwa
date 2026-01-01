import { NextRequest, NextResponse } from "next/server"

import { desc, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { user, vehicleStatusTable, vehicleTable } from "@/db/schemas"
import { requireAuth } from "@/lib/auth/get-session"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth()

    const { id } = await params

    const dbClient = db()

    const [vehicle] = await dbClient
      .select({
        id: vehicleTable.id,
        brand: vehicleTable.brand,
        model: vehicleTable.model,
        vehicleType: vehicleTable.vehicleType,
        year: vehicleTable.year,
        licensePlate: vehicleTable.licensePlate,
        vin: vehicleTable.vin,
        colorName: vehicleTable.colorName,
        colorLabel: vehicleTable.colorLabel,
        colorHex: vehicleTable.colorHex,
        isBrandNew: vehicleTable.isBrandNew,
        transmission: vehicleTable.transmission,
        fuelType: vehicleTable.fuelType,
        seats: vehicleTable.seats,
        doors: vehicleTable.doors,
        baggageCapacity: vehicleTable.baggageCapacity,
        hasAC: vehicleTable.hasAC,
        hasNavigation: vehicleTable.hasNavigation,
        hasBluetooth: vehicleTable.hasBluetooth,
        isPetFriendly: vehicleTable.isPetFriendly,
        createdAt: vehicleTable.createdAt,
        updatedAt: vehicleTable.updatedAt,
      })
      .from(vehicleTable)
      .where(eq(vehicleTable.id, id))
      .limit(1)

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    const statusHistory = await dbClient
      .select({
        id: vehicleStatusTable.id,
        status: vehicleStatusTable.status,
        statusUpdatedAt: vehicleStatusTable.statusUpdatedAt,
        note: vehicleStatusTable.note,
        changedBy: vehicleStatusTable.changedBy,
        changedByName: user.name,
        changedByEmail: user.email,
      })
      .from(vehicleStatusTable)
      .leftJoin(user, eq(vehicleStatusTable.changedBy, user.id))
      .where(eq(vehicleStatusTable.vehicleId, id))
      .orderBy(desc(vehicleStatusTable.statusUpdatedAt))

    const response = {
      vehicle: {
        ...vehicle,
        createdAt: vehicle.createdAt?.toISOString() ?? null,
        updatedAt: vehicle.updatedAt?.toISOString() ?? null,
      },
      statusHistory: statusHistory.map(entry => ({
        ...entry,
        statusUpdatedAt: entry.statusUpdatedAt?.toISOString() ?? null,
      })),
    }

    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.error("Error fetching vehicle details", error)
    return NextResponse.json({ error: "Failed to fetch vehicle details" }, { status: 500 })
  }
}
