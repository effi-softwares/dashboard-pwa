import { cn } from "@/lib/utils"

import { Select, SelectTrigger } from "./select"

function FatSelect({ ...props }: React.ComponentProps<typeof Select>) {
  return <Select {...props} />
}

function FatSelectTrigger({ className, ...props }: React.ComponentProps<typeof SelectTrigger>) {
  return <SelectTrigger className={cn("fat", className)} {...props} />
}

export { FatSelect, FatSelectTrigger }
