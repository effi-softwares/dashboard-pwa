import { vehicleTable } from "@/db/schemas"
import { Vehicle } from "@/zod/vehicle-form"

type VehicleDbInsert = typeof vehicleTable.$inferInsert
type VehicleDbSelect = typeof vehicleTable.$inferSelect

export function toPersistence(input: Vehicle): VehicleDbInsert {
  return {
    brand: input.identity.brand,
    type: input.identity.type,
    model: input.identity.model,
    year: input.identity.year,
    vin: input.identity.vin,
    licensePlate: input.identity.licensePlate,
    isBrandNew: input.identity.isBrandNew,
    colorName: input.identity.color.name,
    colorHex: input.identity.color.hex,
    transmission: input.specs.transmission,
    fuelType: input.specs.fuelType,
    odometerReading: input.specs.odometerReading,
    seats: input.specs.seats,
    doors: input.specs.doors,
    baggageCapacity: input.specs.baggageCapacity,
    hasAC: input.specs.features.hasAC,
    hasNavigation: input.specs.features.hasNavigation,
    hasBluetooth: input.specs.features.hasBluetooth,
    isPetFriendly: input.specs.features.isPetFriendly,
  }
}

export function toDomain(dbRecord: VehicleDbSelect): Vehicle {
  return {
    identity: {
      brand: dbRecord.brand,
      type: dbRecord.type,
      model: dbRecord.model,
      year: dbRecord.year,
      vin: dbRecord.vin,
      licensePlate: dbRecord.licensePlate,
      isBrandNew: dbRecord.isBrandNew,
      color: {
        name: dbRecord.colorName,
        hex: dbRecord.colorHex,
      },
    },
    specs: {
      transmission: dbRecord.transmission,
      fuelType: dbRecord.fuelType,
      odometerReading: dbRecord.odometerReading,
      seats: dbRecord.seats,
      doors: dbRecord.doors,
      baggageCapacity: dbRecord.baggageCapacity,
      features: {
        hasAC: dbRecord.hasAC,
        hasNavigation: dbRecord.hasNavigation,
        hasBluetooth: dbRecord.hasBluetooth,
        isPetFriendly: dbRecord.isPetFriendly,
      },
    },
  }
}
