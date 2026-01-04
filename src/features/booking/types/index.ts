/**
 * Booking feature types
 */

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "CheckoutStarted"
  | "CheckoutCompleted"
  | "Active"
  | "Completed"
  | "Cancelled"

export type PaymentMethod = "Cash"

export type InspectionStatus = "OK" | "Damage"

export type InspectionType = "exterior" | "interior"

export type BookingDetail = {
  id: string
  vehicleId: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  driverLicenseNumber: string
  bookingStartDate: string
  bookingEndDate: string
  actualReturnTime: string | null
  startMileage: number | null
  endMileage: number | null
  paymentMethod: PaymentMethod
  securityDepositAmount: number
  dailyRate: number
  totalDays: number
  totalAmount: number
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type BookingListItem = {
  id: string
  vehicleId: string
  vehicleBrand: string
  vehicleModel: string
  vehicleLicensePlate: string
  customerId: string
  customerName: string
  customerEmail: string
  bookingStartDate: string
  bookingEndDate: string
  status: BookingStatus
  statusUpdatedAt: string
  totalAmount: number
}

export type BookingStatusHistory = {
  id: string
  status: BookingStatus
  statusUpdatedAt: string
  note: string | null
  changedBy: string | null
  changedByName: string | null
  changedByEmail: string | null
}

export type InspectionReport = {
  id: string
  bookingId: string
  inspectionType: InspectionType
  frontStatus: InspectionStatus
  rearStatus: InspectionStatus
  leftStatus: InspectionStatus
  rightStatus: InspectionStatus
  dashboardStatus?: InspectionStatus
  seatsStatus?: InspectionStatus
  frontSeatsStatus?: InspectionStatus
  trunkStatus?: InspectionStatus
  inspectionTime: string
  inspectedBy: string
  inspectorName: string
  notes: string | null
  createdAt: string
}

export type BookingWithDetails = BookingDetail & {
  statusHistory: BookingStatusHistory[]
  inspections: InspectionReport[]
  vehicle: {
    id: string
    brand: string
    model: string
    licensePlate: string
    vehicleType: string
    year: number
  }
}
