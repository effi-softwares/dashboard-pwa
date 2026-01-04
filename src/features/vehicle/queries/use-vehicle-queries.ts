"use client"

import { useQuery } from "@tanstack/react-query"

import type { StatusHistoryEntry, VehicleDetailsResponse, VehicleImage } from "@/types"
import type { VehiclesListParams, VehiclesResponse } from "@/types/api"
export function useVehicles(params: VehiclesListParams = {}) {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 20

  return useQuery<VehiclesResponse>({
    queryKey: [
      "vehicles",
      {
        page,
        pageSize,
        search: params.search,
        status: params.status,
        vehicleType: params.vehicleType,
        fuelType: params.fuelType,
        transmission: params.transmission,
        sortBy: params.sortBy,
        sortDir: params.sortDir,
      },
    ],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      searchParams.set("page", String(page))
      searchParams.set("pageSize", String(pageSize))
      if (params.search) searchParams.set("search", params.search)
      if (params.status) searchParams.set("status", params.status)
      if (params.vehicleType) searchParams.set("vehicleType", params.vehicleType)
      if (params.fuelType) searchParams.set("fuelType", params.fuelType)
      if (params.transmission) searchParams.set("transmission", params.transmission)
      if (params.sortBy) searchParams.set("sortBy", params.sortBy)
      if (params.sortDir) searchParams.set("sortDir", params.sortDir)

      const response = await fetch(`/api/vehicles?${searchParams.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles")
      }
      return response.json()
    },
    placeholderData: previousData => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch a single vehicle by ID
 */
export function useVehicleById(vehicleId: string | null | undefined) {
  return useQuery<VehicleDetailsResponse>({
    queryKey: ["vehicle", vehicleId],
    queryFn: async () => {
      if (!vehicleId) {
        throw new Error("Vehicle ID is required")
      }

      const response = await fetch(`/api/vehicles/${vehicleId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Vehicle not found")
        }
        throw new Error("Failed to fetch vehicle details")
      }
      return response.json()
    },
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch vehicle status history
 */
export function useVehicleStatusHistory(vehicleId: string | null | undefined) {
  return useQuery<StatusHistoryEntry[]>({
    queryKey: ["vehicle", vehicleId, "status-history"],
    queryFn: async () => {
      if (!vehicleId) {
        throw new Error("Vehicle ID is required")
      }

      const response = await fetch(`/api/vehicles/${vehicleId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch vehicle details")
      }
      const data: VehicleDetailsResponse = await response.json()
      return data.statusHistory
    },
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch vehicle images
 */
export function useVehicleImages(vehicleId: string | null | undefined) {
  return useQuery<VehicleImage[]>({
    queryKey: ["vehicle", vehicleId, "images"],
    queryFn: async () => {
      if (!vehicleId) {
        throw new Error("Vehicle ID is required")
      }

      const response = await fetch(`/api/vehicles/${vehicleId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch vehicle images")
      }
      const data: VehicleDetailsResponse = await response.json()
      return data.images
    },
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch vehicle current status
 */
export function useVehicleCurrentStatus(vehicleId: string | null | undefined) {
  return useQuery<string>({
    queryKey: ["vehicle", vehicleId, "current-status"],
    queryFn: async () => {
      if (!vehicleId) {
        throw new Error("Vehicle ID is required")
      }

      const response = await fetch(`/api/vehicles/${vehicleId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch vehicle status")
      }
      const data: VehicleDetailsResponse = await response.json()
      return data.currentStatus
    },
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
