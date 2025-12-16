import { useFieldArray, UseFormReturn } from "react-hook-form"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { VehicleRatesInput } from "@/zod/vehicle-form"

import RateFormField from "./rate-form-fields"

type RateFormProps = {
  form: UseFormReturn<VehicleRatesInput>
}

function RateForm({ form }: RateFormProps) {
  const { control, setValue } = form
  const { fields, append, remove } = useFieldArray({ control, name: "rates" })

  return (
    <Form {...form}>
      <div className="my-4 drawer-container">
        {fields.map((field, idx) => {
          const Component = RateFormField()
          return (
            <Component
              key={field.id}
              control={control}
              idx={idx}
              setValue={setValue}
              remove={remove}
            />
          )
        })}
        <div className="flex flex-col items-center justify-center my-8">
          <div className="space-y-1 mb-4 text-center">
            <h2>Add Rates</h2>
            <p className="text-muted-foreground">
              Configure pricing, mileage policy, and security deposit for this vehicle.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                pricingModel: "Daily",
                rate: 0,
                mileagePolicy: { mileageType: "Unlimited" },
                requiresDeposit: false,
              })
            }
            className="gap-1"
          >
            <Plus className="w-4 h-4" /> Add Rate
          </Button>
        </div>
      </div>
    </Form>
  )
}

export default RateForm
