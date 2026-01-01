import { Badge } from "@/components/ui/badge"
import type { VehicleDetail, VehicleStatus } from "@/types/vehicle"

interface VehicleHeaderProps {
  vehicle: VehicleDetail
  currentStatus: VehicleStatus
}

export function VehicleHeader({ vehicle, currentStatus }: VehicleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{vehicle.licensePlate}</h1>
          {vehicle.isBrandNew && (
            <Badge variant="default" className="text-xs">
              Brand New
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-lg">
          {vehicle.brand} {vehicle.model} • {vehicle.vehicleType} • {vehicle.year}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Current Status:</span>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {currentStatus}
          </Badge>
        </div>
      </div>
    </div>
  )
}
