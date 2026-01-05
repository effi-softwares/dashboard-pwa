"use client"

import Link from "next/link"

import { ExternalLink, MapPin } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import GoogleMap from "../fleet-map/_components/google-map"

export function FleetMapPreview() {
  return (
    <Card className="shadow-sm border-border overflow-hidden bg-card h-full">
      <CardHeader className="pb-1">
        <CardTitle className="text-xs font-medium flex items-center gap-2 text-foreground">
          <MapPin className="h-3 w-3 text-blue-400" />
          Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative h-[200px]">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-75">
          {/* We use the existing GoogleMap component but disable interaction via overlay */}
          <GoogleMap />
        </div>

        {/* Overlay for click and styling */}
        <Link
          href="/fleet-map"
          className="absolute inset-0 z-10 bg-black/20 hover:bg-black/30 transition-colors flex items-center justify-center group"
        >
          <div className="bg-card/95 backdrop-blur-sm px-2 py-1 rounded shadow-lg border border-blue-500/30 flex items-center gap-1 text-[10px] font-medium text-primary group-hover:scale-105 transition-transform">
            <MapPin className="h-2.5 w-2.5 text-blue-400" />
            3 on road
            <ExternalLink className="h-2.5 w-2.5" />
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
