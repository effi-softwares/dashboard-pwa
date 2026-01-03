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
    <div className="space-y-8 mt-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Availability & Schedule
          </h2>
          <Info
            className="h-5 w-5 cursor-pointer text-slate-400 hover:text-slate-600"
            aria-label="Show availability tour"
            onClick={() => startOnborda("vehicleAvailability")}
          />
        </div>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          Track this vehicle’s reservation flow and upcoming service requirements.
        </p>
      </div>
      <div className="flex items-start">
        <div className="space-y-4">
          <div data-onborda="availability-view-mode">
            <SegmentedToggle spacing={2} items={viewModeItem} />
          </div>
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

        <div className="flex gap-2 ml-auto">
          <div className="flex gap-2" data-onborda="availability-calendar-nav">
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
        </div>
      </div>
      <div className="border rounded-xl h-100 grid place-items-center">
        <p>Availability chart goes here</p>
      </div>
      <div className="border rounded-xl h-100 grid place-items-center">
        <p>Booking list goes here</p>
      </div>
    </div>
  )
}

export default AvailabilityTab
