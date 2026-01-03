"use client"

import { useMutation } from "@tanstack/react-query"

import { Vehicle } from "@/features/vehicle/schemas/vehicle-form.schema"

export function useCreateVehicle() {
  return useMutation({
    mutationFn: async (payload: Vehicle) => {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to create vehicle")
      }

      return res.json()
    },
  })
}
