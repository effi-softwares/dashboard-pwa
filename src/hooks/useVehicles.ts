"use client"

import { useQuery } from "@tanstack/react-query"

import type { VehicleSummary } from "@/types/vehicle"

interface FetchVehiclesOptions {
  filters?: Record<string, string | number | boolean>
  pagination?: { limit: number; offset: number }
}

async function fetchVehicles(options?: FetchVehiclesOptions): Promise<VehicleSummary[]> {
  const params = new URLSearchParams()

  if (options?.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value))
    })
  }

  if (options?.pagination?.limit) {
    params.append("limit", options.pagination.limit.toString())
  }
  if (options?.pagination?.offset) {
    params.append("offset", options.pagination.offset.toString())
  }

  const queryString = params.toString()
  const url = `/api/vehicles${queryString ? `?${queryString}` : ""}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch vehicles: ${response.statusText}`)
  }

  const data = await response.json()
  return data.data
}
export function useVehicles(options?: FetchVehiclesOptions) {
  return useQuery({
    queryKey: ["vehicles", options?.filters, options?.pagination],
    queryFn: () => fetchVehicles(options),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}

export function useVehicleSearch(query: string) {
  return useQuery({
    queryKey: ["vehicles-search", query],
    queryFn: () =>
      fetch(`/api/vehicles/search?q=${encodeURIComponent(query)}`).then(res => {
        if (!res.ok) throw new Error("Failed to search vehicles")
        return res.json()
      }),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  })
}
