import { cn } from "@/lib/utils"

import { Input } from "./input"

function FatInput({ className, type, ...props }: React.ComponentProps<"input">) {
  return <Input className={cn("fat", className)} type={type} {...props} />
}

export { FatInput }
