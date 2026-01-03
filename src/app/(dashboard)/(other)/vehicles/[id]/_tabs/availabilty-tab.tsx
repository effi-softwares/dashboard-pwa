"use client"

import { CalendarDays, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { useOnborda } from "onborda"

import SegmentedToggle, { SegmentedToggleItem } from "@/components/segmented-toggle"
import { FatButton } from "@/components/ui/fat-button"

export const viewModeItem: SegmentedToggleItem[] = [
  {
    label: "Daily",
    icon: CalendarDays,
    value: "daily",
    ariaLabel: "Select daily view mode",
  },
  {
    label: "Weekly",
    icon: CalendarDays,
    value: "weekly",
    ariaLabel: "Select weekly view mode",
  },
  {
    label: "Monthly",
    icon: CalendarDays,
    value: "monthly",
    ariaLabel: "Select monthly view mode",
  },
]

const statusAndColors = [
  { status: "Available", color: "bg-green-500/20 border border-green-500" },
  { status: "Booked", color: "bg-amber-500" },
  { status: "Active Rental", color: "bg-blue-500" },
  { status: "Maintenance", color: "bg-orange-500" },
]

function AvailabilityTab() {
  const { startOnborda } = useOnborda()

  return (
    <div className="space-y-8 mt-6">
      <div className="flex items-start">
        <div className="space-y-4" data-onborda="availability-view-mode">
          <SegmentedToggle spacing={2} items={viewModeItem} />
          <div
            className="flex flex-wrap items-center gap-4 text-sm"
            data-onborda="availability-status-legend"
          >
            {statusAndColors.map(({ status, color }) => (
              <div key={status} className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded ${color}`} />
                <p>{status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 ml-auto" data-onborda="availability-calendar-nav">
          <FatButton
            variant="ghost"
            size="icon"
            className="px-6"
            aria-label="Show availability tour"
            onClick={() => startOnborda("vehicleAvailability")}
          >
            <Info className="h-4 w-4" />
          </FatButton>
          <FatButton variant="outline">
            <p>Today</p>
          </FatButton>
          <div className="flex items-center bg-secondary rounded-lg">
            <FatButton variant="ghost" size="icon" className="h-9 w-9">
              <ChevronLeft className="h-4 w-4" />
            </FatButton>
            <span className="px-3 text-sm font-medium min-w-[140px] text-center">
              <p>Jan - 2025</p>
            </span>
            <FatButton variant="ghost" size="icon" className="h-9 w-9">
              <ChevronRight className="h-4 w-4" />
            </FatButton>
          </div>
        </div>

        <div className=""></div>
      </div>
    </div>
  )
}

export default AvailabilityTab
