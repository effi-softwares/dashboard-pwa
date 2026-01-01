import BreadcrumbSetter from "@/components/breadcrumb-setter"

import { VehicleTable } from "./_components/vehicle-table"

export default async function DemoPage() {
  return (
    <>
      <BreadcrumbSetter
        items={[
          { href: "/", title: "Dashboard" },
          { href: "/vehicles", title: "Vehicles" },
        ]}
      />
      <VehicleTable />
    </>
  )
}
