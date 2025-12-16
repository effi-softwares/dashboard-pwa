import { UseFormReturn } from "react-hook-form"

import { Battery, Droplet, Gauge, Hand, Leaf, Settings, Zap } from "lucide-react"

import SegmentedToggle, { SegmentedToggleItem } from "@/components/segmented-toggle"
import { Checkbox } from "@/components/ui/checkbox"
import { FatInputGroup, FatInputGroupInput } from "@/components/ui/fat-input-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { VehicleSpecsInput } from "@/zod/vehicle-form"

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

        <FormField
          control={form.control}
          name="features.hasAC"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-start gap-3">
                  <Checkbox id="terms-2" onCheckedChange={field.onChange} checked={field.value} />
                  <div className="grid gap-2">
                    <Label htmlFor="terms-2">Has A/C</Label>
                    <p className="text-muted-foreground text-sm">
                      Indicates if the vehicle is equipped with air conditioning.
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="features.hasBluetooth"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-start gap-3">
                  <Checkbox id="terms-2" onCheckedChange={field.onChange} checked={field.value} />
                  <div className="grid gap-2">
                    <Label htmlFor="terms-2">Has Bluetooth</Label>
                    <p className="text-muted-foreground text-sm">
                      Indicates if the vehicle is equipped with Bluetooth.
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="features.hasNavigation"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-start gap-3">
                  <Checkbox id="terms-2" onCheckedChange={field.onChange} checked={field.value} />
                  <div className="grid gap-2">
                    <Label htmlFor="terms-2">Has Navigation</Label>
                    <p className="text-muted-foreground text-sm">
                      Indicates if the vehicle is equipped with Navigation.
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="features.isPetFriendly"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-start gap-3">
                  <Checkbox id="terms-2" onCheckedChange={field.onChange} checked={field.value} />
                  <div className="grid gap-2">
                    <Label htmlFor="terms-2">Pet Friendly</Label>
                    <p className="text-muted-foreground text-sm">
                      Indicates if the vehicle allows pets.
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}

export default SpecForm
