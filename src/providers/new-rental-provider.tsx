"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import CustomerDetailsForm from "@/components/new-rental/customer-details-form"
import VehicleSelectionForm from "@/components/new-rental/vehile-selection-form"
import {
  CustomerDetailsFormValues,
  customerDetailsSchema,
  type VehicleSelectionFormValues,
  vehicleSelectionSchema,
} from "@/components/new-rental/zod"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent } from "@/components/ui/drawer"

type NewRentalContextType = {
  isOpen: boolean
  step: number
  setIsOpen: (isOpen: boolean) => void
  showDrawer: () => void
  hideDrawer: () => void
}

type NewRentalFormValues = VehicleSelectionFormValues & CustomerDetailsFormValues

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
  const [step, setStep] = useState<number>(1)
  const [formData, setFormData] = useState<Partial<NewRentalFormValues>>({})

  const showDrawer = useCallback(() => setIsOpen(true), [])
  const hideDrawer = useCallback(() => setIsOpen(false), [])

  const vehicleSelectionForm = useForm<VehicleSelectionFormValues>({
    resolver: zodResolver(vehicleSelectionSchema),
    defaultValues: {
      vehicleId: formData.vehicleId || "",
    },
  })

  const customerDetailsForm = useForm<CustomerDetailsFormValues>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: {
      email: formData.email || "",
      contactNumber: formData.contactNumber || "",
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      driverLicenseNumber: formData.driverLicenseNumber || "",
    },
  })

  const getCurrentForm = () => {
    switch (step) {
      case 1:
        return vehicleSelectionForm
      case 2:
        return customerDetailsForm
      default:
        return vehicleSelectionForm
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <VehicleSelectionForm />
      case 2:
        return <CustomerDetailsForm />
      default:
        return <VehicleSelectionForm />
    }
  }

  const handleNext = async () => {
    if (step < 2) {
      setStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1)
    }
  }

  const contextValue = useMemo<NewRentalContextType>(
    () => ({
      isOpen,
      step,
      setIsOpen,
      showDrawer,
      hideDrawer,
    }),
    [isOpen, step, setIsOpen, showDrawer, hideDrawer],
  )

  return (
    <NewRentalContext.Provider value={contextValue}>
      {children}
      <Drawer open={isOpen} onOpenChange={setIsOpen} dismissible={true}>
        <DrawerContent showHandle={false} className="h-dvh rounded-none!">
          <div className="max-w-7xl mx-auto flex flex-col h-full w-full">
            <div className="flex items-center justify-between py-4 mb-4 md:mb-0 border-b w-full">
              <div className="">Title</div>
              <Button className="cursor-pointer" variant="ghost" onClick={hideDrawer}>
                <X />
              </Button>
            </div>
            <div className="flex-1">{renderStepContent()}</div>
            <div className="shrink-0 py-4 mb-4 md:mb-0 border-t w-full">
              <div className="flex justify-between">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <Button onClick={handleNext} className="flex items-center gap-2 cursor-pointer">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </NewRentalContext.Provider>
  )
}

export { NewRentalProvider, useNewRentalContext }
