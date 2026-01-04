import { z } from "zod"

export const PaymentMethodEnum = z.enum(["Cash"])

export const customerDetailsSchema = z.object({
  customerName: z.string().min(2, "Full name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  driverLicenseNumber: z.string().min(5, "Driver license number is required"),
})

export const exteriorInspectionSchema = z.object({
  frontStatus: z.enum(["OK", "Damage"], { message: "Front status is required" }),
  rearStatus: z.enum(["OK", "Damage"], { message: "Rear status is required" }),
  leftStatus: z.enum(["OK", "Damage"], { message: "Left side status is required" }),
  rightStatus: z.enum(["OK", "Damage"], { message: "Right side status is required" }),
  trunkStatus: z.enum(["OK", "Damage"]).optional(),
  exteriorNotes: z.string().optional(),
})

export const interiorInspectionSchema = z.object({
  dashboardStatus: z.enum(["OK", "Damage"], { message: "Dashboard status is required" }),
  seatsStatus: z.enum(["OK", "Damage"], { message: "Seats status is required" }),
  frontSeatsStatus: z.enum(["OK", "Damage"], { message: "Front seats status is required" }),
  trunkStatus: z.enum(["OK", "Damage"]).optional(),
  interiorNotes: z.string().optional(),
})

export const paymentDetailsSchema = z.object({
  paymentMethod: PaymentMethodEnum.default("Cash"),
  securityDepositAmount: z.number().min(0, "Deposit amount cannot be negative"),
})

export const bookingFormSchema = z.object({
  vehicleId: z.string().uuid("Valid vehicle ID is required"),
  customerName: z.string().min(2, "Full name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  driverLicenseNumber: z.string().min(5, "Driver license number is required"),
  bookingStartDate: z.coerce.date({ message: "Start date is required" }),
  bookingEndDate: z.coerce.date({ message: "End date is required" }),
  dailyRate: z.number().min(0, "Daily rate is required"),
  totalDays: z.number().min(1, "Total days must be at least 1"),
  totalAmount: z.number().min(0, "Total amount is required"),
  paymentMethod: PaymentMethodEnum.default("Cash"),
  securityDepositAmount: z.number().min(0, "Deposit amount cannot be negative"),
  notes: z.string().optional(),
  exteriorInspection: exteriorInspectionSchema.optional(),
  interiorInspection: interiorInspectionSchema.optional(),
})

export type CustomerDetails = z.infer<typeof customerDetailsSchema>
export type CustomerDetailsInput = z.input<typeof customerDetailsSchema>

export type ExteriorInspection = z.infer<typeof exteriorInspectionSchema>
export type ExteriorInspectionInput = z.input<typeof exteriorInspectionSchema>

export type InteriorInspection = z.infer<typeof interiorInspectionSchema>
export type InteriorInspectionInput = z.input<typeof interiorInspectionSchema>

export type PaymentDetails = z.infer<typeof paymentDetailsSchema>
export type PaymentDetailsInput = z.input<typeof paymentDetailsSchema>

export type BookingFormData = z.infer<typeof bookingFormSchema>
export type BookingFormDataInput = z.input<typeof bookingFormSchema>
