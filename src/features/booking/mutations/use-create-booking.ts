"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { BookingFormData } from "@/features/booking/schemas/booking-form.schema"

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: BookingFormData) => {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to create booking")
      }

      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
  })
}
