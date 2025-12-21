import { z } from "zod"

export const TransmissionEnum = z.enum(["Automatic", "Manual", "Semi-Automatic"])
export const FuelTypeEnum = z.enum(["Petrol", "Diesel", "Electric", "Hybrid", "Hydrogen"])
export const VehicleStatusEnum = z.enum(["Available", "Rented", "Maintenance", "Retired"])
export const PricingModelEnum = z.enum(["Daily", "Weekly", "Monthly", "Distance-Based"])

export const vehicleIdentitySchema = z.object({
  brand: z.string().min(2, "Brand is required (e.g. Toyota)"),
  type: z.string().min(2, "Vehicle type is required (e.g. Sedan)"),
  model: z.string().min(2, "Model is required (e.g. Corolla)"),
  year: z
    .number()
    .min(1900, "Year must be 1900 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  vin: z.string().length(17, "VIN must be exactly 17 characters").or(z.string().min(5)),
  licensePlate: z.string().min(2, "License plate is required").toUpperCase(),
  color: z.object({
    name: z.string().min(2, "Color name is required"),
    label: z.string().min(2, "Color label is required"),
    hex: z.string().regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, "Invalid hex color code"),
  }),
  isBrandNew: z.boolean().default(false),
})

const vehicleFeaturesSchema = z.object({
  hasAC: z.boolean().default(true),
  hasNavigation: z.boolean().default(false),
  hasBluetooth: z.boolean().default(true),
  isPetFriendly: z.boolean().default(false),
})

export const vehicleSpecsSchema = z.object({
  transmission: TransmissionEnum,
  fuelType: FuelTypeEnum,
  odometerReading: z.number().min(0, "Odometer reading cannot be negative"),
  seats: z.number().min(1).max(60),
  doors: z.number().min(2).max(5),
  baggageCapacity: z.number().min(0, "Cannot be negative").describe("Number of large bags"),
  features: vehicleFeaturesSchema,
})

export const vehicleOperationsSchema = z.object({
  status: VehicleStatusEnum.default("Available"),
  mileage: z.number().min(0, "Mileage cannot be negative"),
  registrationExpiryDate: z.date({
    message: "Registration expiry date is required",
  }),
  insuranceExpiryDate: z.date({
    message: "Insurance expiry date is required",
  }),
  insurancePolicyNumber: z.string().min(1, "Policy number is required"),
})

const unlimitedMileageSchema = z.object({
  mileageType: z.literal("Unlimited"),
})

const limitedMileageSchema = z.object({
  mileageType: z.literal("Limited"),
  limitPerDay: z.number().min(1, "Daily limit must be positive (e.g., 200km)"),
  overageFeePerUnit: z.number().min(0, "Cost per extra km is required"),
  measureUnit: z.enum(["km", "miles"]).default("km"),
})

export const vehicleRatesSchema = z.object({
  rates: z.array(
    z
      .object({
        pricingModel: PricingModelEnum,
        rate: z.number().min(0, "Rate must be non-negative"),
        mileagePolicy: z.discriminatedUnion("mileageType", [
          unlimitedMileageSchema,
          limitedMileageSchema,
        ]),
        requiresDeposit: z.boolean().default(true),
        depositAmount: z.number().min(0).optional(),
      })
      .superRefine((data, ctx) => {
        if (data.requiresDeposit && (!data.depositAmount || data.depositAmount <= 0)) {
          ctx.addIssue({
            code: "custom",
            message: "Deposit amount is required when security deposit is enabled",
            path: ["depositAmount"],
          })
        }
      }),
  ),
})

export const vehicleSchema = z.object({
  identity: vehicleIdentitySchema,
  specs: vehicleSpecsSchema,
  operations: vehicleOperationsSchema,
  rates: vehicleRatesSchema,
})

export type Transmission = z.infer<typeof TransmissionEnum>
export type TransmissionInput = z.input<typeof TransmissionEnum>

export type FuelType = z.infer<typeof FuelTypeEnum>
export type FuelTypeInput = z.input<typeof FuelTypeEnum>

export type VehicleStatus = z.infer<typeof VehicleStatusEnum>
export type VehicleStatusInput = z.input<typeof VehicleStatusEnum>

export type PricingModel = z.infer<typeof PricingModelEnum>
export type PricingModelInput = z.input<typeof PricingModelEnum>

export type VehicleIdentity = z.infer<typeof vehicleIdentitySchema>
export type VehicleIdentityInput = z.input<typeof vehicleIdentitySchema>

export type VehicleFeatures = z.infer<typeof vehicleFeaturesSchema>
export type VehicleFeaturesInput = z.input<typeof vehicleFeaturesSchema>

export type VehicleSpecs = z.infer<typeof vehicleSpecsSchema>
export type VehicleSpecsInput = z.input<typeof vehicleSpecsSchema>

export type VehicleOperations = z.infer<typeof vehicleOperationsSchema>
export type VehicleOperationsInput = z.input<typeof vehicleOperationsSchema>

export type VehicleRates = z.infer<typeof vehicleRatesSchema>
export type VehicleRatesInput = z.input<typeof vehicleRatesSchema>

// Todo: temporary omit operations and rates mapping
export type Vehicle = Omit<z.infer<typeof vehicleSchema>, "operations" | "rates">
export type VehicleInput = z.input<typeof vehicleSchema>

export type FormDataType = Partial<VehicleInput>
