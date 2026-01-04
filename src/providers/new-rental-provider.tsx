"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

import { X } from "lucide-react"

import { RentalBookingWizard } from "@/app/(dashboard)/(other)/bookings/_components/rental-booking-wizard"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"

export type RentalEntryPoint = "vehicle-table" | "home"

type NewRentalContextType = {
  isOpen: boolean
  selectedVehicleId?: string | null
  entryPoint?: RentalEntryPoint
  setIsOpen: (isOpen: boolean) => void
  showDrawer: (id?: string, entryPoint?: RentalEntryPoint) => void
  showDrawerWithoutVehicle: (entryPoint?: RentalEntryPoint) => void
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
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [entryPoint, setEntryPoint] = useState<RentalEntryPoint>("home")

  const showDrawer = useCallback((id?: string, ep: RentalEntryPoint = "vehicle-table") => {
    if (id) setSelectedVehicleId(id)
    setEntryPoint(ep)
    setIsOpen(true)
  }, [])

  const showDrawerWithoutVehicle = useCallback((ep: RentalEntryPoint = "home") => {
    setSelectedVehicleId(null)
    setEntryPoint(ep)
    setIsOpen(true)
  }, [])

  const hideDrawer = useCallback(() => {
    setIsOpen(false)
    setSelectedVehicleId(null)
    setEntryPoint("home")
  }, [])

  const contextValue = useMemo<NewRentalContextType>(
    () => ({
      isOpen,
      selectedVehicleId,
      entryPoint,
      setIsOpen,
      showDrawer,
      showDrawerWithoutVehicle,
      hideDrawer,
    }),
    [
      isOpen,
      selectedVehicleId,
      entryPoint,
      setIsOpen,
      showDrawer,
      showDrawerWithoutVehicle,
      hideDrawer,
    ],
  )

  return (
    <NewRentalContext.Provider value={contextValue}>
      {children}
      <Drawer open={isOpen} onOpenChange={setIsOpen} dismissible={true}>
        <DrawerContent showHandle={false} className="h-dvh rounded-none!">
          <div className="max-w-7xl mx-auto flex flex-col h-full w-full">
            <div className="flex items-center justify-between py-4 mb-4 md:mb-0 border-b w-full">
              <DrawerTitle className="">Start Rental</DrawerTitle>
              <Button className="cursor-pointer" variant="ghost" onClick={hideDrawer}>
                <X />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <RentalBookingWizard
                preselectedVehicleId={selectedVehicleId}
                entryPoint={entryPoint}
                onClose={hideDrawer}
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </NewRentalContext.Provider>
  )
}

export { NewRentalProvider, useNewRentalContext }
