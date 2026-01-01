"use client"

import { useQuery } from "@tanstack/react-query"

import type { VehicleDetailsResponse } from "@/types/vehicle"

async function fetchVehicleDetails(id: string): Promise<VehicleDetailsResponse> {
  const response = await fetch(`/api/vehicles/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicle details: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data
}

export function useVehicleDetail(id: string) {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => fetchVehicleDetails(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}
