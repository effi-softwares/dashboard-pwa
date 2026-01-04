"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { BookingStatus } from "@/features/booking/types"

export function useChangeBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
      note,
    }: {
      id: string
      status: BookingStatus
      note?: string
    }) => {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      })

      if (!res.ok) {
        throw new Error("Failed to update booking status")
      }

      return res.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["booking", variables.id] })
    },
  })
}
