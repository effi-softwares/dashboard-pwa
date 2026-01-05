import { Activity, ArrowRightLeft, Car, Wrench } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
  {
    id: 1,
    title: "Vehicle Rented",
    description: "Audi Q5 rented to John Smith • $145.50",
    time: "2d ago",
    icon: ArrowRightLeft,
    color: "blue",
    status: "completed",
  },
  {
    id: 2,
    title: "Vehicle Rented",
    description: "Tesla Model 3 rented to Emma Wilson • $189.00",
    time: "Yesterday",
    icon: ArrowRightLeft,
    color: "blue",
    status: "completed",
  },
  {
    id: 3,
    title: "Vehicle Returned",
    description: "BMW 5 Series returned by Michael Brown • Clean condition",
    time: "3d ago",
    icon: Car,
    color: "green",
    status: "completed",
  },
  {
    id: 4,
    title: "Maintenance Started",
    description: "Transmission Service - Volkswagen Multivan",
    time: "2h ago",
    icon: Wrench,
    color: "orange",
    status: "ongoing",
  },
  {
    id: 5,
    title: "Booking Created",
    description: "Sarah Connor booked Ford Mustang • Jan 10-15",
    time: "1h ago",
    icon: ArrowRightLeft,
    color: "blue",
    status: "pending",
  },
  {
    id: 6,
    title: "Payment Received",
    description: "Emma Wilson paid $89.00 for return inspection",
    time: "45m ago",
    icon: ArrowRightLeft,
    color: "green",
    status: "completed",
  },
]

export function RecentActivity() {
  return (
    <Card className="shadow-sm border-border h-full bg-card">
      <CardHeader className="pb-1">
        <CardTitle className="text-xs font-medium flex items-center gap-2 text-foreground">
          <Activity className="h-3 w-3 text-blue-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {activities.map(activity => (
          <div
            key={activity.id}
            className="flex items-center gap-2 p-1.5 rounded-lg border transition-colors bg-muted/20 border-border hover:bg-muted/40"
          >
            <div
              className={`h-6 w-6 rounded flex items-center justify-center flex-shrink-0 ${
                activity.color === "blue"
                  ? "bg-primary/10 text-primary"
                  : activity.color === "green"
                    ? "bg-green-600/10 text-green-600"
                    : "bg-orange-600/10 text-orange-600"
              }`}
            >
              <activity.icon className="h-3 w-3" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-foreground truncate">{activity.title}</p>
              <p className="text-[10px] text-muted-foreground truncate">{activity.description}</p>
            </div>
            <div className="text-[9px] text-muted-foreground flex-shrink-0">{activity.time}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
