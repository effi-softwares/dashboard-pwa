"use server"

import { db as getDb } from "@/db/db"
import { vehicleStatusTable, vehicleTable } from "@/db/schemas/vehicle-schema"
import { requireAuth } from "@/lib/auth/get-session"
import { toPersistence } from "@/lib/mappers/vehicle-mapper"
import { Vehicle, vehicleSchema } from "@/zod/vehicle-form"

export async function createVehicleAction(rawData: Vehicle) {
  const session = await requireAuth()
  const parsed = vehicleSchema.safeParse(rawData)
  if (!parsed.success) {
    throw new Error("Invalid vehicle data: " + parsed.error.message)
  }

  const dbData = toPersistence(parsed.data)
  const db = getDb()
  const [newVehicle] = await db.insert(vehicleTable).values(dbData).returning()
  await db.insert(vehicleStatusTable).values({
    vehicleId: newVehicle.id,
    status: "Available",
    note: "Initial creation via Admin Dashboard",
    changedBy: session.user.id,
  })

  return newVehicle
}
