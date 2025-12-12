import { UseFormReturn } from "react-hook-form"

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
      </div>
    </Form>
  )
}

export default SpecForm
