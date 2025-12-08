"use client"

import * as React from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface ResponsiveDialogContextType {
  isMobile: boolean
}

const ResponsiveDialogContext = React.createContext<ResponsiveDialogContextType | undefined>(
  undefined,
)

const useResponsiveDialogContext = () => {
  const context = React.useContext(ResponsiveDialogContext)
  if (!context) {
    throw new Error("ResponsiveDialog components must be used within a ResponsiveDialog")
  }
  return context
}

interface ResponsiveDialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const ResponsiveDialog = ({ children, open, onOpenChange }: ResponsiveDialogProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <ResponsiveDialogContext.Provider value={{ isMobile }}>
        <Drawer open={open} onOpenChange={onOpenChange}>
          {children}
        </Drawer>
      </ResponsiveDialogContext.Provider>
    )
  }

  return (
    <ResponsiveDialogContext.Provider value={{ isMobile }}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {children}
      </Dialog>
    </ResponsiveDialogContext.Provider>
  )
}

export const ResponsiveDialogTrigger = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogTrigger>) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return (
      <DrawerTrigger className={className} {...props}>
        {children}
      </DrawerTrigger>
    )
  }

  return (
    <DialogTrigger className={className} {...props}>
      {children}
    </DialogTrigger>
  )
}

export const ResponsiveDialogContent = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogContent>) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return (
      <DrawerContent className={cn(className, "p-0 flex flex-col")} {...props}>
        {children}
      </DrawerContent>
    )
  }

  return (
    <DialogContent className={cn(className, "p-0 flex flex-col")} {...props}>
      {children}
    </DialogContent>
  )
}

export const ResponsiveDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerHeader className={className} {...props} />
  }

  return <DialogHeader className={className} {...props} />
}

export const ResponsiveDialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogTitle>) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerTitle className={className} {...props} />
  }

  return <DialogTitle className={className} {...props} />
}

export const ResponsiveDialogDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogDescription>) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerDescription className={className} {...props} />
  }

  return <DialogDescription className={className} {...props} />
}

export const ResponsiveDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerFooter className={className} {...props} />
  }

  return <DialogFooter className={className} {...props} />
}

export const ResponsiveDialogClose = ({
  className,
  ...props
}: React.ComponentProps<typeof DialogClose>) => {
  const { isMobile } = useResponsiveDialogContext()

  if (isMobile) {
    return <DrawerClose className={className} {...props} />
  }

  return <DialogClose className={className} {...props} />
}
