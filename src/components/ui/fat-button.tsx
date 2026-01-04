import * as React from "react"

import type { VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

import { Button, type buttonVariants } from "./button"

const FatButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & VariantProps<typeof buttonVariants>
>(({ className, ...props }, ref) => (
  <Button ref={ref} className={cn("fat", className)} {...props} />
))

FatButton.displayName = "FatButton"

export { FatButton }
