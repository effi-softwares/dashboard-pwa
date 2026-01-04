"use client"

import { useCallback } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { FatButton } from "@/components/ui/fat-button"
import { FatInput } from "@/components/ui/fat-input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  type PaymentDetailsInput,
  paymentDetailsSchema,
} from "@/features/booking/schemas/booking-form.schema"

interface PaymentFormProps {
  dailyRate: number
  totalDays: number
  onSubmit: (data: PaymentDetailsInput) => void
  isLoading?: boolean
  onBack?: () => void
}

export function PaymentForm({
  dailyRate,
  totalDays,
  onSubmit,
  isLoading = false,
  onBack,
}: PaymentFormProps) {
  const form = useForm<PaymentDetailsInput>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      paymentMethod: "Cash",
      securityDepositAmount: 500,
    },
  })

  const handleSubmit = useCallback(
    (data: PaymentDetailsInput) => {
      onSubmit(data)
    },
    [onSubmit],
  )

  const totalAmount = dailyRate * totalDays
  const securityDeposit = form.watch("securityDepositAmount")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Confirm payment method and security deposit.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Daily Rate</span>
            <span className="font-medium">€{dailyRate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Number of Days</span>
            <span className="font-medium">{totalDays} days</span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="font-semibold">Rental Amount</span>
            <span className="font-semibold">€{totalAmount}</span>
          </div>
        </div>

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Payment Method</FormLabel>
              <FormControl>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={field.value === "Cash" ? "default" : "outline"}
                    onClick={() => field.onChange("Cash")}
                    className="flex-1"
                  >
                    💵 Cash
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="securityDepositAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Security Deposit (€)</FormLabel>
              <FormControl>
                <FatInput
                  type="number"
                  placeholder="500"
                  min={0}
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Security Deposit</span>
            <span className="font-medium">€{securityDeposit}</span>
          </div>
          <div className="flex justify-between text-sm border-t pt-2">
            <span className="font-semibold">Total Due Today</span>
            <span className="font-semibold text-blue-600">€{totalAmount + securityDeposit}</span>
          </div>
        </div>

        <div className="flex gap-3 justify-between pt-4">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <div className="flex-1" />
          <FatButton type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Continue"}
          </FatButton>
        </div>
      </form>
    </Form>
  )
}
