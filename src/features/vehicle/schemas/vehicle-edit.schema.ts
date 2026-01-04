import { z } from "zod"

import { FuelTypeEnum, TransmissionEnum } from "./vehicle-form.schema"

/**
 * Individual field update schemas for vehicle specs
 * Each schema handles a single field to allow granular updates
 */

export const transmissionUpdateSchema = z.object({
  transmission: TransmissionEnum,
})
export type TransmissionUpdate = z.infer<typeof transmissionUpdateSchema>

export const fuelTypeUpdateSchema = z.object({
  fuelType: FuelTypeEnum,
})
export type FuelTypeUpdate = z.infer<typeof fuelTypeUpdateSchema>

export const seatsUpdateSchema = z.object({
  seats: z
    .number({ message: "Seats must be a valid number" })
    .int("Seats must be a whole number")
    .min(1, "Minimum 1 seat required")
    .max(60, "Maximum 60 seats allowed"),
})
export type SeatsUpdate = z.infer<typeof seatsUpdateSchema>

export const doorsUpdateSchema = z.object({
  doors: z
    .number({ message: "Doors must be a valid number" })
    .int("Doors must be a whole number")
    .min(2, "Minimum 2 doors required")
    .max(5, "Maximum 5 doors allowed"),
})
export type DoorsUpdate = z.infer<typeof doorsUpdateSchema>

export const baggageCapacityUpdateSchema = z.object({
  baggageCapacity: z
    .number({ message: "Baggage capacity must be a valid number" })
    .min(0, "Baggage capacity cannot be negative")
    .max(10000, "Maximum baggage capacity is 10000 kg"),
})
export type BaggageCapacityUpdate = z.infer<typeof baggageCapacityUpdateSchema>

/**
 * Union type for all spec update schemas
 */
export type SpecUpdate =
  | TransmissionUpdate
  | FuelTypeUpdate
  | SeatsUpdate
  | DoorsUpdate
  | BaggageCapacityUpdate

/**
 * Generic update schema that accepts any spec field
 * Used for API validation
 */
export const vehicleSpecUpdateSchema = z.union([
  transmissionUpdateSchema,
  fuelTypeUpdateSchema,
  seatsUpdateSchema,
  doorsUpdateSchema,
  baggageCapacityUpdateSchema,
])
export type VehicleSpecUpdate = z.infer<typeof vehicleSpecUpdateSchema>
