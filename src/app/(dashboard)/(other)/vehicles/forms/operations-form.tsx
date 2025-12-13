import { UseFormReturn } from "react-hook-form"

import { Archive, CheckCircle2, DollarSign, Wrench } from "lucide-react"

import DateSelector from "@/components/date-selector"
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

import { VehicleOperationsInput } from "../zod"

type OperationsFormProps = {
  form: UseFormReturn<VehicleOperationsInput>
}

const statusItems: SegmentedToggleItem[] = [
  {
    label: "Available",
    icon: CheckCircle2,
    value: "Available",
    ariaLabel: "Select available status",
  },
  {
    label: "Rented",
    icon: DollarSign,
    value: "Rented",
    ariaLabel: "Select rented status",
  },
  {
    label: "Maintenance",
    icon: Wrench,
    value: "Maintenance",
    ariaLabel: "Select maintenance status",
  },
  {
    label: "Retired",
    icon: Archive,
    value: "Retired",
    ariaLabel: "Select retired status",
  },
]

function OperationsForm({ form }: OperationsFormProps) {
  return (
    <Form {...form}>
      <div className="my-4 drawer-container grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <SegmentedToggle spacing={4} field={field} items={statusItems} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mileage</FormLabel>
              <FormControl>
                <FatInputGroup>
                  <FatInputGroupInput {...field} type="text" placeholder="Enter mileage" />
                </FatInputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registrationExpiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Expiry Date</FormLabel>
              <FormControl>
                <DateSelector
                  field={field}
                  from={{
                    year: 1980,
                    month: 1,
                    day: 1,
                  }}
                  to={{
                    year: new Date().getFullYear(),
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Policy Number</FormLabel>
              <FormControl>
                <FatInputGroup>
                  <FatInputGroupInput
                    {...field}
                    type="text"
                    placeholder="Enter insurance policy number"
                  />
                </FatInputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="insuranceExpiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance Expiry Date</FormLabel>
              <FormControl>
                <DateSelector
                  field={field}
                  from={{
                    year: 1980,
                    month: 1,
                    day: 1,
                  }}
                  to={{
                    year: new Date().getFullYear(),
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}

export default OperationsForm
