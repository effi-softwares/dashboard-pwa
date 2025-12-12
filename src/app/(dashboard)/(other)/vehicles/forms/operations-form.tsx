import { UseFormReturn } from "react-hook-form"

import { Form } from "@/components/ui/form"

import { VehicleOperationsInput } from "../zod"

type OperationsFormProps = {
  form: UseFormReturn<VehicleOperationsInput>
}

function OperationsForm({ form }: OperationsFormProps) {
  return (
    <Form {...form}>
      <div className="my-4 drawer-container grid grid-cols-1 md:grid-cols-2 gap-8">b</div>
    </Form>
  )
}

export default OperationsForm
