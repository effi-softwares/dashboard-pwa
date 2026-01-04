import { Badge } from "@/components/ui/badge"
import { BlobImage } from "@/components/ui/blob-image"
import type { VehicleDetail, VehicleImage, VehicleStatus } from "@/types/vehicle"

interface VehicleHeaderProps {
  vehicle: VehicleDetail
  vehicleFrontImage: VehicleImage
  currentStatus: VehicleStatus
}

export function VehicleHeader({ vehicle, vehicleFrontImage, currentStatus }: VehicleHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="h-20 w-30 rounded-xl overflow-hidden border bg-muted">
        <BlobImage
          src={vehicleFrontImage.url}
          blurDataURL={vehicleFrontImage.blurDataURL ?? undefined}
          alt={`Vehicle image (${vehicleFrontImage.role})`}
          width={800}
          height={600}
          className="h-20 w-30 object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
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
      </div>
      <div className="flex-1"></div>
      <Badge variant="secondary" className="text-sm px-3 py-1">
        {currentStatus}
      </Badge>
    </div>
  )
}
