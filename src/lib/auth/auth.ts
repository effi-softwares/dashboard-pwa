import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { admin } from "better-auth/plugins/admin"
import { User } from "better-auth/types"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { user as userTable } from "@/db/schemas"
import { env } from "@/lib/env"

export const auth = betterAuth({
  database: drizzleAdapter(db(), {
    provider: "pg",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,

  events: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUserCreate: async ({ user, db }: { user: User; db: any }) => {
      await db.update(userTable).set({ role: "admin" }).where(eq(userTable.id, user.id))
    },
  },

  rateLimit: {
    storage: "database",
    points: 10,
    duration: 60,
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieOptions: {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
  },

  plugins: [nextCookies(), admin()],

  emailAndPassword: {
    enabled: true,
  },
})
