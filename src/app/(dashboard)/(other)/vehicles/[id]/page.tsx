"use client"

import { use } from "react"

import { AlertCircle, Loader2 } from "lucide-react"

import { useVehicleById } from "@/features/vehicle/hooks/queries/use-vehicle-queries"
import { IMAGE_ROLES } from "@/lib/contants"
import type { VehicleImage } from "@/types/vehicle"

import VehicleBreadcrumbs from "./_components/vehicle-breadcrumbs"
import { VehicleHeader } from "./_components/vehicle-header"
import { VehicleTabs } from "./_tabs"

const findFrontImage = (images: VehicleImage[]) => {
  return images.find((img: VehicleImage) => img.role === IMAGE_ROLES.FRONT) || images[0]
}

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, isLoading, isError, error } = useVehicleById(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading vehicle details...</p>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-destructive font-semibold">
            {error instanceof Error ? error.message : "Failed to load vehicle details"}
          </p>
          <p className="text-muted-foreground text-sm">
            Please try again later or go back to the vehicles list.
          </p>
        </div>
      </div>
    )
  }

  const { vehicle, statusHistory, images, currentStatus } = data

  return (
    <div className="space-y-8">
      <VehicleBreadcrumbs title={`${vehicle.brand} ${vehicle.model}`} />
      <VehicleHeader
        vehicle={vehicle}
        vehicleFrontImage={findFrontImage(images)}
        currentStatus={currentStatus}
      />
      <VehicleTabs vehicleId={id} vehicle={vehicle} statusHistory={statusHistory} images={images} />
    </div>
  )
}
