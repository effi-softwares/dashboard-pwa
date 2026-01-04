import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"

export type SegmentedToggleItem = {
  label: string
  icon: LucideIcon
  value: string
  ariaLabel: string
}

type BaseProps = {
  items: SegmentedToggleItem[]
  spacing?: number
  groupClassNames?: string
  buttonClassName?: string
}

type SingleProps = BaseProps & {
  type?: "single"
  value?: string
  onChange?: (value: string) => void
}

type MultipleProps = BaseProps & {
  type: "multiple"
  value?: string[]
  onChange?: (value: string[]) => void
}

export type SegmentedToggleProps = SingleProps | MultipleProps

function SegmentedToggle(props: SegmentedToggleProps) {
  const { items, spacing = 0, groupClassNames, buttonClassName } = props

  const renderItems = () =>
    items.map(item => (
      <ToggleGroupItem
        key={item.value}
        value={item.value}
        aria-label={item.ariaLabel}
        className={cn(
          "flex-1 fat px-4 flex flex-row items-center justify-center gap-2 border-2 border-border bg-transparent transition-all duration-200 hover:border-primary/50 hover:text-primary data-[state=on]:border-primary data-[state=on]:bg-primary/10 cursor-pointer",
          buttonClassName,
        )}
      >
        <item.icon className="h-4 w-4" />
        {item.label}
      </ToggleGroupItem>
    ))

  if (props.type === "multiple") {
    const { value, onChange } = props

    return (
      <ToggleGroup
        type="multiple"
        spacing={spacing}
        value={value}
        onValueChange={onChange}
        className={cn("w-full", groupClassNames)}
      >
        {renderItems()}
      </ToggleGroup>
    )
  }

  const { value, onChange } = props

  return (
    <ToggleGroup
      type="single"
      spacing={spacing}
      value={value}
      onValueChange={onChange}
      className={cn("w-full", groupClassNames)}
    >
      {renderItems()}
    </ToggleGroup>
  )
}

export default SegmentedToggle
