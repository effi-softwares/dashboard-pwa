import { notFound } from "next/navigation"

import { requireAuth } from "@/lib/auth/get-session"
import { IMAGE_ROLES } from "@/lib/contants"
import { VehicleImage } from "@/types/vehicle"

import { fetchVehicleDetails } from "./_actions"
import VehicleBreadcrumbs from "./_components/vehicle-breadcrumbs"
import { VehicleHeader } from "./_components/vehicle-header"
import { VehicleTabs } from "./_tabs"

const findFrontImage = (images: VehicleImage[]) => {
  return images.find((img: VehicleImage) => img.role === IMAGE_ROLES.FRONT) || images[0]
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireAuth()

  const data = await fetchVehicleDetails(id)
  if (!data) {
    notFound()
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
      <VehicleTabs vehicle={vehicle} statusHistory={statusHistory} />
    </div>
  )
}
