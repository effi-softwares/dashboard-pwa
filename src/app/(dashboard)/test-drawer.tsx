"use client"

import { Button } from "@/components/ui/button"
import { useNewRentalContext } from "@/providers/new-rental-provider"

function TestDrawer() {
  const { showDrawer } = useNewRentalContext()
  return (
    <div>
      <Button onClick={showDrawer}>Open Test Drawer</Button>
    </div>
  )
}

export default TestDrawer
