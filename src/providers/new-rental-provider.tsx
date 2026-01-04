"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"

type NewRentalContextType = {
  isOpen: boolean
  selectedId?: string | null
  setIsOpen: (isOpen: boolean) => void
  showDrawer: (id: string) => void
  hideDrawer: () => void
}

const NewRentalContext = createContext<NewRentalContextType | null>(null)

function useNewRentalContext() {
  const context = useContext(NewRentalContext)
  if (!context) {
    throw new Error("useNewRentalContext must be used within a NewRentalProvider")
  }
  return context
}

function NewRentalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const showDrawer = useCallback((id: string) => {
    setSelectedId(id)
    setIsOpen(true)
  }, [])
  const hideDrawer = useCallback(() => {
    setIsOpen(false)
    setSelectedId(null)
  }, [])

  const contextValue = useMemo<NewRentalContextType>(
    () => ({
      isOpen,
      selectedId,
      setIsOpen,
      showDrawer,
      hideDrawer,
    }),
    [isOpen, selectedId, setIsOpen, showDrawer, hideDrawer],
  )

  return (
    <NewRentalContext.Provider value={contextValue}>
      {children}
      <Drawer open={isOpen} onOpenChange={setIsOpen} dismissible={true}>
        <DrawerContent showHandle={false} className="h-dvh rounded-none!">
          <div className="max-w-7xl mx-auto flex flex-col h-full w-full">
            <div className="flex items-center justify-between py-4 mb-4 md:mb-0 border-b w-full">
              <DrawerTitle className="">Title</DrawerTitle>
              <Button className="cursor-pointer" variant="ghost" onClick={hideDrawer}>
                <X />
              </Button>
            </div>
            <div className="flex-1">{selectedId}</div>
          </div>
        </DrawerContent>
      </Drawer>
    </NewRentalContext.Provider>
  )
}

export { NewRentalProvider, useNewRentalContext }
