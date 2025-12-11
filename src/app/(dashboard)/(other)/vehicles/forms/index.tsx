"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { Car, ChevronLeft, ChevronRight, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Progress } from "@/components/ui/progress"
import { StepFormItem } from "@/types/step-form"

import { Vehicle, VehicleIdentity, vehicleIdentitySchema } from "../zod"
import IdentityForm from "./identity-form"

function VehicleStepForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<Vehicle>>({})

  const identityForm = useForm<VehicleIdentity>({
    resolver: zodResolver(vehicleIdentitySchema),
    defaultValues: {
      brand: formData.identity?.brand || "",
      model: formData.identity?.model || "",
      year: formData.identity?.year || new Date().getFullYear(),
      vin: formData.identity?.vin || "",
      licensePlate: formData.identity?.licensePlate || "",
    },
    mode: "onBlur",
  })

  const steps = useMemo<StepFormItem[]>(() => {
    return [
      {
        title: "Vehicle Info",
        icon: Car,
        nextButtonText: "Continue to Details",
        form: identityForm,
        formComponent: <IdentityForm form={identityForm} />,
      },
    ]
  }, [identityForm])

  const getCurrentForm = () => {
    return steps[currentStep - 1].form
  }

  const renderStepContent = () => {
    return steps[currentStep - 1].formComponent
  }

  const getNextButtonText = () => {
    return steps[currentStep - 1].nextButtonText || "Continue"
  }

  const getPreviousButtonText = () => {
    return steps[currentStep - 1].previousButtonText || "Go Back"
  }

  const handleNext = async () => {
    const currentForm = getCurrentForm()
    const isValid = await currentForm.trigger()

    if (isValid) {
      const data = currentForm.getValues()
      setFormData(prev => ({ ...prev, ...data }))

      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1)
      }
    } else {
      console.log("Validation failed:", currentForm.formState.errors)
    }
  }

  const handleBack = () => {
    const currentForm = getCurrentForm()
    const currentData = currentForm.getValues()
    setFormData(prev => ({ ...prev, ...currentData }))

    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSave = async () => {
    const currentForm = getCurrentForm()
    const isValid = await currentForm.trigger()

    if (isValid) {
      const currentStepData = currentForm.getValues()
      const finalData = { ...formData, ...currentStepData }

      console.log("FINAL SUBMISSION DATA: ", finalData)
      setIsOpen(false)
    } else {
      console.log("Final step validation failed:", currentForm.formState.errors)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} dismissible={true}>
      <DrawerTrigger asChild>
        <Button>Add Vehicle</Button>
      </DrawerTrigger>
      <DrawerContent showHandle={false} className="h-dvh rounded-none!">
        <DrawerHeader className="px-0 pb-0">
          <div className="drawer-container my-2">
            <DrawerTitle className="md:text-left">Add New Vehicle</DrawerTitle>
            <p className="md:text-left text-muted-foreground">
              Step {currentStep} of {steps.length} - {steps[currentStep - 1].title}
            </p>
          </div>
          <div className="h-1 bg-secondary">
            <Progress className="h-1" value={(currentStep / steps.length) * 100} />
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">{renderStepContent()}</div>

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
              {getPreviousButtonText()}
            </Button>

            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 cursor-pointer"
              >
                {getNextButtonText()}
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Vehicle
              </Button>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default VehicleStepForm
