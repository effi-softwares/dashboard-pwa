"use client"

import { CheckCircle2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useNewRentalContext } from "@/providers/new-rental-provider"

export function DashboardActions() {
  const { showDrawer } = useNewRentalContext()

  return (
    <div className="flex gap-3">
      <Button
        onClick={() => showDrawer(undefined)}
        className="flex-1 sm:flex-none gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
      >
        <Plus className="h-4 w-4" />
        New Rental
      </Button>
      <Button
        onClick={() => showDrawer(undefined)}
        variant="outline"
        className="flex-1 sm:flex-none gap-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 shadow-sm"
      >
        <CheckCircle2 className="h-4 w-4" />
        Complete Return
      </Button>
    </div>
  )
}
