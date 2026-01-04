"use client"

import { useQuery } from "@tanstack/react-query"

import type {
  BookingListItem,
  BookingStatusHistory,
  BookingWithDetails,
  InspectionReport,
} from "@/features/booking/types"

export interface BookingsListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  startDate?: string
  endDate?: string
  sortBy?: string
  sortDir?: "asc" | "desc"
}

export interface BookingsResponse {
  data: BookingListItem[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

/**
 * Hook to fetch paginated list of bookings with filtering
 */
export function useBookings(params: BookingsListParams = {}) {
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 20

  return useQuery<BookingsResponse>({
    queryKey: [
      "bookings",
      {
        page,
        pageSize,
        search: params.search,
        status: params.status,
        startDate: params.startDate,
        endDate: params.endDate,
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
      if (params.startDate) searchParams.set("startDate", params.startDate)
      if (params.endDate) searchParams.set("endDate", params.endDate)
      if (params.sortBy) searchParams.set("sortBy", params.sortBy)
      if (params.sortDir) searchParams.set("sortDir", params.sortDir)

      const response = await fetch(`/api/bookings?${searchParams.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch bookings")
      }
      return response.json()
    },
    placeholderData: previousData => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch a single booking with full details
 */
export function useBookingById(bookingId: string | null | undefined) {
  return useQuery<BookingWithDetails>({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!bookingId) {
        throw new Error("Booking ID is required")
      }

      const response = await fetch(`/api/bookings/${bookingId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Booking not found")
        }
        throw new Error("Failed to fetch booking details")
      }
      return response.json()
    },
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch booking status history
 */
export function useBookingStatusHistory(bookingId: string | null | undefined) {
  return useQuery<BookingStatusHistory[]>({
    queryKey: ["booking", bookingId, "status-history"],
    queryFn: async () => {
      if (!bookingId) {
        throw new Error("Booking ID is required")
      }

      const response = await fetch(`/api/bookings/${bookingId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch booking details")
      }
      const data: BookingWithDetails = await response.json()
      return data.statusHistory
    },
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch booking inspections
 */
export function useBookingInspections(bookingId: string | null | undefined) {
  return useQuery<InspectionReport[]>({
    queryKey: ["booking", bookingId, "inspections"],
    queryFn: async () => {
      if (!bookingId) {
        throw new Error("Booking ID is required")
      }

      const response = await fetch(`/api/bookings/${bookingId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch booking inspections")
      }
      const data: BookingWithDetails = await response.json()
      return data.inspections
    },
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
