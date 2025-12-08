import { config } from "dotenv"
config({ path: ".env" })

import { migrate } from "drizzle-orm/neon-http/migrator"

import { getDb } from "./db"

const main = async () => {
  console.log("Migration script started")
  try {
    const db = getDb()
    await migrate(db, { migrationsFolder: "src/db/migrations" })
    console.log("Migrations applied successfully")
    process.exit(0)
  } catch (error) {
    console.log("Migration error: ", error)
    process.exit(1)
  }
}

main()
