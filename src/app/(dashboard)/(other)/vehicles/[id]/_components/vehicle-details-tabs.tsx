"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { IdentityTab } from "./identity-tab"
import { SpecsTab } from "./specs-tab"
import { StatusHistoryTab } from "./status-history-tab"

type VehicleDetail = {
  id: string
  brand: string
  model: string
  vehicleType: string
  year: number
  licensePlate: string
  vin: string
  colorName: string
  colorLabel: string
  colorHex: string
  isBrandNew: boolean
  transmission: string
  fuelType: string
  seats: number
  doors: number
  baggageCapacity: number
  hasAC: boolean
  hasNavigation: boolean
  hasBluetooth: boolean
  isPetFriendly: boolean
  createdAt: string | null
  updatedAt: string | null
}

type StatusHistoryEntry = {
  id: string
  status: string
  statusUpdatedAt: string | null
  note: string | null
  changedBy: string | null
  changedByName: string | null
  changedByEmail: string | null
}

type Props = {
  vehicle: VehicleDetail
  statusHistory: StatusHistoryEntry[]
}

export function VehicleDetailsTabs({ vehicle, statusHistory }: Props) {
  return (
    <Tabs defaultValue="identity" className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-12 touch-manipulation">
        <TabsTrigger value="identity" className="text-base">
          Identity
        </TabsTrigger>
        <TabsTrigger value="specs" className="text-base">
          Specifications
        </TabsTrigger>
        <TabsTrigger value="history" className="text-base">
          Status History
        </TabsTrigger>
      </TabsList>

      <TabsContent value="identity" className="mt-6">
        <IdentityTab vehicle={vehicle} />
      </TabsContent>

      <TabsContent value="specs" className="mt-6">
        <SpecsTab vehicle={vehicle} />
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <StatusHistoryTab statusHistory={statusHistory} />
      </TabsContent>
    </Tabs>
  )
}
