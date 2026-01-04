"use client"

import { MouseEvent, useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FatButton } from "@/components/ui/fat-button"
import { FatInput } from "@/components/ui/fat-input"
import { FatSelect, FatSelectTrigger } from "@/components/ui/fat-select"
import { SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useChangeVehicleStatus } from "@/features/vehicle/mutations/use-change-vehicle-status"
import { useVehicles } from "@/features/vehicle/queries/use-vehicle-queries"
import {
  FuelTypeEnum,
  TransmissionEnum,
  VehicleStatus,
  VehicleStatusEnum,
} from "@/features/vehicle/schemas/vehicle-form.schema"
import { useNewRentalContext } from "@/providers/new-rental-provider"

import VehicleFormClient from "../forms/index.client"
import { buildVehicleColumns } from "./columns"

export function VehicleTable() {
  const router = useRouter()
  const { showDrawer } = useNewRentalContext()

  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [fuelFilter, setFuelFilter] = useState<string | undefined>(undefined)
  const [transmissionFilter, setTransmissionFilter] = useState<string | undefined>(undefined)
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>("")

  const primarySort = sorting[0]
  const sortBy = primarySort?.id
  const sortDir = primarySort?.desc ? "desc" : "asc"

  const { data, isLoading, isFetching, isError } = useVehicles({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    search,
    status: statusFilter,
    fuelType: fuelFilter,
    transmission: transmissionFilter,
    vehicleType: vehicleTypeFilter,
    sortBy,
    sortDir,
  })

  const changeStatus = useChangeVehicleStatus()

  const handleSearch = useCallback(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setSearch(searchInput.trim())
  }, [searchInput])

  const handleChangeStatus = useCallback(
    ({ id, status }: { id: string; status: VehicleStatus }) => {
      changeStatus.mutate({ id, status })
    },
    [changeStatus],
  )

  const handleRowClick = useCallback(
    (event: MouseEvent<HTMLTableRowElement>, rowId: string) => {
      const target = event.target as HTMLElement
      if (target.closest("[data-row-action]")) return
      router.push(`/vehicles/${rowId}`)
    },
    [router],
  )

  const columns = useMemo(
    () =>
      buildVehicleColumns({
        onChangeStatus: handleChangeStatus,
        changingId: changeStatus.isPending ? (changeStatus.variables?.id ?? null) : null,
        onRentVehicle: id => showDrawer(id),
      }),
    [changeStatus.isPending, changeStatus.variables?.id, handleChangeStatus, showDrawer],
  )

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: {
      sorting,
      pagination,
    },
    pageCount: data?.totalPages ?? 1,
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-wrap gap-3 items-center shrink-0">
        <FatInput
          placeholder="Search brand, model, plate, VIN"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleSearch()
          }}
          className="w-full sm:w-[320px] h-11 text-base"
        />
        <FatButton onClick={handleSearch} className="h-11 px-5" variant="default">
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </FatButton>
        <FatSelect
          value={statusFilter ?? "all"}
          onValueChange={val => setStatusFilter(val === "all" ? undefined : val)}
        >
          <FatSelectTrigger className="h-11 w-[170px]">
            <SelectValue placeholder="Status" />
          </FatSelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {VehicleStatusEnum.options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </FatSelect>

        <FatSelect
          value={fuelFilter ?? "all"}
          onValueChange={val => setFuelFilter(val === "all" ? undefined : val)}
        >
          <FatSelectTrigger className="h-11 w-[150px]">
            <SelectValue placeholder="Fuel" />
          </FatSelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fuels</SelectItem>
            {FuelTypeEnum.options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </FatSelect>

        <FatSelect
          value={transmissionFilter ?? "all"}
          onValueChange={val => setTransmissionFilter(val === "all" ? undefined : val)}
        >
          <FatSelectTrigger className="h-11 w-[170px]">
            <SelectValue placeholder="Transmission" />
          </FatSelectTrigger>
          <SelectContent>
            <SelectItem value="all">All transmissions</SelectItem>
            {TransmissionEnum.options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </FatSelect>
        <FatInput
          placeholder="Type (SUV, Sedan...)"
          value={vehicleTypeFilter}
          onChange={e => setVehicleTypeFilter(e.target.value)}
          className="w-full sm:w-[200px] h-11 text-base"
        />
        <div className="flex-1"></div>
        <VehicleFormClient />
      </div>

      <div className="flex-1 min-h-0 border rounded-md flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background shadow-sm">
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="text-sm bg-background">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" /> Loading vehicles...
                    </div>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" /> Failed to load vehicles
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    onClick={event => handleRowClick(event, row.original.id)}
                    key={row.id}
                    className="touch-manipulation cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 justify-between shrink-0 bg-background">
        <div className="text-muted-foreground text-sm">
          Page {pagination.pageIndex + 1} of {data?.totalPages ?? "-"} • {data?.total ?? 0} vehicles
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isFetching}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isFetching}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
