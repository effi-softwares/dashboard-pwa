export type VehicleStatus = "Available" | "Rented" | "Maintenance" | "Retired" | "Unknown"

export type ImageRole = "front" | "back" | "interior"

export type VehicleDetail = {
  id: string
  brand: string
  model: string
  vehicleType: string
  year: number
  licensePlate: string
  vin: string
  colorName: string
  colorLabel: string
  colorHex: string
  isBrandNew: boolean
  transmission: string
  fuelType: string
  seats: number
  doors: number
  baggageCapacity: number
  hasAC: boolean
  hasNavigation: boolean
  hasBluetooth: boolean
  isPetFriendly: boolean
  createdAt: string | null
  updatedAt: string | null
}

export type StatusHistoryEntry = {
  id: string
  status: VehicleStatus
  statusUpdatedAt: string | null
  note: string | null
  changedBy: string | null
  changedByName: string | null
  changedByEmail: string | null
}

export type VehicleImage = {
  id: string
  url: string
  blurDataURL: string | null
  role: ImageRole
  sortOrder: number
  createdAt: string | null
}

export type VehicleDetailsResponse = {
  vehicle: VehicleDetail
  statusHistory: StatusHistoryEntry[]
  images: VehicleImage[]
  currentStatus: VehicleStatus
}

export type VehicleSummary = {
  id: string
  licensePlate: string
  brand: string
  model: string
  year: number
  currentStatus: string
}
