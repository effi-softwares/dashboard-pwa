import { UseFormReturn } from "react-hook-form"

import { type LucideIcon } from "lucide-react"

export interface StepFormItem {
  title: string
  previousButtonText?: string
  nextButtonText?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>
  formComponent: React.ReactNode
  icon: LucideIcon
}
