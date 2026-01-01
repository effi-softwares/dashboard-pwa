import { VehicleTable } from "./_components/vehicle-table"
import VehiclesBreadcrumbs from "./_components/vehicles-breadcrumbs"

export default async function DemoPage() {
  return (
    <>
      <VehiclesBreadcrumbs />
      <VehicleTable />
    </>
  )
}
