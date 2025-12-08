import React from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"

import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

import { ratesFormValues, RateType } from "../zod"

type RatesFormProps = {
  form: UseFormReturn<ratesFormValues>
}

function RatesForm({ form }: RatesFormProps) {
  const { control, watch } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rates",
  })

  return (
    <Form {...form}>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <FormLabel>Rates</FormLabel>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ rateType: RateType.DAILY, amount: 0, limitedMillage: false })}
            className="gap-1"
          >
            <Plus className="w-4 h-4" /> Add Rate
          </Button>
        </div>
        <div className="space-y-2">
          {fields.length === 0 && (
            <div className="text-muted-foreground text-sm">No rates added.</div>
          )}
          {fields.map((field, idx) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5"></div>
              <div className="col-span-5">
                <FormField
                  control={control}
                  name={`rates.${idx}.rateType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Rate Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select rate type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {Object.values(RateType).map(rateType => (
                                <SelectItem key={rateType} value={rateType}>
                                  {rateType.charAt(0).toUpperCase() + rateType.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`rates.${idx}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Amount</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="Amount" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="">
                  <FormField
                    control={control}
                    name={`rates.${idx}.limitedMillage`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Switch
                            id={`rates.${idx}.limitedMillage`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {watch(`rates.${idx}.limitedMillage`) && (
                    <div className="">
                      <FormField
                        control={control}
                        name={`rates.${idx}.millageLimit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Millage Limit</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Millage Limit"
                                className="mt-2"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`rates.${idx}.extraMillageFee`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Extra Millage Fee</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                placeholder="Extra Millage Fee"
                                className="mt-2"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(idx)}
                  aria-label="Remove allowance"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Form>
  )
}

export default RatesForm
