"use client"

import { useState } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { getTextColor } from "@/lib/utils"

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "./responsive-dialog"

type Color = {
  name: string
  label: string
  hex: string
  textColor?: string
}

type ColorSelectorProps = {
  title?: string
  multiple?: boolean
  colors: Color[]
  value: Color | null
  onSelect: (color: Color | null) => void
  children: React.ReactNode
}

function ColorSelector({ title, colors, value, onSelect, children }: ColorSelectorProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (colorName: string) => {
    if (!colorName) {
      onSelect(null)
      return
    }

    const selectedColor = colors.find(color => color.name === colorName) || null
    onSelect(selectedColor)
    setOpen(false)
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>

      <ResponsiveDialogContent className="p-4 max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>{title ?? "Select color"}</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <ToggleGroup
          type="single"
          value={value?.name}
          onValueChange={handleSelect}
          className="grid grid-cols-3 md:grid-cols-4 gap-4"
        >
          {colors.map((color: Color) => {
            const active = value?.name === color.name

            return (
              <ToggleGroupItem
                key={color.name}
                value={color.name}
                style={{
                  backgroundColor: color.hex,
                  height: "80px",
                  borderRadius: "16px",
                  border: "1px solid rgba(0,0,0,0.1)",
                  boxShadow: active ? `0 0 0 3px ${color.hex}` : "none",
                }}
                className="flex items-center justify-center transition-shadow
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-offset-2"
              >
                <span
                  style={{
                    color: getTextColor(color.hex),
                    fontWeight: 500,
                    textWrap: "wrap",
                  }}
                >
                  {color.label}
                </span>
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

export default ColorSelector
