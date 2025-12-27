import Link from "next/link"
import { notFound } from "next/navigation"

import { and, desc, eq } from "drizzle-orm"
import { ArrowLeft } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { BlobImage } from "@/components/ui/blob-image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/db/db"
import { mediaTable, user, vehicleMediaTable, vehicleStatusTable, vehicleTable } from "@/db/schemas"
import { requireAuth } from "@/lib/auth/get-session"

import { VehicleDetailsTabs } from "./_components/vehicle-details-tabs"

type VehicleDetail = {
  id: string
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
  transmission: string
  fuelType: string
  seats: number
  doors: number
  baggageCapacity: number
  hasAC: boolean
  hasNavigation: boolean
  hasBluetooth: boolean
  isPetFriendly: boolean
  createdAt: string | null
  updatedAt: string | null
}

type StatusHistoryEntry = {
  id: string
  status: string
  statusUpdatedAt: string | null
  note: string | null
  changedBy: string | null
  changedByName: string | null
  changedByEmail: string | null
}

type VehicleDetailResponse = {
  vehicle: VehicleDetail
  statusHistory: StatusHistoryEntry[]
  images: VehicleImage[]
}

type VehicleImage = {
  id: string
  url: string
  blurDataURL: string | null
  role: "front" | "back" | "interior"
  sortOrder: number
  createdAt: string | null
}

async function getVehicleDetails(id: string): Promise<VehicleDetailResponse | null> {
  try {
    await requireAuth()

    const dbClient = db()

    const [vehicle] = await dbClient
      .select({
        id: vehicleTable.id,
        brand: vehicleTable.brand,
        model: vehicleTable.model,
        vehicleType: vehicleTable.vehicleType,
        year: vehicleTable.year,
        licensePlate: vehicleTable.licensePlate,
        vin: vehicleTable.vin,
        colorName: vehicleTable.colorName,
        colorLabel: vehicleTable.colorLabel,
        colorHex: vehicleTable.colorHex,
        isBrandNew: vehicleTable.isBrandNew,
        transmission: vehicleTable.transmission,
        fuelType: vehicleTable.fuelType,
        seats: vehicleTable.seats,
        doors: vehicleTable.doors,
        baggageCapacity: vehicleTable.baggageCapacity,
        hasAC: vehicleTable.hasAC,
        hasNavigation: vehicleTable.hasNavigation,
        hasBluetooth: vehicleTable.hasBluetooth,
        isPetFriendly: vehicleTable.isPetFriendly,
        createdAt: vehicleTable.createdAt,
        updatedAt: vehicleTable.updatedAt,
      })
      .from(vehicleTable)
      .where(eq(vehicleTable.id, id))
      .limit(1)

    if (!vehicle) {
      return null
    }

    const statusHistory = await dbClient
      .select({
        id: vehicleStatusTable.id,
        status: vehicleStatusTable.status,
        statusUpdatedAt: vehicleStatusTable.statusUpdatedAt,
        note: vehicleStatusTable.note,
        changedBy: vehicleStatusTable.changedBy,
        changedByName: user.name,
        changedByEmail: user.email,
      })
      .from(vehicleStatusTable)
      .leftJoin(user, eq(vehicleStatusTable.changedBy, user.id))
      .where(eq(vehicleStatusTable.vehicleId, id))
      .orderBy(desc(vehicleStatusTable.statusUpdatedAt))

    const images = await dbClient
      .select({
        id: mediaTable.id,
        url: mediaTable.url,
        blurDataURL: mediaTable.blurDataURL,
        role: vehicleMediaTable.role,
        sortOrder: vehicleMediaTable.sortOrder,
        createdAt: vehicleMediaTable.createdAt,
      })
      .from(vehicleMediaTable)
      .innerJoin(mediaTable, eq(vehicleMediaTable.mediaId, mediaTable.id))
      .where(
        and(
          eq(vehicleMediaTable.vehicleId, id),
          eq(vehicleMediaTable.isActive, true),
          eq(mediaTable.type, "image"),
        ),
      )
      .orderBy(vehicleMediaTable.sortOrder, desc(vehicleMediaTable.createdAt))

    const serializedImages = images.map(image => ({
      ...image,
      createdAt: image.createdAt?.toISOString() ?? null,
    }))

    return {
      vehicle: {
        ...vehicle,
        createdAt: vehicle.createdAt?.toISOString() ?? null,
        updatedAt: vehicle.updatedAt?.toISOString() ?? null,
      },
      statusHistory: statusHistory.map(entry => ({
        ...entry,
        statusUpdatedAt: entry.statusUpdatedAt?.toISOString() ?? null,
      })),
      images: serializedImages,
    }
  } catch (error) {
    console.error("Failed to fetch vehicle details:", error)
    return null
  }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getVehicleDetails(id)

  if (!data) {
    notFound()
  }

  const { vehicle, statusHistory, images } = data
  const currentStatus = statusHistory[0]?.status ?? "Unknown"
  const hasImages = images.length > 0

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <div>
        <Link href="/vehicles">
          <Button variant="ghost" className="mb-4 h-10" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vehicles
          </Button>
        </Link>

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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Images</CardTitle>
        </CardHeader>
        <CardContent>
          {hasImages ? (
            <div className="grid gap-4 md:grid-cols-3">
              {images.map(image => (
                <div
                  key={image.id}
                  className="relative overflow-hidden rounded-lg border bg-muted"
                  aria-label={`Vehicle image (${image.role})`}
                >
                  <BlobImage
                    src={image.url}
                    blurDataURL={image.blurDataURL ?? undefined}
                    alt={`Vehicle image (${image.role})`}
                    width={800}
                    height={600}
                    className="h-56 w-full object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="px-3 py-2 border-t bg-background text-sm font-medium capitalize">
                    {image.role}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No images uploaded for this vehicle yet.
            </p>
          )}
        </CardContent>
      </Card>

      <VehicleDetailsTabs vehicle={vehicle} statusHistory={statusHistory} />
    </div>
  )
}
