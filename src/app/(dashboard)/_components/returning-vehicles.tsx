import { AlertCircle, Calendar, Fuel } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ReturningVehicles() {
  const vehicles = [
    {
      id: "1",
      name: "Toyota Camry",
      plate: "ABC-1234",
      returnTime: "Today, 2:00 PM",
      customer: "John Doe",
      phone: "+1 555-0123",
      fuel: "45%",
      mileage: "12,450 km",
      status: "On Time",
      image: "/placeholder-car.png",
      estimatedCharge: "$145.50",
    },
    {
      id: "2",
      name: "Honda CR-V",
      plate: "XYZ-9876",
      returnTime: "Today, 4:30 PM",
      customer: "Sarah Smith",
      phone: "+1 555-0145",
      fuel: "80%",
      mileage: "8,320 km",
      status: "Late",
      image: "/placeholder-car.png",
      estimatedCharge: "$98.75",
      daysOverdue: 2,
    },
    {
      id: "3",
      name: "Ford Mustang",
      plate: "MUS-5555",
      returnTime: "Tomorrow, 9:00 AM",
      customer: "Mike Johnson",
      phone: "+1 555-0167",
      fuel: "60%",
      mileage: "5,100 km",
      status: "On Time",
      image: "/placeholder-car.png",
      estimatedCharge: "$189.00",
    },
  ]

  return (
    <Card className="shadow-sm border-border h-full bg-card">
      <CardHeader className="pb-1">
        <CardTitle className="text-xs font-medium flex items-center gap-2 text-foreground">
          <Calendar className="h-3 w-3 text-blue-400" />
          Returning Soon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {vehicles.map(vehicle => (
          <div
            key={vehicle.id}
            className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
              vehicle.status === "Late"
                ? "border-destructive bg-destructive/10 hover:bg-destructive/20"
                : "border-border bg-muted/30 hover:bg-muted/50"
            }`}
          >
            <div className="h-8 w-8 rounded bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-[10px] font-bold text-blue-700 flex-shrink-0">
              {vehicle.name.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-semibold text-foreground truncate">{vehicle.name}</h4>
                {vehicle.status === "Late" && (
                  <AlertCircle className="h-3 w-3 text-destructive shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{vehicle.plate}</span>
                <span>•</span>
                <span>{vehicle.customer}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-0.5 shrink-0">
              <Badge
                className={`text-[9px] px-1.5 py-0 h-4 ${
                  vehicle.status === "Late"
                    ? "bg-destructive/20 text-destructive"
                    : "bg-green-600/20 text-green-600"
                }`}
              >
                {vehicle.status}
              </Badge>
              <span className="text-[10px] font-bold text-foreground">
                {vehicle.estimatedCharge}
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5 text-[9px] text-muted-foreground shrink-0">
              <span className="flex items-center gap-0.5">
                <Fuel className="h-2.5 w-2.5 text-orange-400" />
                {vehicle.fuel}
              </span>
              <span className="flex items-center gap-0.5">
                <Calendar className="h-2.5 w-2.5 text-primary" />
                {vehicle.returnTime.split(",")[0]}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
