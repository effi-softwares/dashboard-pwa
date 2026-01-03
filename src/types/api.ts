/**
 * API and Hook Response Types
 */

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
  data: Array<{
    id: string
    brand: string
    model: string
    year: number
    licensePlate: string
    vehicleType: string
    currentStatus: string
    fuelType: string
    transmission: string
  }>
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
