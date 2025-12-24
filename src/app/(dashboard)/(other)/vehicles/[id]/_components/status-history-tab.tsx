import { Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type StatusHistoryEntry = {
  id: string
  status: string
  statusUpdatedAt: string | null
  note: string | null
  changedBy: string | null
  changedByName: string | null
  changedByEmail: string | null
}

type Props = {
  statusHistory: StatusHistoryEntry[]
}

function statusVariant(status: string) {
  switch (status) {
    case "Available":
      return "default" as const
    case "Rented":
      return "secondary" as const
    case "Maintenance":
      return "destructive" as const
    case "Retired":
      return "outline" as const
    default:
      return "secondary" as const
  }
}

export function StatusHistoryTab({ statusHistory }: Props) {
  if (!statusHistory.length) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">No status history available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {statusHistory.map((entry, index) => (
        <Card key={entry.id} className={index === 0 ? "border-primary" : ""}>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={statusVariant(entry.status)} className="text-sm px-3 py-1">
                      {entry.status}
                    </Badge>
                    {index === 0 && (
                      <Badge variant="outline" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {entry.statusUpdatedAt
                      ? new Date(entry.statusUpdatedAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Unknown date"}
                  </p>
                  {entry.changedByName && (
                    <p className="text-sm text-muted-foreground">
                      Changed by {entry.changedByName}
                      {entry.changedByEmail && ` (${entry.changedByEmail})`}
                    </p>
                  )}
                  {entry.note && (
                    <p className="text-sm mt-2 p-3 bg-muted rounded-md italic">"{entry.note}"</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
