"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { InspectionReport } from "@/features/booking/types"

export interface CreateInspectionPayload {
  bookingId: string
  inspectionType: "exterior" | "interior"
  frontStatus: "OK" | "Damage"
  rearStatus: "OK" | "Damage"
  leftStatus: "OK" | "Damage"
  rightStatus: "OK" | "Damage"
  dashboardStatus?: "OK" | "Damage"
  seatsStatus?: "OK" | "Damage"
  frontSeatsStatus?: "OK" | "Damage"
  trunkStatus?: "OK" | "Damage"
  notes?: string
}

export function useCreateInspectionReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateInspectionPayload) => {
      const res = await fetch("/api/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to create inspection report")
      }

      return res.json() as Promise<InspectionReport>
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["booking", variables.bookingId] })
    },
  })
}
