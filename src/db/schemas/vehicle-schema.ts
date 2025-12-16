import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations"

import { user } from "./auth-schema"

export const transmissionEnum = pgEnum("vehicle_transmission", [
  "Automatic",
  "Manual",
  "Semi-Automatic",
])

export const fuelTypeEnum = pgEnum("vehicle_fuel_type", [
  "Petrol",
  "Diesel",
  "Electric",
  "Hybrid",
  "Hydrogen",
])

export const vehicleStatusTypeEnum = pgEnum("vehicle_status_type", [
  "Available",
  "Rented",
  "Maintenance",
  "Retired",
])

export const vehicleTable = pgTable("vehicles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  type: text("type").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: smallint("year").notNull(),
  vin: text("vin").notNull(),
  licensePlate: text("license_plate").notNull(),
  colorName: text("color_name").notNull(),
  colorHex: text("color_hex").notNull(),
  isBrandNew: boolean("is_brand_new").default(false).notNull(),
  transmission: transmissionEnum("transmission").notNull(),
  fuelType: fuelTypeEnum("fuel_type").notNull(),
  odometerReading: integer("odometer_reading").notNull(),
  seats: smallint("seats").notNull(),
  doors: smallint("doors").notNull(),
  baggageCapacity: smallint("baggage_capacity").notNull(),
  hasAC: boolean("has_ac").default(true).notNull(),
  hasNavigation: boolean("has_navigation").default(false).notNull(),
  hasBluetooth: boolean("has_bluetooth").default(true).notNull(),
  isPetFriendly: boolean("is_pet_friendly").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const vehicleStatusTable = pgTable(
  "vehicle_status",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    vehicleId: integer("vehicle_id")
      .notNull()
      .references(() => vehicleTable.id, { onDelete: "cascade" }),
    status: vehicleStatusTypeEnum("status").notNull(),
    changedBy: text("changed_by").references(() => user.id, { onDelete: "set null" }),
    note: text("note"),
    statusUpdatedAt: timestamp("status_updated_at").defaultNow().notNull(),
  },
  table => [index("idx_vehicle_status_latest").on(table.vehicleId, table.statusUpdatedAt)],
)

export const vehicleRelations = relations(vehicleTable, ({ many }) => ({
  statuses: many(vehicleStatusTable),
}))

export const vehicleStatusRelations = relations(vehicleStatusTable, ({ one }) => ({
  vehicle: one(vehicleTable, {
    fields: [vehicleStatusTable.vehicleId],
    references: [vehicleTable.id],
  }),
  changedByUser: one(user, {
    fields: [vehicleStatusTable.changedBy],
    references: [user.id],
  }),
}))
