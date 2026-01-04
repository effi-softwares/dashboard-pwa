"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import type { BookingListItem } from "@/features/booking/types"

export type BookingRow = BookingListItem

function statusVariant(status: BookingRow["status"] | null | undefined) {
  switch (status) {
    case "Pending":
      return "secondary" as const
    case "Confirmed":
      return "default" as const
    case "CheckoutStarted":
      return "outline" as const
    case "CheckoutCompleted":
      return "outline" as const
    case "Active":
      return "default" as const
    case "Completed":
      return "secondary" as const
    case "Cancelled":
      return "destructive" as const
    default:
      return "secondary" as const
  }
}

function statusLabel(status: BookingRow["status"] | null | undefined) {
  return status ?? "Unknown"
}

export const bookingColumns: ColumnDef<BookingRow>[] = [
  {
    accessorKey: "id",
    header: "Booking ID",
    cell: ({ row }) => <div className="text-xs font-mono">{row.original.id.slice(0, 8)}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "vehicleBrand",
    header: "Vehicle",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm leading-tight">
          {row.original.vehicleBrand} {row.original.vehicleModel}
        </span>
        <span className="text-xs text-muted-foreground">{row.original.vehicleLicensePlate}</span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.original.customerName}</span>
        <span className="text-xs text-muted-foreground">{row.original.customerEmail}</span>
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "bookingStartDate",
    header: "Start Date",
    cell: ({ row }) => (
      <span className="text-sm">
        {new Date(row.original.bookingStartDate).toLocaleDateString()}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "bookingEndDate",
    header: "End Date",
    cell: ({ row }) => (
      <span className="text-sm">{new Date(row.original.bookingEndDate).toLocaleDateString()}</span>
    ),
    enableSorting: true,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <Badge variant={statusVariant(row.original.status)} className="px-3 py-1 text-sm w-fit">
          {statusLabel(row.original.status)}
        </Badge>
        {row.original.statusUpdatedAt ? (
          <span className="text-xs text-muted-foreground">
            {new Date(row.original.statusUpdatedAt).toLocaleDateString()}
          </span>
        ) : null}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => <div className="font-semibold text-sm">€{row.original.totalAmount}</div>,
    enableSorting: true,
  },
]
