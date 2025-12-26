import { VehicleTable } from "./_components/vehicle-table"

export default async function DemoPage() {
  return (
    <div className="px-4 md:px-6 h-full flex flex-col overflow-hidden">
      <VehicleTable />
    </div>
  )
}
