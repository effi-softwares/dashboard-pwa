import { headers } from "next/headers"

import { auth } from "./auth"

export type AuthSession = typeof auth.$Infer.Session
export type AuthUser = AuthSession["user"]

export async function getSession(): Promise<AuthSession | null> {
  const session = await auth.api.getSession({
    headers: headers(),
  })
  return session
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession()
  return session?.user ?? null
}

export async function requireAuth(): Promise<AuthSession> {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function requireAdmin(): Promise<AuthSession> {
  const session = await requireAuth()
  if (session.user.role !== "admin") {
    throw new Error("Forbidden: Admin access required")
  }
  return session
}
