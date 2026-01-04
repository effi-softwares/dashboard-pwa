"use client"

import { useState } from "react"
import { UseFormReturn } from "react-hook-form"

import SingleImageUploader, { onUploadCompleteOptions } from "@/components/single-image-uploader"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { VehicleImagesInput } from "@/features/vehicle/schemas/vehicle-form.schema"
import type { ImageFormType } from "@/types"

type UploadedImages = {
  front?: Omit<onUploadCompleteOptions, "file">
  back?: Omit<onUploadCompleteOptions, "file">
  interior?: Omit<onUploadCompleteOptions, "file">
}

type ImagesFormProps = {
  form: UseFormReturn<VehicleImagesInput>
}

function ImagesForm({ form }: ImagesFormProps) {
  const [uploadingCount, setUploadingCount] = useState(0)
  const [uploadedImages, setUploadedImages] = useState<UploadedImages>({})

  const handleUploadComplete = (
    type: ImageFormType,
    { id, url, blurDataURL }: Omit<onUploadCompleteOptions, "file">,
  ) => {
    setUploadedImages(prev => ({
      ...prev,
      [type]: { id, url, blurDataURL },
    }))
    setUploadingCount(prev => Math.max(0, prev - 1))
  }

  return (
    <Form {...form}>
      <div className="my-4 drawer-container space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Vehicle Images</h2>
          <p className="text-sm text-muted-foreground">
            Upload high-quality images of the vehicle from different angles. These will be displayed
            to customers.
          </p>
        </div>

        <FormField
          control={form.control}
          name="frontImageUrl"
          render={() => (
            <FormItem>
              <FormLabel>Front View</FormLabel>
              <SingleImageUploader
                label="Front View"
                imageUrl={uploadedImages.front?.url}
                blurDataURL={uploadedImages.front?.blurDataURL}
                onUploadComplete={({ id, url, blurDataURL }) => {
                  form.setValue("frontImageId", id)
                  form.setValue("frontImageUrl", url)
                  handleUploadComplete("front", { id, url, blurDataURL })
                }}
                isUploading={uploadingCount > 0}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="backImageUrl"
          render={() => (
            <FormItem>
              <FormLabel>Back View</FormLabel>
              <SingleImageUploader
                label="Back View"
                imageUrl={uploadedImages.back?.url}
                blurDataURL={uploadedImages.back?.blurDataURL}
                onUploadComplete={({ id, url, blurDataURL }) => {
                  form.setValue("backImageId", id)
                  form.setValue("backImageUrl", url)
                  handleUploadComplete("back", { id, url, blurDataURL })
                }}
                isUploading={uploadingCount > 0}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interiorImageUrl"
          render={() => (
            <FormItem>
              <FormLabel>Interior View</FormLabel>
              <SingleImageUploader
                label="Interior View"
                imageUrl={uploadedImages.interior?.url}
                blurDataURL={uploadedImages.interior?.blurDataURL}
                onUploadComplete={({ id, url, blurDataURL }) => {
                  form.setValue("interiorImageId", id)
                  form.setValue("interiorImageUrl", url)
                  handleUploadComplete("interior", { id, url, blurDataURL })
                }}
                isUploading={uploadingCount > 0}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}

export default ImagesForm
