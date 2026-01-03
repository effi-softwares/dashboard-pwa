import { useForm } from "react-hook-form"

import {
  Bluetooth,
  Briefcase,
  Dog,
  DoorClosed,
  Fuel,
  Info,
  Navigation,
  Settings2,
  Users,
  Wind,
} from "lucide-react"
import { useOnborda } from "onborda"

import SegmentedToggle from "@/components/segmented-toggle"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { transmissionItems } from "@/lib/contants"

import FeatureCard from "../_components/feature-card"
import SpecCard from "../_components/spec-card"

type VehicleDetail = {
  transmission: string
  fuelType: string
  seats: number
  doors: number
  baggageCapacity: number
  hasAC: boolean
  hasNavigation: boolean
  hasBluetooth: boolean
  isPetFriendly: boolean
}

type Props = {
  vehicle: VehicleDetail
}

export function SpecsTab({ vehicle }: Props) {
  const { startOnborda } = useOnborda()

  const transmissionForm = useForm({
    defaultValues: {
      transmission: vehicle.transmission,
    },
  })

  const toggleField = (field: string) => {
    alert(`Toggled field: ${field}`)
  }

  return (
    <div className="space-y-8 pt-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Technical Profile
          </h2>
          <Info
            className="h-5 w-5 cursor-pointer text-slate-400 hover:text-slate-600"
            aria-label="Show availability tour"
            onClick={() => startOnborda("vehicleAvailability")}
          />
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Detailed performance and capacity metrics.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-x-8 gap-y-6">
        <SpecCard
          icon={Settings2}
          label="Transmission"
          alertDescription="Change transmission type"
          value={vehicle.transmission}
        >
          <Form {...transmissionForm}>
            <FormField
              control={transmissionForm.control}
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SegmentedToggle
                      spacing={4}
                      value={field.value}
                      onChange={field.onChange}
                      items={transmissionItems}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </SpecCard>
        <SpecCard
          icon={Fuel}
          label="Fuel Type"
          alertDescription="Change fuel type"
          value={vehicle.fuelType}
        />
        <SpecCard
          icon={Users}
          label="Seating"
          alertDescription="Change number of passengers"
          value={`${vehicle.seats} Passengers`}
        />
        <SpecCard
          icon={DoorClosed}
          label="Entry"
          alertDescription="Change number of doors"
          value={`${vehicle.doors} Doors`}
        />
        <SpecCard
          icon={Briefcase}
          label="Storage"
          alertDescription="Change baggage capacity"
          value={`${vehicle.baggageCapacity} Kg`}
        />
        <SpecCard
          icon={Info}
          label="Drivetrain"
          alertDescription="Change drivetrain type"
          value={"All-Wheel Drive"}
        />
      </div>

      <div className="flex flex-col gap-2 pt-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Comfort & Connectivity
          </h2>
          <Info
            className="h-5 w-5 cursor-pointer text-slate-400 hover:text-slate-600"
            aria-label="Show availability tour"
            onClick={() => startOnborda("vehicleAvailability")}
          />
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Standard features. Click to toggle status.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-x-6 gap-y-6">
        <FeatureCard
          label="Air Conditioning"
          enabled={vehicle.hasAC}
          icon={Wind}
          onToggle={() => toggleField("hasAC")}
        />
        <FeatureCard
          label="GPS Navigation"
          enabled={vehicle.hasNavigation}
          icon={Navigation}
          onToggle={() => toggleField("hasNavigation")}
        />
        <FeatureCard
          label="Bluetooth"
          enabled={vehicle.hasBluetooth}
          icon={Bluetooth}
          onToggle={() => toggleField("hasBluetooth")}
        />
        <FeatureCard
          label="Pet Friendly"
          enabled={vehicle.isPetFriendly}
          icon={Dog}
          onToggle={() => toggleField("isPetFriendly")}
        />
      </div>
      <br />
    </div>
  )
}
