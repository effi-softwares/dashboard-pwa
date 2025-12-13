import { useMemo } from "react"
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form"

import { MONTHS } from "@/lib/contants"

import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { WheelPicker, WheelPickerOption, WheelPickerWrapper } from "./wheel-picker"

type boundaryDate = {
  year: number
  month?: number
  day?: number
}

type DateSelectorProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>
  from: boundaryDate | null
  to: boundaryDate | null
}

const getYearOptions = (fromYear: number, toYear: number): WheelPickerOption[] => {
  const years: WheelPickerOption[] = []
  const startYear = fromYear
  const endYear = toYear

  for (let year = startYear; year <= endYear; year++) {
    years.push({ label: year.toString(), value: year.toString() })
  }

  return years
}

const getMonthOptions = (): WheelPickerOption[] => {
  return MONTHS.map((month, index) => ({ label: month, value: (index + 1).toString() }))
}

const getDateOptions = (year: number, month: number): WheelPickerOption[] => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const dateOptions: WheelPickerOption[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    dateOptions.push({ label: day.toString(), value: day.toString() })
  }

  return dateOptions
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function DateSelector<T extends FieldValues>({ field, from, to }: DateSelectorProps<T>) {
  const yearOptions = useMemo(
    () => getYearOptions(from?.year ?? 1980, to?.year ?? new Date().getFullYear()),
    [from, to?.year],
  )

  const monthOptions = useMemo(() => getMonthOptions(), [])
  const dateOptions = useMemo(() => getDateOptions(2025, 1), [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" className="fat">
          Select Date
        </Button>
      </DialogTrigger>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>Select a Date</DialogTitle>
        </DialogHeader>
        <div>
          <WheelPickerWrapper>
            <WheelPicker options={yearOptions} />
            <WheelPicker options={monthOptions} />
            <WheelPicker options={dateOptions} />
          </WheelPickerWrapper>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DateSelector
