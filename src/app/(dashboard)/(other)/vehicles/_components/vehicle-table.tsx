"use client"

import * as React from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FuelTypeEnum,
  TransmissionEnum,
  VehicleStatus,
  VehicleStatusEnum,
} from "@/zod/vehicle-form"

import { buildVehicleColumns, VehicleRow } from "./columns"

type VehiclesResponse = {
  data: VehicleRow[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export function VehicleTable() {
  const queryClient = useQueryClient()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 })
  const [searchInput, setSearchInput] = React.useState("")
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>(undefined)
  const [fuelFilter, setFuelFilter] = React.useState<string | undefined>(undefined)
  const [transmissionFilter, setTransmissionFilter] = React.useState<string | undefined>(undefined)
  const [vehicleTypeFilter, setVehicleTypeFilter] = React.useState<string>("")

  const primarySort = sorting[0]
  const sortBy = primarySort?.id
  const sortDir = primarySort?.desc ? "desc" : "asc"

  const { data, isLoading, isFetching, isError } = useQuery<VehiclesResponse>({
    queryKey: [
      "vehicles",
      {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        search,
        statusFilter,
        fuelFilter,
        transmissionFilter,
        vehicleTypeFilter,
        sortBy,
        sortDir,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set("page", String(pagination.pageIndex + 1))
      params.set("pageSize", String(pagination.pageSize))
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      if (fuelFilter) params.set("fuelType", fuelFilter)
      if (transmissionFilter) params.set("transmission", transmissionFilter)
      if (vehicleTypeFilter) params.set("vehicleType", vehicleTypeFilter)
      if (sortBy) params.set("sortBy", sortBy)
      if (sortDir) params.set("sortDir", sortDir)

      const res = await fetch(`/api/vehicles?${params.toString()}`)
      if (!res.ok) {
        throw new Error("Failed to fetch vehicles")
      }
      return res.json()
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  })

  const changeStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: VehicleStatus }) => {
      const res = await fetch(`/api/vehicles/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        throw new Error("Failed to update status")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
    },
  })

  const handleSearch = React.useCallback(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setSearch(searchInput.trim())
  }, [searchInput])

  const handleChangeStatus = React.useCallback(
    ({ id, status }: { id: string; status: VehicleStatus }) => {
      changeStatus.mutate({ id, status })
    },
    [changeStatus],
  )

  const columns = React.useMemo(
    () =>
      buildVehicleColumns({
        onChangeStatus: handleChangeStatus,
        changingId: changeStatus.isPending ? (changeStatus.variables?.id ?? null) : null,
      }),
    [changeStatus.isPending, changeStatus.variables, handleChangeStatus],
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
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Search brand, model, plate, VIN"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleSearch()
          }}
          className="w-full sm:w-[320px] h-11 text-base"
        />
        <Button onClick={handleSearch} className="h-11 px-5" variant="default">
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
        <Select
          value={statusFilter ?? "all"}
          onValueChange={val => setStatusFilter(val === "all" ? undefined : val)}
        >
          <SelectTrigger className="h-11 w-[170px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {VehicleStatusEnum.options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={fuelFilter ?? "all"}
          onValueChange={val => setFuelFilter(val === "all" ? undefined : val)}
        >
          <SelectTrigger className="h-11 w-[150px]">
            <SelectValue placeholder="Fuel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fuels</SelectItem>
            {FuelTypeEnum.options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={transmissionFilter ?? "all"}
          onValueChange={val => setTransmissionFilter(val === "all" ? undefined : val)}
        >
          <SelectTrigger className="h-11 w-[170px]">
            <SelectValue placeholder="Transmission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All transmissions</SelectItem>
            {TransmissionEnum.options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Type (SUV, Sedan...)"
          value={vehicleTypeFilter}
          onChange={e => setVehicleTypeFilter(e.target.value)}
          className="w-full sm:w-[200px] h-11 text-base"
        />
      </div>

      <div className="rounded-md border overflow-visible">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} className="text-sm">
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
                <TableRow key={row.id} className="touch-manipulation">
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

      <div className="flex flex-wrap items-center gap-3 justify-between py-2">
        <div className="text-muted-foreground text-sm">
          Page {pagination.pageIndex + 1} of {data?.totalPages ?? "-"} • {data?.total ?? 0} vehicles
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10 px-4"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isFetching}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="h-10 px-4"
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
