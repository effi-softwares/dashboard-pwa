"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { VehicleStatus } from "@/features/vehicle/schemas/vehicle-form.schema"

export function useChangeVehicleStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: VehicleStatus }) => {
      const res = await fetch(`/api/vehicles/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        throw new Error("Failed to update status")
      }

      return res.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      queryClient.invalidateQueries({ queryKey: ["vehicle", variables.id] })
    },
  })
}
