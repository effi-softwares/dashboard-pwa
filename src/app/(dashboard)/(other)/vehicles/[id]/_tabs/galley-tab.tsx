import type { VehicleImage } from "@/types/vehicle"

type Props = {
  images: VehicleImage[]
}

function GalleryTab({ images }: Props) {
  return (
    <div className="space-y-8">
      <p>Gallery tab content goes here. {images.length} images available.</p>
    </div>
  )
}

export default GalleryTab
