import { index, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { user } from "./auth-schema"

export const mediaTypeEnum = pgEnum("media_type", ["image", "video"])

export const mediaTable = pgTable(
  "media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: mediaTypeEnum("type").notNull(),
    provider: text("provider").notNull().default("blob"),
    url: text("url").notNull(),
    pathname: text("pathname").notNull(),
    mime: text("mime").notNull(),
    size: integer("size").notNull(),
    width: integer("width"),
    height: integer("height"),
    blurDataURL: text("blur_data_url"),
    checksum: text("checksum"),
    createdBy: text("created_by")
      .notNull()
      .references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => [
    index("idx_media_url").on(table.url),
    index("idx_media_created_by").on(table.createdBy),
  ],
)
