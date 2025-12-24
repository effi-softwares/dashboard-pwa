import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

type VehicleDetail = {
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
  createdAt: string | null
  updatedAt: string | null
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

export function IdentityTab({ vehicle }: Props) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 divide-y">
          <InfoRow label="License Plate" value={vehicle.licensePlate} />
          <InfoRow label="VIN" value={vehicle.vin} />
          <InfoRow label="Brand" value={vehicle.brand} />
          <InfoRow label="Model" value={vehicle.model} />
          <InfoRow label="Vehicle Type" value={vehicle.vehicleType} />
          <InfoRow label="Year" value={vehicle.year} />
          <InfoRow label="Condition" value={vehicle.isBrandNew ? "Brand New" : "Pre-owned"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Color</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-lg border-2 shadow-sm"
              style={{ backgroundColor: vehicle.colorHex }}
              aria-label={`Color: ${vehicle.colorLabel}`}
            />
            <div className="space-y-1">
              <p className="text-base font-semibold">{vehicle.colorLabel}</p>
              <p className="text-sm text-muted-foreground">{vehicle.colorName}</p>
              <p className="text-xs text-muted-foreground font-mono">{vehicle.colorHex}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Record Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 divide-y">
          <InfoRow
            label="Created At"
            value={
              vehicle.createdAt
                ? new Date(vehicle.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })
                : "Unknown"
            }
          />
          <InfoRow
            label="Last Updated"
            value={
              vehicle.updatedAt
                ? new Date(vehicle.updatedAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })
                : "Unknown"
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
