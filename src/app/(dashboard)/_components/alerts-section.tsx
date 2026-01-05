import { Bell, CreditCard } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const alerts = [
  {
    id: 1,
    title: "Payment pending",
    description: "Emma Wilson",
    amount: "$145.50",
    type: "payment",
    urgent: true,
    daysOverdue: 2,
  },
  {
    id: 2,
    title: "Payment pending",
    description: "Lisa Anderson",
    amount: "$89.00",
    type: "payment",
    urgent: false,
    daysOverdue: 0,
  },
  {
    id: 3,
    title: "License expiring",
    description: "John Doe - 5 days left",
    type: "document",
    urgent: true,
  },
  {
    id: 4,
    title: "Service due",
    description: "Toyota Camry",
    type: "service",
    urgent: false,
  },
]

export function AlertsSection() {
  return (
    <Card className="shadow-sm border-border h-full bg-card">
      <CardHeader className="pb-1">
        <CardTitle className="text-xs font-medium flex items-center gap-2 text-foreground">
          <Bell className="h-3 w-3 text-orange-500" />
          Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-2.5 rounded-lg border transition-colors ${
                alert.urgent
                  ? "border-destructive bg-destructive/10 hover:bg-destructive/20"
                  : "border-border bg-muted/30 hover:bg-muted/50"
              }`}
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  alert.urgent
                    ? "bg-destructive/20 text-destructive"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <CreditCard className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                  {alert?.daysOverdue && alert?.daysOverdue > 0 && (
                    <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">
                      {alert.daysOverdue}d overdue
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{alert.description}</p>
                {alert.amount && (
                  <p className="text-xs font-semibold text-foreground mt-1">{alert.amount}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
