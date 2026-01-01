import { and, desc, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { mediaTable, user, vehicleMediaTable, vehicleStatusTable, vehicleTable } from "@/db/schemas"
import type { StatusHistoryEntry, VehicleDetail, VehicleImage } from "@/types/vehicle"

export async function getVehicleById(id: string): Promise<VehicleDetail | null> {
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
    return null
  }

  return {
    ...vehicle,
    createdAt: vehicle.createdAt?.toISOString() ?? null,
    updatedAt: vehicle.updatedAt?.toISOString() ?? null,
  }
}

export async function getVehicleStatusHistory(vehicleId: string): Promise<StatusHistoryEntry[]> {
  const dbClient = db()

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
    .where(eq(vehicleStatusTable.vehicleId, vehicleId))
    .orderBy(desc(vehicleStatusTable.statusUpdatedAt))

  return statusHistory.map(entry => ({
    ...entry,
    statusUpdatedAt: entry.statusUpdatedAt?.toISOString() ?? null,
  }))
}

export async function getVehicleCurrentStatus(vehicleId: string): Promise<string> {
  const dbClient = db()

  const [status] = await dbClient
    .select({ status: vehicleStatusTable.status })
    .from(vehicleStatusTable)
    .where(eq(vehicleStatusTable.vehicleId, vehicleId))
    .orderBy(desc(vehicleStatusTable.statusUpdatedAt))
    .limit(1)

  return status?.status ?? "Unknown"
}

export async function getVehicleImages(vehicleId: string): Promise<VehicleImage[]> {
  const dbClient = db()

  const images = await dbClient
    .select({
      id: mediaTable.id,
      url: mediaTable.url,
      blurDataURL: mediaTable.blurDataURL,
      role: vehicleMediaTable.role,
      sortOrder: vehicleMediaTable.sortOrder,
      createdAt: vehicleMediaTable.createdAt,
    })
    .from(vehicleMediaTable)
    .innerJoin(mediaTable, eq(vehicleMediaTable.mediaId, mediaTable.id))
    .where(
      and(
        eq(vehicleMediaTable.vehicleId, vehicleId),
        eq(vehicleMediaTable.isActive, true),
        eq(mediaTable.type, "image"),
      ),
    )
    .orderBy(vehicleMediaTable.sortOrder, desc(vehicleMediaTable.createdAt))

  return images.map(image => ({
    ...image,
    createdAt: image.createdAt?.toISOString() ?? null,
  }))
}
