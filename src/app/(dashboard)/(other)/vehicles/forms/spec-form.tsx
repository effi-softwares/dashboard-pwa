import { UseFormReturn } from "react-hook-form"

import { Battery, Droplet, Gauge, Hand, Leaf, Settings, Zap } from "lucide-react"

import SegmentedToggle, { SegmentedToggleItem } from "@/components/segmented-toggle"
import { FatInputGroup, FatInputGroupInput } from "@/components/ui/fat-input-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { VehicleSpecsInput } from "../zod"

type SpecFormProps = {
  form: UseFormReturn<VehicleSpecsInput>
}
export const transmissionItems: SegmentedToggleItem[] = [
  {
    label: "Automatic",
    icon: Gauge,
    value: "Automatic",
    ariaLabel: "Select automatic transmission",
  },
  {
    label: "Manual",
    icon: Hand,
    value: "Manual",
    ariaLabel: "Select manual transmission",
  },
  {
    label: "Semi-Automatic",
    icon: Settings,
    value: "Semi-Automatic",
    ariaLabel: "Select semi-automatic transmission",
  },
]

export const fuelTypeItems: SegmentedToggleItem[] = [
  {
    label: "Petrol",
    icon: Droplet,
    value: "Petrol",
    ariaLabel: "Select petrol fuel type",
  },
  {
    label: "Diesel",
    icon: Droplet,
    value: "Diesel",
    ariaLabel: "Select diesel fuel type",
  },
  {
    label: "Electric",
    icon: Zap,
    value: "Electric",
    ariaLabel: "Select electric fuel type",
  },
  {
    label: "Hybrid",
    icon: Leaf,
    value: "Hybrid",
    ariaLabel: "Select hybrid fuel type",
  },
  {
    label: "Hydrogen",
    icon: Battery,
    value: "Hydrogen",
    ariaLabel: "Select hydrogen fuel type",
  },
]

function SpecForm({ form }: SpecFormProps) {
  return (
    <Form {...form}>
      <div className="my-4 drawer-container grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <FatInputGroup>
                  <FatInputGroupInput {...field} type="text" placeholder="Enter color" />
                </FatInputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seats"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seats</FormLabel>
              <FormControl>
                <FatInputGroup>
                  <FatInputGroupInput {...field} type="text" placeholder="Enter seats" />
                </FatInputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="doors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doors</FormLabel>
              <FormControl>
                <FatInputGroup>
                  <FatInputGroupInput {...field} type="text" placeholder="Enter doors" />
                </FatInputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="baggageCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Baggage Capacity</FormLabel>
              <FormControl>
                <FatInputGroup>
                  <FatInputGroupInput {...field} type="text" placeholder="Enter baggage capacity" />
                </FatInputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-span-2">
          <FormField
            control={form.control}
            name="transmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transmission</FormLabel>
                <FormControl>
                  <SegmentedToggle spacing={4} field={field} items={transmissionItems} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-2">
          <FormField
            control={form.control}
            name="fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <FormControl>
                  <SegmentedToggle spacing={4} field={field} items={fuelTypeItems} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  )
}

export default SpecForm
