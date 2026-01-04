"use client"

import { useQuery } from "@tanstack/react-query"

import type { CustomerSuggestion } from "@/features/booking/types/customer.types"

export interface CustomerSuggestionsResponse {
  data: CustomerSuggestion[]
  total: number
}

/**
 * Hook to fetch customer suggestions based on search term
 */
export function useCustomerSuggestions(searchTerm: string | undefined) {
  return useQuery<CustomerSuggestionsResponse>({
    queryKey: ["customers", "suggestions", searchTerm],
    queryFn: async () => {
      if (!searchTerm) {
        throw new Error("Search term is required")
      }

      const searchParams = new URLSearchParams()
      searchParams.set("search", searchTerm)
      searchParams.set("limit", "5")

      const response = await fetch(`/api/bookings/customers/suggestions?${searchParams.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch customer suggestions")
      }
      return response.json()
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
