import { UseFormReturn } from "react-hook-form"

import { CalendarRange, Pin } from "lucide-react"

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
import { Switch } from "@/components/ui/switch"

import { VehicleIdentityInput } from "../zod"

type IdentityFomProps = {
  form: UseFormReturn<VehicleIdentityInput>
}

function IdentityFom({ form }: IdentityFomProps) {
  return (
    <Form {...form}>
      <div className="my-4 drawer-container grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <FatInputGroup>
                  <FatInputGroupInput {...field} type="text" placeholder="Enter brand" />
                </FatInputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <FatInputGroup>
                  <FatInputGroupInput {...field} type="text" placeholder="Enter model" />
                </FatInputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacture Year</FormLabel>
              <FormControl>
                <FatInputGroup>
                  <FatInputGroupAddon>
                    <CalendarRange />
                  </FatInputGroupAddon>
                  <FatInputGroupInput {...field} type="text" placeholder="Enter manufacture year" />
                </FatInputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Identification Number (VIN)</FormLabel>
              <FormControl>
                <FatInputGroup>
                  <FatInputGroupAddon>
                    <Pin />
                  </FatInputGroupAddon>
                  <FatInputGroupInput {...field} type="text" placeholder="Enter VIN" />
                </FatInputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licensePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Plate</FormLabel>
              <FormControl>
                <FatInputGroup>
                  <FatInputGroupAddon>
                    <Pin />
                  </FatInputGroupAddon>
                  <FatInputGroupInput {...field} type="text" placeholder="Enter License Plate" />
                </FatInputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="isBrandNew"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Is Brand New</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}

export default IdentityFom
