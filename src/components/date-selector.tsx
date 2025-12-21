"use client"

import { useEffect, useMemo, useState } from "react"
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
  title?: string
  children: React.ReactNode
}

const getYearOptions = (fromYear: number, toYear: number): WheelPickerOption[] => {
  const years: WheelPickerOption[] = []
  for (let year = fromYear; year <= toYear; year++) {
    years.push({ label: year.toString(), value: year.toString() })
  }
  return years
}

const getMonthOptions = (): WheelPickerOption[] => {
  return MONTHS.map((month, index) => ({
    label: month,
    value: (index + 1).toString(),
  }))
}

const getDateOptions = (year: number, month: number): WheelPickerOption[] => {
  const daysInMonth = new Date(year, month, 0).getDate()
  const dateOptions: WheelPickerOption[] = []
  for (let day = 1; day <= daysInMonth; day++) {
    dateOptions.push({ label: day.toString(), value: day.toString() })
  }
  return dateOptions
}

function DateSelector<T extends FieldValues>({
  field,
  from,
  to,
  title,
  children,
}: DateSelectorProps<T>) {
  const [open, setOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedDay, setSelectedDay] = useState("")

  useEffect(() => {
    if (open) {
      const date = field.value ? new Date(field.value) : new Date()
      setSelectedYear(date.getFullYear().toString())
      setSelectedMonth((date.getMonth() + 1).toString())
      setSelectedDay(date.getDate().toString())
    }
  }, [open, field.value])

  useEffect(() => {
    if (selectedYear && selectedMonth && selectedDay) {
      const maxDays = new Date(Number(selectedYear), Number(selectedMonth), 0).getDate()
      if (Number(selectedDay) > maxDays) {
        setSelectedDay(maxDays.toString())
      }
    }
  }, [selectedYear, selectedMonth, selectedDay])

  const yearOptions = useMemo(
    () => getYearOptions(from?.year ?? 1980, to?.year ?? new Date().getFullYear()),
    [from, to],
  )

  const monthOptions = useMemo(() => getMonthOptions(), [])

  const dateOptions = useMemo(
    () => getDateOptions(Number(selectedYear), Number(selectedMonth)),
    [selectedYear, selectedMonth],
  )

  const handleConfirm = () => {
    const resultDate = new Date(
      Number(selectedYear),
      Number(selectedMonth) - 1,
      Number(selectedDay),
    )
    field.onChange(resultDate)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">{children}</div>
      </DialogTrigger>
      <DialogContent className="p-4 sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{title ?? "Select a Date"}</DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mt-4">
          <WheelPickerWrapper className="w-full max-w-sm">
            <WheelPicker
              options={yearOptions}
              value={selectedYear}
              onValueChange={val => setSelectedYear(val as string)}
            />
            <WheelPicker
              options={monthOptions}
              value={selectedMonth}
              onValueChange={val => setSelectedMonth(val as string)}
            />
            <WheelPicker
              options={dateOptions}
              value={selectedDay}
              onValueChange={val => setSelectedDay(val as string)}
            />
          </WheelPickerWrapper>
        </div>

        <Button className="w-full mt-6" onClick={handleConfirm}>
          Confirm
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default DateSelector
