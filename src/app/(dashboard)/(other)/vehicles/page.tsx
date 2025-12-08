import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogTrigger,
} from "@/components/responsive-dialog"
import { Button } from "@/components/ui/button"

import { VehicleTable } from "./_components/vehicle-table"
import NewVehicleForm from "./forms"

export default async function DemoPage() {
  return (
    <div className="container">
      <ResponsiveDialog>
        <ResponsiveDialogTrigger asChild>
          <Button>Add Vehicle</Button>
        </ResponsiveDialogTrigger>

        <ResponsiveDialogContent className="h-[90dvh] custom-dialog-width">
          <NewVehicleForm />
        </ResponsiveDialogContent>
      </ResponsiveDialog>
      <VehicleTable />
    </div>
  )
}
