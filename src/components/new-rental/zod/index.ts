import { email, z } from "zod"

export const vehicleSelectionSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
})

export type VehicleSelectionFormValues = z.infer<typeof vehicleSelectionSchema>

export const customerDetailsSchema = z.object({
  email: z.email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact number is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  driverLicenseNumber: z.string().min(1, "Driver license number is required"),
})

export type CustomerDetailsFormValues = z.infer<typeof customerDetailsSchema>
