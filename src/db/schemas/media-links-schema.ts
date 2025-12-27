import { index, integer, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm/relations"

import { mediaTable } from "./media-schema"
import { vehicleTable } from "./vehicle-schema"

export const entityTypeEnum = pgEnum("entity_type", ["vehicle", "rental", "user"])
export const mediaRoleEnum = pgEnum("media_role", ["primary", "gallery", "document"])

export const mediaLinksTable = pgTable(
  "media_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => mediaTable.id, { onDelete: "cascade" }),
    entityType: entityTypeEnum("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    role: mediaRoleEnum("role").notNull().default("gallery"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => [
    index("idx_media_links_entity").on(table.entityType, table.entityId),
    index("idx_media_links_media").on(table.mediaId),
  ],
)

export const mediaLinksRelations = relations(mediaLinksTable, ({ one }) => ({
  media: one(mediaTable, {
    fields: [mediaLinksTable.mediaId],
    references: [mediaTable.id],
  }),
  vehicle: one(vehicleTable, {
    fields: [mediaLinksTable.entityId],
    references: [vehicleTable.id],
  }),
}))

export const mediaRelations = relations(mediaTable, ({ many }) => ({
  links: many(mediaLinksTable),
}))

export const vehicleMediaRelations = relations(vehicleTable, ({ many }) => ({
  media: many(mediaLinksTable),
}))
