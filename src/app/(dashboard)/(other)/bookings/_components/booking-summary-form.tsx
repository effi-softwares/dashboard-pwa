"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { BookingListItem } from "@/features/booking/types"

interface BookingSummaryProps {
  vehicle: {
    id: string
    brand: string
    model: string
    licensePlate: string
    vehicleType: string
    year: number
  }
  customerName: string
  customerEmail: string
  customerPhone: string
  bookingStartDate: Date
  bookingEndDate: Date
  dailyRate: number
  totalDays: number
  totalAmount: number
  securityDepositAmount: number
  onConfirm: () => void
  isLoading?: boolean
  onBack?: () => void
}

export function BookingSummaryForm({
  vehicle,
  customerName,
  customerEmail,
  customerPhone,
  bookingStartDate,
  bookingEndDate,
  dailyRate,
  totalDays,
  totalAmount,
  securityDepositAmount,
  onConfirm,
  isLoading = false,
  onBack,
}: BookingSummaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Rental Summary</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Please review the rental details before completing the booking.
        </p>
      </div>

      <Card className="p-4">
        <h4 className="font-semibold mb-3 text-sm">Vehicle Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vehicle</span>
            <span className="font-medium">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">License Plate</span>
            <span className="font-medium">{vehicle.licensePlate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type</span>
            <span className="font-medium">{vehicle.vehicleType}</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="font-semibold mb-3 text-sm">Customer Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{customerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{customerEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone</span>
            <span className="font-medium">{customerPhone}</span>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="font-semibold mb-3 text-sm">Rental Period</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-in</span>
            <span className="font-medium">{bookingStartDate.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-out</span>
            <span className="font-medium">{bookingEndDate.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Days</span>
            <span className="font-medium">{totalDays} days</span>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-slate-50">
        <h4 className="font-semibold mb-3 text-sm">Price Breakdown</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Daily Rate</span>
            <span className="font-medium">€{dailyRate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">× {totalDays} Days</span>
            <span className="font-medium">€{totalAmount}</span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="text-muted-foreground">Security Deposit</span>
            <span className="font-medium">€{securityDepositAmount}</span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="font-semibold">Total Due</span>
            <span className="font-semibold text-lg text-blue-600">
              €{totalAmount + securityDepositAmount}
            </span>
          </div>
        </div>
      </Card>

      <div className="flex gap-3 justify-between pt-4">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <div className="flex-1" />
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="px-8 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Complete Rental"}
        </Button>
      </div>
    </div>
  )
}
