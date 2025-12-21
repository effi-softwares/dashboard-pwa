"use client"

import { useMutation } from "@tanstack/react-query"

import { createVehicleAction } from "@/server/vehicle-action"
import type { Vehicle } from "@/zod/vehicle-form"

export function useCreateVehicle() {
  return useMutation({
    mutationFn: (payload: Vehicle) => createVehicleAction(payload),
  })
}
