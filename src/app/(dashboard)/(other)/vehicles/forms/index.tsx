"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { Car, ChevronLeft, ChevronRight, IdCard, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import {
  FuelType,
  ratesFormValues,
  ratesSchema,
  Transmission,
  VehicleFormValues,
  vehicleSchema,
  VehicleStatus,
} from "../zod"
import RatesForm from "./rates-form"
import VehicleDetailsForm from "./vehicle-details-form"

type NewVehicleFormValues = VehicleFormValues & ratesFormValues

const steps = [
  { id: 1, title: "Vehicle Details", icon: Car },
  { id: 2, title: "Rates", icon: IdCard },
]

function VehicleFormComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<NewVehicleFormValues>>({})

  const vehicleForm = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: formData.make || "",
      model: formData.model || "",
      year: formData.year || new Date().getFullYear(),
      vin: formData.vin || "",
      licensePlate: formData.licensePlate || "",
      color: formData.color || "",
      mileage: formData.mileage || 0,
      transmission: formData.transmission || Transmission.AUTOMATIC,
      seats: formData.seats || 1,
      fuelType: formData.fuelType || FuelType.GASOLINE,
      status: formData.status || VehicleStatus.AVAILABLE,
    },
  })

  const ratesForm = useForm<ratesFormValues>({
    resolver: zodResolver(ratesSchema),
    defaultValues: {
      rates: formData.rates || [],
    },
  })

  const getCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return vehicleForm
      case 2:
        return ratesForm
      default:
        return vehicleForm
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <VehicleDetailsForm form={vehicleForm} />
      case 2:
        return <RatesForm form={ratesForm} />
      default:
        return <div>Vehicle Details Form</div>
    }
  }

  const handleNext = async () => {
    const currentForm = getCurrentForm()
    const isValid = await currentForm.trigger()
    console.log(isValid)

    if (isValid) {
      const data = currentForm.getValues()
      setFormData(prev => ({ ...prev, ...data }))

      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const handleBack = () => {
    const currentData = getCurrentForm().getValues()
    setFormData(prev => ({ ...prev, ...currentData }))

    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSave = async () => {
    const currentForm = getCurrentForm()
    const isValid = await currentForm.trigger()
    if (isValid) {
      const data = currentForm.getValues()
      console.log("form data: ", data)
    } else {
      console.log("form is invalid")
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} dismissible={true}>
      <DrawerTrigger asChild>
        <Button>Add Vehicle</Button>
      </DrawerTrigger>
      <DrawerContent showHandle={false} className="h-dvh rounded-none!">
        <DrawerHeader className="border-b px-0">
          <div className="drawer-container">
            <DrawerTitle className="md:text-left">Add New Vehicle</DrawerTitle>
            <p className="md:text-left">Fill in the details to add a vehicle to your fleet</p>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto">{renderStepContent()}</div>

        <DrawerFooter className="my-2 px-0 border-t">
          <div className="flex justify-between drawer-container">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Employee
              </Button>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default VehicleFormComponent
