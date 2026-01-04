"use client"

import { useCallback, useMemo, useState } from "react"

import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FatButton } from "@/components/ui/fat-button"
import { FatInput } from "@/components/ui/fat-input"
import { useVehicles } from "@/features/vehicle/queries/use-vehicle-queries"

interface VehicleSelectionFormProps {
  onSelect: (vehicleId: string) => void
  isLoading?: boolean
  onBack?: () => void
  preselectedId?: string | null
}

export function VehicleSelectionForm({
  onSelect,
  isLoading = false,
  onBack,
  preselectedId,
}: VehicleSelectionFormProps) {
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | undefined>("Available")
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })

  const { data, isFetching } = useVehicles({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    search,
    status: statusFilter,
  })

  const handleSearch = useCallback(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setSearch(searchInput.trim())
  }, [searchInput])

  const handleSelectVehicle = useCallback(
    (vehicleId: string) => {
      onSelect(vehicleId)
    },
    [onSelect],
  )

  const vehicles = useMemo(() => data?.data ?? [], [data?.data])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Vehicle</h3>
        <p className="text-sm text-muted-foreground mb-6">Choose an available vehicle to rent.</p>
      </div>

      <div className="flex gap-3">
        <FatInput
          placeholder="Search by brand, model, or license plate"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleSearch()
          }}
          className="flex-1"
        />
        <FatButton onClick={handleSearch} disabled={isFetching}>
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </FatButton>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No vehicles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map(vehicle => (
            <button
              key={vehicle.id}
              onClick={() => handleSelectVehicle(vehicle.id)}
              disabled={isLoading || isFetching}
              className={`p-4 border rounded-lg text-left transition-all ${
                preselectedId === vehicle.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              } disabled:opacity-50`}
            >
              <div className="font-semibold text-sm">
                {vehicle.brand} {vehicle.model}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {vehicle.year} • {vehicle.vehicleType}
              </div>
              <div className="text-xs font-mono text-blue-600 mt-2">{vehicle.licensePlate}</div>
              <div className="text-xs text-muted-foreground mt-1">Seats: {vehicle.seats}</div>
            </button>
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            disabled={pagination.pageIndex === 0}
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.pageIndex + 1} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={pagination.pageIndex >= data.totalPages - 1}
            onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      <div className="flex gap-3 justify-between pt-4">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
      </div>
    </div>
  )
}
