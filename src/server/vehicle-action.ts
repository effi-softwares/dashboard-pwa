"use server"

import { and, eq } from "drizzle-orm"

import { db as getDb } from "@/db/db"
import { mediaLinksTable, mediaTable } from "@/db/schemas"
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

export async function linkVehicleMedia(
  vehicleId: string,
  mediaId: string,
  role: "primary" | "gallery" | "document" = "gallery",
  sortOrder = 0,
) {
  await requireAuth()
  const db = getDb()
  const [link] = await db
    .insert(mediaLinksTable)
    .values({
      mediaId,
      entityType: "vehicle",
      entityId: vehicleId,
      role,
      sortOrder,
    })
    .returning()
  return link
}

export async function unlinkVehicleMedia(vehicleId: string, mediaId: string) {
  await requireAuth()
  const db = getDb()
  await db
    .delete(mediaLinksTable)
    .where(
      and(
        eq(mediaLinksTable.mediaId, mediaId),
        eq(mediaLinksTable.entityType, "vehicle"),
        eq(mediaLinksTable.entityId, vehicleId),
      ),
    )
  return { success: true }
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
