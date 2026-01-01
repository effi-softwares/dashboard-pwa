import { BlobImage } from "@/components/ui/blob-image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { VehicleImage } from "@/types/vehicle"

interface VehicleImagesProps {
  images: VehicleImage[]
}

export function VehicleImages({ images }: VehicleImagesProps) {
  const hasImages = images.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Images</CardTitle>
      </CardHeader>
      <CardContent>
        {hasImages ? (
          <div className="grid gap-4 md:grid-cols-3">
            {images.map(image => (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-lg border bg-muted"
                aria-label={`Vehicle image (${image.role})`}
              >
                <BlobImage
                  src={image.url}
                  blurDataURL={image.blurDataURL ?? undefined}
                  alt={`Vehicle image (${image.role})`}
                  width={800}
                  height={600}
                  className="h-56 w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="px-3 py-2 border-t bg-background text-sm font-medium capitalize">
                  {image.role}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No images uploaded for this vehicle yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
