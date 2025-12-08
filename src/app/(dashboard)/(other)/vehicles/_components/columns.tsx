"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Vehicle = {
  id: string
  name: string
  model: string
  brand: string
  year: number
  status: "available" | "rented" | "maintenance"
}

export const data: Vehicle[] = [
  {
    id: "m5gr84i9",
    name: "Toyota Camry",
    model: "SE",
    brand: "Toyota",
    year: 2020,
    status: "available",
  },
  {
    id: "3u1reuv4",
    name: "Honda Accord",
    model: "EX",
    brand: "Honda",
    year: 2019,
    status: "rented",
  },
  {
    id: "derv1ws0",
    name: "Ford Mustang",
    model: "GT",
    brand: "Ford",
    year: 2021,
    status: "maintenance",
  },
  {
    id: "5kma53ae",
    name: "Chevrolet Malibu",
    model: "LT",
    brand: "Chevrolet",
    year: 2018,
    status: "available",
  },
  {
    id: "bhqecj4p",
    name: "Nissan Altima",
    model: "SL",
    brand: "Nissan",
    year: 2022,
    status: "rented",
  },
]

export const columns: ColumnDef<Vehicle>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
