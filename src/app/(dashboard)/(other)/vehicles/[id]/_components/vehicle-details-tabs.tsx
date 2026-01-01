"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StatusHistoryEntry, VehicleDetail } from "@/types/vehicle"

import { IdentityTab } from "./identity-tab"
import { SpecsTab } from "./specs-tab"
import { StatusHistoryTab } from "./status-history-tab"

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
