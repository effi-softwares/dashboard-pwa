"use client"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { useUpdateVehicleSpec } from "@/features/vehicle/hooks/mutations/use-update-vehicle-spec"
import {
  type BaggageCapacityUpdate,
  baggageCapacityUpdateSchema,
  type DoorsUpdate,
  doorsUpdateSchema,
  type FuelTypeUpdate,
  fuelTypeUpdateSchema,
  type SeatsUpdate,
  seatsUpdateSchema,
  type TransmissionUpdate,
  transmissionUpdateSchema,
} from "@/features/vehicle/schemas/vehicle-edit.schema"
import { fuelTypeItems, transmissionItems } from "@/lib/contants"

import FeatureCard from "../_components/feature-card"
import SpecCard from "../_components/spec-card"

type VehicleDetail = {
  id: string
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
  const updateVehicleSpec = useUpdateVehicleSpec()

  // Transmission Form
  const transmissionForm = useForm<TransmissionUpdate>({
    resolver: zodResolver(transmissionUpdateSchema),
    defaultValues: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transmission: vehicle.transmission as any,
    },
  })

  // Fuel Type Form
  const fuelTypeForm = useForm<FuelTypeUpdate>({
    resolver: zodResolver(fuelTypeUpdateSchema),
    defaultValues: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fuelType: vehicle.fuelType as any,
    },
  })

  // Seats Form
  const seatsForm = useForm<SeatsUpdate>({
    resolver: zodResolver(seatsUpdateSchema),
    defaultValues: {
      seats: vehicle.seats,
    },
  })

  // Doors Form
  const doorsForm = useForm<DoorsUpdate>({
    resolver: zodResolver(doorsUpdateSchema),
    defaultValues: {
      doors: vehicle.doors,
    },
  })

  // Baggage Capacity Form
  const baggageCapacityForm = useForm<BaggageCapacityUpdate>({
    resolver: zodResolver(baggageCapacityUpdateSchema),
    defaultValues: {
      baggageCapacity: vehicle.baggageCapacity,
    },
  })

  // Handlers
  const handleTransmissionSave = async () => {
    const isValid = await transmissionForm.trigger()
    if (isValid) {
      const data = transmissionForm.getValues()
      await updateVehicleSpec.mutateAsync({
        vehicleId: vehicle.id,
        data,
      })
    }
  }

  const handleFuelTypeSave = async () => {
    const isValid = await fuelTypeForm.trigger()
    if (isValid) {
      const data = fuelTypeForm.getValues()
      await updateVehicleSpec.mutateAsync({
        vehicleId: vehicle.id,
        data,
      })
    }
  }

  const handleSeatsSave = async () => {
    const isValid = await seatsForm.trigger()
    if (isValid) {
      const data = seatsForm.getValues()
      await updateVehicleSpec.mutateAsync({
        vehicleId: vehicle.id,
        data,
      })
    }
  }

  const handleDoorsSave = async () => {
    const isValid = await doorsForm.trigger()
    if (isValid) {
      const data = doorsForm.getValues()
      await updateVehicleSpec.mutateAsync({
        vehicleId: vehicle.id,
        data,
      })
    }
  }

  const handleBaggageCapacitySave = async () => {
    const isValid = await baggageCapacityForm.trigger()
    if (isValid) {
      const data = baggageCapacityForm.getValues()
      await updateVehicleSpec.mutateAsync({
        vehicleId: vehicle.id,
        data,
      })
    }
  }

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
          isDirty={transmissionForm.watch("transmission") !== vehicle.transmission}
          isLoading={updateVehicleSpec.isPending}
          onSave={handleTransmissionSave}
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
          isDirty={fuelTypeForm.watch("fuelType") !== vehicle.fuelType}
          isLoading={updateVehicleSpec.isPending}
          onSave={handleFuelTypeSave}
        >
          <Form {...fuelTypeForm}>
            <FormField
              control={fuelTypeForm.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SegmentedToggle
                      spacing={4}
                      value={field.value}
                      onChange={field.onChange}
                      items={fuelTypeItems}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </SpecCard>

        <SpecCard
          icon={Users}
          label="Seating"
          alertDescription="Change number of passengers"
          value={`${vehicle.seats} Passengers`}
          isDirty={seatsForm.watch("seats") !== vehicle.seats}
          isLoading={updateVehicleSpec.isPending}
          onSave={handleSeatsSave}
        >
          <Form {...seatsForm}>
            <FormField
              control={seatsForm.control}
              name="seats"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </SpecCard>

        <SpecCard
          icon={DoorClosed}
          label="Entry"
          alertDescription="Change number of doors"
          value={`${vehicle.doors} Doors`}
          isDirty={doorsForm.watch("doors") !== vehicle.doors}
          isLoading={updateVehicleSpec.isPending}
          onSave={handleDoorsSave}
        >
          <Form {...doorsForm}>
            <FormField
              control={doorsForm.control}
              name="doors"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="number"
                      min="2"
                      max="5"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </SpecCard>

        <SpecCard
          icon={Briefcase}
          label="Storage"
          alertDescription="Change baggage capacity in kg"
          value={`${vehicle.baggageCapacity} Kg`}
          isDirty={baggageCapacityForm.watch("baggageCapacity") !== vehicle.baggageCapacity}
          isLoading={updateVehicleSpec.isPending}
          onSave={handleBaggageCapacitySave}
        >
          <Form {...baggageCapacityForm}>
            <FormField
              control={baggageCapacityForm.control}
              name="baggageCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="number"
                      min="0"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </SpecCard>

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
