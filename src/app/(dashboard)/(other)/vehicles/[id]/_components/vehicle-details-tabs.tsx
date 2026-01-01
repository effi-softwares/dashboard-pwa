"use client"

import { useMemo } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { StatusHistoryEntry, VehicleDetail } from "@/types/vehicle"

import { IdentityTab } from "./identity-tab"
import { SpecsTab } from "./specs-tab"
import { StatusHistoryTab } from "./status-history-tab"

type Props = {
  vehicle: VehicleDetail
  statusHistory: StatusHistoryEntry[]
}

export type Tab = {
  label: string
  value: string
  tab: React.ReactNode
}

export function VehicleDetailsTabs({ vehicle, statusHistory }: Props) {
  const vehicleTabs = useMemo(
    () => [
      { label: "Availability", value: "availability", tab: null },
      { label: "Rates", value: "rates", tab: null },
      { label: "Info", value: "identity", tab: <IdentityTab vehicle={vehicle} /> },
      { label: "Specs", value: "specs", tab: <SpecsTab vehicle={vehicle} /> },
      { label: "Gallery", value: "gallery", tab: null },
      {
        label: "Status History",
        value: "history",
        tab: <StatusHistoryTab statusHistory={statusHistory} />,
      },
    ],
    [statusHistory, vehicle],
  )

  const defaultTab = useMemo(() => vehicleTabs[0].value, [vehicleTabs])

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="w-full touch-manipulation">
        {vehicleTabs.map((tab: Tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {vehicleTabs.map((tab: Tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-4">
          {tab.tab}
        </TabsContent>
      ))}
    </Tabs>
  )
}
