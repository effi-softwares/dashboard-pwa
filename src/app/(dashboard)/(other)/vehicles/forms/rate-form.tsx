import { Form, UseFormReturn } from "react-hook-form"

import { VehicleRatesInput } from "../zod"

type RateFormProps = {
  form: UseFormReturn<VehicleRatesInput>
}

function RateForm({ form }: RateFormProps) {
  return (
    <Form {...form}>
      <div className="my-4 drawer-container grid grid-cols-1 md:grid-cols-2 gap-8">RateForm</div>
    </Form>
  )
}

export default RateForm
