import { ElementType, HTMLAttributes, ReactNode } from "react"

import { cn } from "@/lib/utils"

type VisuallyHiddenProps = {
  children: ReactNode
  as?: ElementType
} & HTMLAttributes<HTMLElement>

const VisuallyHidden = ({
  children,
  as: Component = "span",
  className = "",
  ...props
}: VisuallyHiddenProps) => {
  return (
    <Component className={cn("sr-only", className)} {...props}>
      {children}
    </Component>
  )
}

export default VisuallyHidden
