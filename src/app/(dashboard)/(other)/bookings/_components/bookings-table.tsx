"use client"

import { useCallback, useMemo, useState } from "react"

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import { FatButton } from "@/components/ui/fat-button"
import { FatInput } from "@/components/ui/fat-input"
import { FatSelect } from "@/components/ui/fat-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useBookings } from "@/features/booking/queries/use-booking-queries"
import { useNewRentalContext } from "@/providers/new-rental-provider"

import { bookingColumns } from "./columns"

export function BookingsTable() {
  const { showDrawerWithoutVehicle } = useNewRentalContext()

  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)

  const primarySort = sorting[0]
  const sortBy = primarySort?.id
  const sortDir = primarySort?.desc ? "desc" : "asc"

  const { data, isLoading, isFetching, isError } = useBookings({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    search,
    status: statusFilter,
    sortBy,
    sortDir: sortDir as "asc" | "desc",
  })

  const handleSearch = useCallback(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }))
    setSearch(searchInput.trim())
  }, [searchInput])

  const columns = useMemo(() => bookingColumns, [])

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

  const rows = table.getRowModel().rows

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-wrap gap-3 items-center shrink-0">
        <FatInput
          placeholder="Search by customer name, email, vehicle, plate"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleSearch()
          }}
          className="w-full sm:w-[320px] h-11 text-base"
        />
        <FatButton onClick={handleSearch} className="h-11 px-5" variant="default">
          Search
        </FatButton>
        <FatSelect
          value={statusFilter ?? "all"}
          onValueChange={val => setStatusFilter(val === "all" ? undefined : val)}
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </FatSelect>
        <div className="flex-1" />
        <FatButton onClick={() => showDrawerWithoutVehicle("home")} variant="default">
          + New Booking
        </FatButton>
      </div>

      <div className="flex-1 min-h-0 border rounded-md flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="bg-muted/50">
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          onClick={() => header.column.toggleSorting()}
                          className="text-left font-semibold hover:text-foreground"
                        >
                          {typeof header.column.columnDef.header === "function"
                            ? header.column.columnDef.header(header.getContext())
                            : header.column.columnDef.header}
                        </button>
                      ) : typeof header.column.columnDef.header === "function" ? (
                        header.column.columnDef.header(header.getContext())
                      ) : (
                        header.column.columnDef.header
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-destructive">
                    Failed to load bookings
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                rows.map(row => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 justify-between shrink-0 bg-background">
        <div className="text-sm text-muted-foreground">
          {data
            ? `Showing ${pagination.pageIndex * pagination.pageSize + 1} to ${Math.min((pagination.pageIndex + 1) * pagination.pageSize, data.total)} of ${data.total} bookings`
            : ""}
        </div>
        <div className="flex items-center gap-3">
          <FatButton
            variant="outline"
            disabled={pagination.pageIndex === 0 || isFetching}
            onClick={() => table.previousPage()}
            className="h-9"
          >
            Previous
          </FatButton>
          <div className="text-sm font-medium">
            Page {pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </div>
          <FatButton
            variant="outline"
            disabled={!table.getCanNextPage() || isFetching}
            onClick={() => table.nextPage()}
            className="h-9"
          >
            Next
          </FatButton>
        </div>
      </div>
    </div>
  )
}
