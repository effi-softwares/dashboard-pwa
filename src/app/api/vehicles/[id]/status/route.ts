import { NextResponse } from "next/server"

import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db/db"
import { vehicleStatusTable, vehicleTable } from "@/db/schemas/vehicle-schema"
import { requireAuth } from "@/lib/auth/get-session"
import { VehicleStatusEnum } from "@/zod/vehicle-form"

const bodySchema = z.object({
  status: VehicleStatusEnum,
  note: z.string().max(300).optional(),
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth()
    const body = await request.json()
    const parsed = bodySchema.parse(body)

    const dbClient = db()

    const [vehicle] = await dbClient
      .select({ id: vehicleTable.id })
      .from(vehicleTable)
      .where(eq(vehicleTable.id, params.id))
      .limit(1)

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    await dbClient.insert(vehicleStatusTable).values({
      vehicleId: vehicle.id,
      status: parsed.status,
      note: parsed.note,
      changedBy: session.user.id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload", details: error.issues }, { status: 400 })
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.error("Error updating vehicle status", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
