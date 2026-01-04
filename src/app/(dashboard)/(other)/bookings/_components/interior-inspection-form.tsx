"use client"

import { useCallback } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { FatButton } from "@/components/ui/fat-button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  type InteriorInspectionInput,
  interiorInspectionSchema,
} from "@/features/booking/schemas/booking-form.schema"

interface InteriorInspectionFormProps {
  onSubmit: (data: InteriorInspectionInput) => void
  isLoading?: boolean
  onBack?: () => void
}

function StatusToggle({
  value,
  onChange,
}: {
  value: "OK" | "Damage"
  onChange: (value: "OK" | "Damage") => void
}) {
  return (
    <div className="flex gap-3">
      <Button
        type="button"
        variant={value === "OK" ? "default" : "outline"}
        onClick={() => onChange("OK")}
        className="flex-1"
      >
        ✓ OK
      </Button>
      <Button
        type="button"
        variant={value === "Damage" ? "destructive" : "outline"}
        onClick={() => onChange("Damage")}
        className="flex-1"
      >
        ⚠ Damage
      </Button>
    </div>
  )
}

export function InteriorInspectionForm({
  onSubmit,
  isLoading = false,
  onBack,
}: InteriorInspectionFormProps) {
  const form = useForm<InteriorInspectionInput>({
    resolver: zodResolver(interiorInspectionSchema),
    defaultValues: {
      dashboardStatus: "OK",
      seatsStatus: "OK",
      frontSeatsStatus: "OK",
      trunkStatus: "OK",
      interiorNotes: "",
    },
  })

  const handleSubmit = useCallback(
    (data: InteriorInspectionInput) => {
      onSubmit(data)
    },
    [onSubmit],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Interior Condition Check</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Document the interior condition. Check seats, dashboard, and trunk.
          </p>
        </div>

        <FormField
          control={form.control}
          name="dashboardStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Dashboard</FormLabel>
              <FormControl>
                <StatusToggle value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seatsStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Seats</FormLabel>
              <FormControl>
                <StatusToggle value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frontSeatsStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Front Seats</FormLabel>
              <FormControl>
                <StatusToggle value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="trunkStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Trunk</FormLabel>
              <FormControl>
                <StatusToggle value={field.value || "OK"} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interiorNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Notes (Optional)</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Add any additional notes about the interior condition"
                  className="w-full p-3 border rounded-md text-sm"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-between pt-4">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <div className="flex-1" />
          <FatButton type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Continue"}
          </FatButton>
        </div>
      </form>
    </Form>
  )
}
