import { z } from "zod"

export const TransmissionEnum = z.enum(["Automatic", "Manual", "Semi-Automatic"])
export const FuelTypeEnum = z.enum(["Petrol", "Diesel", "Electric", "Hybrid", "Hydrogen"])
export const VehicleStatusEnum = z.enum(["Available", "Rented", "Maintenance", "Retired"])
export const PricingModelEnum = z.enum(["Daily", "Weekly", "Distance-Based"])

export const vehicleIdentitySchema = z.object({
  brand: z.string().min(2, "Brand is required (e.g. Toyota)"),
  model: z.string().min(2, "Model is required (e.g. Corolla)"),
  year: z
    .number()
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  vin: z.string().length(17, "VIN must be exactly 17 characters").or(z.string().min(5)),
  licensePlate: z.string().min(2, "License plate is required").toUpperCase(),
})

export const vehicleSpecsSchema = z.object({
  color: z.string().min(3, "Color is required"),
  transmission: TransmissionEnum,
  fuelType: FuelTypeEnum,
  seats: z.coerce.number().min(1).max(60),
  doors: z.coerce.number().min(2).max(5),
  baggageCapacity: z.coerce.number().min(0, "Cannot be negative").describe("Number of large bags"),
  features: z
    .object({
      hasAC: z.boolean().default(true),
      hasNavigation: z.boolean().default(false),
      hasBluetooth: z.boolean().default(true),
      isPetFriendly: z.boolean().default(false),
    })
    .optional(),
})

export const vehicleOperationsSchema = z.object({
  status: VehicleStatusEnum.default("Available"),
  mileage: z.coerce.number().min(0, "Mileage cannot be negative"),
  registrationExpiryDate: z.date({
    message: "Registration expiry date is required",
  }),
  insuranceExpiryDate: z.date({
    message: "Insurance expiry date is required",
  }),
  insurancePolicyNumber: z.string().min(1, "Policy number is required"),
})

const rateSchema = z.object({
  dailyRate: z.coerce.number().min(0, "Daily rate is required"),
  weeklyRate: z.coerce.number().min(0).optional().describe("Discounted rate for 7+ days"),
  monthlyRate: z.coerce.number().min(0).optional().describe("Discounted rate for 30+ days"),
})

const unlimitedMileageSchema = z.object({
  mileageType: z.literal("Unlimited"),
})

const limitedMileageSchema = z.object({
  mileageType: z.literal("Limited"),
  limitPerDay: z.coerce.number().min(1, "Daily limit must be positive (e.g., 200km)"),
  overageFeePerUnit: z.coerce.number().min(0, "Cost per extra km is required"),
  measureUnit: z.enum(["km", "miles"]).default("km"),
})

export const vehicleFinancialSchema = z
  .object({
    rates: rateSchema,
    mileagePolicy: z.discriminatedUnion("mileageType", [
      unlimitedMileageSchema,
      limitedMileageSchema,
    ]),

    requiresDeposit: z.boolean().default(true),
    depositAmount: z.coerce.number().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.requiresDeposit && (!data.depositAmount || data.depositAmount <= 0)) {
      ctx.addIssue({
        code: "custom",
        message: "Deposit amount is required when security deposit is enabled",
        path: ["depositAmount"],
      })
    }
  })

export type Transmission = z.infer<typeof TransmissionEnum>
export type FuelType = z.infer<typeof FuelTypeEnum>
export type VehicleStatus = z.infer<typeof VehicleStatusEnum>
export type PricingModel = z.infer<typeof PricingModelEnum>
export type VehicleIdentity = z.infer<typeof vehicleIdentitySchema>
export type VehicleSpecs = z.infer<typeof vehicleSpecsSchema>
export type VehicleOperations = z.infer<typeof vehicleOperationsSchema>
export type VehicleFinancial = z.infer<typeof vehicleFinancialSchema>

export const vehicleSchema = z.object({
  identity: vehicleIdentitySchema,
  specs: vehicleSpecsSchema,
  operations: vehicleOperationsSchema,
  financial: vehicleFinancialSchema,
})

export type Vehicle = z.infer<typeof vehicleSchema>
