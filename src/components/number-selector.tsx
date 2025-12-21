import { useMemo, useState } from "react"
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form"

import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { WheelPicker, WheelPickerOption, WheelPickerWrapper } from "./wheel-picker"

type NumberSelectorProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>
  min?: number
  max?: number
  step?: number
  title?: string
  children: React.ReactNode
}

const getNumberOptions = (min: number, max: number, step: number): WheelPickerOption[] => {
  const options: WheelPickerOption[] = []
  for (let i = min; i <= max; i += step) {
    options.push({ label: i.toString(), value: i.toString() })
  }
  return options
}

export function NumberSelector<T extends FieldValues>({
  field,
  min = 0,
  max = 100,
  step = 1,
  title = "Select Number",
  children,
}: NumberSelectorProps<T>) {
  const [open, setOpen] = useState(false)
  const numberOptions = useMemo(() => getNumberOptions(min, max, step), [min, max, step])

  const handleValueChange = (value: string) => {
    field.onChange(Number(value))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title ?? "Select Number"}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <WheelPickerWrapper>
            <WheelPicker
              options={numberOptions}
              defaultValue={field.value?.toString()}
              onValueChange={handleValueChange}
            />
          </WheelPickerWrapper>
          <Button className="w-full mt-4" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
