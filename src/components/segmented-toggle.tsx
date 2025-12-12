import { ControllerRenderProps, FieldValues, Path } from "react-hook-form"

import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"

export type SegmentedToggleItem = {
  label: string
  icon: LucideIcon
  value: string
  ariaLabel: string
}

type SegmentedToggleProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>
  items: SegmentedToggleItem[]
  type?: "single" | "multiple"
  spacing?: number
  groupClassNames?: string
  buttonClassName?: string
}

function SegmentedToggle<T extends FieldValues>({
  field,
  items,
  type = "single",
  spacing = 0,
  groupClassNames,
  buttonClassName,
}: SegmentedToggleProps<T>) {
  return (
    <div>
      <ToggleGroup
        spacing={spacing}
        type={type}
        onValueChange={field.onChange}
        defaultValue={field.value}
        className={cn("w-full pt-2", groupClassNames)}
      >
        {items.map(item => (
          <ToggleGroupItem
            key={item.value}
            value={item.value}
            aria-label={item.ariaLabel}
            className={cn(
              "flex-1 h-14 flex flex-row items-center justify-center gap-2 border-2 border-border bg-transparent transition-all duration-200 hover:border-primary/50 hover:bg-transparent hover:text-primary data-[state=on]:border-primary data-[state=on]:bg-primary/10",
              buttonClassName,
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

export default SegmentedToggle
