"use client"

import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { Car, ChevronLeft, ChevronRight, DollarSign, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
// If you have this type defined externally, keep the import.
// Otherwise, I have defined it below for safety.
import { StepFormItem } from "@/types/step-form"

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

function VehicleFormComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<NewVehicleFormValues>>({})

  // 1. Setup Vehicle Form
  const vehicleForm = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    mode: "onChange", // Useful to see errors immediately
    defaultValues: {
      make: formData.make || "",
      model: formData.model || "",
      // Ensure this is a number in your Zod schema (z.coerce.number())
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

  // 2. Setup Rates Form
  const ratesForm = useForm<ratesFormValues>({
    resolver: zodResolver(ratesSchema),
    mode: "onChange",
    defaultValues: {
      rates: formData.rates || [],
    },
  })

  // 3. Define Steps
  const steps = useMemo<StepFormItem[]>(() => {
    return [
      {
        title: "Vehicle Info",
        icon: Car,
        nextButtonText: "Continue to Details",
        form: vehicleForm,
        formComponent: <VehicleDetailsForm form={vehicleForm} />,
      },
      {
        title: "Pricing",
        icon: DollarSign,
        nextButtonText: "Review Vehicle",
        form: ratesForm,
        formComponent: <RatesForm form={ratesForm} />,
      },
    ]
  }, [ratesForm, vehicleForm])

  const getCurrentForm = () => {
    return steps[currentStep - 1].form
  }

  const renderStepContent = () => {
    return steps[currentStep - 1].formComponent
  }

  // 4. Handle Next Click
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
      // DEBUG: This tells you WHY the step isn't moving
      console.error("Validation failed:", currentForm.formState.errors)
    }
  }

  const handleBack = () => {
    const currentForm = getCurrentForm()
    // Optional: Save current progress before going back
    const currentData = currentForm.getValues()
    setFormData(prev => ({ ...prev, ...currentData }))

    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  // 5. Handle Final Save
  const handleSave = async () => {
    const currentForm = getCurrentForm()
    const isValid = await currentForm.trigger()

    if (isValid) {
      const currentStepData = currentForm.getValues()
      // Merge all data
      const finalData = { ...formData, ...currentStepData }

      console.log("FINAL SUBMISSION DATA: ", finalData)
      setIsOpen(false) // Close drawer on success
    } else {
      console.error("Final step validation failed:", currentForm.formState.errors)
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
            <DrawerTitle className="md:text-left">
              {currentStep === 1 ? "Add New Vehicle" : "Vehicle Pricing"}
            </DrawerTitle>
            <p className="md:text-left text-muted-foreground">
              Step {currentStep} of {steps.length} - {steps[currentStep - 1].title}
            </p>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">{renderStepContent()}</div>

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

            {/* FIXED LOGIC HERE: Use steps.length instead of hardcoded 3 */}
            {currentStep < steps.length ? (
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
                Save Vehicle
              </Button>
            )}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default VehicleFormComponent
