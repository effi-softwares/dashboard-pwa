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
  type ExteriorInspectionInput,
  exteriorInspectionSchema,
} from "@/features/booking/schemas/booking-form.schema"

interface ExteriorInspectionFormProps {
  onSubmit: (data: ExteriorInspectionInput) => void
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

export function ExteriorInspectionForm({
  onSubmit,
  isLoading = false,
  onBack,
}: ExteriorInspectionFormProps) {
  const form = useForm<ExteriorInspectionInput>({
    resolver: zodResolver(exteriorInspectionSchema),
    defaultValues: {
      frontStatus: "OK",
      rearStatus: "OK",
      leftStatus: "OK",
      rightStatus: "OK",
      trunkStatus: "OK",
      exteriorNotes: "",
    },
  })

  const handleSubmit = useCallback(
    (data: ExteriorInspectionInput) => {
      onSubmit(data)
    },
    [onSubmit],
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Exterior Condition Check</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Document the exterior condition. Take photos and mark each area.
          </p>
        </div>

        <FormField
          control={form.control}
          name="frontStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Front View</FormLabel>
              <FormControl>
                <StatusToggle value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rearStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Rear View</FormLabel>
              <FormControl>
                <StatusToggle value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leftStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Left Side</FormLabel>
              <FormControl>
                <StatusToggle value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rightStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Right Side</FormLabel>
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
          name="exteriorNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Notes (Optional)</FormLabel>
              <FormControl>
                <textarea
                  placeholder="Add any additional notes about the exterior condition"
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
