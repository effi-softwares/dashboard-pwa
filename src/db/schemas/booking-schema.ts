import { index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations"

import { user } from "./auth-schema"
import { customersTable } from "./customer-schema"
import { vehicleTable } from "./vehicle-schema"

export const bookingStatusEnum = pgEnum("booking_status_type", [
  "Pending",
  "Confirmed",
  "CheckoutStarted",
  "CheckoutCompleted",
  "Active",
  "Completed",
  "Cancelled",
])

export const paymentMethodEnum = pgEnum("payment_method_type", ["Cash", "Card", "Transfer"])

export const inspectionStatusEnum = pgEnum("inspection_status_type", ["OK", "Damage"])

export const bookingsTable = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vehicleId: uuid("vehicle_id")
      .notNull()
      .references(() => vehicleTable.id, { onDelete: "restrict" }),
    customerId: text("customer_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    customerPersonId: uuid("customer_person_id").references(() => customersTable.id, {
      onDelete: "set null",
    }),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email").notNull(),
    customerPhone: text("customer_phone").notNull(),
    driverLicenseNumber: text("driver_license_number").notNull(),
    bookingStartDate: timestamp("booking_start_date").notNull(),
    bookingEndDate: timestamp("booking_end_date").notNull(),
    actualReturnTime: timestamp("actual_return_time"),
    startMileage: integer("start_mileage"),
    endMileage: integer("end_mileage"),
    paymentMethod: paymentMethodEnum("payment_method").default("Cash").notNull(),
    securityDepositAmount: integer("security_deposit_amount").notNull(),
    dailyRate: integer("daily_rate").notNull(),
    totalDays: integer("total_days").notNull(),
    totalAmount: integer("total_amount").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [
    index("idx_booking_vehicle_id").on(table.vehicleId),
    index("idx_booking_customer_id").on(table.customerId),
    index("idx_booking_dates").on(table.bookingStartDate, table.bookingEndDate),
    index("idx_booking_created_at").on(table.createdAt),
  ],
)

export const bookingStatusTable = pgTable(
  "booking_status",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookingsTable.id, { onDelete: "cascade" }),
    status: bookingStatusEnum("status").notNull(),
    changedBy: text("changed_by").references(() => user.id, { onDelete: "set null" }),
    note: text("note"),
    statusUpdatedAt: timestamp("status_updated_at").defaultNow().notNull(),
  },
  table => [index("idx_booking_status_latest").on(table.bookingId, table.statusUpdatedAt)],
)

export const inspectionReportsTable = pgTable(
  "inspection_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookingId: uuid("booking_id")
      .notNull()
      .references(() => bookingsTable.id, { onDelete: "cascade" }),
    inspectionType: text("inspection_type").notNull(), // "exterior" | "interior"
    frontStatus: text("front_status").notNull(), // "OK" | "Damage"
    rearStatus: text("rear_status").notNull(), // "OK" | "Damage"
    leftStatus: text("left_status").notNull(), // "OK" | "Damage"
    rightStatus: text("right_status").notNull(), // "OK" | "Damage"
    dashboardStatus: text("dashboard_status"), // For interior inspections
    seatsStatus: text("seats_status"), // For interior inspections
    frontSeatsStatus: text("front_seats_status"), // For interior inspections
    trunkStatus: text("trunk_status"), // For interior/exterior
    inspectionTime: timestamp("inspection_time").notNull(),
    inspectedBy: text("inspected_by")
      .notNull()
      .references(() => user.id, { onDelete: "set null" }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => [
    index("idx_inspection_booking_id").on(table.bookingId),
    index("idx_inspection_type").on(table.inspectionType),
  ],
)

export const bookingsRelations = relations(bookingsTable, ({ many, one }) => ({
  statuses: many(bookingStatusTable),
  inspections: many(inspectionReportsTable),
  vehicle: one(vehicleTable, {
    fields: [bookingsTable.vehicleId],
    references: [vehicleTable.id],
  }),
  customer: one(user, {
    fields: [bookingsTable.customerId],
    references: [user.id],
  }),
  customerPerson: one(customersTable, {
    fields: [bookingsTable.customerPersonId],
    references: [customersTable.id],
  }),
}))

export const bookingStatusRelations = relations(bookingStatusTable, ({ one }) => ({
  booking: one(bookingsTable, {
    fields: [bookingStatusTable.bookingId],
    references: [bookingsTable.id],
  }),
  changedByUser: one(user, {
    fields: [bookingStatusTable.changedBy],
    references: [user.id],
  }),
}))

export const inspectionReportsRelations = relations(inspectionReportsTable, ({ one }) => ({
  booking: one(bookingsTable, {
    fields: [inspectionReportsTable.bookingId],
    references: [bookingsTable.id],
  }),
  inspector: one(user, {
    fields: [inspectionReportsTable.inspectedBy],
    references: [user.id],
  }),
}))
