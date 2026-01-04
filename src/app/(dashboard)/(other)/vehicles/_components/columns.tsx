"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Loader2, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FatButton } from "@/components/ui/fat-button"
import { VehicleStatus } from "@/features/vehicle/schemas/vehicle-form.schema"
import type { VehicleListItem } from "@/features/vehicle/types"

export type VehicleRow = VehicleListItem

type BuildColumnsOptions = {
  onChangeStatus: (opts: { id: string; status: VehicleStatus }) => void
  changingId?: string | null
  onRentVehicle: (id: string) => void
}

function statusVariant(status: VehicleRow["status"] | null | undefined) {
  switch (status) {
    case "Available":
      return "default" as const
    case "Rented":
      return "secondary" as const
    case "Maintenance":
      return "destructive" as const
    case "Retired":
      return "outline" as const
    default:
      return "secondary" as const
  }
}

function statusLabel(status: VehicleRow["status"] | null | undefined) {
  return status ?? "Unknown"
}

export const buildVehicleColumns = ({
  onChangeStatus,
  changingId,
  onRentVehicle,
}: BuildColumnsOptions): ColumnDef<VehicleRow>[] => [
  {
    accessorKey: "licensePlate",
    header: "Plate",
    cell: ({ row }) => (
      <div className="font-semibold tracking-wide text-base">{row.original.licensePlate}</div>
    ),
    enableHiding: false,
    enableSorting: true,
  },
  {
    accessorKey: "brand",
    header: "Vehicle",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-base leading-tight">
          {row.original.brand} {row.original.model}
        </span>
        <span className="text-muted-foreground text-sm">{row.original.vehicleType}</span>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "year",
    header: "Year",
    enableSorting: true,
  },
  {
    accessorKey: "transmission",
    header: "Transmission",
    enableSorting: false,
  },
  {
    accessorKey: "fuelType",
    header: "Fuel",
    enableSorting: false,
  },
  {
    id: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <Badge variant={statusVariant(row.original.status)} className="px-3 py-1 text-sm">
          {statusLabel(row.original.status)}
        </Badge>
        {row.original.statusUpdatedAt ? (
          <span className="text-xs text-muted-foreground">
            Updated {new Date(row.original.statusUpdatedAt).toLocaleDateString()}
          </span>
        ) : null}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="">
        <div data-row-action className="flex justify-end gap-3">
          <FatButton onClick={() => onRentVehicle(row.original.id)}>Rent this vehicle</FatButton>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <FatButton variant="ghost" className=" p-0" aria-label="Row actions">
                {changingId === row.original.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal />
                )}
              </FatButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px]">
              <DropdownMenuLabel>Change status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onChangeStatus({ id: row.original.id, status: "Available" })}
              >
                Available
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onChangeStatus({ id: row.original.id, status: "Rented" })}
              >
                Rented
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onChangeStatus({ id: row.original.id, status: "Maintenance" })}
              >
                Maintenance
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onChangeStatus({ id: row.original.id, status: "Retired" })}
              >
                Retired
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-muted-foreground" disabled>
                VIN: {row.original.vin}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    ),
  },
]
