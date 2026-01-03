"use client"

import { useMutation } from "@tanstack/react-query"

import { Vehicle } from "@/features/vehicle/schemas/vehicle-form.schema"
import { createVehicleAction } from "@/server/vehicle-action"

export function useCreateVehicle() {
  return useMutation({
    mutationFn: (payload: Vehicle) => createVehicleAction(payload),
  })
}
