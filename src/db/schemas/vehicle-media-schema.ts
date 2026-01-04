import { boolean, index, integer, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations"

import { mediaTable } from "./media-schema"
import { vehicleTable } from "./vehicle-schema"

export const vehicleMediaRoleEnum = pgEnum("vehicle_media_role", ["front", "back", "interior"])

export const vehicleMediaTable = pgTable(
  "vehicle_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vehicleId: uuid("vehicle_id")
      .notNull()
      .references(() => vehicleTable.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => mediaTable.id, { onDelete: "cascade" }),
    role: vehicleMediaRoleEnum("role").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => [
    index("idx_vehicle_media_vehicle").on(table.vehicleId),
    index("idx_vehicle_media_media").on(table.mediaId),
    index("idx_vehicle_media_vehicle_role").on(table.vehicleId, table.role),
  ],
)

export const vehicleMediaRelations = relations(vehicleMediaTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [vehicleMediaTable.mediaId],
    references: [mediaTable.id],
  }),
  vehicle: one(vehicleTable, {
    fields: [vehicleMediaTable.vehicleId],
    references: [vehicleTable.id],
  }),
}))
