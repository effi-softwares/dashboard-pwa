import * as React from "react"

import { cn } from "@/lib/utils"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group"

function FatInputGroup({ className, ...props }: React.ComponentProps<typeof InputGroup>) {
  return (
    <InputGroup
      className={cn(
        "fat",
        "has-[>[data-align=inline-start]]:[&>input]:pl-3",
        "has-[>[data-align=inline-end]]:[&>input]:pr-3",
        "**:data-[slot=input-group-addon]:px-4",
        className,
      )}
      {...props}
    />
  )
}

function FatInputGroupInput({ className, ...props }: React.ComponentProps<typeof InputGroupInput>) {
  return <InputGroupInput className={cn("fat-h", "text-base md:text-base", className)} {...props} />
}

function FatInputGroupButton({
  className,
  size = "sm",
  ...props
}: React.ComponentProps<typeof InputGroupButton>) {
  return <InputGroupButton size={size} className={cn("rounded-lg", className)} {...props} />
}

function FatInputGroupAddon({ className, ...props }: React.ComponentProps<typeof InputGroupAddon>) {
  return <InputGroupAddon className={cn("text-base", "px-4", className)} {...props} />
}

export { FatInputGroup, FatInputGroupAddon, FatInputGroupButton, FatInputGroupInput }
