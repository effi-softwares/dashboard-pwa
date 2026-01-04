/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEffect, useMemo, useState } from "react"

import { useCreateBooking } from "@/features/booking/mutations/use-create-booking"
import { useCreateInspectionReport } from "@/features/booking/mutations/use-create-inspection-report"
import type {
  CustomerDetailsInput,
  ExteriorInspectionInput,
  InteriorInspectionInput,
  PaymentDetailsInput,
} from "@/features/booking/schemas/booking-form.schema"
import { useVehicleById } from "@/features/vehicle/queries/use-vehicle-queries"
import type { RentalEntryPoint } from "@/providers/new-rental-provider"

import { BookingSummaryForm } from "./booking-summary-form"
import { CustomerDetailsForm } from "./customer-details-form"
import { ExteriorInspectionForm } from "./exterior-inspection-form"
import { InteriorInspectionForm } from "./interior-inspection-form"
import { PaymentForm } from "./payment-form"
import { VehicleSelectionForm } from "./vehicle-selection-form"

type WizardStep = "vehicle" | "customer" | "exterior" | "interior" | "payment" | "summary"

interface RentalBookingWizardProps {
  preselectedVehicleId?: string | null
  entryPoint?: RentalEntryPoint
  onClose: () => void
}

export function RentalBookingWizard({
  preselectedVehicleId,
  entryPoint = "home",
  onClose,
}: RentalBookingWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(
    preselectedVehicleId ? "customer" : "vehicle",
  )
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    preselectedVehicleId || null,
  )

  // Form data state
  const [customerDetails, setCustomerDetails] = useState<CustomerDetailsInput | null>(null)
  const [exteriorInspection, setExteriorInspection] = useState<ExteriorInspectionInput | null>(null)
  const [interiorInspection, setInteriorInspection] = useState<InteriorInspectionInput | null>(null)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetailsInput | null>(null)
  const [bookingStartDate, setBookingStartDate] = useState<Date | null>(null)
  const [bookingEndDate, setBookingEndDate] = useState<Date | null>(null)
  const [dailyRate, setDailyRate] = useState<number>(85) // Default rate

  // Queries
  // Guard against accidental non-string values ending up in state (prevents circular JSON errors in query keys)
  const vehicleIdForQuery = typeof selectedVehicleId === "string" ? selectedVehicleId : null
  const { data: vehicleData } = useVehicleById(vehicleIdForQuery)

  // Mutations
  const createBooking = useCreateBooking()
  const createInspection = useCreateInspectionReport()

  // Calculate total days
  const totalDays = useMemo(() => {
    if (!bookingStartDate || !bookingEndDate) return 1
    const days = Math.ceil(
      (bookingEndDate.getTime() - bookingStartDate.getTime()) / (1000 * 60 * 60 * 24),
    )
    return Math.max(1, days)
  }, [bookingStartDate, bookingEndDate])

  const totalAmount = dailyRate * totalDays

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId)
    setCurrentStep("customer")
  }

  const handleCustomerDetails = (data: CustomerDetailsInput) => {
    setCustomerDetails(data)
    setCurrentStep("exterior")
  }

  const handleExteriorInspection = (data: ExteriorInspectionInput) => {
    setExteriorInspection(data)
    setCurrentStep("interior")
  }

  const handleInteriorInspection = (data: InteriorInspectionInput) => {
    setInteriorInspection(data)
    setCurrentStep("payment")
  }

  const handlePayment = (data: PaymentDetailsInput) => {
    setPaymentDetails(data)
    setCurrentStep("summary")
  }

  const handleConfirmBooking = async () => {
    if (!selectedVehicleId || !customerDetails || !bookingStartDate || !bookingEndDate) {
      return
    }

    try {
      const bookingData = {
        vehicleId: selectedVehicleId,
        customerName: customerDetails.customerName,
        customerEmail: customerDetails.customerEmail,
        customerPhone: customerDetails.customerPhone,
        driverLicenseNumber: customerDetails.driverLicenseNumber,
        bookingStartDate: new Date(bookingStartDate),
        bookingEndDate: new Date(bookingEndDate),
        dailyRate,
        totalDays,
        totalAmount,
        paymentMethod: paymentDetails?.paymentMethod || "Cash",
        securityDepositAmount: paymentDetails?.securityDepositAmount || 500,
        notes: "",
      }

      const response = await createBooking.mutateAsync(bookingData)
      const bookingId = response.id

      // Create exterior inspection report
      if (exteriorInspection) {
        await createInspection.mutateAsync({
          bookingId,
          inspectionType: "exterior",
          frontStatus: exteriorInspection.frontStatus,
          rearStatus: exteriorInspection.rearStatus,
          leftStatus: exteriorInspection.leftStatus,
          rightStatus: exteriorInspection.rightStatus,
          trunkStatus: exteriorInspection.trunkStatus,
          notes: exteriorInspection.exteriorNotes,
        })
      }

      // Create interior inspection report
      if (interiorInspection) {
        await createInspection.mutateAsync({
          bookingId,
          inspectionType: "interior",
          frontStatus: "OK", // Use a default for interior
          rearStatus: "OK",
          leftStatus: "OK",
          rightStatus: "OK",
          dashboardStatus: interiorInspection.dashboardStatus,
          seatsStatus: interiorInspection.seatsStatus,
          frontSeatsStatus: interiorInspection.frontSeatsStatus,
          trunkStatus: interiorInspection.trunkStatus,
          notes: interiorInspection.interiorNotes,
        })
      }

      // Close the drawer
      onClose()
    } catch (error) {
      console.error("Error creating booking:", error)
    }
  }

  const stepNumber = useMemo(() => {
    const steps = ["vehicle", "customer", "exterior", "interior", "payment", "summary"]
    return steps.indexOf(currentStep) + 1
  }, [currentStep])

  const stepIndicator = (
    <div className="mb-8">
      <div className="flex justify-between mb-3">
        <span className="text-sm font-semibold">Step {stepNumber} of 6</span>
        <span className="text-sm text-muted-foreground">
          {currentStep === "vehicle" && "Vehicle Selection"}
          {currentStep === "customer" && "Customer Details"}
          {currentStep === "exterior" && "Exterior Check"}
          {currentStep === "interior" && "Interior Check"}
          {currentStep === "payment" && "Payment Details"}
          {currentStep === "summary" && "Rental Summary"}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all"
          style={{ width: `${(stepNumber / 6) * 100}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {stepIndicator}

      {currentStep === "vehicle" && (
        <VehicleSelectionForm
          onSelect={handleVehicleSelect}
          preselectedId={preselectedVehicleId}
          onBack={entryPoint === "home" ? undefined : onClose}
        />
      )}

      {currentStep === "customer" && selectedVehicleId && (
        <CustomerDetailsForm
          onSubmit={data => {
            // Set dates to today and tomorrow as defaults
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            setBookingStartDate(new Date())
            setBookingEndDate(tomorrow)
            handleCustomerDetails(data)
          }}
          isLoading={false}
        />
      )}

      {currentStep === "exterior" && (
        <ExteriorInspectionForm
          onSubmit={handleExteriorInspection}
          onBack={() => setCurrentStep("customer")}
        />
      )}

      {currentStep === "interior" && (
        <InteriorInspectionForm
          onSubmit={handleInteriorInspection}
          onBack={() => setCurrentStep("exterior")}
        />
      )}

      {currentStep === "payment" && (
        <PaymentForm
          dailyRate={dailyRate}
          totalDays={totalDays}
          onSubmit={handlePayment}
          onBack={() => setCurrentStep("interior")}
        />
      )}

      {currentStep === "summary" && vehicleData && (
        <BookingSummaryForm
          vehicle={{
            id: vehicleData.vehicle.id,
            brand: vehicleData.vehicle.brand,
            model: vehicleData.vehicle.model,
            licensePlate: vehicleData.vehicle.licensePlate,
            vehicleType: vehicleData.vehicle.vehicleType,
            year: vehicleData.vehicle.year,
          }}
          customerName={customerDetails?.customerName || ""}
          customerEmail={customerDetails?.customerEmail || ""}
          customerPhone={customerDetails?.customerPhone || ""}
          bookingStartDate={bookingStartDate || new Date()}
          bookingEndDate={bookingEndDate || new Date()}
          dailyRate={dailyRate}
          totalDays={totalDays}
          totalAmount={totalAmount}
          securityDepositAmount={paymentDetails?.securityDepositAmount || 500}
          onConfirm={handleConfirmBooking}
          isLoading={createBooking.isPending}
          onBack={() => setCurrentStep("payment")}
        />
      )}
    </div>
  )
}
