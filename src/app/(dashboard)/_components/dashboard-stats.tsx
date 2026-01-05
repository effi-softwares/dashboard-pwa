import { Car, CheckCircle, Key, Wrench } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Total",
    value: "12",
    icon: Car,
    description: "Total vehicles",
  },
  {
    title: "Available",
    value: "7",
    icon: CheckCircle,
    description: "Ready for rent",
  },
  {
    title: "Rented",
    value: "3",
    icon: Key,
    description: "Currently out",
  },
  {
    title: "Service",
    value: "2",
    icon: Wrench,
    description: "In maintenance",
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map(stat => (
        <Card key={stat.title} className="shadow-sm border-border bg-card">
          <CardContent className="p-2 flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground uppercase tracking-wide truncate">
                {stat.title}
              </p>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
