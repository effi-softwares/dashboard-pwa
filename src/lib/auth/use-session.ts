"use client"

import { authClient } from "./auth-client"

export function useCurrentSession() {
  const { data, isPending, error } = authClient.useSession()

  return {
    session: data?.session ?? null,
    user: data?.user ?? null,
    isPending,
    error,
  }
}

export function useCurrentUser() {
  const { data, isPending, error } = authClient.useSession()

  return {
    user: data?.user ?? null,
    isPending,
    error,
  }
}
