"use client"

import { CalendarIcon, Search, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function QuickRentalForm() {
  return (
    <Card className="shadow-sm border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
          <UserPlus className="h-4 w-4 text-blue-500" />
          Quick Rental
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          <Input placeholder="Customer name or phone" className="h-8 text-xs" />
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <CalendarIcon className="h-3 w-3 mr-1" />
              Pick Date
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Search className="h-3 w-3 mr-1" />
              Find Vehicle
            </Button>
          </div>
          <Button size="sm" className="w-full h-8 text-xs">
            Start Rental
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
