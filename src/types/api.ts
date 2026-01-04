/**
 * API and Hook Response Types
 */

import type { VehicleListItem } from "@/features/vehicle/types"

export interface VehiclesListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  vehicleType?: string
  fuelType?: string
  transmission?: string
  sortBy?: string
  sortDir?: "asc" | "desc"
}

export interface VehiclesResponse {
  data: VehicleListItem[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface UploadOptions {
  onProgress?: (progress: number) => void
}

export interface UploadResult {
  id: string
  url: string
  blurDataURL?: string | null
  width?: number
  height?: number
  mime?: string
  size?: number
  pathname?: string
}

export interface UpdateVehicleSpecPayload {
  vehicleId: string
  data: Record<string, unknown>
}
