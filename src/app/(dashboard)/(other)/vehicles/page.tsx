import { VehicleTable } from "./_components/vehicle-table"
import VehicleFormComponent from "./forms"

export default async function DemoPage() {
  return (
    <div className="container">
      <VehicleFormComponent />
      <VehicleTable />
    </div>
  )
}
