import { UseFormReturn } from "react-hook-form"

import { BaggageClaimIcon, DoorOpen, Table } from "lucide-react"

import { NumberSelector } from "@/components/number-selector"
import SegmentedToggle from "@/components/segmented-toggle"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FatInputGroup,
  FatInputGroupAddon,
  FatInputGroupInput,
} from "@/components/ui/fat-input-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { VehicleSpecsInput } from "@/features/vehicle/schemas/vehicle-form.schema"
import { fuelTypeItems, transmissionItems } from "@/lib/contants"

type SpecFormProps = {
  form: UseFormReturn<VehicleSpecsInput>
}

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
                <NumberSelector field={field} min={2} max={7}>
                  <FatInputGroup>
                    <FatInputGroupAddon>
                      <Table />
                    </FatInputGroupAddon>
                    <FatInputGroupInput
                      {...field}
                      value={field.value || ""}
                      type="text"
                      placeholder="Select number of seats"
                      readOnly
                    />
                  </FatInputGroup>
                </NumberSelector>
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
                <NumberSelector field={field} min={2} max={5}>
                  <FatInputGroup>
                    <FatInputGroupAddon>
                      <DoorOpen />
                    </FatInputGroupAddon>
                    <FatInputGroupInput
                      {...field}
                      value={field.value || ""}
                      type="text"
                      placeholder="Select number of doors"
                      readOnly
                    />
                  </FatInputGroup>
                </NumberSelector>
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
                  <FatInputGroupAddon>
                    <BaggageClaimIcon />
                  </FatInputGroupAddon>
                  <FatInputGroupInput
                    {...field}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    value={field.value ?? ""}
                    onChange={event => {
                      const value = event.target.value
                      field.onChange(value === "" ? undefined : Number(value))
                    }}
                    placeholder="Enter baggage capacity"
                  />
                  <FatInputGroupAddon align="inline-end" className="border-l">
                    Kg
                  </FatInputGroupAddon>
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
        </div>

        <div className="col-span-2">
          <FormField
            control={form.control}
            name="fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
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
