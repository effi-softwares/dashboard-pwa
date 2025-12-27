"use server"

import { db as getDb } from "@/db/db"
import { mediaTable, vehicleMediaTable } from "@/db/schemas"
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
  const images = parsed.data.images
  const db = getDb()
  const [newVehicle] = await db.insert(vehicleTable).values(dbData).returning()
  await db.insert(vehicleStatusTable).values({
    vehicleId: newVehicle.id,
    status: "Available",
    note: "Initial creation via Admin Dashboard",
    changedBy: session.user.id,
  })

  // Link any uploaded images to this vehicle with explicit roles
  const linkOps: Promise<unknown>[] = []
  if (images?.frontImageId) {
    linkOps.push(linkVehicleMedia(newVehicle.id, images.frontImageId, "front", 0))
  }
  if (images?.backImageId) {
    linkOps.push(linkVehicleMedia(newVehicle.id, images.backImageId, "back", 1))
  }
  if (images?.interiorImageId) {
    linkOps.push(linkVehicleMedia(newVehicle.id, images.interiorImageId, "interior", 2))
  }
  if (linkOps.length > 0) {
    await Promise.all(linkOps)
  }

  return newVehicle
}

export async function linkVehicleMedia(
  vehicleId: string,
  mediaId: string,
  role: "front" | "back" | "interior",
  sortOrder = 0,
) {
  await requireAuth()
  const db = getDb()
  const [link] = await db
    .insert(vehicleMediaTable)
    .values({
      mediaId,
      vehicleId,
      role,
      sortOrder,
    })
    .returning()
  return link
}

export async function persistMediaRecord(data: {
  type: "image" | "video"
  url: string
  pathname: string
  mime: string
  size: number
  width?: number
  height?: number
  blurDataURL?: string | null
}) {
  const session = await requireAuth()
  const db = getDb()
  const [media] = await db
    .insert(mediaTable)
    .values({
      ...data,
      createdBy: session.user.id,
    })
    .returning()
  return media
}
