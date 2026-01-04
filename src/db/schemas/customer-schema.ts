import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations"

import { bookingsTable, user } from "./index"

export const customersTable = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    driverLicenseNumber: text("driver_license_number").notNull(),
    lastRentalDate: timestamp("last_rental_date"),
    totalRentals: integer("total_rentals").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [
    index("idx_customer_email").on(table.email),
    index("idx_customer_phone").on(table.phone),
    index("idx_customer_driver_license").on(table.driverLicenseNumber),
    index("idx_customer_created_at").on(table.createdAt),
  ],
)

export const customersRelations = relations(customersTable, ({ many }) => ({
  bookings: many(bookingsTable),
}))
