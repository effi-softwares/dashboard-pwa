import { VehicleTable } from "./_components/vehicle-table"
import VehicleFormComponent from "./forms/vehicle-form-component"

export default async function DemoPage() {
  return (
    <div className="container">
      <VehicleFormComponent />
      <VehicleTable />
    </div>
  )
}
