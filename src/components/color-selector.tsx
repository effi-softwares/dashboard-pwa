"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { VEHICLE_COLORS } from "@/lib/contants"
import { getTextColor } from "@/lib/utils"

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "./responsive-dialog"

function ColorSelector() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <ResponsiveDialog>
      <ResponsiveDialogTrigger asChild>
        <Button type="button" className="fat">
          Select Color
        </Button>
      </ResponsiveDialogTrigger>

      <ResponsiveDialogContent className="p-4 max-w-lg">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Vehicle color</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <ToggleGroup
          type="single"
          value={value ?? ""}
          onValueChange={v => setValue(v || null)}
          className="grid grid-cols-3 md:grid-cols-4 gap-4"
        >
          {VEHICLE_COLORS.map(color => {
            const active = value === color.key

            return (
              <ToggleGroupItem
                key={color.key}
                value={color.key}
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
