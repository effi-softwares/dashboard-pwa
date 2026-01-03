"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import { VehicleSpecUpdate } from "@/features/vehicle/schemas/vehicle-edit.schema"

export function useUpdateVehicleSpec() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ vehicleId, data }: { vehicleId: string; data: VehicleSpecUpdate }) => {
      const res = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to update vehicle spec")
      }

      return res.json()
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["vehicle", variables.vehicleId],
      })
    },
  })
}
