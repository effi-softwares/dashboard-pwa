import { VehicleTable } from "./_components/vehicle-table"
import VehicleFormClient from "./forms/index.client"

export default async function DemoPage() {
  return (
    <div className="container">
      <VehicleFormClient />
      <VehicleTable />
    </div>
  )
}
