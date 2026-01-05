import { Clock, HeartPulse, Wrench } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function FleetHealth() {
  return (
    <Card className="shadow-sm border-border h-full bg-card">
      <CardHeader className="pb-1">
        <CardTitle className="text-xs font-medium flex items-center gap-2 text-foreground">
          <HeartPulse className="h-3 w-3 text-green-600" />
          Fleet Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-[10px] text-muted-foreground">Operational</div>
              <div className="text-xs font-medium text-foreground">10 of 12</div>
            </div>
            <div className="text-base font-bold text-primary">83%</div>
          </div>
          <Progress value={83} className="h-1.5 bg-muted" />
        </div>

        <div className="flex gap-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Wrench className="h-2.5 w-2.5" />1 service
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />3 scheduled
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
