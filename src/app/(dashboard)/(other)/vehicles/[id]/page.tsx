import { notFound } from "next/navigation"

import { requireAuth } from "@/lib/auth/get-session"

import { fetchVehicleDetails } from "./_actions"
import VehicleBreadcrumbs from "./_components/vehicle-breadcrumbs"
import { VehicleDetailsTabs } from "./_components/vehicle-details-tabs"
import { VehicleHeader } from "./_components/vehicle-header"
import { VehicleImages } from "./_components/vehicle-images"

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireAuth()

  const data = await fetchVehicleDetails(id)
  if (!data) {
    notFound()
  }

  const { vehicle, statusHistory, images, currentStatus } = data

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <VehicleBreadcrumbs title={`${vehicle.brand} ${vehicle.model}`} />
      <VehicleHeader vehicle={vehicle} currentStatus={currentStatus} />
      <VehicleImages images={images} />
      <VehicleDetailsTabs vehicle={vehicle} statusHistory={statusHistory} />
    </div>
  )
}
