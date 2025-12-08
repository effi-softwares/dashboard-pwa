import { z } from "zod"

export enum Transmission {
  AUTOMATIC = "automatic",
  MANUAL = "manual",
}

export enum FuelType {
  GASOLINE = "gasoline",
  DIESEL = "diesel",
  ELECTRIC = "electric",
  HYBRID = "hybrid",
}

export enum VehicleStatus {
  AVAILABLE = "available",
  RENTED = "rented",
  MAINTENANCE = "maintenance",
}

export enum RateType {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number({ message: "Year must be a number" })
    .min(1886, "Year must be 1886 or later")
    .max(new Date().getFullYear() + 1, `Year cannot be later than ${new Date().getFullYear() + 1}`),
  vin: z.string().min(1, "VIN is required"),
  licensePlate: z.string().min(1, "License plate is required"),
  color: z.string().min(1, "Color is required"),
  mileage: z.number({ message: "Mileage must be a number" }).min(0, "Mileage cannot be negative"),
  transmission: z.enum(Transmission, {
    message: "Transmission is required",
  }),
  seats: z.number({ message: "Seats must be a number" }).min(1, "There must be at least 1 seat"),
  fuelType: z.enum(FuelType, {
    message: "Fuel type is required",
  }),
  status: z.enum(VehicleStatus, {
    message: "Status is required",
  }),
})

export type VehicleFormValues = z.infer<typeof vehicleSchema>

export const ratesSchema = z.object({
  rates: z.array(
    z.object({
      rateType: z.enum(RateType, { message: "Rate type is required" }),
      amount: z.number({ message: "Amount must be a number" }).min(0, "Amount cannot be negative"),
      limitedMillage: z.boolean().optional(),
      millageLimit: z
        .number({ message: "Millage limit must be a number" })
        .min(0, "Millage limit cannot be negative")
        .optional(),
      extraMillageFee: z
        .number({ message: "Extra millage fee must be a number" })
        .min(0, "Extra millage fee cannot be negative")
        .optional(),
    }),
  ),
})

export type ratesFormValues = z.infer<typeof ratesSchema>
