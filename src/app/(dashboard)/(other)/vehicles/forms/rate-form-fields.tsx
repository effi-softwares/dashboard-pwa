import { Control, UseFormSetValue, useWatch } from "react-hook-form"

import { Plus, Trash2 } from "lucide-react"

import SegmentedToggle, { SegmentedToggleItem } from "@/components/segmented-toggle"
import { Button } from "@/components/ui/button"
import { FatInput } from "@/components/ui/fat-input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { VehicleRatesInput } from "@/zod/vehicle-form"

type RateFormFieldProps = {
  control: Control<VehicleRatesInput>
  idx: number
  setValue: UseFormSetValue<VehicleRatesInput>
  remove: (index: number) => void
}

export const pricingModelItems: SegmentedToggleItem[] = [
  { label: "Daily", icon: Plus, value: "Daily", ariaLabel: "Select daily pricing model" },
  { label: "Weekly", icon: Plus, value: "Weekly", ariaLabel: "Select weekly pricing model" },
  { label: "Monthly", icon: Plus, value: "Monthly", ariaLabel: "Select monthly pricing model" },
  {
    label: "Distance-Based",
    icon: Plus,
    value: "Distance-Based",
    ariaLabel: "Select distance-based pricing model",
  },
]

const measureUnitItems: SegmentedToggleItem[] = [
  { label: "km", icon: Plus, value: "km", ariaLabel: "Kilometers" },
  { label: "miles", icon: Plus, value: "miles", ariaLabel: "Miles" },
]

function RateFormField() {
  return function RateFormField({ control, idx, setValue, remove }: RateFormFieldProps) {
    const mileageType = useWatch({ control, name: `rates.${idx}.mileagePolicy.mileageType` })
    const requiresDeposit = useWatch({ control, name: `rates.${idx}.requiresDeposit` })

    return (
      <div className="border p-4 rounded-md mb-4 space-y-6">
        <FormField
          control={control}
          name={`rates.${idx}.pricingModel`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pricing Model</FormLabel>
              <FormControl>
                <SegmentedToggle spacing={2} field={field} items={pricingModelItems} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={control}
            name={`rates.${idx}.rate`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate</FormLabel>
                <FormControl>
                  <FatInput
                    type="number"
                    placeholder="Base price"
                    value={field.value ?? 0}
                    onChange={e => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Set the base price for the selected pricing model.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name={`rates.${idx}.mileagePolicy.mileageType`}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel>Mileage Policy</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Choose unlimited mileage or set daily distance caps with overage fees.
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === "Limited"}
                    onCheckedChange={checked => {
                      if (checked) {
                        setValue(
                          `rates.${idx}.mileagePolicy`,
                          {
                            mileageType: "Limited",
                            limitPerDay: 200,
                            overageFeePerUnit: 0,
                            measureUnit: "km",
                          },
                          { shouldValidate: true },
                        )
                        field.onChange("Limited")
                      } else {
                        setValue(
                          `rates.${idx}.mileagePolicy`,
                          {
                            mileageType: "Unlimited",
                          },
                          { shouldValidate: true },
                        )
                        field.onChange("Unlimited")
                      }
                    }}
                    aria-label="Toggle limited mileage"
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {mileageType === "Limited" && (
          <div className="rounded-md border p-4 space-y-4 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Define the daily distance cap and overage fee. When renters exceed the limit, the
              overage fee applies per selected unit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={control}
                name={`rates.${idx}.mileagePolicy.limitPerDay`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Limit</FormLabel>
                    <FormControl>
                      <FatInput
                        type="number"
                        placeholder="e.g., 200"
                        value={field.value ?? 0}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Maximum distance allowed per day.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`rates.${idx}.mileagePolicy.overageFeePerUnit`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overage Fee / Unit</FormLabel>
                    <FormControl>
                      <FatInput
                        type="number"
                        placeholder="e.g., 0.50"
                        value={field.value ?? 0}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Fee charged for each extra kilometer/mile beyond the daily limit.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`rates.${idx}.mileagePolicy.measureUnit`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <SegmentedToggle spacing={2} field={field} items={measureUnitItems} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <FormItem>
          <div className="flex items-center justify-between">
            <div>
              <FormLabel>Security Deposit</FormLabel>
              <p className="text-xs text-muted-foreground">
                Require an upfront deposit to reduce risk. If enabled, a positive amount is
                mandatory.
              </p>
            </div>
            <FormField
              control={control}
              name={`rates.${idx}.requiresDeposit`}
              render={({ field }) => (
                <FormControl>
                  <Switch
                    checked={Boolean(field.value)}
                    onCheckedChange={checked => {
                      field.onChange(checked)
                      if (!checked) {
                        setValue(`rates.${idx}.depositAmount`, undefined)
                      }
                    }}
                    aria-label="Toggle security deposit requirement"
                  />
                </FormControl>
              )}
            />
          </div>
        </FormItem>

        {requiresDeposit && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control}
              name={`rates.${idx}.depositAmount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deposit Amount</FormLabel>
                  <FormControl>
                    <FatInput
                      type="number"
                      placeholder="Enter deposit amount"
                      value={field.value ?? 0}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Required when a security deposit is enabled.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(idx)}
            aria-label="Remove rate"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </div>
    )
  }
}

export default RateFormField
