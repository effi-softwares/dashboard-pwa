"use client"

import { BookingsTable } from "./_components/bookings-table"

export default function BookingsPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground mt-2">Manage and view all rental bookings</p>
      </div>
      <BookingsTable />
    </div>
  )
}
