"use client"

import BreadcrumbSetter from "@/components/breadcrumb-setter"

import { VehicleTable } from "./_components/vehicle-table"

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <BreadcrumbSetter
        items={[
          { href: "/", title: "Dashboard" },
          { href: "/vehicles", title: "Vehicles" },
        ]}
      />
      <VehicleTable />
    </div>
  )
}
