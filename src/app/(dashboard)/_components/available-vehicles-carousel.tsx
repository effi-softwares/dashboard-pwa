"use client"

import { Car, Fuel, Gauge } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const vehicles = [
  { id: 1, name: "Tesla Model 3", type: "Electric", fuel: 85, mileage: "15,230", price: "$89/day" },
  { id: 2, name: "BMW X5", type: "SUV", fuel: 70, mileage: "32,100", price: "$120/day" },
  { id: 3, name: "Audi Q5", type: "Luxury", fuel: 90, mileage: "8,450", price: "$105/day" },
]

export function AvailableVehiclesCarousel() {
  return (
    <Card className="shadow-sm border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
            <Car className="h-4 w-4 text-green-500" />
            Available Now
          </CardTitle>
          <Badge className="bg-green-500/10 text-green-600 text-xs">7 Ready</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {vehicles.map(vehicle => (
          <div
            key={vehicle.id}
            className="flex items-center justify-between p-2 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{vehicle.name}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Fuel className="h-3 w-3 text-green-500" />
                  {vehicle.fuel}%
                </span>
                <span className="flex items-center gap-1">
                  <Gauge className="h-3 w-3" />
                  {vehicle.mileage}
                </span>
              </div>
            </div>
            <div className="text-right">
              <Badge className="bg-primary/10 text-primary text-xs">{vehicle.type}</Badge>
              <p className="text-xs font-bold text-foreground mt-1">{vehicle.price}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
