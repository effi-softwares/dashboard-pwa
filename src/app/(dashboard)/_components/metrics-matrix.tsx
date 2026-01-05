import { ArrowDown, ArrowUp, DollarSign, TrendingUp, Users } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const metrics = [
  { label: "Revenue", value: "$28.4k", change: "+12%", trend: "up", icon: DollarSign },
  { label: "Bookings", value: "156", change: "+8%", trend: "up", icon: TrendingUp },
  { label: "Customers", value: "89", change: "-3%", trend: "down", icon: Users },
]

export function MetricsMatrix() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {metrics.map(metric => (
        <Card key={metric.label} className="shadow-sm border-border bg-card">
          <CardContent className="p-2">
            <div className="flex items-center gap-1 mb-1">
              <metric.icon className="h-3 w-3 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground uppercase">{metric.label}</p>
            </div>
            <p className="text-lg font-bold text-foreground">{metric.value}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {metric.trend === "up" ? (
                <ArrowUp className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={`text-[10px] font-medium ${
                  metric.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {metric.change}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
