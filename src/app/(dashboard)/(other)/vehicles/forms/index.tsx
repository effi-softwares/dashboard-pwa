"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { Car, Check, ChevronLeft, ChevronRight, IdCard, Loader2, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

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
  const [isLoading, setIsLoading] = useState(false)

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
        <DrawerHeader className="max-w-7xl mx-auto w-full py-4">
          <div className="flex flex-col md:flex-row items-center justify-between border-b pb-4">
            <div className="">
              <DrawerTitle className="md:text-left">Add New Vehicle</DrawerTitle>
              <p className="md:text-left">Fill in the details to add a vehicle to your fleet</p>
            </div>
            <Button className="cursor-pointer" variant="ghost" onClick={() => setIsOpen(false)}>
              <X />
            </Button>
          </div>
        </DrawerHeader>
        <div className="flex flex-col h-full w-full">
          <div className="px-6 py-4 border-b bg-secondary/30">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={cn(
                      "flex items-center gap-2 transition-all duration-300",
                      step.id === currentStep && "scale-105",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                        step.id < currentStep
                          ? "bg-emerald-600 text-white"
                          : step.id === currentStep
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {step.id < currentStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "hidden md:block text-sm font-medium transition-colors",
                        step.id === currentStep ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-8 lg:w-16 h-0.5 mx-2 transition-colors duration-300",
                        step.id < currentStep ? "bg-emerald-600" : "bg-border",
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-w-7xl mx-auto w-full">
            <div className="px-8 py-6">{renderStepContent()}</div>
          </div>
          <div className="shrink-0 px-8 py-6 mb-4 md:mb-0 border-t">
            <div className="flex justify-between">
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
                  {isLoading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Employee
                </Button>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default VehicleFormComponent
