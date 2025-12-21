import { useMemo, useState } from "react"
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form"

import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { WheelPicker, WheelPickerOption, WheelPickerWrapper } from "./wheel-picker"

type YearSelectorProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>
  fromYear?: number
  toYear?: number
  children: React.ReactNode
}

const getYearOptions = (from: number, to: number): WheelPickerOption[] => {
  const years: WheelPickerOption[] = []
  for (let year = to; year >= from; year--) {
    years.push({ label: year.toString(), value: year.toString() })
  }
  return years
}

export function YearSelector<T extends FieldValues>({
  field,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 1,
  children,
}: YearSelectorProps<T>) {
  const [open, setOpen] = useState(false)

  const yearOptions = useMemo(() => getYearOptions(fromYear, toYear), [fromYear, toYear])

  const handleYearChange = (value: string) => {
    field.onChange(parseInt(value, 10))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Manufacture Year</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <WheelPickerWrapper>
            <WheelPicker
              options={yearOptions}
              defaultValue={field.value?.toString()}
              onValueChange={handleYearChange}
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
