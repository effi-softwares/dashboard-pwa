"use client"

import { AdvancedMarker, APIProvider, Map, Pin } from "@vis.gl/react-google-maps"

import { env } from "@/lib/env"

export default function GoogleMap() {
  const position = { lat: 6.926944, lng: 79.858333 }

  return (
    <APIProvider apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div style={{ height: "100%", width: "100%" }}>
        <Map
          defaultZoom={16.5}
          defaultTilt={45}
          defaultHeading={45}
          disableDefaultUI={true}
          defaultCenter={position}
          mapId={env.NEXT_PUBLIC_GOOGLE_MAP_ID}
          fullscreenControl={false}
        >
          <AdvancedMarker position={position}>
            <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
          </AdvancedMarker>
        </Map>
      </div>
    </APIProvider>
  )
}
