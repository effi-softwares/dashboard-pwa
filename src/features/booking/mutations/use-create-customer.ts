"use client"

import { useMutation } from "@tanstack/react-query"

import type { CustomerSuggestion } from "@/features/booking/types/customer.types"

export interface CreateCustomerPayload {
  name: string
  email: string
  phone: string
  driverLicenseNumber: string
}

export function useCreateCustomer() {
  return useMutation({
    mutationFn: async (payload: CreateCustomerPayload) => {
      const res = await fetch("/api/bookings/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to create customer")
      }

      return res.json() as Promise<CustomerSuggestion>
    },
  })
}
