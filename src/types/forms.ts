/**
 * Form-related types
 */

export type ImageFormType = "front" | "back" | "interior"

export interface UploadedImages {
  frontImageId?: string
  backImageId?: string
  interiorImageId?: string
}

export interface ImageUploadProgress {
  imageType: ImageFormType
  progress: number
}
