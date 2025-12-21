"use client"

import { useMemo, useState } from "react"
import { useForm, UseFormReturn } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { Car, ChevronLeft, ChevronRight, LucideIcon, Save } from "lucide-react"

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
import { Spinner } from "@/components/ui/spinner"
import { useCreateVehicle } from "@/hooks/use-create-vehicle"
import type { Vehicle } from "@/zod/vehicle-form"
import {
  VehicleIdentityInput,
  vehicleIdentitySchema,
  VehicleInput,
  VehicleOperationsInput,
  vehicleOperationsSchema,
  VehicleRatesInput,
  vehicleRatesSchema,
  VehicleSpecsInput,
  vehicleSpecsSchema,
} from "@/zod/vehicle-form"

import IdentityForm from "./identity-form"
import OperationsForm from "./operations-form"
import RateForm from "./rate-form"
import SpecForm from "./spec-form"

export interface StepFormItem {
  title: string
  previousButtonText?: string
  nextButtonText?: string
  form:
    | UseFormReturn<VehicleIdentityInput>
    | UseFormReturn<VehicleSpecsInput>
    | UseFormReturn<VehicleOperationsInput>
    | UseFormReturn<VehicleRatesInput>
  formComponent: React.ReactNode
  icon: LucideIcon
}

function VehicleStepForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [formData, setFormData] = useState<Partial<VehicleInput>>({})
  const createVehicle = useCreateVehicle()

  const identityForm = useForm<VehicleIdentityInput>({
    resolver: zodResolver(vehicleIdentitySchema),
    defaultValues: {
      brand: formData.identity?.brand || "",
      model: formData.identity?.model || "",
      year: formData.identity?.year || new Date().getFullYear(),
      vin: formData.identity?.vin || "",
      licensePlate: formData.identity?.licensePlate || "",
      color: formData.identity?.color,
      isBrandNew: formData.identity?.isBrandNew,
    },
    mode: "onBlur",
  })

  const specsForm = useForm<VehicleSpecsInput>({
    resolver: zodResolver(vehicleSpecsSchema),
    defaultValues: {
      transmission: formData.specs?.transmission,
      fuelType: formData.specs?.fuelType,
      seats: formData.specs?.seats,
      doors: formData.specs?.doors,
      baggageCapacity: formData.specs?.baggageCapacity,
      features: formData.specs?.features,
    },
    mode: "onBlur",
  })

  const operationsForm = useForm<VehicleOperationsInput>({
    resolver: zodResolver(vehicleOperationsSchema),
    defaultValues: {
      status: formData.operations?.status,
      mileage: formData.operations?.mileage,
      registrationExpiryDate: formData.operations?.registrationExpiryDate,
      insuranceExpiryDate: formData.operations?.insuranceExpiryDate,
      insurancePolicyNumber: formData.operations?.insurancePolicyNumber,
    },
    mode: "onBlur",
  })

  const ratesForm = useForm<VehicleRatesInput>({
    resolver: zodResolver(vehicleRatesSchema),
    defaultValues: {
      rates: [],
    },
    mode: "onBlur",
  })

  const steps = useMemo<StepFormItem[]>(
    () => [
      {
        title: "Vehicle Info",
        icon: Car,
        nextButtonText: "Continue to Details",
        form: identityForm,
        formComponent: <IdentityForm form={identityForm} />,
      },
      {
        title: "Specifications",
        icon: Car,
        previousButtonText: "Back to Info",
        nextButtonText: "Continue to Operations",
        form: specsForm,
        formComponent: <SpecForm form={specsForm} />,
      },
      {
        title: "Operations",
        icon: Car,
        previousButtonText: "Back to Details",
        nextButtonText: "Continue to Rates",
        form: operationsForm,
        formComponent: <OperationsForm form={operationsForm} />,
      },
      {
        title: "Rates & Financials",
        icon: Car,
        previousButtonText: "Back to Operations",
        nextButtonText: "Save Vehicle",
        form: ratesForm,
        formComponent: <RateForm form={ratesForm} />,
      },
    ],
    [identityForm, specsForm, operationsForm, ratesForm],
  )

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
    // const currentForm = getCurrentForm()
    // const isValid = await currentForm.trigger()

    // if (isValid) {
    //   const data = currentForm.getValues()
    //   setFormData(prev => ({ ...prev, ...data }))

    //   if (currentStep < steps.length) {
    //     setCurrentStep(prev => prev + 1)
    //   }
    // } else {
    //   console.log("Validation failed:", currentForm.formState.errors)
    // }

    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    // const currentForm = getCurrentForm()
    // const currentData = currentForm.getValues()
    // setFormData(prev => ({ ...prev, ...currentData }))

    // if (currentStep > 1) {
    //   setCurrentStep(prev => prev - 1)
    // }
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSave = async () => {
    const currentForm = getCurrentForm()
    const isValid = await currentForm.trigger()

    if (isValid) {
      try {
        const identity = identityForm.getValues()
        const specs = specsForm.getValues()
        const operations = operationsForm.getValues()
        const rates = ratesForm.getValues()

        const payloadInput: VehicleInput = {
          identity,
          specs,
          operations,
          rates,
        }

        console.log(payloadInput)
        return

        const created = await createVehicle.mutateAsync(payloadInput as unknown as Vehicle)
        console.log("Vehicle created:", created)

        setIsOpen(false)
        setCurrentStep(1)
        identityForm.reset()
        specsForm.reset()
        operationsForm.reset()
        ratesForm.reset()
      } catch (err) {
        console.error("Create vehicle failed:", err)
      }
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
          <div className="flex justify-between drawer-container gap-4">
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
            <div className="flex-1"></div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 text-sky-700 bg-transparent hover:bg-transparent hover:underline hover:text-sky-600"
            >
              Cancel
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
                disabled={createVehicle.isPending}
                className="flex items-center gap-2 cursor-pointer"
              >
                {createVehicle.isPending ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {createVehicle.isPending ? "Saving..." : "Save Vehicle"}
              </Button>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default VehicleStepForm
