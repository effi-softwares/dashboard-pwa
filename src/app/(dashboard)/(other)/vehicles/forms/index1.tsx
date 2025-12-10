"use client"

import { createElement, useState } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { Car, ChevronLeft, ChevronRight, IdCard, Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"

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

type NewVehicleFormProps = {
  onClose?: () => void
}
type NewVehicleFormValues = VehicleFormValues & ratesFormValues

const steps = [
  { id: 1, title: "Vehicle Details", icon: Car },
  { id: 2, title: "Rates", icon: IdCard },
]

function NewVehicleForm({ onClose }: NewVehicleFormProps) {
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
    <div className="h-full flex flex-col">
      <div className="shrink-0 px-8 py-6 pb-4 border-b">
        <div className="flex items-center gap-2">
          {createElement(steps[currentStep - 1].icon, { className: "w-5 h-5" })}
          <h2 className="text-xl font-semibold">{steps[currentStep - 1].title}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
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
  )
}

export default NewVehicleForm
