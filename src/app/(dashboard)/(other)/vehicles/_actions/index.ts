"use server"

import {
  getVehicleById,
  getVehicleCurrentStatus,
  getVehicleImages,
  getVehicleStatusHistory,
} from "@/queries/vehicle"
import type { VehicleDetailsResponse } from "@/types/vehicle"

export async function fetchVehicleDetails(id: string): Promise<VehicleDetailsResponse | null> {
  try {
    const [vehicle, statusHistory, images] = await Promise.all([
      getVehicleById(id),
      getVehicleStatusHistory(id),
      getVehicleImages(id),
    ])

    if (!vehicle) {
      return null
    }

    const currentStatus = (statusHistory[0]?.status ??
      "Unknown") as VehicleDetailsResponse["currentStatus"]

    return {
      vehicle,
      statusHistory,
      images,
      currentStatus,
    }
  } catch (error) {
    console.error(`Failed to fetch vehicle details for ID: ${id}`, error)
    return null
  }
}

export async function fetchVehicleStatus(id: string): Promise<string> {
  try {
    return await getVehicleCurrentStatus(id)
  } catch (error) {
    console.error(`Failed to fetch vehicle status for ID: ${id}`, error)
    return "Unknown"
  }
}
