"use client"

import { useCallback, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle, Loader2 } from "lucide-react"

import { FatInput } from "@/components/ui/fat-input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useCustomerSuggestions } from "@/features/booking/queries/use-customer-suggestions"
import {
  type CustomerDetailsInput,
  customerDetailsSchema,
} from "@/features/booking/schemas/booking-form.schema"
import type { CustomerSuggestion } from "@/features/booking/types/customer.types"

interface CustomerDetailsFormProps {
  onSubmit: (data: CustomerDetailsInput) => void
  isLoading?: boolean
  defaultValues?: Partial<CustomerDetailsInput>
}

export function CustomerDetailsForm({
  onSubmit,
  isLoading = false,
  defaultValues,
}: CustomerDetailsFormProps) {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const form = useForm<CustomerDetailsInput>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: {
      customerName: defaultValues?.customerName || "",
      customerEmail: defaultValues?.customerEmail || "",
      customerPhone: defaultValues?.customerPhone || "",
      driverLicenseNumber: defaultValues?.driverLicenseNumber || "",
    },
  })

  const { data: suggestionsData, isFetching } = useCustomerSuggestions(searchTerm)
  const suggestions = useMemo(() => suggestionsData?.data ?? [], [suggestionsData?.data])

  const handleEmailChange = useCallback(
    (value: string) => {
      form.setValue("customerEmail", value)
      if (value.length >= 2) {
        setSearchTerm(value)
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    },
    [form],
  )

  const handlePhoneChange = useCallback(
    (value: string) => {
      form.setValue("customerPhone", value)
      if (value.length >= 2) {
        setSearchTerm(value)
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    },
    [form],
  )

  const handleSelectSuggestion = useCallback(
    (suggestion: CustomerSuggestion) => {
      form.setValue("customerName", suggestion.name)
      form.setValue("customerEmail", suggestion.email)
      form.setValue("customerPhone", suggestion.phone)
      form.setValue("driverLicenseNumber", suggestion.driverLicenseNumber)
      setShowSuggestions(false)
      setSearchTerm(undefined)
    },
    [form],
  )

  const handleSubmit = useCallback(
    (data: CustomerDetailsInput) => {
      onSubmit(data)
    },
    [onSubmit],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Full Name</FormLabel>
              <FormControl>
                <FatInput placeholder="e.g., John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="customerEmail"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-sm font-semibold">Email Address</FormLabel>
                <FormControl>
                  <FatInput
                    type="email"
                    placeholder="john@example.com"
                    {...field}
                    onChange={e => handleEmailChange(e.target.value)}
                    onFocus={() => {
                      if (field.value && field.value.length >= 2) {
                        setShowSuggestions(true)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
                {showSuggestions && suggestions.length > 0 && (
                  <SuggestionsDropdown
                    suggestions={suggestions}
                    isLoading={isFetching}
                    onSelect={handleSelectSuggestion}
                    onClose={() => setShowSuggestions(false)}
                  />
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerPhone"
            render={({ field }) => (
              <FormItem className="relative">
                <FormLabel className="text-sm font-semibold">Phone Number</FormLabel>
                <FormControl>
                  <FatInput
                    placeholder="+1 555 000 0000"
                    {...field}
                    onChange={e => handlePhoneChange(e.target.value)}
                    onFocus={() => {
                      if (field.value && field.value.length >= 2) {
                        setShowSuggestions(true)
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
                {showSuggestions && suggestions.length > 0 && (
                  <SuggestionsDropdown
                    suggestions={suggestions}
                    isLoading={isFetching}
                    onSelect={handleSelectSuggestion}
                    onClose={() => setShowSuggestions(false)}
                  />
                )}
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="driverLicenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Driver License Number</FormLabel>
              <FormControl>
                <FatInput placeholder="DL-XXXXXXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Continue"}
          </button>
        </div>
      </form>
    </Form>
  )
}

interface SuggestionsDropdownProps {
  suggestions: CustomerSuggestion[]
  isLoading: boolean
  onSelect: (suggestion: CustomerSuggestion) => void
  onClose: () => void
}

function SuggestionsDropdown({
  suggestions,
  isLoading,
  onSelect,
  onClose,
}: SuggestionsDropdownProps) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50">
      <div className="max-h-72 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Searching customers...</span>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No customers found</div>
        ) : (
          <div className="divide-y">
            {suggestions.map(suggestion => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => {
                  onSelect(suggestion)
                  onClose()
                }}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900">{suggestion.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{suggestion.email}</div>
                  <div className="text-xs text-muted-foreground">{suggestion.phone}</div>
                  {suggestion.lastRentalDate && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Last: {new Date(suggestion.lastRentalDate).toLocaleDateString()} (
                      {suggestion.totalRentals} rentals)
                    </div>
                  )}
                </div>
                <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-1" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
