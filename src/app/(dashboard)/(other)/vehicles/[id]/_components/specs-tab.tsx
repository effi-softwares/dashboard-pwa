import { Check, X } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type VehicleDetail = {
  transmission: string
  fuelType: string
  seats: number
  doors: number
  baggageCapacity: number
  hasAC: boolean
  hasNavigation: boolean
  hasBluetooth: boolean
  isPetFriendly: boolean
}

type Props = {
  vehicle: VehicleDetail
}

function InfoRow({ label, value }: { label: string; value: string | number | React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-3">
      <span className="text-sm font-medium text-muted-foreground min-w-[140px]">{label}</span>
      <span className="text-base font-medium">{value}</span>
    </div>
  )
}

function FeatureItem({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={`flex items-center justify-center w-6 h-6 rounded-full ${
          enabled
            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
            : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
        }`}
      >
        {enabled ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </div>
      <span className={`text-base ${enabled ? "font-medium" : "text-muted-foreground"}`}>
        {label}
      </span>
    </div>
  )
}

export function SpecsTab({ vehicle }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 divide-y">
          <InfoRow label="Transmission" value={vehicle.transmission} />
          <InfoRow label="Fuel Type" value={vehicle.fuelType} />
          <InfoRow label="Seating Capacity" value={`${vehicle.seats} seats`} />
          <InfoRow label="Number of Doors" value={vehicle.doors} />
          <InfoRow label="Baggage Capacity" value={`${vehicle.baggageCapacity} large bags`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features & Amenities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <FeatureItem label="Air Conditioning" enabled={vehicle.hasAC} />
          <FeatureItem label="Navigation System" enabled={vehicle.hasNavigation} />
          <FeatureItem label="Bluetooth Connectivity" enabled={vehicle.hasBluetooth} />
          <FeatureItem label="Pet Friendly" enabled={vehicle.isPetFriendly} />
        </CardContent>
      </Card>
    </div>
  )
}
